import './index.css';

import App from './App';
import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(<App />, document.getElementById('root'));

if (module.hot)
  module.hot.accept('./App', () => {
    const App = require('./App').default;
    ReactDOM.render(<App />, document.getElementById('root'));
  });
