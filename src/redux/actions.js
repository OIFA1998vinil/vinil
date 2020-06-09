import { SIGN_IN, SIGN_OUT } from './types';

export const signIn = (key, session) => ({ type: SIGN_IN, key, session });
export const signOut = (key) => ({ type: SIGN_OUT, key });