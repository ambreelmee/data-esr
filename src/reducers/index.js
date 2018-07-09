import { combineReducers } from 'redux';
import search from './search';
import activeInstitution from './institution';

export default combineReducers({
  search,
  activeInstitution,
});
