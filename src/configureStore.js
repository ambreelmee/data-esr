import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import { createHashHistory } from 'history';
import thunk from 'redux-thunk';
import rootReducer from './reducers';


const reduxRouterMiddleware = routerMiddleware(createHashHistory());
const middleware = [thunk, reduxRouterMiddleware];
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default function configureStore(initialState) {
  return createStore(
    rootReducer,
    initialState,
    composeEnhancers(applyMiddleware(...middleware)),
  );
}
