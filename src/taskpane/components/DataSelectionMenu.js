import React, { useEffect, useState } from "react";
import { TOKEN_KEY } from "../Config/constant";
import { getSourceTableListingViaApi, loadSourceTableDataForParticularId } from "../Utils/helper";
import SourceTableSelection from "./DataSelection/SourceTableSelection";
import FieldsDropDownTree from "./DataSelection/FiledsDropDownTree";

const SourceTableCachedData = {};

function DataSelectionMenu() {
  const [sourceTablesList, setSourceTablesList] = useState([]);
  const [fields, setFields] = useState([]);
  const [selectedFields, setSelectedFields] = useState([]);
  const [selectedSource, setSelectedSource] = useState("");
  const [selectedSources, setSelectedSources] = useState([]);
  const [loadingFieldsData, setLoadingFieldsData] = useState(false);
  const [downloadedTableData, setDownloadedTableData] = useState({});

  /**
   * load required data for dropdowns
   */

  const loadRequiredData = async () => {
    try {
      const [sourceTablesData = []] = await Promise.all([getSourceTableListingViaApi()]);

      setSourceTablesList(sourceTablesData);
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * load data In Case source table data is not cached
   *
   * @param {Array} sources
   *
   */

  const handleIfSourceDataIsNotPresentInStore = async (sources) => {
    try {
      const alredadyCachedData = [];

      const pendingPromise = sources
        .filter(({ value }) => {
          if (SourceTableCachedData[value]) {
            alredadyCachedData.push(SourceTableCachedData[value]);

            return null;
          }

          return value;
        })
        .map(({ value }) => loadSourceTableDataForParticularId(value));

      const data = await Promise.all(pendingPromise);

      data.forEach((field) => {
        if (field) SourceTableCachedData[field.id] = field;
      });

      const getArrWithValues = data.filter((value) => value);

      setFields([...getArrWithValues, ...alredadyCachedData]);

      return true;
    } catch (error) {
      console.error(error);

      return false;
    }
  };

  useEffect(() => {
    loadRequiredData();
  }, []);

  const handleSourceTableSelection = async (sourceTable) => {
    setSelectedSource(sourceTable);
    setSelectedSources([sourceTable]);
    setSelectedFields([]);
    setDownloadedTableData({});

    setLoadingFieldsData(true);

    if (SourceTableCachedData[sourceTable.value]) {
      setFields([SourceTableCachedData[sourceTable.value]]);

      return;
    }

    await handleIfSourceDataIsNotPresentInStore([sourceTable]);
  };

  return (
    <div>
      <SourceTableSelection
        sourceTablesList={sourceTablesList}
        handleSourceTableSelection={handleSourceTableSelection}
        selectedSource={selectedSource}
      />
      <FieldsDropDownTree
        fields={fields}
        selectedFields={selectedFields}
        loadingFieldsData={loadingFieldsData}
        setSelectedFields={setSelectedFields}
        setLoadingFieldsData={setLoadingFieldsData}
      />
    </div>
  );
}

export default DataSelectionMenu;
