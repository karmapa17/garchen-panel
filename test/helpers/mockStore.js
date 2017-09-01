import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import clientMiddleware from './../../src/redux/middlewares/clientMiddleware';
import ipc from './../../src/utils/ipc';

const middlewares = [thunk, clientMiddleware(ipc)];

export default configureMockStore(middlewares);
