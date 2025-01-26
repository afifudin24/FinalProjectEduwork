// actions.js
import { LOGIN_SUCCESS, LOGOUT } from './constants';

export const loginSuccess = () => ({
  type: LOGIN_SUCCESS,
});

export const logout = () => ({
  type: LOGOUT,
});
