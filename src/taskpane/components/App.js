import React, { useState, useEffect } from "react";
import { TOKEN_KEY } from "../Config/constant";
import Login from "./Login";
import DataSelectionMenu from "./DataSelectionMenu";
import NavOption from "./NavOption";
import "./index.css";
function App() {
  const [errorMessage, setErrorMessage] = useState("");
  const [reload, setReload] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const handleClose = () => {
    setOpenModal(false);
  };

  const [loginAccessToken, setLoginAccessToken] = useState(localStorage.getItem(TOKEN_KEY));

  return (
    <>
      <NavOption
        setReload={setReload}
        loginAccessToken={loginAccessToken}
        setLoginAccessToken={setLoginAccessToken}
        setOpenModal={setOpenModal}
      />

      {reload ? (
        <></>
      ) : (
        <div className="main-section">
          <div id="showErrorMessage">{errorMessage}</div>
          {!loginAccessToken ? (
            <Login
              setErrorMessage={setErrorMessage}
              setLoginAccessToken={setLoginAccessToken}
              openModal={openModal}
              handleClose={handleClose}
            />
          ) : (
            <DataSelectionMenu />
          )}
        </div>
      )}
    </>
  );
}

export default App;
