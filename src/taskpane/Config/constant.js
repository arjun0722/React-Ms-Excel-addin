export const BUTTON_ACTION = {
  SAVE_DATA: "SAVE_DATA",
  REFRESH_DATA: "REFRESH_DATA",
  DOWNLOAD_SOURCE_TABLE_DATA: "DOWNLOAD_SOURCE_TABLE_DATA",
  LOAD_VALUES: "LOAD_VALUES",
  DELETE_COMMENTS: "DELETE_COMMENTS",
};

export const NOTIFICATIONS_MESSAGES = {
  REQUIRED_FIELDS_FOR_LOGIN: "Please enter in both and email and password.",

  LOGIN_FAILED: "Login failed. Please try again later.",

  MESSAGE_FOR_DUMP_SOURCE_TABLE: "Exports all rows of the table directly into sheet",

  MESSAGE_FOR_REFRESHING_THE_SELECTED_CELLS:
    "Refreshes the data for any selected cells that are intersected by a row/column mapping",

  MESSAGE_FOR_REFRESHING_THE_ROW:
    "Refreshes the data for the cells in the selected row. The refresh will only apply to cells in the row to the right of the highlighted selection. To refresh a whole row, highlight the entire row.",

  MESSAGE_FOR_REFRESHING_THE_COLUMN:
    "Refreshes the data for the cells in the selected column. The refresh will only apply to cells in the column downwards of the highlighted selection. To refresh a whole column, highlight the entire column.",

  MESSAGE_FOR_DELETE_MAPPED_DATA: "Delete mapped data over selected range.",

  MESSAGE_FOR_EXPORT_DATA:
    "We do not delete the prior data before pasting in new data, so if there are less rows in your export then you may want to delete the prior data first.",

  MESSAGE_FOR_SHOW_MAPPING:
    "Selections below don't change when different cells are selected, so click here to refresh the mappings. We're working with Google on this.",
};

export const AIP_CELL_MAP_CONTENT_PREFIX = "AIP Map:";

export const PROGRESS_BAR_MESSAGE_ACCORDING_TO_ACTION = {
  LOADING_THE_DATA: "Loading the data...",
  MAP_DATA: "Mapping the data...",
  DELETE_COMMENT: "Deleting the comments...",
  LOADING_SOURCE_TABLES_FIELDS: "Loading source table fields...",
  RENDERING_DATA: "Data is downloaded. Awaiting Google Sheets to render the data…",
};

export const KEYS_FOR_VISIBILITY_FLAG = {
  SHOW: "show",
  HIDE: "hide",
};

export const PLACEHOLDER_VALUES = {
  SOURCE_TABLE_SELECTION_DROPDOWN: "Select the Source Table...",
  EMPTY_VALUE: "Empty",
};

export const CONSTANT_TEXT = {
  SAVE: "Save",
  LOGIN: "Login",
  REMEMBER_ME: "Remember me",
  CLOSE: "Close",
  REFRESH: "Refresh",
  DELETE: "Delete",
  SHOW_MAPPING: "Show Mappings",
  LOGOUT: "Logout",
  LOGIN: "Login",
  RELOAD: "Reload",
  SELECT_ALL: "Select All",
  CLEAR_ALL: "Clear",
  CLOSE: "Close",
  DOWNLOAD: "Download",
  DOWNLOAD_TABLE: "Download Table",
  EXPORT_TABLE: "Export Table",
  FIELDS: "Filter",
  SELECT_TABLE_LABEL: "Select Table",
  APPLY_FILTER_CHECKBOX: "Apply Field Filters",
  SELECT_TABLE_COLUMNS: "Select Table columns",
};

export const MAX_FIELDS_LENGTH_TO_SHOW_DOWNLOAD_BUTTON = 1;

export const TOKEN_KEY = "user-token";

export const TABLE_TYPE_LABELS = {
  rbm: {
    name: "RBM",
    backgroundColor: "none",
    color: "#0094ff",
    border: "1px solid #0094ff",
  },

  linked_lookup: {
    name: "Linked Lookup",
    backgroundColor: "none",
    color: "#0094ff",
    border: "1px solid #0094ff",
  },

  scenario: {
    name: "Scenario",
    backgroundColor: {
      Working: "#0094ff",
      Actuals: "#0094ff",
      others: "#b7d8ef",
    },
    color: {
      Working: "#ffffff",
      Actuals: "#ffffff",
      others: "#0094ff",
    },
    border: "1px solid #0094ff",
  },
};

export const TABLE_TYPES = {
  SOURCE: "source",
  SCENARIO: "scenario",
};

export const DROPDOWN_TREE_CLASS_FOR_INFINITE_SCROLL = "infinite-scroll-component";
export const REACT_TREE_DROPDOWN_INPUT_CLASS_NAME = "search";
export const REACT_TREE_DROPDOWN_CONTENT_CLASS_NAME = "dropdown-content";
export const REACT_TREE_DROPDOWN_INPUT_WIDTH_PERCENTAGE = 80;
export const MINIMUM_HEIGHT_PERCENTAGE_FOR_TIME_PERIOD_DROPDOWN = 100;
export const TOTAL_PERCENTAGE_OF_SCREEN = 100;

export const LIMIT_TO_UPDATE_CELLS_PER_CALL = 4000;

export const MAXIMUM_NUMBER_TO_DISABLE_BUTTON = 1;

export const STATUS_CODE_FOR_UNPROCESSABLE_ENTITY = 422;

export const STATUS_CODE = {
  Bad_Request: 400,
  Unauthorized: 401,
  Accepted: 202,
  Forbidden: 403,
  Not_Found: 404,
  Method_Not_Allowed: 405,
  Precondition_Failed: 412,
  Conflict: 409,
  Unprocessable_Entity: 422,
  Bad_Gateway: 502,
  Service_Unavailable: 503,
};

export const LOGIN_PAGE_HEADING = "Please enter in your email and password to login.";
