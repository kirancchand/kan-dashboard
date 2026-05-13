import React from "react";
import Select from "react-select";
// import "react-select-css/dist/react-select-css.css";

function RSelectCountry(props) {
      const customstyle = {
        control: base => ({
            ...base,
            // position: "absolute",
            width: "100px",
        })
    };

  return (
    <div>
      <Select
        name={props.name}
        placeholder={props.placeholder}
        ref={props.ref}
        options={props.options}
        onChange={props.onChange}
        onBlur={props.onBlur}
        value={props.value}
        styles={customstyle}
        isLoading={props.isLoading}
        defaultValue={props.defaultValue}
        isDisabled={props.disabled}
        getOptionLabel={props.getOptionLabel}
        isClearable={props.isClearable}     
        id={props.id}
      />
      {!!props.error && props.touched && (
        <div
          style={{ color: "#DC3545", fontSize: 11.264, marginTop: ".4rem" }}
        >
          {props.error}
        </div>
      )}
    </div>
  );
}
export default RSelectCountry;

