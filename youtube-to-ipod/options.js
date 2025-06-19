// Saves options to chrome.storage
function save_options() {
  const serverUrl = document.getElementById('serverUrl').value;
  const apiKey = document.getElementById('apiKey').value;
  
  chrome.storage.sync.set({
    serverUrl: serverUrl,
    apiKey: apiKey
  }, function() {
    // Update status to let user know options were saved.
    const status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 1500);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  chrome.storage.sync.get({
    serverUrl: '',
    apiKey: ''
  }, function(items) {
    document.getElementById('serverUrl').value = items.serverUrl;
    document.getElementById('apiKey').value = items.apiKey;
  });
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', restore_options);
  const saveBtn = document.getElementById('save');
  if (saveBtn) saveBtn.addEventListener('click', save_options);
}

if (typeof module !== 'undefined') {
  module.exports = { save_options, restore_options };
}
