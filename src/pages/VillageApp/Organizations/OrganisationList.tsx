import React, { useMemo, useState, useEffect, Fragment } from 'react'
import { TableContainer } from "../../../Responsive Table/TableContainerReactTable";
import { SortTanstackInterface } from '../../../Typecomponents/ComponentsType';
// import UsersFormModal from '../../UsersFormModal';
import { SortInterface } from '../../../Typecomponents/ComponentsType';
// import AddUserModal from '../../AddUserModal';
import { http, GET_ORGANISATION_LIST } from '../../../http/http';
import {
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Breadcrumb,
  BreadcrumbItem,
  Alert,
  CardFooter,
} from 'reactstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import RSelect from '../../../Components/Common/RSelect/RSelect';
import md from '../../../http/masterData';
import { toast } from 'react-toastify';


interface KeyValue{
    value:string;
    label:string;
  };


interface OrgRow {
  organisation: string;
  state: KeyValue | null;
  district: KeyValue | null;
  region: KeyValue | null;
  area: KeyValue | null;
  branch: KeyValue | null;
}

const OrganisationList = ({returnFunc,formik_values}:any) => {
  //console.log("formik_values",formik_values)
    const [page, setPage] = useState(1);
    const [sorting, setSorting] = useState<SortTanstackInterface[]>([]);
    const [selectedUser, setSelectedUser] = useState<any | null>(null);
    const [modal, setModal] = useState(false);
    const [data, setData] = useState<[]>([]);
    const [stateData,setStateData]=useState([]);
    const [districtData,setDistrictData]=useState([]);
    const [regionData,setRegionData]=useState([]);
    const [areaData,setAreaData]=useState([]);
    const [areaLoading,setAreaLoading]=useState(false);
    const [stateLoading,setStateLoading]=useState(false);
    const [districtLoading,setDistrictLoading]=useState(false);
    const [regionLoading,setRegionLoading]=useState(false);
    const [branchLoading, setBranchLoading] = useState(false);
    const [branchData, setBranchData] = useState([]);

    const [selectedRows, setSelectedRows] = useState<any[]>([]);

     useEffect(()=>{
       async function getState() {
         setStateLoading(true);
         md('getAll_State')
           .then((r) => {
             setStateData(r);
             setStateLoading(false);
           }).catch((error) => {
             toast(error, { position: 'top-right', type: 'error' });
             setStateLoading(false);
           });
       }
       getState()
        getArea({
         "requestName": "getAll_Area",
       })
 
     },[])
   
   
     async function getDistrict(reqData:any) {
       setDistrictLoading(true);
       md(reqData)
         .then((r) => {
           setDistrictData(r);
           setDistrictLoading(false);
         }).catch((error) => {
           toast(error, { position: 'top-right', type: 'error' });
           setDistrictLoading(false);
         });
     }
   
     async function getRegion(reqData:any) {
       setRegionLoading(true);
       md(reqData)
         .then((r) => {
           setRegionData(r);
           setRegionLoading(false);
         }).catch((error) => {
           toast(error, { position: 'top-right', type: 'error' });
           setRegionLoading(false);
         });
     }
   
     async function getArea(reqData:any) {
       setAreaLoading(true);
       md(reqData)
         .then((r) => {
           setAreaData(r);
           setAreaLoading(false);
         }).catch((error) => {
           toast(error, { position: 'top-right', type: 'error' });
           setAreaLoading(false);
         });
     }
   
     const stateFunc=(value:any,setFieldValue:any)=>{
       setFieldValue("state",value)
       setFieldValue("district",null)
       getDistrict({
         "requestName": "getAll_DistrictByState",
         "params":[
           {
             "paramValue":value.value,
             "paramEncrypted": "Y"
           }
         ]
       });
     }
   
     const districtFunc=(value:any,setFieldValue:any)=>{
       setFieldValue("district",value)
       getRegion({
         "requestName": "getAll_RegionByDistrict",
         "params":[
           {
             "paramValue":value.value,
             "paramEncrypted": "Y"
           }
         ]
       })
     }
   
     const regionFunc=(value:any,setFieldValue:any)=>{
       setFieldValue("region",value)
       getArea({
         "requestName": "getAll_Area",
       })
       // getArea({
       //   "requestName": "getAll_AreaByRegion",
       //   "params":[
       //     {
       //       "paramValue":value.value,
       //       "paramEncrypted": "Y"
       //     }
       //   ]
       // })
     }

    const handleAreaChange=(ev:any)=>{
        formik.setFieldValue("area", ev)
        formik.setFieldValue("branch", null)
        async function getBranch() {
            setBranchLoading(true);
            md({
                    "requestName": "getAll_BranchByArea",
                    "params":[
                        {
                            "paramValue":ev.value,
                            "paramEncrypted": "Y"
                        }
                    ]
                })
                .then((r) => {
                setBranchData(r);
                setBranchLoading(false);
                }).catch((error) => {
                toast(error, { position: 'top-right', type: 'error' });
                setBranchLoading(false);
                });
        }
        getBranch()
    }


    const handleBranchChange=(ev:any)=>{
        formik.setFieldValue("branch", ev)
        fetchData(initialRequest)
    }

    // const [data, setData] = useState<DataItem[]>([]);
    const toggle = () => {
        setModal(!modal);
        if (modal) {
            setSelectedUser(null);
        }
    };


    const serialNo = (celldata: any) => {
        return <span>{((page - 1) * sizePerPage) + (Number(celldata.row.id) + 1)}</span>
    }


    const contactFunc = (celldata: any) => {
        // console.log(celldata)
        return <span>
                <div>{celldata.row.original.email_id!=undefined?celldata.row.original.email_id:null}</div>
                <div>{celldata.row.original.mobno!=undefined?celldata.row.original.mobno:null}</div>
                <div>{celldata.row.original.address!=undefined?celldata.row.original.address:null }</div>
                </span>
    }


    const columns = useMemo(() => [
        {
            id: "slno",
            header: "Sl No",
            accessorKey: "slno",
            enableColumnFilter: false,
            cell: (cell: any) => serialNo(cell),
        }, 
        {
            id: "organisation",
            header: "Organisation",
            accessorKey: "organisation",
            enableColumnFilter: false,
            
        },
        {
            id: "organisation_type",
            header: "Organisation Type",
            accessorKey: "organisation_type",
            enableColumnFilter: false,
            
        },
        {
            id: "ownerName",
            header: "Owner Name",
            accessorKey: "ownerName",
            enableColumnFilter: false,
            
        },
        {
            id: "contact",
            header: "Contact",
            accessorKey: "Contact",
            enableColumnFilter: false,
            cell: (cell: any) => contactFunc(cell),
        },
        {
                header: "Actions",
                cell: (cell: any) => {
        
                  const row = cell.row.original;
                  //console.log(row)
        
                  return (
                    
                <div className="d-flex gap-2">
        
                      <Button
                        size="sm"
                        color="soft-warning"
                        onClick={() =>
                          returnFunc(row)
                        }
                      >
                        Add
                      </Button>
        
        
                    </div>
                    
                  );
                },
              },

    ], [toggle])

    const [totalCount, setTotalCount] = useState(0);

    let sort: SortInterface[] = [];
    const [sizePerPage, setSizePerPage] = useState(10);
    const [loading, setLoading] = useState(false);

    let initialRequest = {
        "start": 0,
        "sort": [],
        "numberOfRows": 10,
        "filters": []
    }


    //console.log("data",data)
    const fetchData = async (requestdata: any) => {
        const { start, numberOfRows } = requestdata;
        try {
            const response = await http.post(GET_ORGANISATION_LIST, requestdata);
            //console.log(response.data)
            if (response.data) {
                setData(response.data.result);
                setTotalCount(response.data.totalCount);
            }
        } catch (error) {
            console.error("Error fetching analytics data:", error);
        }



    };

    useEffect(() => {
      fetchData(initialRequest);
    }, []);

    const handleTableChange = ({ pages, sizePerPages, sortField, sortOrder }: any) => {
        setPage(pages)
        setSizePerPage(sizePerPages)
        if (sortField !== "" && sortOrder !== "") {
            sort = [{
                "columnName": sortField,
                "sortOrder": sortOrder
            }]
        }
        fetchData({
            "start": (pages - 1) * sizePerPages,
            "sort": sort,
            "numberOfRows": sizePerPages,
            "filters": []
        });
        //console.log("page", page)
    }


    const formik = useFormik<OrgRow>({
        initialValues: {
          organisation: '',
          state: null,
          district:null,
          region:null,
          area:null,
          branch:null,
        },
        onSubmit: (values, { resetForm }) => {
          fetchData(initialRequest)
        }
      });
    return (
        <React.Fragment> 
               <Row>
                    <Col md="12">
                    <Card>

                        <CardBody>

                           <Form onSubmit={formik.handleSubmit}>
                            <Row>
                              <Col md="2">
                                  <FormGroup>

                                  <Label>State</Label>
                                    <RSelect
                                        name="state"
                                        id="state"
                                        value={formik.values.state}
                                        onChange={(ev: any) =>stateFunc(ev,formik.setFieldValue)}
                                        options={stateData}
                                        placeholder="--Select State--"
                                        error={formik.errors.state}
                                        touched={formik.touched.state}
                                        isLoading={stateLoading}
                                        isClearable
                                      />
                                    {formik.touched.state &&
                                      formik.errors.state && (
                                        <div className="text-danger">
                                          {formik.errors.state}
                                        </div>
                                      )}

                                </FormGroup>
                              </Col>
                              <Col md="2">
                                    <FormGroup>
                                    <Label>District</Label>
                                      <RSelect
                                          name="district"
                                          id="district"
                                          value={formik.values.district}
                                          onChange={(ev: any) =>districtFunc(ev,formik.setFieldValue)}
                                          options={districtData}
                                          placeholder="--Select District--"
                                          error={formik.errors.district}
                                          touched={formik.touched.district}
                                          isLoading={districtLoading}
                                          isClearable
                                        />
                                      {formik.touched.district &&
                                        formik.errors.district && (
                                          <div className="text-danger">
                                            {formik.errors.district}
                                          </div>
                                        )}

                                  </FormGroup>
                              
                              </Col>
                              <Col md="2">
                                  <FormGroup>
                                  <Label>Region</Label>
                                    <RSelect
                                        name="region"
                                        id="region"
                                        value={formik.values.region}
                                        onChange={(ev: any) =>regionFunc(ev,formik.setFieldValue)}
                                        options={regionData}
                                        placeholder="--Select Region--"
                                        error={formik.errors.region}
                                        touched={formik.touched.region}
                                        isLoading={regionLoading}
                                        isClearable
                                      />
                                    {formik.touched.region &&
                                      formik.errors.region && (
                                        <div className="text-danger">
                                          {formik.errors.region}
                                        </div>
                                      )}

                                </FormGroup>
                              </Col>
                              <Col md="2">
                                  <FormGroup>
                                  <Label>Area</Label>
                                    <RSelect
                                        name="area"
                                        id="area"
                                        value={formik.values.area}
                                        onChange={(ev: any) =>handleAreaChange(ev)
                                          // formik.setFieldValue("area", ev)
                                        }
                                        options={areaData}
                                        placeholder="--Select Area--"
                                        error={formik.errors.area}
                                        touched={formik.touched.area}
                                        isLoading={areaLoading}
                                        isClearable
                                      />
                                    {formik.touched.area &&
                                      formik.errors.area && (
                                        <div className="text-danger">
                                          {formik.errors.area}
                                        </div>
                                      )}

                                </FormGroup>
                              </Col>
                              <Col md="2">                
                                  <FormGroup>
                                  <Label>Branch</Label>
                                      <RSelect
                                        name="branch"
                                        id="branch"
                                        value={formik.values.branch}
                                        onChange={(ev: any) =>handleBranchChange(ev)
                                          // formik.setFieldValue("branch", ev)
                                        }
                                        options={branchData}
                                        placeholder="--Select Branch--"
                                        error={formik.errors.branch}
                                        touched={formik.touched.branch}
                                        isLoading={branchLoading}
                                        isClearable
                                      />
                                    {formik.touched.branch &&
                                      formik.errors.branch && (
                                        <div className="text-danger">
                                          {formik.errors.branch}
                                        </div>
                                      )}
                                </FormGroup>
                                </Col>
                                <Col md="2">
                                  <FormGroup>
                                  <Label>User Name</Label>
                                      <Input
                                        type="text"
                                        name="organisation"
                                        value={formik.values.organisation}
                                        onChange={(e) =>formik.setFieldValue("organisation",e.target.value === "")}
                                    />
                                  </FormGroup>
                                </Col>
                            </Row>

                
            


              </Form>
                        
                        {!loading?<TableContainer
                            columns={(columns || [])}
                            data={(data || [])}
                            customPageSize={sizePerPage}
                            tableClass="table-centered align-middle table-nowrap mb-0"
                            theadClass="text-muted table-light"
                            SearchPlaceholder='Search Users...'
                            isGlobalFilter={false}
                            page={page}
                            sorting={sorting}
                            setSorting={setSorting}
                            sizePerPage={sizePerPage}
                            clickable={false}
                            totalCount={totalCount}
                            handleTableChange={handleTableChange}
                            loading={loading}
                        />:"Loading..."}
                        </CardBody>
                        <CardFooter className="d-flex justify-content-end">
                          <Button
                            size="sm"
                            color="soft-success"
                            onClick={() =>
                              returnFunc(selectedRows)
                            }
                          >
                        Add
                        </Button>
                        </CardFooter>
                    </Card>

                    </Col>
                </Row>
              

        </React.Fragment>
    );
}

export default OrganisationList