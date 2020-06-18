import { SIGN_IN, SIGN_OUT, SET_PLAYING_SONG } from './types';
import { USER, ADMIN } from '../constants/roles';
import { SERVER_API_URL } from '../settings';
import { selectPlayingSong } from './selectors';

export const signIn = (key, session) => ({ type: SIGN_IN, key, session });
export const signOut = (keys = [ADMIN, USER]) => ({ type: SIGN_OUT, keys });

export const setPlayingSong = (song) => ({ type: SET_PLAYING_SONG, song });

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