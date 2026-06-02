import React, { useMemo, useState, useEffect } from 'react'
import { TableContainer } from "../../../../Responsive Table/TableContainerReactTable";
import { SortTanstackInterface } from '../../../../Typecomponents/ComponentsType';
// import UsersFormModal from '../../UsersFormModal';
import { SortInterface } from '../../../../Typecomponents/ComponentsType';
// import AddUserModal from '../../AddUserModal';
import { http, GET_ROLE_LIST, addRole} from '../../../../http/http';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { toast } from 'react-toastify';
import {
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardHeader,
  FormGroup,
  Input,
  InputGroup,
  InputGroupText,
  Button,
  Label,
  FormFeedback,
  CardFooter,
} from 'reactstrap';
interface DataItem {
    role_id: number;
    role_name: string;
}



const Role = () => {
    const [page, setPage] = useState(1);
    const [sorting, setSorting] = useState<SortTanstackInterface[]>([]);
    const [selectedUser, setSelectedUser] = useState<any | null>(null);
    const [mode, setMode] = useState("");
    const [modal, setModal] = useState(false);

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
        return <span>{((page - 1) * sizePerPage) + (Number(celldata.row.index) + 1)}</span>
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
            id: "Role Name",
            header: "Role Name",
            accessorKey: "role",
            enableColumnFilter: false,
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
            const response = await http.post(GET_ROLE_LIST, requestdata);
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

      const initialValue = {
        role: '',
      };
    
      async function addNewRole(data:any) {
        console.log('data', data);
        setLoading(true);
        await http({
          method: 'POST',
          url: addRole,
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
    
      const handleSubmit = (values:any, { resetForm }:any) => {
        addNewRole(values);
        resetForm();
      };
      

    return (
        <React.Fragment>
            <div style={{ padding: '50px', marginTop: '50px' }}>
            <Row>
                <Col md="12">
                <div className="plants-header">
                    <h1>Role</h1>
                    <Formik
                        initialValues={initialValue}
                        //  validationSchema={firContentValidateSchema}
                        onSubmit={handleSubmit}
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
                                            name="role"
                                            id="role"
                                            value={values.role}
                                            placeholder="role"
                                            as={Input}
                                            invalid={errors.role && touched.role}
                                            autoComplete="off"
                                        />
                                        <Button className='primary' type='submit'>
                                            Save
                                        </Button>
                                        {/* <span className="input-group-text" id="basic-addon2">
                                            Save
                                        </span> */}

                                        
                                    </div>
                                </Col>
                            </Row>
                        </Form>
                        )}
                    </Formik>
                    
                </div>
                </Col>
            </Row>
             <Row>
                <Col md="12">
                 <TableContainer
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
                />
                </Col>
            </Row>
            
                
               
            </div>
        </React.Fragment>
    );
}

export default Role