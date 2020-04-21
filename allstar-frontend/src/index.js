import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import AuthProvider from './Context/AuthContext';
import Store from './Context/Store';

ReactDOM.render(<Store><AuthProvider><App /></AuthProvider></Store>, document.getElementById('root'));
