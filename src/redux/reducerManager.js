/**
 * Redux reducers module
 * @module client/redux/reducerManager
 */

import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist'

/**
 * Creates a combine reducers
 * @param {Object} reducers Reducers
 * @param {Object} config Redux Persist configuration see: [Redux Persist documentation]{@link https://www.npmjs.com/package/redux-persist#persistreducerconfig-reducer}
 * @returns {Object} Combined reducers
 */
function createCombineReducers(reducers, config) {
  return persistReducer(config, combineReducers(reducers));
}

/**
 * Creates a reducer manager
 * @param {Object} initialReducers Initial reducers 
 * @param {Object} persistConfig Redux Persist configuration see: [Redux Persist documentation]{@link https://www.npmjs.com/package/redux-persist#persistreducerconfig-reducer}
 * @returns {Object} reducer manager
 */
export function createReducerManager(initialReducers, persistConfig) {
  const reducers = { ...initialReducers }
  let combinedReducer = createCombineReducers(reducers, persistConfig);
  let keysToRemove = []
  return {
    reduce(state, action) {
      if (keysToRemove.length > 0) {
        state = { ...state };
        for (let key of keysToRemove) delete state[key];
        keysToRemove = [];
      }
      return combinedReducer(state, action);
    },
    register(key, reducer) {
      if (!key || reducers[key]) return;
      reducers[key] = reducer;
      combinedReducer = createCombineReducers(reducers, persistConfig);
    },
    unregister(key) {
      if (!key || !reducers[key]) return;
      delete reducers[key];
      keysToRemove.push(key);
      combinedReducer = createCombineReducers(reducers, persistConfig);
    }
  }
}