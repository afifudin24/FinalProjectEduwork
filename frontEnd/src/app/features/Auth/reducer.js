// reducer.js
import { LOGIN_SUCCESS, LOGOUT } from './constants';

const initialState = {
  isLogin: JSON.parse(localStorage.getItem('isLogin')) || false, // Retrieve from localStorage or default to false
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      localStorage.setItem('isLogin', true); // Update localStorage on login
      return { ...state, isLogin: true };
    case LOGOUT:
      localStorage.setItem('isLogin', false); // Update localStorage on logout
      return { ...state, isLogin: false };
    default:
      return state;
  }
};
