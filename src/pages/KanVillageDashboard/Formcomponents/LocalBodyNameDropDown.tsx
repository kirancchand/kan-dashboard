import React, { useEffect, useState } from "react";
import { GETVILLAGELOCALBODYBYDISTRICTANDTYPE } from '../api';
const LocalBodyNameDropDown = (props:any) => {
  const [selectedLocalbodyName, setSelectedLocalbodyName] = useState(props.value);
  const [loading, setLoading] = useState(false);  // Loading state
  // const districts = ["Kollam", "Thiruvananthapuram"];
  const [localbodyname,setLocalbodyName]=useState([])
  console.log("props.formValues",props.formValues)
   const fetchData = async (reqData:any) => {
    setLoading(true);  // Set loading to true before the request
  
    try {
       const response = await fetch(GETVILLAGELOCALBODYBYDISTRICTANDTYPE, {
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
      setLocalbodyName(result.localBodies);  // Update the data state
    } catch (err:any) {
      console.log(err)
    } finally {
      setLoading(false);  // Set loading to false after the request
    }
  };

  useEffect(()=>{
    if( (props.formValues.district&&props.formValues.local_body_type)!="")
    fetchData({
      "district": props.formValues.district,
      "localbody_type":props.formValues.local_body_type
    })
  },[props.formValues.district,props.formValues.local_body_type])

  const handleChange = (e:any) => {
    setSelectedLocalbodyName(e.target.value);
    props.handleChange(e)

    // const selectedObj:any = localbodyname.find((item:any) => item.localbody_name === e.target.value);
    // console.log("selectedObj",selectedObj)
    props.getBranch(e.target.value)

  };

  return (
    <div>
      <div>
      <label htmlFor="localbodyname">Select Localbody Name: </label>
      </div>
      <div>
      <select
        id="localbodyname"
        value={selectedLocalbodyName}
        onChange={handleChange}
        name={props.name}
      >
        <option value="">-- Select --</option>
        {localbodyname.length>0&&localbodyname.map((data:any, index:number) => (
          <option key={index} value={data.area}>
            {data.area}
          </option>
        ))}
      </select>
      </div>
    </div>
  );
};

export default LocalBodyNameDropDown;
