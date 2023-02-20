import React, { useState } from "react";
import { TOKEN_KEY, CONSTANT_TEXT } from "../Config/constant";
import { bool, func, string } from "prop-types";

function NavOption({ setLoginAccessToken, loginAccessToken, setReload, setOpenModal }) {
  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setLoginAccessToken("");
  };

  const handleReloadApp = () => {
    setReload(true);

    setTimeout(() => setReload(false), 1000);
  };
  const handleShow = () => {
    return setOpenModal(true);
  };

  return (
    <div class="nav-options" style={{ display: "flex", justifyContent: "space-between" }}>
      {loginAccessToken ? (
        <button type="button" className="btn btn nav-button" onClick={handleLogout}>
          <i className="bi bi-person"></i> {CONSTANT_TEXT.LOGOUT}
        </button>
      ) : (
        <button
          onClick={handleShow}
          type="button"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
          className="btn btn nav-button"
        >
          <i className="bi bi-person"></i> {CONSTANT_TEXT.LOGIN}
        </button>
      )}

      <button onClick={handleReloadApp} type="button" className="btn btn nav-button">
        <i className="bi bi-arrow-clockwise"></i> {CONSTANT_TEXT.RELOAD}
      </button>
    </div>
  );
}

NavOption.propTypes = {
  setLoginAccessToken: func,
  loginAccessToken: string,
  setReload: bool,
};

NavOption.defaultProps = {
  setLoginAccessToken: () => {},
  loginAccessToken: "",
  setReload: false,
};

export default NavOption;
