import React from 'react';

function Login({ setRole }) {
  return (
    <div className="login-container">
      <h1>Premiere Access</h1>
      <p>Select your portal to continue</p>
      
      <div className="role-buttons">
        <button className="btn btn-director" onClick={() => setRole('director')}>
          Director Studio
        </button>
        <button className="btn btn-viewer" onClick={() => setRole('viewer')}>
          Viewer Lounge
        </button>
      </div>
    </div>
  );
}

export default Login;