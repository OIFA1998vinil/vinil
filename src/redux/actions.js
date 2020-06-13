import { SIGN_IN, SIGN_OUT } from './types';
import { USER, ADMIN } from '../constants/roles';

export const signIn = (key, session) => ({ type: SIGN_IN, key, session });
export const signOut = (keys = [ADMIN, USER]) => ({ type: SIGN_OUT, keys });