import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// We import the global CSS file here so the premium styles apply everywhere
import './App.css'; 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);