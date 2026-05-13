import React from 'react';
import Select from "react-select";
// import "react-select/dist/react-select.css";


function RSelectMulti(props) {

  const style = {
    // ...styles,
    control: (base, state) => ({
      ...base,
      borderColor: '#DC3545',
      // overwrittes hover style
      '&:hover': {
        borderColor: '#DC3545'
      }
    }),
  }
  const style1 = {
    // control: (base, state) => ({
    //   ...base,
    //  height:35,
    //  minHeight:35
    // }),
    menu: provided => ({ ...provided, zIndex: 9999 })
  }
  
  //to search only in the label
  const filterOption = (option, inputValue) =>
  (option.label.toString().match(inputValue) || []).length > 0;  

  return (
    <div>
      <Select
        name={props.name}
        ref={props.ref}
        isMulti
        onChange={props.onChange}
        onBlur={props.onBlur}
        value={props.value}
        styles={props.error && props.touched ? style : style1}
        options={props.options}
        filterOption={filterOption}
        isLoading={props.isLoading}
        isClearable={props.isClearable}
        // isOptionDisabled = {true}
        isDisabled={props.isDisabled}
        placeholder={props.placeholder}
      />
      {!!props.error && props.touched && (
        <div style={{ color: "#DC3545", fontSize: 11.264, marginTop: ".4rem" }}>
          {props.error}
        </div>
      )}
    </div>
  )
}

export default RSelectMulti;
