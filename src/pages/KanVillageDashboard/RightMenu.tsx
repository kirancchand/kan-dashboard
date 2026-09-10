
import React, { useState, useCallback,useEffect } from 'react';
import { Card,CardBody,Row,Container,Col,Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import { SearchAllUnit,INSERTUPLOADUSER } from './api';
import DistrictDropdown from "./Formcomponents/DistrictDropdown";
import LocalBodyTypeDropDown from "./Formcomponents/LocalbodyTypeDropdown";
import LocalBodyNameDropDown from"./Formcomponents/LocalBodyNameDropDown";
import WardDropdown from "./Formcomponents/BranchDropdown";
import RightMenuData from './RightMenuData';
// Type definitions
interface AdministrativeUnit {
  district: string;
  type: 'corporation' | 'municipality' | 'panchayat';
  name: string;
  wards: string[];
}

interface GroupedData {
  [district: string]: {
    [type: string]: AdministrativeUnit[];
  };
}

interface CheckboxState {
  checked: boolean;
  indeterminate: boolean;
}

interface TypeInfo {
  name: string;
  color: string;
}

interface DistrictInfo {
  name: string;
  color: string;
}

interface ExpansionState {
  [key: string]: boolean;
}

const RightMenu = (props:any) => {
  // const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [expandedItems, setExpandedItems] = useState<ExpansionState>({});
    const [data, setData] = useState<any[]>([]); 
    const [loading, setLoading] = useState(false);  // Loading state
    const [error, setError] = useState(null); 

   const fetchData = async () => {
    setLoading(true);  // Set loading to true before the request
    setError(null);  // Reset the error state
  
    try {
       const response = await fetch(SearchAllUnit, {
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
      setData(result);  // Update the data state
    } catch (err:any) {
      setError(err.message);  // Handle any errors
    } finally {
      setLoading(false);  // Set loading to false after the request
    }
  };

  useEffect(() => {
    fetchData();
  }, []); 
  // Group data by district, then by type
  const groupedData: GroupedData = data.reduce((acc: GroupedData, item: AdministrativeUnit) => {
    if (!acc[item.district]) {
      acc[item.district] = {};
    }
    if (!acc[item.district][item.type]) {
      acc[item.district][item.type] = [];
    }
    acc[item.district][item.type].push(item);
    return acc;
  }, {});
  // Generate unique keys for different levels
  const getDistrictKey = (district: string): string => `district-${district}`;
  const getDistrictTypeKey = (district: string, type: string): string => `district-type-${district}-${type}`;
  const getUnitKey = (district: string, type: string, name: string): string => `unit-${district}-${type}-${name}`;
  const getWardKey = (district: string, type: string, name: string, ward: string): string => `ward-${district}-${type}-${name}-${ward}`;

  // Generate expansion keys
  const getDistrictExpansionKey = (district: string): string => `expand-district-${district}`;
  const getDistrictTypeExpansionKey = (district: string, type: string): string => `expand-district-type-${district}-${type}`;
  const getUnitExpansionKey = (district: string, type: string, name: string): string => `expand-unit-${district}-${type}-${name}`;

  // Toggle expansion state
  const toggleExpansion = (key: string): void => {
    setExpandedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Check if item is expanded
  const isExpanded = (key: string): boolean => {
    return expandedItems[key] || false;
  };

  // Get all ward keys for a unit
  const getUnitWardKeys = (district: string, type: string, name: string, wards: string[]): string[] => 
    wards.map((ward: string) => getWardKey(district, type, name, ward));

  // Get all keys for a district-type combination
  const getDistrictTypeAllKeys = (district: string, type: string, units: AdministrativeUnit[]): string[] => {
    const keys: string[] = [];
    units.forEach((unit: AdministrativeUnit) => {
      keys.push(getUnitKey(district, type, unit.name));
      keys.push(...getUnitWardKeys(district, type, unit.name, unit.wards));
    });
    return keys;
  };

  // Get all keys for a district
  const getDistrictAllKeys = (district: string, districtData: { [type: string]: AdministrativeUnit[] }): string[] => {
    const keys: string[] = [];
    Object.entries(districtData).forEach(([type, units]: [string, AdministrativeUnit[]]) => {
      keys.push(...getDistrictTypeAllKeys(district, type, units));
    });
    return keys;
  };

  // Check if all items in array are selected
  const areAllSelected = (keys: string[]): boolean => keys.every((key: string) => props.selectedItems.has(key));
  
  // Check if some items in array are selected
  const areSomeSelected = (keys: string[]): boolean => keys.some((key: string) => props.selectedItems.has(key));

  // Toggle selection
  const toggleSelection = useCallback((keys: string[], isSelected: boolean): void => {
    props.setSelectedItems((prev: Set<string>) => {
      const newSet = new Set(prev);
      if (isSelected) {
        keys.forEach((key: string) => newSet.delete(key));
      } else {
        keys.forEach((key: string) => newSet.add(key));
      }
      return newSet;
    });
  }, []);

  // Handle district checkbox
  const handleDistrictChange = (district: string): void => {
    const districtData = groupedData[district];
    const allKeys: string[] = getDistrictAllKeys(district, districtData);
    const isSelected: boolean = areAllSelected(allKeys);
    toggleSelection(allKeys, isSelected);
  };

  // Handle district-type checkbox
  const handleDistrictTypeChange = (district: string, type: string): void => {
    const units: AdministrativeUnit[] = groupedData[district][type];
    const allKeys: string[] = getDistrictTypeAllKeys(district, type, units);
    const isSelected: boolean = areAllSelected(allKeys);
    toggleSelection(allKeys, isSelected);
  };

  // Handle unit checkbox
  const handleUnitChange = (district: string, type: string, name: string, wards: string[]): void => {
    const unitKey: string = getUnitKey(district, type, name);
    const wardKeys: string[] = getUnitWardKeys(district, type, name, wards);
    const allKeys: string[] = [unitKey, ...wardKeys];
    const isSelected: boolean = areAllSelected(allKeys);
    toggleSelection(allKeys, isSelected);
  };

  // Handle ward checkbox
  const handleWardChange = (district: string, type: string, name: string, ward: string): void => {
    const wardKey: string = getWardKey(district, type, name, ward);
    const unitKey: string = getUnitKey(district, type, name);
    
    props.setSelectedItems((prev: Set<string>) => {
      const newSet = new Set(prev);
      if (newSet.has(wardKey)) {
        newSet.delete(wardKey);
        // If no wards are selected, deselect unit
        const unit: AdministrativeUnit | undefined = data.find((u: AdministrativeUnit) => 
          u.district === district && u.type === type && u.name === name
        );
        if (unit) {
          const wardKeys: string[] = getUnitWardKeys(district, type, name, unit.wards);
          if (!wardKeys.some((key: string) => newSet.has(key))) {
            newSet.delete(unitKey);
          }
        }
      } else {
        newSet.add(wardKey);
        // If all wards are selected, select unit
        const unit: AdministrativeUnit | undefined = data.find((u: AdministrativeUnit) => 
          u.district === district && u.type === type && u.name === name
        );
        if (unit) {
          const wardKeys: string[] = getUnitWardKeys(district, type, name, unit.wards);
          if (wardKeys.every((key: string) => newSet.has(key) || key === wardKey)) {
            newSet.add(unitKey);
          }
        }
      }
      return newSet;
    });
  };

  // Get checkbox state (checked, unchecked, indeterminate)
  const getCheckboxState = (keys: string[]): CheckboxState => {
    const allSelected: boolean = areAllSelected(keys);
    const someSelected: boolean = areSomeSelected(keys);
    return {
      checked: allSelected,
      indeterminate: someSelected && !allSelected
    };
  };

  const getSelectedCount = (): number => props.selectedItems.size;

  // Get type display name and color
  const getTypeInfo = (type: string): TypeInfo => {
    const typeMap: { [key: string]: TypeInfo } = {
      corporation: { name: 'Corporation', color: 'bg-blue-100 text-blue-800' },
      municipality: { name: 'Municipality', color: 'bg-green-100 text-green-800' },
      panchayat: { name: 'Panchayat', color: 'bg-purple-100 text-purple-800' }
    };
    return typeMap[type] || { name: type, color: 'bg-gray-100 text-gray-800' };
  };

  // Get district display name
  const getDistrictInfo = (district: string): DistrictInfo => {
    const districtMap: { [key: string]: DistrictInfo } = {
      tvm: { name: 'Thiruvananthapuram', color: 'bg-red-100 text-red-800' },
      klm: { name: 'Kollam', color: 'bg-orange-100 text-orange-800' }
    };
    return districtMap[district] || { name: district.toUpperCase(), color: 'bg-gray-100 text-gray-800' };
  };

  // Sort districts and types for consistent display
  const sortedDistricts: string[] = Object.keys(groupedData).sort();

  const handleSelectAll = (): void => {
    const allKeys = new Set<string>();
    Object.values(groupedData).forEach((districtData: { [type: string]: AdministrativeUnit[] }) => {
      Object.values(districtData).flat().forEach((unit: AdministrativeUnit) => {
        allKeys.add(getUnitKey(unit.district, unit.type, unit.name));
        unit.wards.forEach((ward: string) => {
          allKeys.add(getWardKey(unit.district, unit.type, unit.name, ward));
        });
      });
    });
    props.setSelectedItems(allKeys);
  };

  const handleClearAll = (): void => {
    props.setSelectedItems(new Set());
  };

  const handleExpandAll = (): void => {
    const allExpansionKeys: { [key: string]: boolean } = {};
    
    sortedDistricts.forEach((district: string) => {
      const districtData = groupedData[district];
      allExpansionKeys[getDistrictExpansionKey(district)] = true;
      
      Object.keys(districtData).forEach((type: string) => {
        allExpansionKeys[getDistrictTypeExpansionKey(district, type)] = true;
        
        districtData[type].forEach((unit: AdministrativeUnit) => {
          allExpansionKeys[getUnitExpansionKey(district, type, unit.name)] = true;
        });
      });
    });
    
    setExpandedItems(allExpansionKeys);
  };

  const handleCollapseAll = (): void => {
    setExpandedItems({});
  };
  const [activeTab, setActiveTab] = useState(0);

  const toggleTab = (index: number) => {
    setActiveTab(index);
  };

  // Arrow icon component
  const ArrowIcon: React.FC<{ isExpanded: boolean }> = ({ isExpanded }) => (
    <svg 
      className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
  const FilterData=()=>{
    return <Container>
    <div className="max-w-5xl mx-auto p-6 bg-white">
       <div className="mb-6">
         <p className="text-sm text-gray-600">Selected items: {getSelectedCount()}</p>
       </div>

                       {
               sortedDistricts.map((district: string) => {
                   const districtData: { [type: string]: AdministrativeUnit[] } = groupedData[district];
                   const allDistrictKeys: string[] = getDistrictAllKeys(district, districtData);
                   const districtState: CheckboxState = getCheckboxState(allDistrictKeys);
                   const districtInfo: DistrictInfo = getDistrictInfo(district);
                   const totalUnits: number = Object.values(districtData).flat().length;
                   const districtExpansionKey: string = getDistrictExpansionKey(district);
                   const isDistrictExpanded: boolean = isExpanded(districtExpansionKey);
               
               return (
                 <div key={district} className="border-2 border-gray-200">
                   <div className="d-flex items-center">
                     <input
                       type="checkbox"
                       id={getDistrictKey(district)}
                       checked={districtState.checked}
                       ref={(el: HTMLInputElement | null) => {
                         if (el) el.indeterminate = districtState.indeterminate;
                       }}
                       onChange={() => handleDistrictChange(district)}
                     />
                           <span onClick={() => toggleExpansion(districtExpansionKey)} className='cursor-pointer'>
                             <i className="ri-folder-2-line"></i> 
                             <span> {districtInfo.name}</span>
                             <span className="text-gray-600 text-base font-normal">
                             ({totalUnits} unit{totalUnits !== 1 ? 's' : ''})
                           </span>
                         </span>
                   </div>

                   {/* Type Categories within District - Collapsible */}
                   {isDistrictExpanded && (
                     <div className="ml-8 space-y-5">
                       {Object.keys(districtData).sort().map((type: string) => {
                         const units: AdministrativeUnit[] = districtData[type];
                         const allDistrictTypeKeys: string[] = getDistrictTypeAllKeys(district, type, units);
                         const districtTypeState: CheckboxState = getCheckboxState(allDistrictTypeKeys);
                         const typeInfo: TypeInfo = getTypeInfo(type);
                         const districtTypeExpansionKey: string = getDistrictTypeExpansionKey(district, type);
                         const isDistrictTypeExpanded: boolean = isExpanded(districtTypeExpansionKey);

                         return (
                           <div key={`${district}-${type}`} className="rounded-lg bg-gray-50" style={{paddingLeft:"20px"}}>
                             {/* District-Type Level */}
                             <div className="d-flex items-center">
                               <input
                                 type="checkbox"
                                 id={getDistrictTypeKey(district, type)}
                                 checked={districtTypeState.checked}
                                 ref={(el: HTMLInputElement | null) => {
                                   if (el) el.indeterminate = districtTypeState.indeterminate;
                                 }}
                                 onChange={() => handleDistrictTypeChange(district, type)}
                                 className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-3"
                               />

                             <a data-bs-toggle="collapse" href="#collapseExample" role="button" aria-expanded="true" aria-controls="collapseExample"  
                                onClick={() => toggleExpansion(districtTypeExpansionKey)}>
                                 <i className="ri-folder-2-line align-bottom me-2"></i> <span className="file-list-link"> {typeInfo.name}</span>
                                 <span className="text-gray-600 text-base font-normal">
                                 ({units.length} unit{units.length !== 1 ? 's' : ''})
                               </span>
                             </a>
                             </div>

                             {/* Individual Units Level - Collapsible */}
                             {isDistrictTypeExpanded && (
                               <div className="ml-7 space-y-3">
                                 {units.map((unit: AdministrativeUnit) => {
                                   const unitKey: string = getUnitKey(district, type, unit.name);
                                   const wardKeys: string[] = getUnitWardKeys(district, type, unit.name, unit.wards);
                                   const allUnitKeys: string[] = [unitKey, ...wardKeys];
                                   const unitState: CheckboxState = getCheckboxState(allUnitKeys);
                                   const unitExpansionKey: string = getUnitExpansionKey(district, type, unit.name);
                                   const isUnitExpanded: boolean = isExpanded(unitExpansionKey);

                                   return (
                                     <div key={`${district}-${type}-${unit.name}`} className="border-l-2 border-gray-200 bg-white rounded-r-lg" style={{paddingLeft:"20px"}}>
                                       {/* Unit Level */}
                                       <div className="d-flex items-center">
                                         <input
                                           type="checkbox"
                                           id={unitKey}
                                           checked={unitState.checked}
                                           ref={(el: HTMLInputElement | null) => {
                                             if (el) el.indeterminate = unitState.indeterminate;
                                           }}
                                           onChange={() => handleUnitChange(district, type, unit.name, unit.wards)}
                                           className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-3"
                                         />



                                         <a data-bs-toggle="collapse" href="#collapseExample" role="button" aria-expanded="true" aria-controls="collapseExample"  
                                               onClick={() => toggleExpansion(unitExpansionKey)}>
                                               <i className="ri-folder-2-line align-bottom me-2"></i> <span className="file-list-link">  {unit.name.toUpperCase()}</span>
                                               <span className="text-gray-600 text-base font-normal">
                                               ({unit.wards.length} ward{unit.wards.length !== 1 ? 's' : ''})
                                             </span>
                                           </a>

                                       </div>

                                       {/* Wards Level - Collapsible */}
                                       {isUnitExpanded && (
                                         <div className="ml-7 grid grid-cols-3 gap-2" style={{paddingLeft:"20px"}}>
                                           {unit.wards.map((ward: string) => {
                                             const wardKey: string = getWardKey(district, type, unit.name, ward);
                                             return (
                                               <div key={wardKey} className="d-flex items-center">
                                                 <input
                                                   type="checkbox"
                                                   id={wardKey}
                                                   checked={props.selectedItems.has(wardKey)}
                                                   onChange={() => handleWardChange(district, type, unit.name, ward)}
                                                   className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-2"
                                                 />
                                                  <a data-bs-toggle="collapse" href="#collapseExample" role="button" aria-expanded="true" aria-controls="collapseExample">
                                                  <i className="ri-send-plane-2-fill"></i> <span className="file-list-link">    Ward {ward.toUpperCase()}</span>
                                                 </a>
                                               </div>
                                             );
                                           })}
                                         </div>
                                       )}
                                     </div>
                                   );
                                 })}
                               </div>
                             )}
                           </div>
                         );
                       })}
                     </div>
                   )}
                 </div>
               );
             })}

             {/* {getSelectedCount() > 0 && (
               <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                 <h3 className="font-semibold text-blue-900 mb-2">Selected Items ({getSelectedCount()}):</h3>
                 <div className="text-sm text-blue-800 space-y-1 max-h-40 overflow-y-auto">
                   {Array.from(props.selectedItems as Set<string>).sort().map((item: string) => (
                     <div key={item} className="font-mono">{item}</div>
                   ))}
                 </div>
               </div>
             )} */}
           <div className="mt-6 flex gap-2 flex-wrap">
             <Button
               onClick={handleClearAll}
               className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
             >
               Clear All
             </Button>
             <Button
               onClick={handleSelectAll}
               className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
             >
               Select All
             </Button>
             <Button
               onClick={handleExpandAll}
               className="px-4 py-2 text-sm font-medium text-green-700 bg-green-100 border border-green-300 rounded-md hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
             >
               Expand All
             </Button>
             <Button
               onClick={handleCollapseAll}
               className="px-4 py-2 text-sm font-medium text-red-700 bg-red-100 border border-red-300 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
             >
               Collapse All
             </Button>
           </div>
     </div>
 </Container>
  }
  const UploadData=()=>{
  const [formValues, setFormValues] = useState({
      state: "Kerala",
      district: "",
      local_body_type: "",
      local_body_name: "",
      ward: "",
      users: null, // file
    });
  
    // Handle input change
    const handleChange = (e:any) => {
      const { name, value } = e.target;
      setFormValues({ ...formValues, [name]: value });
    };
  
    // Handle file upload
    const handleFileChange = (e:any) => {
      setFormValues({ ...formValues, users: e.target.files[0] });
    };
  
    // Handle form submit
    const handleSubmit = async (e:any) => {
      e.preventDefault();
  
      const formData = new FormData();
      formData.append("state", formValues.state);
      formData.append("district", formValues.district);
      formData.append("local_body_type", formValues.local_body_type);
      formData.append("local_body_name", formValues.local_body_name);
      formData.append("ward", formValues.ward);
      if (formValues.users) {
        formData.append("users", formValues.users);
      }
  
      try {
        const response = await fetch(INSERTUPLOADUSER, {
          method: "POST",
          body: formData,
        });
  
        const data = await response.json();
        console.log("✅ Success:", data);
        alert("Form Submitted Successfully!");
      } catch (error) {
        console.error("❌ Error:", error);
        alert("Failed to submit form");
      }
    };

    const [Wards,SetWards]=useState([])

    const getWard=(warddata:any)=>{
      console.log("warddata",warddata)
      SetWards(warddata)
    }
  
    return (
      <div style={{paddingLeft:"10px"}}>
        <div className='pl-2'>
          <form onSubmit={handleSubmit} style={{margin: "20px auto" }}>
            <div>
              <label>State:</label>
              <input
                type="text"
                name="state"
                value={formValues.state}
                onChange={handleChange}
                disabled
              />
            </div>
      
            {/* <div>
              <label>District:</label>
              <input
                type="text"
                name="district"
                value={formValues.district}
                onChange={handleChange}
                required
              />
            </div> */}
            <DistrictDropdown 
              handleChange={handleChange} 
              value={formValues.district} 
              name="district"
              />
            <LocalBodyTypeDropDown
            handleChange={handleChange} 
            value={formValues.local_body_type} 
            name="local_body_type"
            />
            <LocalBodyNameDropDown
              handleChange={handleChange} 
              value={formValues.local_body_name} 
              name="local_body_name"
              formValues={formValues}
              getWard={(e:any)=>getWard(e)}
            />
            <WardDropdown
            handleChange={handleChange} 
            value={formValues.ward} 
            name="ward"
            Wards={Wards}
            />

      
            <div>
              <label>Upload JSON File:</label>
              <input type="file" accept=".json,.pdf" onChange={handleFileChange} required />
            </div>
      
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    );
  }
  return (
    <React.Fragment>
      <div className={props.rightColumn ? "col-auto layout-rightside-col d-block" : "col-auto layout-rightside-col d-none"} id="layout-rightside-coll">
        <div className="overlay" onClick={props.hideRightColumn}></div>
        <div className="layout-rightside">
          <Card className="h-100 rounded-0">
            <CardBody className="p-0">
              <div className="p-3">
                <h6 className="text-muted mb-0 text-uppercase fw-semibold">
                <div className="tabs">
                  <div className={`tab ${activeTab === 0 ? "active" : ""}`} onClick={() => toggleTab(0)} >Filter Data</div>
                  <div className={`tab ${activeTab === 1 ? "active" : ""}`}  onClick={() => toggleTab(1)}>Upload Data</div>
                  <div className={`tab ${activeTab === 2 ? "active" : ""}`} onClick={() => toggleTab(2)} > New Data</div>
                </div>
                </h6>
              </div>
              {
                (() => {
                  switch (activeTab) {
                    case 0:
                      return <FilterData/>;
                    case 1:
                      return <UploadData/>;
                    // case 2:
                    //   return <RightMenuData/>;
                    default:
                      return <div className="tab-content">No content</div>;
                  }
                })()
              }
                
                


              <Card>  

              <div className="max-w-5xl mx-auto p-6 bg-white">

                <div className="space-y-6">
                
                </div>

                {/* Selected Items Summary */}
               

              </div>


              </Card>
              
              {/* <SimpleBar style={{ maxHeight: "410px" }} className="p-3 pt-0">
                <div className="acitivity-timeline acitivity-main">
                  <div className="acitivity-item d-flex">
                    <div className="flex-shrink-0 avatar-xs acitivity-avatar">
                      <div className="avatar-title bg-success-subtle text-success rounded-circle">
                        <i className="ri-shopping-cart-2-line"></i>
                      </div>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h6 className="mb-1 lh-base">Purchase by James Price</h6>
                      <p className="text-muted mb-1">
                        Product noise evolve smartwatch{" "}
                      </p>
                      <small className="mb-0 text-muted">02:14 PM Today</small>
                    </div>
                  </div>
                  <div className="acitivity-item py-3 d-flex">
                    <div className="flex-shrink-0 avatar-xs acitivity-avatar">
                      <div className="avatar-title bg-danger-subtle text-danger rounded-circle">
                        <i className="ri-stack-fill"></i>
                      </div>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h6 className="mb-1 lh-base">
                        Added new{" "}
                        <span className="fw-semibold">style collection</span>
                      </h6>
                      <p className="text-muted mb-1">By Nesta Technologies</p>
                      <div className="d-inline-flex gap-2 border border-dashed p-2 mb-2">
                        <Link
                          to="/apps-ecommerce-product-details"
                          className="bg-light rounded p-1"
                        >
                          <img
                            src={product8}
                            alt=""
                            className="img-fluid d-block"
                          />
                        </Link>
                        <Link
                          to="/apps-ecommerce-product-details"
                          className="bg-light rounded p-1"
                        >
                          <img
                            src={product2}
                            alt=""
                            className="img-fluid d-block"
                          />
                        </Link>
                        <Link
                          to="/apps-ecommerce-product-details"
                          className="bg-light rounded p-1"
                        >
                          <img
                            src={product10}
                            alt=""
                            className="img-fluid d-block"
                          />
                        </Link>
                      </div>
                      <p className="mb-0 text-muted">
                        <small>9:47 PM Yesterday</small>
                      </p>
                    </div>
                  </div>
                  <div className="acitivity-item py-3 d-flex">
                    <div className="flex-shrink-0">
                      <img
                        src={avatar2}
                        alt=""
                        className="avatar-xs rounded-circle acitivity-avatar"
                      />
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h6 className="mb-1 lh-base">
                        Natasha Carey have liked the products
                      </h6>
                      <p className="text-muted mb-1">
                        Allow users to like products in your WooCommerce store.
                      </p>
                      <small className="mb-0 text-muted">25 Dec, 2021</small>
                    </div>
                  </div>
                  <div className="acitivity-item py-3 d-flex">
                    <div className="flex-shrink-0">
                      <div className="avatar-xs acitivity-avatar">
                        <div className="avatar-title rounded-circle bg-secondary">
                          <i className="mdi mdi-sale fs-14"></i>
                        </div>
                      </div>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h6 className="mb-1 lh-base">
                        Today offers by{" "}
                        <Link
                          to="/apps-ecommerce-seller-details"
                          className="link-secondary"
                        >
                          Digitech Galaxy
                        </Link>
                      </h6>
                      <p className="text-muted mb-2">
                        Offer is valid on orders of Rs.500 Or above for selected
                        products only.
                      </p>
                      <small className="mb-0 text-muted">12 Dec, 2021</small>
                    </div>
                  </div>
                  <div className="acitivity-item py-3 d-flex">
                    <div className="flex-shrink-0">
                      <div className="avatar-xs acitivity-avatar">
                        <div className="avatar-title rounded-circle bg-danger-subtle text-danger">
                          <i className="ri-bookmark-fill"></i>
                        </div>
                      </div>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h6 className="mb-1 lh-base">Favoried Product</h6>
                      <p className="text-muted mb-2">
                        Esther James have favorited product.
                      </p>
                      <small className="mb-0 text-muted">25 Nov, 2021</small>
                    </div>
                  </div>
                  <div className="acitivity-item py-3 d-flex">
                    <div className="flex-shrink-0">
                      <div className="avatar-xs acitivity-avatar">
                        <div className="avatar-title rounded-circle bg-secondary">
                          <i className="mdi mdi-sale fs-14"></i>
                        </div>
                      </div>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h6 className="mb-1 lh-base">
                        Flash sale starting{" "}
                        <span className="text-primary">Tomorrow.</span>
                      </h6>
                      <p className="text-muted mb-0">
                        Flash sale by{" "}
                        <Link to="#" className="link-secondary fw-medium">
                          Zoetic Fashion
                        </Link>
                      </p>
                      <small className="mb-0 text-muted">22 Oct, 2021</small>
                    </div>
                  </div>
                  <div className="acitivity-item py-3 d-flex">
                    <div className="flex-shrink-0">
                      <div className="avatar-xs acitivity-avatar">
                        <div className="avatar-title rounded-circle bg-info-subtle text-info">
                          <i className="ri-line-chart-line"></i>
                        </div>
                      </div>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h6 className="mb-1 lh-base">Monthly sales report</h6>
                      <p className="text-muted mb-2">
                        <span className="text-danger">2 days left</span>{" "}
                        notification to submit the monthly sales report.{" "}
                        <Link
                          to="#"
                          className="link-warning text-decoration-underline"
                        >
                          Reports Builder
                        </Link>
                      </p>
                      <small className="mb-0 text-muted">15 Oct</small>
                    </div>
                  </div>
                  <div className="acitivity-item d-flex">
                    <div className="flex-shrink-0">
                      <img
                        src={avatar3}
                        alt=""
                        className="avatar-xs rounded-circle acitivity-avatar"
                      />
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h6 className="mb-1 lh-base">Frank Hook Commented</h6>
                      <p className="text-muted mb-2 fst-italic">
                        " A product that has reviews is more likable to be sold
                        than a product. "
                      </p>
                      <small className="mb-0 text-muted">26 Aug, 2021</small>
                    </div>
                  </div>
                </div>
              </SimpleBar> */}
            </CardBody>
          </Card>
        </div>
      </div>
    </React.Fragment>
  );
};

export default RightMenu;


