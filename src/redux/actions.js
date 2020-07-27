/**
 * Redux actions module
 * @module client/redux/actions
 */

import { SIGN_IN, SIGN_OUT, SET_PLAYING_SONG } from './types';
import { USER, ADMIN } from '../constants/roles';
import { SERVER_API_URL } from '../settings';
import { selectPlayingSong } from './selectors';

/**
 * Signs in an user
 * @function signIn
 * @param {String} key Auth cookie key
 * @param {Object} session Session info
 * @returns {Object} action
 */
export const signIn = (key, session) => ({ type: SIGN_IN, key, session });

/**
 * Signs out an user
 * @function signOut
 * @param {String[]} keys Auth cookie keys to sign out
 * @returns {Object} action
 */
export const signOut = (keys = [ADMIN, USER]) => ({ type: SIGN_OUT, keys });

/**
 * Sets the currently playing song in the store
 * @function setPlayingSong
 * @param {Object} song song object
 * @returns {Object} action
 */
export const setPlayingSong = (song) => ({ type: SET_PLAYING_SONG, song });

/**
 * @callback reduxDispatch
 * @param {Object} action Action to dispatch 
 */

/**
* @callback reduxGetState
* @returns {Object} Current store state
*/

/**
 * @callback reduxThunkActionCreatorResult
 * @param {reduxDispatch} dispatch Redux dispatch function
 * @param {reduxGetState} getState Redux getState function
 */

/**
 * Downloads and plays song data
 * @function playSong
 * @param {Object} song Song Object
 * @returns {reduxThunkActionCreatorResult} Redux thunk action creator see: [Redux thunk documentation]{@link https://www.npmjs.com/package/redux-thunk}
 */
export const playSong = (song) => (dispatch) => {
  dispatch(stopSong());
  const audio = new Audio(`${SERVER_API_URL}api/v1/files/${song.source}`);
  audio.onended = () => dispatch(setPlayingSong(null));
  audio.play();
  dispatch(setPlayingSong({ ...song, audio }));
  if (navigator.mediaSession) {
    navigator.mediaSession.metadata = new window.MediaMetadata({
      title: song.title,
      artwork: [{ src: `${SERVER_API_URL}api/v1/files/${song.thumbnail}`, sizes: '512x512', type: 'image/png' }]
    });
    navigator.mediaSession.setActionHandler('play', function () { });
    navigator.mediaSession.setActionHandler('pause', () => {
      dispatch(stopSong());
    });
  }
};

/**
 * Stops currently playing song
 * @function stopSong
 * @returns {reduxThunkActionCreatorResult} Redux thunk action creator see: [Redux thunk documentation]{@link https://www.npmjs.com/package/redux-thunk}
 */
export const stopSong = () => (dispatch, getState) => {
  const playingSong = selectPlayingSong(getState());
  if (playingSong) {
    playingSong.audio.onended = null;
    playingSong.audio.pause();
    delete playingSong.audio;
    if (navigator.mediaSession) {
      delete navigator.mediaSession.metadata;
    }
  }
  dispatch(setPlayingSong(null));
};