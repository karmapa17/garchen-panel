require('babel-register');
require('mock-local-storage');

const noop = () => null;

global.document = require('jsdom').jsdom('<body></body>');
global.window = document.defaultView;
global.navigator = window.navigator;

require.extensions['.scss'] = noop;
