require('babel-register');

function noop() {
  return null;
}

global.document = require('jsdom').jsdom('<body></body>');
global.window = document.defaultView;
global.navigator = window.navigator;

require.extensions['.scss'] = noop;