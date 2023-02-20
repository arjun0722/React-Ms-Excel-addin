import { func } from "prop-types";
import React, { useState, useEffect } from "react";
import { ADD_ONS_APIS } from "../Config/api";
import {
  LOGIN_PAGE_HEADING,
  NOTIFICATIONS_MESSAGES,
  STATUS_CODE_FOR_UNPROCESSABLE_ENTITY,
  TOKEN_KEY,
} from "../Config/constant";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import { httpPost } from "../Utils/http";

function Login({ setLoginAccessToken, openModal, handleClose }) {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setError] = useState("");

  const handleCloseModal = () => {
    handleClose();
  };

  const onLogin = async () => {
    setError("");

    if (email === undefined || password === undefined || email?.length === 0 || password?.length === 0) {
      setError(NOTIFICATIONS_MESSAGES.REQUIRED_FIELDS_FOR_LOGIN);
      return;
    }

    try {
      const params = new URLSearchParams();
      params.append("email", email);
      params.append("password", password);
      params.append("remember_me", rememberMe);

      const response = await httpPost(ADD_ONS_APIS.LOGIN_API, params);

      if (response?.response?.status === STATUS_CODE_FOR_UNPROCESSABLE_ENTITY) {
        setError(response?.response?.message ?? NOTIFICATIONS_MESSAGES.LOGIN_FAILED);

        return;
      }

      localStorage.setItem(TOKEN_KEY, response.access_token);
      // document.getElementById("close-login-modal").click();
      setLoginAccessToken(response?.access_token);
    } catch (error) {
      setError(NOTIFICATIONS_MESSAGES.LOGIN_FAILED);
      setLoginAccessToken(null);
      localStorage.removeItem(TOKEN_KEY);
    }
  };

  return (
    <>
      <Modal show={openModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Analyst Intelligence Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <>
            <div>
              <p id="info-heading">{LOGIN_PAGE_HEADING}</p>
            </div>

            {errorMessage && <span className="color-red"> {errorMessage} </span>}

            <div id="main-form">
              <div className="form-group">
                <label className="input-label">Email / User Name</label>
                <input
                  type="text"
                  onChange={({ target }) => setEmail(target.value)}
                  className="form-control"
                  value={email}
                />
              </div>
              <div className="form-group postion-relative">
                <label className="input-label">Password</label>
                <div>
                  <input
                    type={showPassword ? "text" : "password"}
                    onChange={({ target }) => setPassword(target.value)}
                    className="form-control"
                    value={password}
                  />

                  {showPassword ? (
                    <i
                      className="bi bi-eye-slash password-show-hide"
                      onClick={() => setShowPassword(!showPassword)}
                    ></i>
                  ) : (
                    <i className="bi bi-eye password-show-hide" onClick={() => setShowPassword(!showPassword)}></i>
                  )}
                </div>
              </div>
              <div className="form-check input-label">
                <input
                  type="checkbox"
                  className="form-check-input"
                  name="option1"
                  value="something"
                  onClick={() => {
                    setRememberMe((pre) => !pre);
                  }}
                  checked={rememberMe}
                />
                <label className="form-check-label">Remember me</label>
              </div>
            </div>
          </>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={onLogin}>
            Login
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
Login.propTypes = {
  setLoginAccessToken: func,
};

Login.defaultProps = {
  setLoginAccessToken: () => {},
};

export default Login;
