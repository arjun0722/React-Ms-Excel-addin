import React from "react";
import { func, object, shape, arrayOf } from "prop-types";
import { CONSTANT_TEXT, PLACEHOLDER_VALUES, TABLE_TYPES, TABLE_TYPE_LABELS } from "../../Config/constant";
import Select from "react-select";
import { getSourceTableListingOptions } from "../../Utils/helper";

function SourceTableSelection({ sourceTablesList, selectedSource, handleSourceTableSelection }) {
  /**
   * get styles according to label
   *
   * @param {Object} param
   *
   */
  const getStylesAccordingToLabel = (param) => {
    return {
      color:
        param.data.tableType === TABLE_TYPES.SCENARIO
          ? TABLE_TYPE_LABELS[param.data.tableType]?.color[param.data.labelName] ||
            TABLE_TYPE_LABELS[param.data.tableType]?.color.others
          : TABLE_TYPE_LABELS[param.data.tableType]?.color,
      backgroundColor:
        param.data.tableType === TABLE_TYPES.SCENARIO
          ? TABLE_TYPE_LABELS[param.data.tableType]?.backgroundColor[param.data.labelName] ||
            TABLE_TYPE_LABELS[param.data.tableType]?.backgroundColor.others
          : TABLE_TYPE_LABELS[param.data.tableType]?.backgroundColor,
      border: TABLE_TYPE_LABELS[param.data.tableType]?.border,
    };
  };

  /**
   *
   * Show Option with labels
   *
   */
  const showOptionsWithLabels = (param) => {
    const { tableType, labelName } = param?.data || {};

    if (tableType && tableType !== TABLE_TYPES.SOURCE) {
      const label = labelName || TABLE_TYPE_LABELS[tableType]?.name;

      if (label) {
        return (
          <>
            <div {...param} className="source-table-listing-div" onClick={() => param.innerProps.onClick()}>
              {param.data.label} -
              <span className="label-text" style={getStylesAccordingToLabel(param)}>
                {label}
              </span>
            </div>
          </>
        );
      }
    }

    return (
      <div className="source-table-listing-div" {...param} onClick={() => param.innerProps.onClick()}>
        {" "}
        {param.data.label}
      </div>
    );
  };

  return (
    <div>
      <label className="dropdown-labels">{CONSTANT_TEXT.SELECT_TABLE_LABEL}</label>
      <Select
        value={selectedSource}
        components={{ Option: showOptionsWithLabels }}
        onChange={(val) => handleSourceTableSelection(val)}
        options={getSourceTableListingOptions(sourceTablesList)}
        placeholder={PLACEHOLDER_VALUES.SOURCE_TABLE_SELECTION_DROPDOWN}
      />
    </div>
  );
}
SourceTableSelection.propTypes = {
  sourceTablesList: arrayOf(shape({})),
  selectedSource: object,
  handleSourceTableSelection: func,
};

SourceTableSelection.defaultProps = {
  sourceTablesList: [],
  selectedSource: {},
  handleSourceTableSelection: () => {},
};

export default SourceTableSelection;
