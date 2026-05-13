import React, { useEffect, useState } from "react";
const LocalbodyTypeDropdown = (props:any) => {
  const [selectedLocalBodyType, setSelectedLocalBodyType] = useState(props.value);
  const [loading, setLoading] = useState(false);  // Loading state
  const Localbodytype = ["Corporation", "Muncipality","Panchayat"];



  const handleChange = (e:any) => {
    setSelectedLocalBodyType(e.target.value);
    props.handleChange(e)
  };

  return (
    <div>
      <div>
      <label htmlFor="localbodytype">Select Localbody Type: </label>
      </div>
      <div>
      <select
        id="localbodytype"
        value={selectedLocalBodyType}
        onChange={handleChange}
        name={props.name}
      >
        <option value="">-- Select --</option>
        {Localbodytype.map((localbodytype, index) => (
          <option key={index} value={localbodytype}>
            {localbodytype}
          </option>
        ))}
      </select>
      </div>
    </div>
  );
};

export default LocalbodyTypeDropdown;
