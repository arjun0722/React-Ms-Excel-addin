const BASE_URLS = {
  staging: "https://api.staging.dev-openfpa.com/api",
  production: "https://api.openfpa.com/api",
};

const API_BASE_URL = BASE_URLS.production;

const ADD_ONS_APIS = {
  DIMENSIONS_API: {
    GET_DIMENSIONS: "/dimensions/all-info",
    DIMENSIONS_HIERARCHY: "/mapping/hierarchy",
  },

  SCENARIO_API: {
    GET_SCENARIO_LIST: "/scenario/list",
    GET_LABELS: "/labels",
  },

  V2_API: {
    ROLLUP_DATA_API: "/v2/data_query/rollup",
    LOAD_TABLE_INFO: "/v2/source_tables/0/list",

    LOAD_TABLE_COLUMN_INFO: "/v2/source_tables/#ID#/info",

    LOAD_ALL_TABLES_NO_PARENT_FOLDER: "/v2/source_tables/all/list",
    LOAD_SOURCE_TABLE_DETAILS: "/v2/source_tables/#ID#/info?details=#DETAILS#",
    LOAD_SOURCE_TABLE_DATA: "/v2/source_tables/#ID#/data/search",
  },

  LOGIN_API: "/login",
};

export { API_BASE_URL, ADD_ONS_APIS };
