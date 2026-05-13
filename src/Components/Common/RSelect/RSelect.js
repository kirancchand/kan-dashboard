import React from "react";
import Select from "react-select";
// import "react-select-css/dist/react-select-css.css";

function RSelect(props) {
  const style = {
    // ...styles,
    control: (base, state) => ({
      ...base,
      borderColor: '#DC3545',
      // overwrittes hover style
      '&:hover': {
        borderColor: '#DC3545',
      }
    }),
  }
  const style1 = {
    // control: (base, state) => ({
    //   ...base,
    //  height:32,
    //  minHeight:32
    // }),
    menu: provided => ({ ...provided, zIndex: 9999 })
  }

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
        styles={props.error && props.touched ? style : style1}
        isLoading={props.isLoading}
        defaultValue={props.defaultValue}
        isDisabled={props.disabled}
        isClearable={props.isClearable} 
        menuPlacement="auto"   
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
export default RSelect;

