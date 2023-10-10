import React, { useState } from 'react';

function LoginRegister() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log('Logging in with', username, password);
  };

  const handleRegister = () => {
    console.log('Registering with', username, password);
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="login-container">
        <h2>{isLogin ? 'Login' : 'Register'}</h2>
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {isLogin ? (
          <>
            <button className="btn btn-primary" onClick={handleLogin}>
              Login
            </button>
            <p className="mt-3">
              Don't have an account?{' '}
              <span
                className="text-primary cursor-pointer"
                onClick={() => setIsLogin(false)}
              >
                Sign Up
              </span>
            </p>
          </>
        ) : (
          <>
            <button className="btn btn-primary" onClick={handleRegister}>
              Register
            </button>
            <p className="mt-3">
              Already have an account?{' '}
              <span
                className="text-primary cursor-pointer"
                onClick={() => setIsLogin(true)}
              >
                Login
              </span>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default LoginRegister;
