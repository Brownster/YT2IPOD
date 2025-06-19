# Implementation Plan: YouTube to iPod Chrome Extension

This document outlines the steps to implement the browser extension described in the issue:

## 1. Project Structure
```
youtube-to-ipod/
├── manifest.json
├── popup.html
├── popup.js
├── options.html
├── options.js
└── icons/
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```
The extension directory will contain the manifest, popup, options, and icon resources.

## 2. Manifest File
- Create `manifest.json` with manifest_version 3.
- Declare `activeTab` and `storage` permissions.
- Add `host_permissions` for HTTP and HTTPS so the extension can contact the server.
- Configure `action` with `default_popup` and default icon paths.
- Define an `options_page` that links to `options.html`.

## 3. Options Page
- `options.html` provides a simple form with fields for the server URL and API key.
- `options.js` will use the `chrome.storage.sync` API to save and restore these values.
- The user opens this page from the extension’s menu to set the server address (e.g. `http://192.168.1.100:8000`) and API key.

## 4. Popup Interface
- `popup.html` displays three buttons: **Send as Music**, **Send as Audiobook**, **Send as Podcast**.
- `popup.js` executes when the popup loads:
  1. Detects if the current tab is a YouTube video (URL contains `youtube.com/watch`). If not, it informs the user that the extension only works on video pages.
  2. When a button is clicked, it reads the saved `serverUrl` and `apiKey` from `chrome.storage.sync`.
  3. Sends a `POST` request to `${serverUrl}/youtube` with JSON body `{ url: <videoUrl>, category: <chosenCategory> }` and header `X-API-Key`.
  4. Shows success or error status messages in the popup depending on the response.
  5. Handles missing settings by directing the user to the options page.

## 5. Icons
- Provide 16x16, 48x48, and 128x128 PNG icons in the `icons/` directory.
- Update the manifest to reference these icons for both the extension action and overall icon set.

## 6. Local Server
- The extension expects a local server listening for `POST /youtube` requests.
- The request contains `url` and `category`; the server processes the video accordingly (e.g., convert to audio and sync to an iPod).
- Ensure the server verifies the provided `X-API-Key` for simple authentication.

## 7. Testing
1. Load the unpacked extension in Chrome via `chrome://extensions`.
2. Configure the server URL and API key in the options page.
3. Navigate to a YouTube video, open the extension popup, and click one of the send buttons.
4. Observe the server receiving the request and confirm that the popup displays success or error messages correctly.

## 8. Future Enhancements
- Add error handling for invalid server responses or network failures.
- Provide UI feedback (loading state, disable buttons during requests).
- Consider adding a badge or context menu entry for convenience.
