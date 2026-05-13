import React, { useMemo, useState, useEffect } from 'react'
import { TableContainer } from "../../../Responsive Table/TableContainerReactTable";
import { SortTanstackInterface } from '../../../Typecomponents/ComponentsType';
// import UsersFormModal from '../../UsersFormModal';
import { SortInterface } from '../../../Typecomponents/ComponentsType';
// import AddUserModal from '../../AddUserModal';
import { http, GET_ORGANISATION_LIST,ADD_ORGANISATION,DELETE_ORGANISATION,UPDATE_ORGANISATION } from '../../../http/http';
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
} from 'reactstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import RSelect from '../../../Components/Common/RSelect/RSelect';
import md from '../../../http/masterData';
import { toast } from 'react-toastify';
interface DataItem {
    organisationtype_id: number;
    organisation: string;
    organisationtype:string;
    
}

interface KeyValue{
    value:string;
    label:string;
  };


interface OrgRow {
  organisation_id: number;
  organisation: string;
  organisation_type: KeyValue | null;
  area: KeyValue | null;
  branch: KeyValue | null;
  latitude: number | null;
  longitude: number | null;
  status:KeyValue | null;
  ownerId:string;
}

const schema = Yup.object({
  organisation: Yup.string().required("Required"),
  organisation_type: Yup.object().required("Required"),
  area: Yup.object(),
  branch: Yup.object().required("Required"),
  latitude: Yup.string().required("Required"),
  longitude: Yup.string().required("Required"),
  status:Yup.object().required("Required"),
  ownerId:Yup.string().required("Required"),
});


const OrganisationMember = ({respValue,setRespValue}:any) => {
    const [page, setPage] = useState(1);
    const [sorting, setSorting] = useState<SortTanstackInterface[]>([]);
    const [selectedUser, setSelectedUser] = useState<any | null>(null);
    const [mode, setMode] = useState("");
    const [modal, setModal] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [data, setData] = useState<OrgRow[]>([]);
    const [organisationtypeLoading, setOrganisationtypeLoading] = useState(false);
    const [organisationtypeData, setOrganisationtypeData] = useState([]);
    const [areaLoading, setAreaLoading] = useState(false);
    const [areaData, setAreaData] = useState([]);
    const [branchLoading, setBranchLoading] = useState(false);
    const [branchData, setBranchData] = useState([]);
    const [statusLoading, setStatusLoading] = useState(false);
    const [statusData, setStatusData] = useState([]);

    async function getOrganisationType() {
      setOrganisationtypeLoading(true);
      md('getAll_Organisationtype')
        .then((r) => {
          setOrganisationtypeData(r);
          setOrganisationtypeLoading(false);
        }).catch((error) => {
          toast(error, { position: 'top-right', type: 'error' });
          setOrganisationtypeLoading(false);
        });
    }

     async function getArea() {
      setAreaLoading(true);
      md('getAll_Area')
        .then((r) => {
          setAreaData(r);
          setAreaLoading(false);
        }).catch((error) => {
          toast(error, { position: 'top-right', type: 'error' });
          setAreaLoading(false);
        });
    }



    async function getStatus() {
      setStatusLoading(true);
      md('getAll_Status')
        .then((r) => {
          setStatusData(r);
          setStatusLoading(false);
        }).catch((error) => {
          toast(error, { position: 'top-right', type: 'error' });
          setStatusLoading(false);
        });
    }
    useEffect(()=>{
        getOrganisationType()
        getArea()
        getStatus()
    },[])

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

    // const [data, setData] = useState<DataItem[]>([]);
    const toggle = () => {
        setModal(!modal);
        if (modal) {
            setSelectedUser(null);
        }
    };

    const addToggle = () => {
        setModal(!modal);
    };


    const serialNo = (celldata: any) => {
        return <span>{((page - 1) * sizePerPage) + (Number(celldata.row.id) + 1)}</span>
    }

    const handleEdit=(row:any)=>{
        setEditId(row.organisation_id)
        let selectedRow=JSON.parse(JSON.stringify(row))
        let selectedOrganisationType=organisationtypeData.find((sd:any)=>sd.value==row.organisation_type_id)
        let selectedBranch={
            label:row.branch,
            value:row.branch_id
        }
        let selectedStatus=statusData.find((sd:any)=>sd.value==row.status_id)


        selectedRow.organisation_type=selectedOrganisationType;
        selectedRow.branch=selectedBranch;
        selectedRow.status=selectedStatus;

        formik.setValues({
        ...selectedRow,
        });
        setShowForm(true);
    }

    const handleDelete=(organisation_id:number)=>{
              async function deleteOrganisation(organisation_id:any) {
                   setLoading(true);
                   await http({
                     method: 'DELETE',
                     url: DELETE_ORGANISATION+'/'+organisation_id
                   })
                     .then(function(response) {
                       if (response.status === 200) {
                         console.log(response.data);
                        fetchData(initialRequest)
                         toast(response.data.message, {
                           position: 'top-right',
                           type: 'success',
                         });
                       } else {
                         toast('Failed to Add State', {
                           position: 'top-right',
                           type: 'error',
                         });
                       }
                       setLoading(false);
                     })
                     .catch(err => {
                       toast(err, { position: 'top-right', type: 'error' });
                       setLoading(false);
                     });
                  }

                  deleteOrganisation(organisation_id)
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
            id: "Organisation",
            header: "Organisation",
            accessorKey: "organisation",
            enableColumnFilter: false,
        },
        {
            id: "owner",
            header: "ownerName",
            accessorKey: "ownerName",
            enableColumnFilter: false,
        },
        {
            id: "OrganisationType",
            header: "Organisation Type",
            accessorKey: "organisation_type",
            enableColumnFilter: false,
        },
         {
            id: "branch",
            header: "Branch",
            accessorKey: "branch",
            enableColumnFilter: false,
        },
        {
            id: "status",
            header: "Status",
            accessorKey: "status",
            enableColumnFilter: false,
        },
        {
                header: "Actions",
                cell: (cell: any) => {
        
                  const row = cell.row.original;
        
                  return (
                    
                <div className="d-flex gap-2">
        
                      <Button
                        size="sm"
                        color="soft-warning"
                        onClick={() =>
                          handleEdit(row)
                        }
                      >
                        Edit
                      </Button>
        
                      <Button
                        size="sm"
                        color="soft-danger"
                        onClick={() =>
                          handleDelete(row.organisation_id)
                        }
                      >
                        Delete
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
    const fetchData = async (requestdata: any) => {
        const { start, numberOfRows } = requestdata;
        try {
            const response = await http.post(GET_ORGANISATION_LIST, requestdata);
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
        console.log("page", page)
    }

      async function addNewOrganisation(data:any) {
          console.log('data', data);
          setLoading(true);
          await http({
            method: 'POST',
            url: ADD_ORGANISATION,
            data,
          })
            .then(function(response) {
              if (response.status === 200) {
                console.log(response.data);
                fetchData(initialRequest)
                toast(response.data.message, {
                  position: 'top-right',
                  type: 'success',
                });
              } else {
                toast('Failed to Add State', {
                  position: 'top-right',
                  type: 'error',
                });
              }
              setLoading(false);
            })
            .catch(err => {
              toast(err, { position: 'top-right', type: 'error' });
              setLoading(false);
            });
        }

        async function updateOrganisation(data:any) {
            console.log('data', data);
            setLoading(true);
            await http({
            method: 'PUT',
            url: UPDATE_ORGANISATION+'/'+data.area_id,
            data,
            })
            .then(function(response) {
                if (response.status === 200) {
                console.log(response.data);
        
                toast(response.data.message, {
                    position: 'top-right',
                    type: 'success',
                });
                } else {
                toast('Failed to Add State', {
                    position: 'top-right',
                    type: 'error',
                });
                }
                setLoading(false);
            })
            .catch(err => {
                toast(err, { position: 'top-right', type: 'error' });
                setLoading(false);
            });
        }

    const formik = useFormik<OrgRow>({
        initialValues: {
          organisation_id: 0,
          organisation: '',
          organisation_type: null,
          area:null,
          branch:null,
          latitude:null,
          longitude:null,
          status:null,
          ownerId:''
        },
        // validationSchema: schema,
    
        onSubmit: (values, { resetForm }) => {
          if (editId) {
            updateOrganisation(values)
            setEditId(null);
          } else {
           addNewOrganisation(values);
          }
    
          resetForm();
          setShowForm(false);
        }
      });
    return (
        <React.Fragment>
            <div style={{ padding: '50px', marginTop: '50px' }}>
               
               <Row>
                    <Col md="12">
                    <Card>

                        <CardHeader className="d-flex justify-content-between">
                        <h4>{respValue.title}</h4>
    
                            <Button
                                color="soft-success"
                                size="sm"
                                onClick={() => {
                                 setRespValue({
                                    nav:"RegisterOrganisationMember",
                                    mode:"add",
                                    data:null,
                                    origin:"OrganisationMember",
                                    title:"Register Organisation Member"
                                    })
                                }}
                            >
                                + Add New
                            </Button>    
                        </CardHeader>

                        <CardBody>
                        
                        {!loading?<TableContainer
                            columns={(columns || [])}
                            data={(data || [])}
                            customPageSize={sizePerPage}
                            tableClass="table-centered align-middle table-nowrap mb-0"
                            theadClass="text-muted table-light"
                            SearchPlaceholder='Search Users...'
                            isGlobalFilter={true}
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

                    </Card>
                    </Col>
                </Row>
              
            </div>
        </React.Fragment>
    );
}

export default OrganisationMember