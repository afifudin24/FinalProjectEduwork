// store.js
import { createStore, combineReducers } from 'redux';
import { authReducer } from './features/Auth/reducer';

const rootReducer = combineReducers({
  auth: authReducer,
});

export const store = createStore(rootReducer);
