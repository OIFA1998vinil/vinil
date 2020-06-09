import storage from 'redux-persist/lib/storage';

export default {
  key: 'root',
  storage: storage,
  whitelist: ['auth']
};