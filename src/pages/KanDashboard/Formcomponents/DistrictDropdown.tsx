import React, { useEffect, useState } from "react";
import { GETDISTRICT } from '../api';
const DistrictDropdown = (props:any) => {
  const [selectedDistrict, setSelectedDistrict] = useState(props.value);
  const [loading, setLoading] = useState(false);  // Loading state
  // const districts = ["Kollam", "Thiruvananthapuram"];
  const [district,setDistrict]=useState([])

   const fetchData = async () => {
    setLoading(true);  // Set loading to true before the request
  
    try {
       const response = await fetch(GETDISTRICT, {
            method: 'GET', // Specify the request method
            headers: {
                'Content-Type': 'application/json' // Set the content type to JSON
            },
        });
  
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const result = await response.json();  // Parse JSON response
      console.log(result)
      setDistrict(result);  // Update the data state
    } catch (err:any) {
      console.log(err)
    } finally {
      setLoading(false);  // Set loading to false after the request
    }
  };

  useEffect(()=>{
    fetchData()
  },[])

  const handleChange = (e:any) => {
    setSelectedDistrict(e.target.value);
    props.handleChange(e)
  };

  return (
    <div>
       <div>
      <label htmlFor="district">Select District: </label>
      </div>
      <div>
      <select
        id="district"
        value={selectedDistrict}
        onChange={handleChange}
        name={props.name}
      >
        <option value="">-- Select --</option>
        {district.map((district, index) => (
          <option key={index} value={district}>
            {district}
          </option>
        ))}
      </select>
      </div>
    </div>
  );
};

export default DistrictDropdown;
