import React from 'react';
import { Provider } from 'react-redux';
import store from './store';

// const createStore = () =>
//   reduxCreateStore(
//     rootReducer,
//     window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
//   );

export default ({ element }) => <Provider store={store}>{element}</Provider>;
