import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { persistStore } from 'redux-persist'
import { createReducerManager } from './reducerManager';
import reducers from './reducers';
import persistConfig from './persist.config';

const manager = createReducerManager(reducers, persistConfig);
const composeEnhancers = typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : compose;

export const store = createStore(manager.reduce, composeEnhancers(applyMiddleware(thunk)));
export const persistor = persistStore(store);
export const { register, unregister } = manager;