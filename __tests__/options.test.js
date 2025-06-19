const { save_options, restore_options } = require('../youtube-to-ipod/options.js');

describe('options page', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <input id="serverUrl" />
      <input id="apiKey" />
      <div id="status"></div>
      <button id="save"></button>
    `;
    global.chrome = {
      storage: {
        sync: {
          set: jest.fn((data, cb) => cb && cb()),
          get: jest.fn((defaults, cb) => cb({ serverUrl: 'http://host', apiKey: 'key' }))
        }
      }
    };
  });

  test('save_options stores values and shows status', () => {
    document.getElementById('serverUrl').value = 'http://s';
    document.getElementById('apiKey').value = 'k';
    save_options();
    expect(chrome.storage.sync.set).toHaveBeenCalledWith({ serverUrl: 'http://s', apiKey: 'k' }, expect.any(Function));
    expect(document.getElementById('status').textContent).toBe('Options saved.');
  });

  test('restore_options populates fields from storage', () => {
    restore_options();
    expect(document.getElementById('serverUrl').value).toBe('http://host');
    expect(document.getElementById('apiKey').value).toBe('key');
  });
});
