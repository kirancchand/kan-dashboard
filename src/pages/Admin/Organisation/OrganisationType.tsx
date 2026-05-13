import React, { useMemo, useState, useEffect,useRef } from 'react'
import { TableContainer } from "../../../Responsive Table/TableContainerReactTable";
import { SortTanstackInterface } from '../../../Typecomponents/ComponentsType';
// import UsersFormModal from '../../UsersFormModal';
import { SortInterface } from '../../../Typecomponents/ComponentsType';
// import AddUserModal from '../../AddUserModal';
import { http, GET_ORGANISATIONTYPE_LIST,ADD_ORGANISATIONTYPE,UPDATE_ORGANISATIONTYPE,DELETE_ORGANISATIONTYPE } from '../../../http/http';
import {
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Label,
  Input,
  Button
} from "reactstrap";
import { Formik, Field,Form,ErrorMessage,FormikProps } from 'formik';
import { toast } from 'react-toastify';
interface DataItem {
    organisationtype_id: number;
    organisationtype: string;
    
}



const OrganisationType = () => {
    const [page, setPage] = useState(1);
    const [sorting, setSorting] = useState<SortTanstackInterface[]>([]);
    const [selectedUser, setSelectedUser] = useState<any | null>(null);
    const [mode, setMode] = useState("");
    const [modal, setModal] = useState(false);
    const formRef = useRef<FormikProps<any>>(null);
    const [editId,setEditId]=useState("")
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

    const handleEdit = (row: any) => {
        formRef.current?.setFieldValue("organisation_type",row.organisation_type)
        setEditId(row.organisation_type_id)
        // props.handleEdit(row)
    };

      async function deleteOrganisationType(organisation_type_id:any) {
           setLoading(true);
           await http({
             method: 'DELETE',
             url: DELETE_ORGANISATIONTYPE+'/'+organisation_type_id
           })
             .then(function(response) {
               if (response.status === 200) {
                 console.log(response.data);
                fetchData(initialRequest);
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

    const handleDelete = (id: number) => {
        deleteOrganisationType(id)
    };
        async function updateOrganisationType(data:any) {
          console.log('data', data);
          setLoading(true);
          await http({
            method: 'PUT',
            url: UPDATE_ORGANISATIONTYPE+'/'+editId,
            data,
          })
            .then(function(response) {
              if (response.status === 200) {
                console.log(response.data);
                setEditId("")
                fetchData(initialRequest);
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

    const columns = useMemo(() => [
        {
            id: "slno",
            header: "Sl No",
            accessorKey: "slno",
            enableColumnFilter: false,
            cell: (cell: any) => serialNo(cell),
        }, 
        {
            id: "OrganisationType",
            header: "Organisation Type",
            accessorKey: "organisation_type",
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
                        handleDelete(row.organisation_type_id)
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
    const [data, setData] = useState<DataItem[]>([]);
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
            const response = await http.post(GET_ORGANISATIONTYPE_LIST, requestdata);
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

    async function addNewOrganisationType(data:any) {
        console.log('data', data);
        setLoading(true);
        await http({
            method: 'POST',
            url: ADD_ORGANISATIONTYPE,
            data,
        })
            .then(function(response) {
            if (response.status === 200) {
                console.log(response.data);
                fetchData(initialRequest);
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

    const initialValue = {
        organisation_type: '',
      };

    const handleSubmit = (values:any, { resetForm }:any) => {
        if(editId==""){
            addNewOrganisationType(values);
        }else{
            updateOrganisationType(values);
        }

        resetForm();
      };

    return (
        <React.Fragment>
            <div style={{ padding: '50px', marginTop: '50px' }}>
                <Card>
                <CardHeader className="d-flex justify-content-between">

                  <h4>Organisation Type</h4>


                    <Formik
                        initialValues={initialValue}
                        //  validationSchema={firContentValidateSchema}
                        onSubmit={handleSubmit}
                        innerRef={formRef}
                    >
                        {({
                        errors,
                        touched,
                        isSubmitting,
                        dirty,
                        resetForm,
                        values,
                        setFieldValue,
                        setFieldTouched,
                        }) => (
                        <Form>
                            <Row>
                            <Col md="12">
                                    <div className="input-group">

                                        <Field
                                            type="text"
                                            name="organisation_type"
                                            id="organisation_type"
                                            value={values.organisation_type}
                                            placeholder="Organisation Type"
                                            as={Input}
                                            invalid={errors.organisation_type && touched.organisation_type}
                                            autoComplete="off"
                                        />
                                        <Button
                                            color="soft-success"
                                            size="sm"
                                            type='submit'
                                        >
                                            + Save
                                        </Button>
                                        
 

                                        
                                    </div>
                                </Col>
                            </Row>
                        </Form>
                        )}
                    </Formik>


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
                    />:"Loading.."}

                </CardBody>
                </Card>
               
            </div>
        </React.Fragment>
    );
}

export default OrganisationType