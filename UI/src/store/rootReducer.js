import { combineReducers } from 'redux';
import authReducer from './auth/reducer';
import infoReducer from './info/reducer';
import journalReducer from './journal/reducer';

const rootReducer = combineReducers({
  profile: authReducer,
  info: infoReducer,
  journal: journalReducer
});

export default rootReducer;
