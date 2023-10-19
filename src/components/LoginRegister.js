import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_USER, LOGIN_USER } from "./../queries";

function LoginRegister({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [createUser] = useMutation(CREATE_USER);
  const [loginUser] = useMutation(LOGIN_USER);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

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
      localStorage.setItem("token", result.data.loginUser.token);
      onLoginSuccess();
    } catch (error) {
      console.error("Error logging in:", error);
      setErrorMessage("Invalid username or password.");
    }
  };

  const handleRegister = async () => {
    setIsLoading(true);
    try {
      await createUser({
        variables: {
          userInput: {
            username: username,
            password: password,
          },
        },
      });
      setRegistrationSuccess(true);
      setIsLogin(true);
    } catch (error) {
      console.error("Error registering user:", error);
      setErrorMessage("Error creating account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="login-container" data-testid="login-form">
        {isLoading ? (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p>{isLogin ? "Logging in..." : "Registering..."}</p>
          </div>
        ) : (
          <>
            {errorMessage && <p className="text-danger">{errorMessage}</p>}
            {registrationSuccess && (
              <p className="text-success">
                Registration successful! Please login.
              </p>
            )}
            <h2>{isLogin ? "Login" : "Register"}</h2>
            <div className="mb-3">
              <label className="form-label">Username</label>
              <input
                type="text"
                className="form-control"
                data-testid="login-name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                data-testid="login-pwd"
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
                  Don't have an account?{" "}
                  <span
                    className="text-primary cursor-pointer"
                    onClick={() => setIsLogin(false)}
                    data-testid="signUp-link"
                  >
                    Sign Up
                  </span>
                </p>
              </>
            ) : (
              <>
                <button
                  className="btn btn-primary"
                  data-testid="register-btn"
                  onClick={handleRegister}
                >
                  Register
                </button>
                <p className="mt-3">
                  Already have an account?{" "}
                  <span
                    className="text-primary cursor-pointer"
                    onClick={() => setIsLogin(true)}
                  >
                    Login
                  </span>
                </p>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default LoginRegister;
