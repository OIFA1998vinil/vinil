import storage from 'redux-persist/lib/storage';

/**
 * App Redux Persist configuration see: [Redux Persist documentation]{@link https://www.npmjs.com/package/redux-persist#persistreducerconfig-reducer}
 * @module client/redux/persist/config
 */
export default {
  key: 'root',
  storage: storage,
  whitelist: ['auth']
};