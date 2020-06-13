import { SIGN_IN, SIGN_OUT } from "./types";

export default {
  auth: (state = {}, action) => {
    switch (action.type) {
      case SIGN_IN: {
        const { key, session } = action;
        return { ...state, [key]: session };
      }
      case SIGN_OUT: {
        const { keys } = action;
        const copy = { ...state };
        keys.forEach(key => {
          delete copy[key];
        });
        const cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i];
          const eqPos = cookie.indexOf("=");
          const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
          document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
        return copy;
      }
      default: {
        return state;
      }
    }
  }
};