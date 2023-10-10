import React, { useState } from 'react';
import { useMutation } from "@apollo/client";
import { CREATE_USER, LOGIN_USER } from "./../queries";

function LoginRegister({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [createUser] = useMutation(CREATE_USER);
  const [loginUser] = useMutation(LOGIN_USER);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    try {
      const result = await loginUser({
        variables: {
          loginInput: {
            username: username,
            password: password,
          },
        },
      });
      console.log('User logged in:', result.data.loginUser.username);
      localStorage.setItem('token', result.data.loginUser.token);
      onLoginSuccess(); // Notify the App component about successful login
    } catch (error) {
      console.error('Error logging in:', error);
      setErrorMessage('Invalid username or password.');
    }
  };

  const handleRegister = async () => {
    try {
      const result = await createUser({
        variables: {
          userInput: {
            username: username,
            password: password,
          },
        },
      });
      console.log('User registered:', result.data.createUser.username);
    } catch (error) {
      console.error('Error registering user:', error);
      setErrorMessage('Error creating account. Please try again.');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="login-container">
        {errorMessage && <p className="text-danger">{errorMessage}</p>}
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
