document.addEventListener('DOMContentLoaded', function () {
    // --- UI Elements ---
    const statusDiv = document.getElementById('status');
    const buttonContainer = document.querySelector('.button-container');

    // --- UI Helper Functions (from your design) ---
    function showStatus(message, type = 'loading') {
        // Use innerHTML for messages that might contain links (like the settings error)
        if (type === 'loading') {
            statusDiv.innerHTML = `<span class="loading-dots">${message}</span>`;
        } else {
            statusDiv.innerHTML = message;
        }
        statusDiv.className = `status-${type}`;
    }

    function hideButtons() {
        buttonContainer.style.display = 'none';
    }

    function showButtons() {
        buttonContainer.style.display = 'flex';
    }

    // --- Core Extension Logic ---

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

    // 2. Attach click handlers to the buttons
    function attachClickHandlers(videoUrl) {
        document.getElementById('sendMusic').addEventListener('click', () => sendUrl(videoUrl, 'music'));
        document.getElementById('sendAudiobook').addEventListener('click', () => sendUrl(videoUrl, 'audiobook'));
        document.getElementById('sendPodcast').addEventListener('click', () => sendUrl(videoUrl, 'podcast'));
    }

    // 3. The main function to send the data to the server
    function sendUrl(url, category) {
        hideButtons();
        showStatus(`Sending as ${category}`, 'loading');

        // Retrieve server settings from Chrome's storage
        chrome.storage.sync.get(['serverUrl', 'apiKey'], function (items) {
            if (!items.serverUrl || !items.apiKey) {
                const optionsUrl = chrome.runtime.getURL('options.html');
                const errorMessage = `Error: Server or API Key not set. Please <a href="${optionsUrl}" target="_blank">configure settings</a>.`;
                showStatus(errorMessage, 'error');
                // Don't show the buttons again here, as the user needs to fix settings first.
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
            });
        });
    }
});
