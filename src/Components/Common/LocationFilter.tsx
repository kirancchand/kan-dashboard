import React, { useEffect, useState } from "react";
import RSelect from "../../Components/Common/RSelect/RSelect";
import md from "../../../src/http/masterData";
import { toast } from "react-toastify";
interface SelectOption {
  value: string | number;
  label: string;
}
interface Props {
  values: {
    state: SelectOption | null;
    district: SelectOption | null;
    region: SelectOption | null;
    area: SelectOption | null;
    branch: SelectOption | null;
  };
  setFieldValue: (field: string, value: SelectOption | null) => void;
}

const LocationFilter = ({ values, setFieldValue }: Props) => {
  const [stateData, setStateData] = useState([]);
  const [districtData, setDistrictData] = useState([]);
  const [regionData, setRegionData] = useState([]);
  const [areaData, setAreaData] = useState([]);
  const [branchData, setBranchData] = useState([]);

  useEffect(() => {
    md("getAll_State")
      .then(setStateData)
      .catch((err) => toast(err, { type: "error" }));

    md({
      requestName: "getAll_Area",
    })
      .then(setAreaData)
      .catch((err) => toast(err, { type: "error" }));
  }, []);

  const stateChange = (value: any) => {
    setFieldValue("state", value);
    setFieldValue("district", null);
    setFieldValue("region", null);
    setFieldValue("area", null);
    setFieldValue("branch", null);

    md({
      requestName: "getAll_DistrictByState",
      params: [
        {
          paramValue: value.value,
          paramEncrypted: "Y",
        },
      ],
    }).then(setDistrictData);
  };

  const districtChange = (value: any) => {
    setFieldValue("district", value);
    setFieldValue("region", null);
    setFieldValue("area", null);
    setFieldValue("branch", null);

    md({
      requestName: "getAll_RegionByDistrict",
      params: [
        {
          paramValue: value.value,
          paramEncrypted: "Y",
        },
      ],
    }).then(setRegionData);
  };

  const regionChange = (value: any) => {
    setFieldValue("region", value);

    md({
      requestName: "getAll_Area",
    }).then(setAreaData);
  };

  const areaChange = (value: any) => {
    setFieldValue("area", value);
    setFieldValue("branch", null);

    md({
      requestName: "getAll_BranchByArea",
      params: [
        {
          paramValue: value.value,
          paramEncrypted: "Y",
        },
      ],
    }).then(setBranchData);
  };

  return (
    <>
      <RSelect
        value={values.state}
        onChange={stateChange}
        options={stateData}
        placeholder="State"
        isClearable
      />

      <RSelect
        value={values.district}
        onChange={districtChange}
        options={districtData}
        placeholder="District"
        isClearable
      />

      <RSelect
        value={values.region}
        onChange={regionChange}
        options={regionData}
        placeholder="Region"
        isClearable
      />

      <RSelect
        value={values.area}
        onChange={areaChange}
        options={areaData}
        placeholder="Area"
        isClearable
      />
      <RSelect
        value={values.branch}
        onChange={(value: any) => setFieldValue("branch", value)}
        options={branchData}
        placeholder="Branch"
        isClearable
      />
    </>
  );
};

export default LocationFilter;
