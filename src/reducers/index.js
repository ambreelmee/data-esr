import { combineReducers } from 'redux';
import { institutions, institutionsHasErrored, institutionsIsLoading } from './institutions';
export default combineReducers({
    institutions,
    institutionsHasErrored,
    institutionsIsLoading
});
