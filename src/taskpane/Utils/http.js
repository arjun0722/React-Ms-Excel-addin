import axios from "axios";
import { API_BASE_URL } from "../Config/api";
import { STATUS_CODE } from "../Config/constant";
import { getUserSession } from "./helper";

/**
 * commandAxios
 * Axios instance for all API requests
 */
const appAxios = axios.create({
  baseURL: API_BASE_URL,
});

export const getCommonHeaders = () => {
  const accessToken = getUserSession();

  try {
    const headers = {
      Accept: "application/json",
      "Access-Control-Allow-Origin": "*",
    };

    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    return headers;
  } catch (e) {
    return {};
  }
};
const showErrorMsg = (msg = "An internal error occurred.") => {
  document.getElementById("showErrorMessage").innerHTML = `Error : ${msg}`;

  setTimeout(() => {
    document.getElementById("showErrorMessage").innerHTML = "";
  }, 4000);
};

const httpHandleResponse = (res) => {
  // show warning msg in case of status code 202 globally
  const { status = "", data = {} } = res || {};
  const { message = "" } = data || {};

  if (status === STATUS_CODE.Accepted && message) showErrorMsg(message, " MESSAGE");

  return res.data;
};

const httpHandleError = (error) => {
  try {
    if (!error) return undefined;

    /* Handle Cancel Request */
    if (!error.request) return undefined;

    if (error.message === "Network failed") {
      showErrorMsg();

      return undefined;
    }

    const xhr = error.request;
    let err = {};
    if (xhr.response) err = JSON.parse(xhr.response);

    if (xhr) {
      switch (xhr.status) {
        case 0:
          showErrorMsg();
          break;

        case STATUS_CODE.Bad_Request:
          if (err.errors && err.errors[0] && err.errors[0].errors) {
            const newErr = err.errors[0].errors;
            if (newErr[0] && newErr[0].message) {
              showErrorMsg(newErr[0].message);
            } else {
              showErrorMsg();
            }
          } else {
            const msg = err.message || err.error;
            showErrorMsg(msg);
          }
          break;

        case STATUS_CODE.Unauthorized:
          showErrorMsg(err.message || "Session expired.");
          localStorage.clear();
          window.location.reload(); // Reload page
          break;

        case STATUS_CODE.Forbidden:
          if (err.errors && err.errors[0] && err.errors[0].detail) {
            showErrorMsg(err.errors[0].detail);
          } else {
            showErrorMsg(err.message);
          }
          break;

        case STATUS_CODE.Not_Found:
          if (err.errors && err.errors[0] && err.errors[0].title) {
            if (err.errors[0].title !== "Resource Not Found") {
              showErrorMsg(err.errors[0].title);
            }
          } else if (err.error && typeof err.error === "string") {
            showErrorMsg(err.error);
          } else {
            showErrorMsg(err.message);
          }
          break;

        case STATUS_CODE.Method_Not_Allowed:
          showErrorMsg(err.message || "");
          break;

        case STATUS_CODE.Precondition_Failed:
          if (Object.keys(err.errors)[0] === "q") {
            showErrorMsg();
          } else {
            showErrorMsg(err.errors[Object.keys(err.errors)[0]][0]);
          }
          break;
        case STATUS_CODE.Conflict:
          showErrorMsg(err.message);

          break;
        case STATUS_CODE.Unprocessable_Entity:
          if (typeof err === "string") {
            showErrorMsg(err);
          } else if (err.errors && err.errors[0] && err.errors[0].detail) {
            showErrorMsg(err.errors[0].detail);
          } else if (Array.isArray(err.message)) {
            showErrorMsg(err.message[0]);
          } else if (err.message) {
            showErrorMsg(err.message);
          } else if (err.error && typeof err.error === "string") {
            showErrorMsg(err.error);
          } else if (Array.isArray(err[Object.keys(err)[0]])) {
            showErrorMsg(err[Object.keys(err)[0]][0]);
          } else {
            showErrorMsg(err[Object.keys(err)[0]]);
          }
          break;

        case STATUS_CODE.Bad_Gateway:
          showErrorMsg();
          break;

        case STATUS_CODE.Service_Unavailable:
          if (err.error && typeof err.error === "string") {
            showErrorMsg(err.error);
          } else {
            showErrorMsg();
          }
          break;

        default:
          showErrorMsg();
      }
    } else {
      showErrorMsg();
    }

    return undefined;
  } catch (e) {
    console.error("-- HTTP HANDLE ERROR -- ", e);
  }
};

/**
 * GET Request
 *
 * @param {String} url
 */
export const httpGet = async (url) => {
  console.log("LLLLLLLLLLLUUUUUURLLL", url);
  return appAxios
    .get(url, {
      headers: getCommonHeaders(),
    })
    .then(httpHandleResponse)
    .catch((err) => {
      httpHandleError(err);
    });
};

/**
 * POST Request
 *
 * @param {String} url
 * @param {Object} params
 */
export const httpPost = async (url, params) => {
  console.log("hhhhhhhhhhhhhh", url, params);
  return appAxios
    .post(url, params, {
      headers: getCommonHeaders(),
    })
    .then(httpHandleResponse)
    .catch((err) => {
      httpHandleError(err);
    });
};
