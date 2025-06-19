let statusDiv;
let buttonContainer;

function showStatus(message, type = 'loading') {
    if (!statusDiv) return;
    // Use innerHTML for messages that might contain links (like the settings error)
    if (type === 'loading') {
        statusDiv.innerHTML = `<span class="loading-dots">${message}</span>`;
    } else {
        statusDiv.innerHTML = message;
    }
    statusDiv.className = `status-${type}`;
}

function hideButtons() {
    if (buttonContainer) buttonContainer.style.display = 'none';
}

function showButtons() {
    if (buttonContainer) buttonContainer.style.display = 'flex';
}

function attachClickHandlers(videoUrl) {
    document.getElementById('sendMusic').addEventListener('click', () => sendUrl(videoUrl, 'music'));
    document.getElementById('sendAudiobook').addEventListener('click', () => sendUrl(videoUrl, 'audiobook'));
    document.getElementById('sendPodcast').addEventListener('click', () => sendUrl(videoUrl, 'podcast'));
}

    // 3. The main function to send the data to the server
function sendUrl(url, category) {
    return new Promise((resolve) => {
        hideButtons();
        showStatus(`Sending as ${category}`, 'loading');

        // Retrieve server settings from Chrome's storage
        chrome.storage.sync.get(['serverUrl', 'apiKey'], function (items) {
            if (!items.serverUrl || !items.apiKey) {
                const optionsUrl = chrome.runtime.getURL('options.html');
                const errorMessage = `Error: Server or API Key not set. Please <a href="${optionsUrl}" target="_blank">configure settings</a>.`;
                showStatus(errorMessage, 'error');
                resolve();
                return;
            }

            const apiEndpoint = `${items.serverUrl}/youtube`;

            // Make the API call using fetch
            fetch(apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': items.apiKey
                },
                body: JSON.stringify({
                    url: url,
                    category: category
                })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Server error: ${response.status} ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                // Success!
                showStatus(`Success! Queued: ${data.queued}`, 'success');
                setTimeout(() => window.close(), 2500); // Close popup after success
            })
            .catch(error => {
                // Handle network errors or server errors
                console.error("API Request Failed:", error);
                showStatus(`Error: ${error.message}`, 'error');
                showButtons(); // Show buttons again so the user can retry
            })
            .finally(resolve);
        });
    });
}

function initPopup() {
    statusDiv = document.getElementById('status');
    buttonContainer = document.querySelector('.button-container');

    // 1. Check if we are on a valid YouTube page
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const currentTab = tabs[0];
        if (currentTab && currentTab.url && currentTab.url.includes("youtube.com/watch")) {
            // It's a YouTube video page, so attach the real click handlers
            attachClickHandlers(currentTab.url);
        } else {
            // Not a YouTube page, show an error message.
            hideButtons();
            showStatus('This only works on a YouTube video page.', 'error');
        }
    });
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', initPopup);
}

if (typeof module !== 'undefined') {
    module.exports = { showStatus, hideButtons, showButtons, sendUrl, initPopup };
}
