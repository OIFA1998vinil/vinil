/**
 * Redux selectors module
 * @module client/redux/selectors
 */

/**
 * @callback selectAuthCallback
 * @param {Object} state Store state
 * @returns {Object} Auth information
 */

/**
 * Creates a selector for the auth information from the store
 * @function selectAuth
 * @param {String} key Cookie auth key
 * @returns {selectAuthCallback} Select auth selector
 */
export const selectAuth = (key) => state => state.auth[key];

/**
 * Selects the playing song from the store
 * @function selectPlayingSong
 * @param {Object} state Store state
 * @returns {Object} Playing song
 */
export const selectPlayingSong = state => state.playingSong;