import React, { useEffect, useState } from "react";
import { string } from "prop-types";
import { PROGRESS_BAR_MESSAGE_ACCORDING_TO_ACTION } from "../../Config/constant";

const intervalDelay = 100;
const intervalIncrement = 2;

const ProgressIndicatorBar = ({ message }) => {
  const [percentComplete, setPercentComplete] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setPercentComplete(percentComplete > 99 ? 0 : intervalIncrement + percentComplete);
    }, intervalDelay);

    return () => {
      clearInterval(id);
    };
  });

  return (
    <>
      <span id="progress-bar-text">{message || PROGRESS_BAR_MESSAGE_ACCORDING_TO_ACTION.LOADING_THE_DATA}</span>
      <div className="progress ">
        <div
          className="progress-bar progress-bar-striped"
          role="progressbar"
          style={{ width: `${percentComplete}%` }}
          aria-valuenow={percentComplete}
          aria-valuemin="0"
          aria-valuemax="100"
        ></div>
      </div>
    </>
  );
};

ProgressIndicatorBar.propTypes = {
  message: string,
};

ProgressIndicatorBar.defaultProps = {};

export default ProgressIndicatorBar;
