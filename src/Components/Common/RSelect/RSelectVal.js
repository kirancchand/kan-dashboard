import React from "react";
import Select from "react-select";
// import "react-select/dist/react-select.css";
  
 function RSelectVal(props)  {
  const style={
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
    return (
    //  console.log(props),
      <div> 
       {/* typeOfInfoData.find(typeofinfo => typeofinfo.value===typeOfInfo */}
        <Select
          name={props.name}
          placeholder={props.placeholder}
          ref={props.ref}
          options={props.options}
          onChange={props.onChange}
          onBlur={props.onBlur}
          // value={props.value}     
          value={props.options!==undefined?props.value!==null?props.options.find(optionValue=>optionValue.value===props.value):null:null}  
          // value={props.options!==undefined?props.options.find(optionValue=>optionValue.value===props.value):""}  
          styles={ props.error && props.touched ?  style : 'none' }    
          isLoading={props.isLoading}
          isDisabled = {props.disabled} 
          // isClearable={true}
          isClearable={props.isClearable} 
          // readOnly = {props.readOnly}
          defaultValue={props.defaultValue}
        />
       {!!props.error && props.touched && (
          <div 
          style={{ color: "#DC3545",fontSize:11.264, marginTop: ".4rem" }}
          >
          {props.error}
          </div>
       )} 
      </div>
    );
  }
  export default RSelectVal;

