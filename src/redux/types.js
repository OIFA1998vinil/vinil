/**
 * Redux types module
 * @module client/redux/types
 */

/**
 * Redux type for signing in
 * @type {String}
 * @constant
 */
export const SIGN_IN = 'SIGN_IN';

/**
 * Redux type for signing out
 * @type {String}
 * @constant
 */
export const SIGN_OUT = 'SIGN_OUT';

/**
 * Redux type for setting the currently playing song 
 * @type {String}
 * @constant
 */
export const SET_PLAYING_SONG = 'SET_PLAYING_SONG';

/**
 * Redux type for playing a song
 * @type {String}
 * @constant
 */
export const PLAY_SONG = 'PLAY_SONG';

/**
 * Redux type for pausing a song
 * @type {String}
 * @constant
 */
export const PAUSE_SONG = 'PAUSE_SONG';

/**
 * Redux type for setting the progress of the playing song
 * @type {String}
 * @constant
 */
export const SET_PROGRESS = 'SET_PROGRESS';

/**
 * Redux type for stoping the playing song
 * @type {String}
 * @constant
 */
export const STOP_SONG = 'STOP_SONG';