/**
 * Redux store module
 * @module client/redux/store
 */

import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { persistStore } from 'redux-persist'
import { createReducerManager } from './reducerManager';
import reducers from './reducers';
import persistConfig from './persist.config';

const manager = createReducerManager(reducers, persistConfig);
const composeEnhancers = typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : compose;

/**
 * Application redux store
 * @constant
 * @type {Object}
 */
export const store = createStore(manager.reduce, composeEnhancers(applyMiddleware(thunk)));

/**
 * Application redux store persistor
 * @constant
 * @type {Object}
 */
export const persistor = persistStore(store);

/**
 * @callback reducerCallback
 * @param {Object} state Store state
 * @param {Object} action Action dispatched
 * @returns {Object} new state or old state
 */

/**
 * Registers redux reducers on demand
 * @function register
 * @param {String} key Redux key section for the reducer
 * @param {reducerCallback} reducer Reducer to handle redux store section
 */
export const { register } = manager;

/**
 * Unregisters a redux section
 * @function unregister
 * @param {String} key Redux key section for the reducer
 */
export const { unregister } = manager;