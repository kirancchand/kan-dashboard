import React, { useEffect, useState } from "react";
import { GETBRANCHBYLOCALBODY } from '../api';
const BranchDropdown = (props:any) => {

  const [localBody, setLocalBody] = useState(props.localBody);
  const [selectedBranch, setSelectedBranch] = useState(props.value);
  const [branchData, setBranchData] = useState([]);
  const [loading, setLoading] = useState(false);  // Loading state
   const fetchData = async (reqData:any) => {
    setLoading(true);  // Set loading to true before the request
  
    try {
       const response = await fetch(GETBRANCHBYLOCALBODY, {
            method: 'POST', // Specify the request method
            headers: {
                'Content-Type': 'application/json' // Set the content type to JSON
            },
            body:JSON.stringify(reqData)
        });
  
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const result = await response.json();  // Parse JSON response
      console.log(result)
      setBranchData(result);  // Update the data state
    } catch (err:any) {
      console.log(err)
    } finally {
      setLoading(false);  // Set loading to false after the request
    }
  };

  useEffect(()=>{
    if(props.localBody!="")
    fetchData({
      "localbody_name": props.localBody
    })
  },[props.localBody])


  const handleChange = (e:any) => {
    setSelectedBranch(e.target.value);
    props.handleChange(e)
  };

  return (
    <div>
       <div>
      <label htmlFor="ward">Select Ward: </label>
      </div>
      <div>
      <select
        id="ward"
        value={selectedBranch}
        onChange={handleChange}
        name={props.name}
      >
        <option value="">-- Select --</option>
        {branchData.map((data:any, index:number) => (
          <option key={index} value={data.branch_name}>
           {data.branch_name}
          </option>
        ))}
      </select>
      </div>
    </div>
  );
};

export default BranchDropdown;
