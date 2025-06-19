const { showStatus, hideButtons, showButtons, sendUrl, initPopup } = require('../youtube-to-ipod/popup.js');

describe('popup functions', () => {
  let statusDiv, buttonContainer, fetchMock;
  beforeEach(() => {
    document.body.innerHTML = `
      <div class="button-container">
        <button id="sendMusic"></button>
        <button id="sendAudiobook"></button>
        <button id="sendPodcast"></button>
      </div>
      <div id="status"></div>
    `;
    statusDiv = document.getElementById('status');
    buttonContainer = document.querySelector('.button-container');
    global.chrome = {
      storage: {
        sync: {
          get: jest.fn((keys, cb) => cb({ serverUrl: 'http://server', apiKey: 'k' }))
        }
      },
      tabs: {
        query: jest.fn((q, cb) => cb([{ url: 'https://youtube.com/watch?v=123' }]))
      },
      runtime: {
        getURL: jest.fn(() => 'options.html')
      }
    };
    fetchMock = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({ queued: 'video' }) }));
    global.fetch = fetchMock;
    initPopup();
  });

  test('showStatus updates status div', () => {
    showStatus('hello', 'success');
    expect(statusDiv.innerHTML).toBe('hello');
    expect(statusDiv.className).toBe('status-success');
  });

  test('hideButtons/showButtons toggle display', () => {
    showButtons();
    expect(buttonContainer.style.display).toBe('flex');
    hideButtons();
    expect(buttonContainer.style.display).toBe('none');
  });

  test('sendUrl posts to server and shows success', async () => {
    await sendUrl('http://vid', 'music');
    expect(fetchMock).toHaveBeenCalled();
    expect(statusDiv.className).toBe('status-success');
  });

  test('sendUrl shows error when settings missing', async () => {
    chrome.storage.sync.get.mockImplementation((k, cb) => cb({ serverUrl: '', apiKey: '' }));
    await sendUrl('http://vid', 'music');
    expect(statusDiv.className).toBe('status-error');
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
