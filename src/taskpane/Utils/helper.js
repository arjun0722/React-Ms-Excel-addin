import { ADD_ONS_APIS } from "../Config/api";
import { httpGet } from "./http";

import {
  AIP_CELL_MAP_CONTENT_PREFIX,
  TOKEN_KEY,
  TOTAL_PERCENTAGE_OF_SCREEN,
  REACT_TREE_DROPDOWN_INPUT_CLASS_NAME,
  REACT_TREE_DROPDOWN_INPUT_WIDTH_PERCENTAGE,
  DROPDOWN_TREE_CLASS_FOR_INFINITE_SCROLL,
  REACT_TREE_DROPDOWN_CONTENT_CLASS_NAME,
  MINIMUM_HEIGHT_PERCENTAGE_FOR_TIME_PERIOD_DROPDOWN,
  LIMIT_TO_UPDATE_CELLS_PER_CALL,
  PROGRESS_BAR_MESSAGE_ACCORDING_TO_ACTION,
} from "../Config/constant";
import { getQueryObject, getQueryObjectForGettingTableData } from "./QueryObject";

/**
 * Convert row character into number
 *
 * @param {String} rowIndex
 *
 */
const convertRowIndexIntoNumber = (rowIndex) => {
  if ((typeof rowIndex === "string" || rowIndex instanceof String) && /^[a-zA-Z]+$/.test(rowIndex)) {
    rowIndex = rowIndex.toUpperCase();

    let result = 0;
    const len = rowIndex.length;

    for (let pos = 0; pos < len; pos++) {
      result += (rowIndex.charCodeAt(pos) - 64) * 26 ** (len - pos - 1);
    }

    return result;
  }

  return undefined;
};

/**
 * convert number into the character
 *
 * @param {Number} column
 *
 * @return {String}
 *
 */
const convertNumberIntoCharacter = (column) => {
  var temp,
    letter = "";
  while (column > 0) {
    temp = (column - 1) % 26;
    letter = String.fromCharCode(temp + 65) + letter;
    column = (column - temp - 1) / 26;
  }
  return letter;
};

/**
 * map content to the active cell
 *
 * @param {String} content
 *
 */
export const mappedContentToTheCellComment = async (content) => {
  try {
    await serverFunctions.mapCommentToTheActiveCell(content);

    return true;
  } catch (error) {
    console.log(error);
  }
};

/**
 * Get Source Table Data with filters
 *
 * @param {Object} mappedData
 *
 */
export const getSourceTableData = async (mappedData) => {
  try {
    const url = `${ADD_ONS_APIS.V2_API.LOAD_SOURCE_TABLE_DATA.replace(
      "#ID#",
      mappedData.source.value
    )}?query=${getQueryObjectForGettingTableData(mappedData)}`;

    const res = await httpGet(url);

    if (res) return res.data;
  } catch (error) {
    console.error(error);
  }
};

/**
 * Render Data on active cell or given address
 *
 * @param {Object} mappedData
 * @param {String} cellAddress
 *
 */
export const downloadAndRenderDataOnActiveCell = async (mappedData, cellAddress = "", setProgressBarCustomMessage) => {
  try {
    const tableData = await getSourceTableData(mappedData);

    if (!tableData) return Promise.reject();

    setProgressBarCustomMessage(PROGRESS_BAR_MESSAGE_ACCORDING_TO_ACTION?.RENDERING_DATA);

    const activeCellAddress = await serverFunctions.getActiveRange();

    await mapSourceTableDataToTheCells(tableData, cellAddress || activeCellAddress);

    setProgressBarCustomMessage("");

    return false;
  } catch (error) {
    console.error(error);
  }
};

/**
 * create dataset for Each APIs Limit
 *
 * @param {Array} data
 *
 * @return {Array}
 *
 */
export const getDataSetAccordingToTheLimit = (rowWiseDataInFlatArr, limit) => {
  let index = 0;
  let tempArr = [];
  const dataSetAccordingToLimit = [];

  (rowWiseDataInFlatArr || []).forEach((obj) => {
    ++index;
    tempArr.push(obj);

    if (limit == index) {
      dataSetAccordingToLimit.push(tempArr);
      tempArr = [];
      index = 0;
    }
  });

  if (tempArr.length) dataSetAccordingToLimit.push(tempArr);

  return dataSetAccordingToLimit;
};

/**
 * map data to the cells
 *
 * @param {Array} data
 * @param {String} startingAddress
 *
 */
const mapSourceTableDataToTheCells = async (data, startingAddress) => {
  const headerCellNames = (data.columns_meta || []).map(({ display_name }) => display_name).flat();

  const dataSetAccordingToLimit = getDataSetAccordingToTheLimit(
    [headerCellNames, ...(data?.data || [])],
    LIMIT_TO_UPDATE_CELLS_PER_CALL
  );

  const mapping = dataSetAccordingToLimit.map((setAccordingToTheLimit, index) => {
    const [row, column] = startingAddress.split(/(\d+)/);

    const cellsLength = (data.columns_meta || []).length - 1;

    const endPoint = convertNumberIntoCharacter(convertRowIndexIntoNumber(row) + cellsLength);

    const cellRange = `${row}${Number(column) + index * LIMIT_TO_UPDATE_CELLS_PER_CALL}:${endPoint}${
      Number(column) + index * LIMIT_TO_UPDATE_CELLS_PER_CALL + setAccordingToTheLimit.length - 1
    }`;

    return { address: cellRange, value: setAccordingToTheLimit };
  });

  try {
    const updateTheValuesToTheCells = async (row) => {
      await serverFunctions.dumpTableData(row.value, row.address);
    };

    await eachLimit(mapping, 1, updateTheValuesToTheCells);

    return true;
  } catch (error) {
    console.log(error, "ERROR");
  }
};

/**
 * get all source tables list
 */
export const getSourceTableListingViaApi = async () => {
  try {
    const url = `${ADD_ONS_APIS.V2_API.LOAD_ALL_TABLES_NO_PARENT_FOLDER}?query=${getQueryObject()}&details=false`;
    console.log("LLLLLLLLLLL33333333333", url);

    const res = await httpGet(url);

    if (res) return res.data;
  } catch (error) {
    console.error(error);
    console.log("LLLLLLLLLLLLLLLLeeeeeerrrrrrrrooooooorrrrrr");

    return [];
  }
};

/**
 * get string after adding prefix and converting object into the string
 *
 * @param {Object} source
 * @param {Object} selectedFields
 * @param {Object} downloadTableData
 *
 * @returns {String}
 *
 */
export const getCommentAfterAddingPrefixAndConvertingTheContentIntoString = (
  source,
  selectedFields,
  downloadTableData = {}
) => {
  const cellDimensionMap = {
    version: 1,
    content: {
      source,
      selectedFields,
      downloadTableData,
    },
  };

  const cellDimensionMapSerialized = AIP_CELL_MAP_CONTENT_PREFIX + JSON.stringify(cellDimensionMap);

  return cellDimensionMapSerialized;
};

/**
 * get object after removing prefix and converting string into the object
 *
 * @param {String} content
 *
 * @returns {Object}
 *
 */
export const getCommentAfterRemovingPrefixAndConvertingTheStringIntoObject = (content) => {
  let mappedContent = {};

  try {
    if (content.indexOf(AIP_CELL_MAP_CONTENT_PREFIX) == 0) {
      content = content.slice(AIP_CELL_MAP_CONTENT_PREFIX.length);
    }

    mappedContent = JSON.parse(content);
  } catch (error) {
    console.error(error);
  }

  return mappedContent;
};

/**
 * refresh the selected cells and render the data according to mapped comments
 *
 */
export const refreshTheData = async () => {
  try {
    const mappedData = await serverFunctions.getAllCommentWithAddress();

    const pendingPromises = [];

    (mappedData || []).forEach((cell) => {
      const { content } = getCommentAfterRemovingPrefixAndConvertingTheStringIntoObject(cell.comment);

      if (Object.keys(content?.downloadTableData || {}).length) {
        pendingPromises.push(downloadAndRenderDataOnActiveCell(content, cell.address));
      }

      return null;
    });

    await Promise.all(pendingPromises);

    return true;
  } catch (error) {
    console.log(error);
  }
};

/**
 * get source table dropdown array
 *
 * @param {Array} list
 *
 * @returns {Array}
 *
 */
export const getSourceTableListingOptions = (list) => {
  return (list || []).map(({ display_name: name = "", id, table_type = "", label = "" }) => {
    return {
      value: id,
      label: name,
      labelName: label,
      tableType: table_type,
    };
  });
};

/**
 * get source table data according to id
 *
 * @param {String} id
 * @param {Boolean} details
 *
 * @returns {Object}
 *
 */
export const loadSourceTableDataForParticularId = async (id, details = false) => {
  try {
    const res = await httpGet(
      `${ADD_ONS_APIS.V2_API.LOAD_SOURCE_TABLE_DETAILS.replace("#ID#", id).replace("#DETAILS#", details)}`
    );

    if (res) return res.data;

    return Promise.reject();
  } catch (error) {
    console.error(error);

    return [];
  }
};

/**
 * Delete comments on selected range
 *
 */
export const deleteSelectedRangeComments = async () => {
  try {
    await serverFunctions.deleteSelectedRangeCommnets();

    return true;
  } catch (error) {
    console.log(error);
  }
};

/**
 *
 * Get User token key
 *
 */
export const getUserSession = () => {
  return localStorage.getItem(TOKEN_KEY) || {};
};

/**
 *
 * Set height of react tree dropdown according to screen size
 *
 */
export const setHeightOfTheDropDownAccordingToScreenSize = () => {
  setTimeout(() => {
    if (document.getElementsByClassName(DROPDOWN_TREE_CLASS_FOR_INFINITE_SCROLL).length) {
      const element = document.getElementsByClassName(DROPDOWN_TREE_CLASS_FOR_INFINITE_SCROLL);

      element[0].style.height = `${
        (document.body.scrollHeight * MINIMUM_HEIGHT_PERCENTAGE_FOR_TIME_PERIOD_DROPDOWN) / TOTAL_PERCENTAGE_OF_SCREEN
      }px`;
    }

    setWidthOfNode(document.getElementsByClassName(REACT_TREE_DROPDOWN_CONTENT_CLASS_NAME));
  }, 1);
};

/**
 *
 * Iterate the node and set the given width
 *
 * @param {Array} dropdownOptions
 *
 */
const setWidthOfNode = (dropdownOptions) => {
  Array.from(dropdownOptions).forEach((element) => {
    if (!(element instanceof HTMLElement)) {
      return;
    }

    element.style.width = `${(window.innerWidth * REACT_TREE_DROPDOWN_INPUT_WIDTH_PERCENTAGE) / 100}px`;
  });
};

/**
 *
 * Set Width of react tree dropdown according to screen size
 *
 */
export const handleReactTreeDropdownWidthOnResizeEvent = () => {
  setWidthOfNode(document.getElementsByClassName(REACT_TREE_DROPDOWN_INPUT_CLASS_NAME));

  setWidthOfNode(document.getElementsByClassName(REACT_TREE_DROPDOWN_CONTENT_CLASS_NAME));
};
