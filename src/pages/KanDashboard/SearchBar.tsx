import React, { useState } from "react";

export default function SearchForm(props:any) {
  const [search, setSearch] = useState("");
  const [option, setOption] = useState("Name");

  const handleSubmit = (e:any) => {
    e.preventDefault();
    console.log("Search:", search);
    console.log("Selected Option:", option);
    // props.setFilterReq({option:search})
    const formData = {
        [option]: search,
      };

      if(search!=""){
        props.setFilterSearch(formData)
      }

  
      console.log("Form Data:", formData);
  };
  const resetReq=()=>{
    setSearch("")
    props.setFilterSearch({})
  }
  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "500px", margin: "auto" }}>
      {/* Search Bar Inline */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: "10px", }} >
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1,
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "4px 0 0 4px",
            outline: "none",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "8px 16px",
            border: "none",
            backgroundColor: "#007BFF",
            color: "#fff",
            borderRadius: "0 4px 4px 0",
            cursor: "pointer",
          }}
        >
          Search
        </button>&nbsp;
        <button
          type="button"
          onClick={()=>resetReq()}
          style={{
            padding: "8px 16px",
            border: "none",
            backgroundColor: "#a5abb3",
            color: "#fff",
            borderRadius: "4px 4px 4px 4px",
            cursor: "pointer",
          }}
        >
          Reset
        </button>
      </div>

      {/* Radio Buttons Inline */}
      <div style={{ display: "flex", gap: "15px" }}>
        <label>
          <input
            type="radio"
            name="option"
            value="Name"
            checked={option === "Name"}
            onChange={(e) => setOption(e.target.value)}
          />
          Name
        </label>

        <label>
          <input
            type="radio"
            name="option"
            value="Gender"
            checked={option === "Gender"}
            onChange={(e) => setOption(e.target.value)}
          />
          Gender
        </label>

        <label>
          <input
            type="radio"
            name="option"
            value="ID"
            checked={option === "ID"}
            onChange={(e) => setOption(e.target.value)}
          />
          Voters Id
        </label>
      </div>
    </form>
  );
}
