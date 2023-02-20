import { AND_FILTER_TYPE, IN_FILTER_TYPE, SEARCH_QUERY_TYPE, SELECT_EXTRACTION_TYPE } from "../Config/QueryConfig";

/**
 * Get Query Object for the APIs
 */
export const getQueryObject = () => {
  return btoa(
    JSON.stringify({
      query_type: SEARCH_QUERY_TYPE,
      source_extraction: {
        extraction_type: SELECT_EXTRACTION_TYPE,
      },
    })
  );
};

/**
 * Get Filter Object for the APIs
 *
 * @param {Array} selectedFields
 * @param {Object} tableColumns
 *
 */
const getSelectedFiledFiltersObject = (selectedFields) => {
  const columnWiseData = {};

  (selectedFields || []).forEach((field) => {
    if (columnWiseData[field.columnName]) {
      columnWiseData[field.columnName] = [...columnWiseData[field.columnName], field];

      return;
    }

    columnWiseData[field.columnName] = [field];
  });

  const filtersObj = Object.values(columnWiseData).map((selectedField) => {
    const [details] = selectedField || [];

    let isFieldsHasEmptyValueSelected = false;

    const selectedFieldsNames = [];

    selectedField.forEach((field) => {
      if (field.dimensionId === null || field.dimensionId === undefined || field.dimensionId === "") {
        isFieldsHasEmptyValueSelected = true;

        return;
      }

      selectedFieldsNames.push(field.dimensionId);
    });

    if (isFieldsHasEmptyValueSelected) {
      return {
        filter_type: "or",
        filters: [
          ...(selectedFieldsNames.length
            ? [
                {
                  filter_type: IN_FILTER_TYPE,
                  column: { column_name: details.columnName },
                  in_values: selectedFieldsNames,
                },
              ]
            : []),

          {
            filter_type: "null_check",
            column: { column_name: details.columnName },
          },

          {
            filter_type: "equals",
            column: { column_name: details.columnName },
            value: "",
          },
        ],
      };
    }

    return {
      filter_type: IN_FILTER_TYPE,
      column: { column_name: details.columnName },
      in_values: selectedFieldsNames,
    };
  });

  return {
    filter_type: AND_FILTER_TYPE,
    filters: filtersObj,
  };
};

/**
 * Get Query Object for the Table Info APIs
 *
 * @param {Array} selectedColumns
 * @param {Array} selectedFilters
 * @param {Boolean} isFieldFilterApplied
 * @param {Array} fieldsData
 *
 *
 */
export const getQueryObjectForGettingTableData = (mappedData) => {
  const { isFilterApplied = [], tableColumns = [] } = mappedData.downloadTableData || {};

  return btoa(
    JSON.stringify({
      query_type: SEARCH_QUERY_TYPE,
      source_extraction: {
        extraction_type: SELECT_EXTRACTION_TYPE,
        columns: tableColumns.map((name) => {
          return { column_name: name };
        }),
      },

      ...(isFilterApplied && mappedData.selectedFields.length
        ? {
            filter: getSelectedFiledFiltersObject(mappedData.selectedFields),
          }
        : {}),
    })
  );
};
