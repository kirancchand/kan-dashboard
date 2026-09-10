import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronDown, ChevronRight, MapPin, Building, Users, RefreshCw, Loader2 } from 'lucide-react';

import { SearchAllUnit,INSERTUPLOADUSER,GETDISTRICT,GETLOCALBODYBYDISTRICTANDTYPE,GETWARDSBYLOCALBODY,GETVILLAGEDISTRICT,GETVILLAGELOCALBODYBYDISTRICTANDTYPE,GETBRANCHBYLOCALBODY,INSERTUPLOADVILLAGEUSER } from './api';
import DistrictDropdown from "./Formcomponents/DistrictDropdown";
import LocalBodyTypeDropDown from "./Formcomponents/LocalbodyTypeDropdown";
import LocalBodyNameDropDown from"./Formcomponents/LocalBodyNameDropDown";
import BranchDropdown from "./Formcomponents/BranchDropdown";
import { 
  Button, 
  Card, 
  CardBody, 
  CardHeader, 
  Container, 
  Row, 
  Col, 
  Badge,
  Alert
} from 'reactstrap';
import SimpleBar from "simplebar-react";
// TypeScript Interfaces
interface Ward {
  ward_no: string;
  ward_name: string;
}

interface Branch {
  branch_no: string;
  branch_name: string;
}

interface LocalBodyData {
  loaded: boolean;
  branchs: Branch[];
}

interface LocalBodyTypeData {
  loaded: boolean;
  localBodies: Record<string, LocalBodyData>;
}

interface DistrictData {
  loaded: boolean;
  localBodyTypes: Record<string, LocalBodyTypeData>;
}

interface LoadingStates {
  districts?: boolean;
  [key: string]: boolean | undefined;
}

interface ExpandedStates {
  [key: string]: boolean;
}

interface CheckboxState {
  checked: boolean;
  indeterminate: boolean;
}

// API Response Types
interface LocalBodyResponse {
  localbody_name: string;
}

// Simulated API functions with proper TypeScript typing
const API = {
  getDistricts: async (): Promise<string[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [
      "Thiruvananthapuram", "Kollam", "Pathanamthitta", "Alappuzha", "Kottayam", 
      "Idukki", "Ernakulam", "Thrissur", "Palakkad", "Malappuram", 
      "Kozhikode", "Wayanad", "Kannur", "Kasaragod"
    ];
  },

  getLocalBodyTypes: async (district: string): Promise<string[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return ["Corporation", "Municipality", "Panchayat"];
  },

  getLocalBodies: async (district: string, localBodyType: string): Promise<LocalBodyResponse[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (district === "Thiruvananthapuram") {
      if (localBodyType === "Corporation") {
        return [{ localbody_name: "Thiruvananthapuram Corporation" }];
      } else if (localBodyType === "Municipality") {
        return [
          { localbody_name: "Attingal Municipality" },
          { localbody_name: "Varkala Municipality" },
          { localbody_name: "Nedumangad Municipality" }
        ];
      } else {
        return [
          { localbody_name: "Neyyattinkara Panchayat" },
          { localbody_name: "Aruvikkara Panchayat" },
          { localbody_name: "Kattakada Panchayat" }
        ];
      }
    }
    return [
      { localbody_name: `${district} ${localBodyType} 1` },
      { localbody_name: `${district} ${localBodyType} 2` }
    ];
  },

  getBranchs: async (district: string, localBodyType: string, localBodyName: string): Promise<Branch[]> => {
    await new Promise(resolve => setTimeout(resolve, 250));
    
    const branchCount = Math.floor(Math.random() * 20) + 5;
    return Array.from({ length: branchCount }, (_, i) => ({
      branch_no: (i + 1).toString(),
      branch_name: `${localBodyName} Branch ${i + 1}`
    }));
  }
};

const RightMenuData = (props: any) => {
  const [data, setData] = useState<Record<string, DistrictData>>({});
  const [loading, setLoading] = useState<LoadingStates>({});
  const [expanded, setExpanded] = useState<ExpandedStates>({});
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
   const [activeTab, setActiveTab] = useState(0);
  
    const toggleTab = (index: number) => {
      setActiveTab(index);
    };

  // Key generation functions (similar to FilterData)
  const getDistrictKey = (district: string): string => `district-${district}`;
  const getLocalBodyTypeKey = (district: string, localBodyType: string): string => 
    `localbodytype-${district}-${localBodyType}`;
  const getLocalBodyKey = (district: string, localBodyType: string, localBodyName: string): string => 
    `localbody-${district}-${localBodyType}-${localBodyName}`;
  const getBranchKey = (district: string, localBodyType: string, localBodyName: string, branchNo: string): string => 
    `branch-${district}-${localBodyType}-${localBodyName}-${branchNo}`;

  // Get all keys for different levels
  const getLocalBodyBranchKeys = (district: string, localBodyType: string, localBodyName: string): string[] => {
    const keys: string[] = [];
    if (data[district]?.localBodyTypes[localBodyType]?.localBodies[localBodyName]?.loaded) {
      data[district].localBodyTypes[localBodyType].localBodies[localBodyName].branchs.forEach(branch => {
        keys.push(getBranchKey(district, localBodyType, localBodyName, branch.branch_no));
      });
    }
    return keys;
  };

  const getLocalBodyAllKeys = (district: string, localBodyType: string, localBodyName: string): string[] => {
    const keys: string[] = [];
    keys.push(getLocalBodyKey(district, localBodyType, localBodyName));
    keys.push(...getLocalBodyBranchKeys(district, localBodyType, localBodyName));
    return keys;
  };

  const getLocalBodyTypeAllKeys = (district: string, localBodyType: string): string[] => {
    const keys: string[] = [];
    keys.push(getLocalBodyTypeKey(district, localBodyType));
    
    if (data[district]?.localBodyTypes[localBodyType]?.loaded) {
      Object.keys(data[district].localBodyTypes[localBodyType].localBodies).forEach(localBodyName => {
        keys.push(...getLocalBodyAllKeys(district, localBodyType, localBodyName));
      });
    }
    return keys;
  };

  const getDistrictAllKeys = (district: string): string[] => {
    const keys: string[] = [];
    keys.push(getDistrictKey(district));
    
    if (data[district]?.loaded) {
      Object.keys(data[district].localBodyTypes).forEach(localBodyType => {
        keys.push(...getLocalBodyTypeAllKeys(district, localBodyType));
      });
    }
    return keys;
  };

  // Helper function to get all local body keys for a local body type
  const getLocalBodyTypeLocalBodyKeys = (district: string, localBodyType: string): string[] => {
    const keys: string[] = [];
    if (data[district]?.localBodyTypes[localBodyType]?.loaded) {
      Object.keys(data[district].localBodyTypes[localBodyType].localBodies).forEach(localBodyName => {
        keys.push(getLocalBodyKey(district, localBodyType, localBodyName));
      });
    }
    return keys;
  };

  // Helper function to get all local body type keys for a district
  const getDistrictLocalBodyTypeKeys = (district: string): string[] => {
    const keys: string[] = [];
    if (data[district]?.loaded) {
      Object.keys(data[district].localBodyTypes).forEach(localBodyType => {
        keys.push(getLocalBodyTypeKey(district, localBodyType));
      });
    }
    return keys;
  };

  // Selection state functions
  const areAllSelected = (keys: string[]): boolean => 
    keys.every(key => selectedItems.has(key));
  
  const areSomeSelected = (keys: string[]): boolean => 
    keys.some(key => selectedItems.has(key));

  const getCheckboxState = (keys: string[]): CheckboxState => {
    const allSelected = areAllSelected(keys);
    const someSelected = areSomeSelected(keys);
    return {
      checked: allSelected,
      indeterminate: someSelected && !allSelected
    };
  };

  // Toggle selection function (similar to FilterData)
  const toggleSelection = useCallback((keys: string[], isSelected: boolean): void => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (isSelected) {
        keys.forEach(key => newSet.delete(key));
      } else {
        keys.forEach(key => newSet.add(key));
      }
      return newSet;
    });
  }, []);

  // Handle selection changes
  const handleDistrictChange = (district: string): void => {
    const allKeys = getDistrictAllKeys(district);
    const isSelected = areAllSelected(allKeys);
    toggleSelection(allKeys, isSelected);
  };

  const handleLocalBodyTypeChange = (district: string, localBodyType: string): void => {
    const allKeys = getLocalBodyTypeAllKeys(district, localBodyType);
    const isSelected = areAllSelected(allKeys);
    toggleSelection(allKeys, isSelected);
    
    // Update parent district state
    setTimeout(() => updateParentStates(district), 10);
  };

  const handleLocalBodyChange = (district: string, localBodyType: string, localBodyName: string): void => {
    const allKeys = getLocalBodyAllKeys(district, localBodyType, localBodyName);
    const isSelected = areAllSelected(allKeys);
    toggleSelection(allKeys, isSelected);
    
    // Update parent local body type and district states
    setTimeout(() => updateParentStates(district, localBodyType), 10);
  };

  const handleBranchChange = (district: string, localBodyType: string, localBodyName: string, branch: Branch): void => {
    const branchKey = getBranchKey(district, localBodyType, localBodyName, branch.branch_no);
    const localBodyKey = getLocalBodyKey(district, localBodyType, localBodyName);
    
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(branchKey)) {
        newSet.delete(branchKey);
        // If no branchs are selected, deselect local body
        const branchKeys = getLocalBodyBranchKeys(district, localBodyType, localBodyName);
        if (!branchKeys.some(key => newSet.has(key))) {
          newSet.delete(localBodyKey);
        }
      } else {
        newSet.add(branchKey);
        // If all branchs are selected, select local body
        const branchKeys = getLocalBodyBranchKeys(district, localBodyType, localBodyName);
        if (branchKeys.every(key => newSet.has(key) || key === branchKey)) {
          newSet.add(localBodyKey);
        }
      }
      return newSet;
    });

    // Update parent states (local body type and district)
    setTimeout(() => updateParentStates(district, localBodyType), 10);
  };

  // Update parent states based on children selection - REWRITTEN for reliability
  const updateParentStates = (district: string, localBodyType?: string): void => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);

      // If localBodyType is provided, update the local body type based on its local bodies
      if (localBodyType) {
        const localBodyTypeKey = getLocalBodyTypeKey(district, localBodyType);
        const allLocalBodies = getLocalBodyTypeLocalBodyKeys(district, localBodyType);
        
        if (allLocalBodies.length > 0) {
          const selectedLocalBodies = allLocalBodies.filter(key => newSet.has(key));
          
          if (selectedLocalBodies.length === allLocalBodies.length) {
            // All local bodies are selected, select the local body type
            newSet.add(localBodyTypeKey);
          } else if (selectedLocalBodies.length === 0) {
            // No local bodies are selected, unselect local body type
            newSet.delete(localBodyTypeKey);
          } else {
            // Some local bodies are selected, unselect local body type (will show as indeterminate)
            newSet.delete(localBodyTypeKey);
          }
        }
      }

      // Always update the district based on its local body types
      const districtKey = getDistrictKey(district);
      const allLocalBodyTypes = getDistrictLocalBodyTypeKeys(district);
      
      if (allLocalBodyTypes.length > 0) {
        const selectedLocalBodyTypes = allLocalBodyTypes.filter(key => newSet.has(key));
        
        if (selectedLocalBodyTypes.length === allLocalBodyTypes.length) {
          // All local body types are selected, select the district
          newSet.add(districtKey);
        } else if (selectedLocalBodyTypes.length === 0) {
          // No local body types are selected, unselect district
          newSet.delete(districtKey);
        } else {
          // Some local body types are selected, unselect district (will show as indeterminate)
          newSet.delete(districtKey);
        }
      }

      return newSet;
    });
  };

  // Update props.selected based on selectedItems
  useEffect(() => {
    const newSelected = {
      districts: [] as string[],
      localBodyTypes: [] as any[],
      localBodies: [] as any[],
      branchs: [] as any[]
    };

    selectedItems.forEach(key => {
      if (key.startsWith('district-')) {
        const district = key.replace('district-', '');
        newSelected.districts.push(district);
      } else if (key.startsWith('localbodytype-')) {
        const parts = key.replace('localbodytype-', '').split('-');
        const district = parts[0];
        const localBodyType = parts.slice(1).join('-');
        newSelected.localBodyTypes.push({
          district,
          localBodyType,
          key: `${district}-${localBodyType}`
        });
      } else if (key.startsWith('localbody-')) {
        const parts = key.replace('localbody-', '').split('-');
        const district = parts[0];
        const localBodyType = parts[1];
        const localBodyName = parts.slice(2).join('-');
        newSelected.localBodies.push({
          district,
          localBodyType,
          localbody_name: localBodyName,
          key: `${district}-${localBodyType}-${localBodyName}`
        });
      } else if (key.startsWith('branch-')) {
        const parts = key.replace('branch-', '').split('-');
        const district = parts[0];
        const localBodyType = parts[1];
        const localBodyName = parts.slice(2, -1).join('-'); // Handle names with dashes
        const branchNo = parts[parts.length - 1]; // Last part is always branch number
        
        // Find branch details from data
        const allBranchs = data[district]?.localBodyTypes[localBodyType]?.localBodies[localBodyName]?.branchs || [];
        const branchData = allBranchs.find(w => String(w.branch_no) === String(branchNo));
        
        if (branchData) {
          newSelected.branchs.push({
            district,
            localBodyType,
            localbody_name: localBodyName,
            branch_no: branchData.branch_no,
            branch_name: branchData.branch_name,
            key: `${district}-${localBodyType}-${localBodyName}-${branchData.branch_no}`
          });
        }
      }
    });

    props.setSelected(newSelected);
  }, [selectedItems, data]);

  const loadDistricts = async (): Promise<void> => {
    try {
      setLoading(prev => ({ ...prev, districts: true }));
      const response = await fetch(GETVILLAGEDISTRICT, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });
      const districts = await response.json();
      console.log(districts);
      const districtData: Record<string, DistrictData> = {};
      districts.forEach((district: any) => {
        districtData[district] = { loaded: false, localBodyTypes: {} };
      });
      setData(districtData);
    } catch (error) {
      console.error('Error loading districts:', error);
    } finally {
      setLoading(prev => ({ ...prev, districts: false }));
    }
  };

  useEffect(() => {
    loadDistricts();
  }, []);

  const loadLocalBodyTypes = async (district: string): Promise<void> => {
    const key = `${district}-types`;
    try {
      setLoading(prev => ({ ...prev, [key]: true }));
      const types = await API.getLocalBodyTypes(district);
      
      setData(prev => ({
        ...prev,
        [district]: {
          ...prev[district],
          loaded: true,
          localBodyTypes: types.reduce((acc: Record<string, LocalBodyTypeData>, type) => {
            acc[type] = { loaded: false, localBodies: {} };
            return acc;
          }, {})
        }
      }));

      // Auto-select children if district is selected
      if (selectedItems.has(getDistrictKey(district))) {
        setTimeout(() => {
          const newKeys: string[] = [];
          types.forEach(localBodyType => {
            newKeys.push(getLocalBodyTypeKey(district, localBodyType));
          });
          setSelectedItems(prev => {
            const newSet = new Set(prev);
            newKeys.forEach(key => newSet.add(key));
            return newSet;
          });
        }, 100);
      }
    } catch (error) {
      console.error('Error loading local body types:', error);
    } finally {
      setLoading(prev => ({ ...prev, [key]: false }));
    }
  };

  const loadLocalBodies = async (district: string, localBodyType: string): Promise<void> => {
    const key = `${district}-${localBodyType}-bodies`;
    try {
      setLoading(prev => ({ ...prev, [key]: true }));
      const response = await fetch(GETVILLAGELOCALBODYBYDISTRICTANDTYPE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "district": district,
          "localbody_type": localBodyType
        })
      });
      const localBodies = await response.json();
      console.log(localBodies);
      
      setData(prev => ({
        ...prev,
        [district]: {
          ...prev[district],
          localBodyTypes: {
            ...prev[district].localBodyTypes,
            [localBodyType]: {
              loaded: true,
              localBodies: localBodies.localBodies.reduce((acc: Record<string, LocalBodyData>, body: any) => {
                acc[body.area] = { loaded: false, branchs: [] };
                return acc;
              }, {})
            }
          }
        }
      }));

      // Auto-select children if parent is selected
      if (selectedItems.has(getDistrictKey(district)) || 
          selectedItems.has(getLocalBodyTypeKey(district, localBodyType))) {
        setTimeout(() => {
          const newKeys: string[] = [];
          localBodies.localBodies.forEach((body: any) => {
            newKeys.push(getLocalBodyKey(district, localBodyType, body.localbody_name));
          });
          setSelectedItems(prev => {
            const newSet = new Set(prev);
            newKeys.forEach(key => newSet.add(key));
            return newSet;
          });
        }, 100);
      }
    } catch (error) {
      console.error('Error loading local bodies:', error);
    } finally {
      setLoading(prev => ({ ...prev, [key]: false }));
    }
  };

  const loadBranchs = async (district: string, localBodyType: string, area: string): Promise<void> => {
    const key = `${district}-${localBodyType}-${area}-branchs`;
    try {
      setLoading(prev => ({ ...prev, [key]: true }));
      const response = await fetch(GETBRANCHBYLOCALBODY, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "district": district,
          "localbody_type": localBodyType,
          "localbody_name": area
        })
      });
      const branchs = await response.json();
      
      setData(prev => ({
        ...prev,
        [district]: {
          ...prev[district],
          localBodyTypes: {
            ...prev[district].localBodyTypes,
            [localBodyType]: {
              ...prev[district].localBodyTypes[localBodyType],
              localBodies: {
                ...prev[district].localBodyTypes[localBodyType].localBodies,
                [area]: {
                  loaded: true,
                  branchs
                }
              }
            }
          }
        }
      }));

      // Auto-select branchs when expanding a local body
      setTimeout(() => {
        const newKeys: string[] = [];
        branchs.forEach((branch: Branch) => {
          newKeys.push(getBranchKey(district, localBodyType, area, branch.branch_no));
        });
        
        setSelectedItems(prev => {
          const newSet = new Set(prev);
          newKeys.forEach(key => newSet.add(key));
          return newSet;
        });
      }, 100);
    } catch (error) {
      console.error('Error loading branchs:', error);
    } finally {
      setLoading(prev => ({ ...prev, [key]: false }));
    }
  };

  type ToggleType = 'district' | 'localBodyType' | 'localBody';

  const toggleExpand = async (
    key: string, 
    type: ToggleType, 
    district: string, 
    localBodyType?: string, 
    localBodyName?: string
  ): Promise<void> => {
    const isExpanded = expanded[key];
    setExpanded(prev => ({ ...prev, [key]: !isExpanded }));

    if (!isExpanded) {
      switch (type) {
        case 'district':
          if (!data[district]?.loaded) {
            await loadLocalBodyTypes(district);
          }
          break;
        case 'localBodyType':
          if (localBodyType && !data[district]?.localBodyTypes[localBodyType]?.loaded) {
            await loadLocalBodies(district, localBodyType);
          }
          break;
        case 'localBody':
          if (localBodyType && localBodyName && 
              !data[district]?.localBodyTypes[localBodyType]?.localBodies[localBodyName]?.loaded) {
            await loadBranchs(district, localBodyType, localBodyName);
          }
          break;
      }
    }
  };

  const clearAllSelections = (): void => {
    setSelectedItems(new Set());
  };

  const UploadData=()=>{
    const [formValues, setFormValues] = useState({
        state: "Kerala",
        district: "",
        local_body_type: "",
        local_body_name: "",
        branch: "",
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
        formData.append("branch", formValues.branch);
        if (formValues.users) {
          formData.append("users", formValues.users);
        }
    
        try {
          const response = await fetch(INSERTUPLOADVILLAGEUSER, {
            method: "POST",
            body: formData,
          });
    
          const data = await response.json();
          console.log("✅ Success:", data);
          alert("Form submitted successfully!");
        } catch (error) {
          console.error("❌ Error:", error);
          alert("Failed to submit form");
        }
      };
  
      const [localBody,seLocalBody]=useState("")
  
      const getBranch=(data:any)=>{
        console.log("branchdata",data)
        seLocalBody(data)
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
                getBranch={(e:any)=>getBranch(e)}
              />
              <BranchDropdown
                handleChange={handleChange} 
                value={formValues.branch} 
                name="branch"
                localBody={localBody}
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

  if (loading.districts) {
    return (
      <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="animate-spin mr-2" size={24} />
          <span className="text-lg">Loading districts...</span>
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
                </div>
                </h6>
              </div>
              {
                (() => {
                  switch (activeTab) {
                    case 0:
                      return  <Container fluid className="min-vh-100">
                      {/* <div className="d-flex justify-content-between align-items-center mb-4">
                        <Button 
                          color="primary"
                          onClick={loadDistricts}
                          className="d-flex align-items-center"
                        >
                          <RefreshCw size={16} className="me-2" />
                          Refresh
                        </Button>
                        <span className="text-muted">Selected: {selectedItems.size} items</span>
                      </div> */}
                      <SimpleBar style={{ maxHeight: "410px" }} className="p-3 pt-0">
                      <div className='mb-2'>
                        <span className="text-muted">Selected: {selectedItems.size} items</span>  
                      </div>
                      <Row>
                       
                      
                        {/* Tree Structure */}
                        <Col lg={12} className="mb-4">
                              <div className="tree-structure">
                                {Object.entries(data).map(([district, districtData]) => {
                                  const districtKeys = getDistrictAllKeys(district);
                                  const districtState = getCheckboxState(districtKeys);
                                  
                                  return (
                                    <div key={district} className="border-start border-2 border-secondary ps-3 mb-3">
                                      {/* District Level */}
                                      <div className="d-flex align-items-center mb-2">
                                        <Button
                                          color="link"
                                          size="sm"
                                          className="p-0 me-2 text-decoration-none text-dark"
                                          onClick={() => toggleExpand(`district-${district}`, 'district', district)}
                                          disabled={loading[`${district}-types`]}
                                        >
                                          {loading[`${district}-types`] ? (
                                            <Loader2 className="spinner-border-sm" size={16} />
                                          ) : expanded[`district-${district}`] ? (
                                            <ChevronDown size={16} />
                                          ) : (
                                            <ChevronRight size={16} />
                                          )}
                                        </Button>
                                        <input
                                          type="checkbox"
                                          id={`district-${district}`}
                                          checked={districtState.checked}
                                          ref={(el: HTMLInputElement | null) => {
                                            if (el) el.indeterminate = districtState.indeterminate;
                                          }}
                                          onChange={() => handleDistrictChange(district)}
                                          className="form-check-input me-2"
                                        />
                                        <MapPin size={16} className="text-primary me-2" />
                                        <label htmlFor={`district-${district}`} className="fw-medium text-dark mb-0 user-select-none">
                                          {district} District
                                        </label>
                                      </div>
      
                                      {/* Local Body Types */}
                                      {expanded[`district-${district}`] && districtData.loaded && (
                                        <div className="ms-4">
                                          {Object.entries(districtData.localBodyTypes).map(([localBodyType, typeData]) => {
                                            const typeKeys = getLocalBodyTypeAllKeys(district, localBodyType);
                                            const typeState = getCheckboxState(typeKeys);
                                            
                                            return (
                                              <div key={`${district}-${localBodyType}`} className="border-start border-1 border-light ps-3 mb-2">
                                                <div className="d-flex align-items-center mb-2">
                                                  <Button
                                                    color="link"
                                                    size="sm"
                                                    className="p-0 me-2 text-decoration-none text-dark"
                                                    onClick={() => toggleExpand(`type-${district}-${localBodyType}`, 'localBodyType', district, localBodyType)}
                                                    disabled={loading[`${district}-${localBodyType}-bodies`]}
                                                  >
                                                    {loading[`${district}-${localBodyType}-bodies`] ? (
                                                      <Loader2 className="spinner-border-sm" size={16} />
                                                    ) : expanded[`type-${district}-${localBodyType}`] ? (
                                                      <ChevronDown size={16} />
                                                    ) : (
                                                      <ChevronRight size={16} />
                                                    )}
                                                  </Button>
                                                  <input
                                                    type="checkbox"
                                                    id={`type-${district}-${localBodyType}`}
                                                    checked={typeState.checked}
                                                    ref={(el: HTMLInputElement | null) => {
                                                      if (el) el.indeterminate = typeState.indeterminate;
                                                    }}
                                                    onChange={() => handleLocalBodyTypeChange(district, localBodyType)}
                                                    className="form-check-input me-2"
                                                  />
                                                  <Building size={16} className="text-success me-2" />
                                                  <label htmlFor={`type-${district}-${localBodyType}`} className="fw-medium text-dark mb-0 user-select-none">
                                                    {localBodyType}
                                                  </label>
                                                  {typeData.loaded && (
                                                    <Badge color="secondary" className="ms-2">
                                                      {Object.keys(typeData.localBodies).length}
                                                    </Badge>
                                                  )}
                                                </div>
      
                                                {/* Local Bodies */}
                                                {expanded[`type-${district}-${localBodyType}`] && typeData.loaded && (
                                                  <div className="ms-4">
                                                    {Object.entries(typeData.localBodies).map(([localBodyName, bodyData]) => {
                                                      const bodyKeys = getLocalBodyAllKeys(district, localBodyType, localBodyName);
                                                      const bodyState = getCheckboxState(bodyKeys);
                                                      
                                                      return (
                                                        <div key={`${district}-${localBodyType}-${localBodyName}`} className="border-start border-1 ps-3 mb-2" style={{borderColor: '#f8f9fa'}}>
                                                          <div className="d-flex align-items-center mb-2">
                                                            <Button
                                                              color="link"
                                                              size="sm"
                                                              className="p-0 me-2 text-decoration-none text-dark"
                                                              onClick={() => toggleExpand(`body-${district}-${localBodyType}-${localBodyName}`, 'localBody', district, localBodyType, localBodyName)}
                                                              disabled={loading[`${district}-${localBodyType}-${localBodyName}-branchs`]}
                                                            >
                                                              {loading[`${district}-${localBodyType}-${localBodyName}-branchs`] ? (
                                                                <Loader2 className="spinner-border-sm" size={16} />
                                                              ) : expanded[`body-${district}-${localBodyType}-${localBodyName}`] ? (
                                                                <ChevronDown size={16} />
                                                              ) : (
                                                                <ChevronRight size={16} />
                                                              )}
                                                            </Button>
                                                            <input
                                                              type="checkbox"
                                                              id={`body-${localBodyName}`}
                                                              checked={bodyState.checked}
                                                              ref={(el: HTMLInputElement | null) => {
                                                                if (el) el.indeterminate = bodyState.indeterminate;
                                                              }}
                                                              onChange={() => handleLocalBodyChange(district, localBodyType, localBodyName)}
                                                              className="form-check-input me-2"
                                                            />
                                                            <Users size={16} className="text-info me-2" />
                                                            <label htmlFor={`body-${localBodyName}`} className="text-dark mb-0 user-select-none">
                                                              {localBodyName}
                                                            </label>
                                                            {bodyData.loaded && (
                                                              <Badge color="light" className="ms-2 text-muted">
                                                                {bodyData.branchs.length} branchs
                                                              </Badge>
                                                            )}
                                                          </div>
      
                                                          {/* Branchs */}
                                                          {expanded[`body-${district}-${localBodyType}-${localBodyName}`] && bodyData.loaded && (
                                                            <div className="ms-4">
                                                              {bodyData.branchs.map((branch) => (
                                                                <div key={`${localBodyName}-${branch.branch_no}`} className="d-flex align-items-center mb-1">
                                                                  <input
                                                                    type="checkbox"
                                                                    id={`branch-${localBodyName}-${branch.branch_no}`}
                                                                    checked={selectedItems.has(getBranchKey(district, localBodyType, localBodyName, branch.branch_no))}
                                                                    onChange={() => handleBranchChange(district, localBodyType, localBodyName, branch)}
                                                                    className="form-check-input me-2"
                                                                  />
                                                                  <label htmlFor={`branch-${localBodyName}-${branch.branch_no}`} className="small text-muted mb-0 user-select-none">
                                                                    Branch {branch.branch_no}: {branch.branch_name}
                                                                  </label>
                                                                </div>
                                                              ))}
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
                              </div>

                        </Col>
      
                        {/* Selected Items Display */}
                        <Col lg={12}>
                          <Card>
                            <CardHeader>
                              <h5 className="mb-0">Selected Items</h5>
                            </CardHeader>
                            <CardBody>
                              {/* Selected Districts */}
                              {props.selected.districts.length > 0 && (
                                <div className="mb-4">
                                  <h6 className="d-flex align-items-center text-muted">
                                    <MapPin size={16} className="text-primary me-2" />
                                    Districts ({props.selected.districts.length})
                                  </h6>
                                  <div className="bg-primary bg-opacity-10 p-3 rounded border-start border-4 border-primary">
                                    {props.selected.districts.map((district: any, index: any) => (
                                      <div key={index} className="small text-primary">{district}</div>
                                    ))}
                                  </div>
                                </div>
                              )}
      
                              {/* Selected Local Body Types */}
                              {props.selected.localBodyTypes.length > 0 && (
                                <div className="mb-4">
                                  <h6 className="d-flex align-items-center text-muted">
                                    <Building size={16} className="text-success me-2" />
                                    Local Body Types ({props.selected.localBodyTypes.length})
                                  </h6>
                                  <div className="bg-success bg-opacity-10 p-3 rounded border-start border-4 border-success">
                                    {props.selected.localBodyTypes.map((item: any, index: any) => (
                                      <div key={index} className="small text-success">
                                        {item.district} - {item.localBodyType}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
      
                              {/* Selected Local Bodies */}
                              {props.selected.localBodies.length > 0 && (
                                <div className="mb-4">
                                  <h6 className="d-flex align-items-center text-muted">
                                    <Users size={16} className="text-info me-2" />
                                    Local Bodies ({props.selected.localBodies.length})
                                  </h6>
                                  <div className="bg-info bg-opacity-10 p-3 rounded border-start border-4 border-info">
                                    {props.selected.localBodies.map((item: any, index: any) => (
                                      <div key={index} className="small text-info">
                                        <div className="fw-medium">{item.localbody_name}</div>
                                        <div className="text-muted" style={{fontSize: '0.75rem'}}>{item.district} - {item.localBodyType}</div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
      
                              {/* Selected Branchs */}
                              {props.selected.branchs.length > 0 && (
                                <div className="mb-4">
                                  <h6 className="text-muted">
                                    Branchs ({props.selected.branchs.length})
                                  </h6>
                                  <div className="bg-warning bg-opacity-10 p-3 rounded border-start border-4 border-warning" style={{maxHeight: '300px', overflowY: 'auto'}}>
                                    {props.selected.branchs.map((item: any, index: any) => (
                                      <div key={index} className="small text-warning-emphasis mb-2">
                                        <div className="fw-medium">Branch {item.branch_no}: {item.branch_name}</div>
                                        <div className="text-muted" style={{fontSize: '0.75rem'}}>{item.localbody_name}, {item.district}</div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
      
                              {/* Clear All Button */}
                              {selectedItems.size > 0 && (
                                <Button
                                  color="danger"
                                  onClick={clearAllSelections}
                                  className="w-100 mb-3"
                                >
                                  Clear All Selections
                                </Button>
                              )}
      
                              <details className="mt-3">
                                <summary className="text-muted small" style={{cursor: 'pointer'}}>
                                  View Selection Data (Ready for API)
                                </summary>
                                <pre className="mt-2 small bg-light p-3 rounded text-wrap" style={{fontSize: '0.75rem', maxHeight: '200px', overflowY: 'auto'}}>
                                  {JSON.stringify(props.selected, null, 2)}
                                </pre>
                              </details>
                            </CardBody>
                          </Card>
                        </Col>
                      </Row>
                      </SimpleBar>
                    </Container>
                    case 1:
                      return <UploadData/>;
                    // case 2:
                    //   return <RightMenuData/>;
                    default:
                      return <div className="tab-content">No content</div>;
                  }
                })()
              }

             

            </CardBody>
          </Card>
        </div>
      </div>
    </React.Fragment>
  );
};

export default RightMenuData;