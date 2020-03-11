import { init } from '@rematch/core';
import reducer from './reducer';
import thunk from 'redux-thunk';

const middlewares = [thunk];
const isLogger = false;
if (isLogger && process.env.NODE_ENV === 'development') {
  const { logger } = require('redux-logger');
  middlewares.push(logger);
}

const store = init({
  models: reducer().models,
  redux: {
    middlewares,
    ...reducer().redux,
  },
});

const { dispatch } = store;

export default store;

export { dispatch };
