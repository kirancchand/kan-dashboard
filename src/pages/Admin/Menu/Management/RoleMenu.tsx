import React, { useMemo, useState, useEffect,useRef } from 'react'
import { TableContainer } from "../../../../Responsive Table/TableContainerReactTable";
import { SortTanstackInterface } from '../../../../Typecomponents/ComponentsType';
// import UsersFormModal from '../../UsersFormModal';
import { SortInterface } from '../../../../Typecomponents/ComponentsType';
// import AddUserModal from '../../AddUserModal';
import { http, GET_ROLE_MENU_LIST, addRoleMenu,GET_MENU_BY_ROLE_ID,UPDATE_ROLEMENU } from '../../../../http/http';
import md from '../../../../http/masterData';
import { toast } from 'react-toastify';
import { Formik, Field, Form, ErrorMessage } from 'formik';
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
import RSelect from '../../../../Components/Common/RSelect/RSelect';
import RSelectMulti from '../../../../Components/Common/RSelectMulti/RSelectMulti';
import { co } from '@fullcalendar/core/internal-common';
interface DataItem {
    role_id: number;
    role: string;
    
}



const RoleMenu = () => {
    const [page, setPage] = useState(1);
    const [sorting, setSorting] = useState<SortTanstackInterface[]>([]);
    const [loading,setLoading]=useState(false);
    const [roleData,setRoleData]=useState([]);
    const [menuData,setMenuData]=useState([]);
    const [roleLoading,setRoleLoading]=useState(false);
    const [menuLoading,setMenuLoading]=useState(false);
    const [editData,setEditData]=useState<any>([]);
    const formRef = useRef<any>(null);


    useEffect(()=>{
    async function getRole() {
        setRoleLoading(true);
        md('getAll_Role')
        .then((r) => {
            setRoleData(r);
            setRoleLoading(false);
        }).catch((error) => {
            toast(error, { position: 'top-right', type: 'error' });
            setRoleLoading(false);
        });
    }

    async function getMenu() {
        setMenuLoading(true);
        md('getAll_Menu')
        .then((r) => {
            setMenuData(r);
            setMenuLoading(false);
        }).catch((error) => {
            toast(error, { position: 'top-right', type: 'error' });
            setMenuLoading(false);
        });
    }

    getRole()
    getMenu()
    },[])

    useEffect(()=>{
        if(editData.length>0){  
            console.log("editData",editData)
            console.log("roleData",roleData)
            console.log("menuData",menuData)
            console.log("role_id",roleData.find((r: any) => r.value === editData[0].f_role_id.toString()))
            formRef.current.setFieldValue("role", roleData.find((r: any) => r.value === editData[0].f_role_id.toString()))
            let menu=editData.map((item:any)=>{
                console.log("item",item)
                return menuData.find((m: any) => m.value === item.f_menu_id.toString())
            })
            formRef.current.setFieldValue("menu", menu) 
        }
    },[editData])

  let initialValue={
    role:null,
    menu:[]
  }
  const roleFunc=(value:any,setFieldValue:any)=>{
    setFieldValue("role",value)

  }
  const menuFunc=(value:any,setFieldValue:any)=>{
    setFieldValue("menu",value)
  }
console.log("roleData",roleData)
async function getRoleMenu(role_id:any) {
        setLoading(true);
        await http({
            method: 'GET',
            url: GET_MENU_BY_ROLE_ID+'/'+role_id
        })
            .then(function(response) {
            if (response.status === 200) {
                setEditData(response.data.data);
            } else {
                toast('Failed to Get Data', {
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

  const handleUpdate=(row:any)=>{
    getRoleMenu(row.role_id)
  }

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
        {
            id: "Menu Name",
            header: "Menu Name",
            accessorKey: "menu",
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
                    color="soft-danger"
                    onClick={() =>
                        handleUpdate(row)
                    }
                    >
                    Edit
                    </Button>
    
                </div>
                
                );
            },
            },
       

    ], [])

    const [totalCount, setTotalCount] = useState(0);
    const [data, setData] = useState<DataItem[]>([]);
    let sort: SortInterface[] = [];
    const [sizePerPage, setSizePerPage] = useState(10);


    let initialRequest = {
        "start": 0,
        "sort": [],
        "numberOfRows": 10,
        "filters": []
    }
    const fetchData = async (requestdata: any) => {
        const { start, numberOfRows } = requestdata;
        try {
            const response = await http.post(GET_ROLE_MENU_LIST, requestdata);
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


    async function addNewRoleMenu(data:any) {
        console.log("data",data)
        setLoading(true)
        await http({
            method: 'POST',
            url: addRoleMenu,
            data,
        }).then(function (response) {
            if (response.status === 200) {
                console.log(response.data)
                toast(response.data.message, { position: 'top-right', type: 'success' });
                fetchData(initialRequest);
            } else {
                toast("Failed to Add State", { position: 'top-right', type: 'error' });
            };
                 setLoading(false)
            })
            .catch(err => {
                toast(err, { position: 'top-right', type: 'error' });
                setLoading(false)
            });
    }

    async function updateRoleMenu(data:any) {
        console.log("data",data)
        setLoading(true)
        await http({
            method: 'POST',
            url: UPDATE_ROLEMENU,
            data,
        }).then(function (response) {
            if (response.status === 200) {
                console.log(response.data)
                toast(response.data.message, { position: 'top-right', type: 'success' });
                fetchData(initialRequest);
            } else {
                toast("Failed to Add State", { position: 'top-right', type: 'error' });
            };
                 setLoading(false)
            })
            .catch(err => {
                toast(err, { position: 'top-right', type: 'error' });
                setLoading(false)
            });
    }

    


    const handleSubmit=(values:any,{resetForm}:any)=>{
        if(editData.length>0){
            updateRoleMenu(values)
        } else{
            addNewRoleMenu(values)
        }

        resetForm()
    }

    return (
        <React.Fragment>
             <div style={{ padding: '50px', marginTop: '50px' }}>
            <Row>
                <Col md="12">
             
                    <Row>
                        <Col md="5"><h1>Role Menu</h1></Col>
                        <Col md="7"> 
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
                                    <Col md="5">
                                        <FormGroup>
                                        <Field
                                            component={RSelect}
                                            name="role"
                                            id="role"
                                            value={values.role}
                                            onChange={(ev:any) => roleFunc(ev, setFieldValue)}
                                            options={roleData}
                                            placeholder="--Select Role--"
                                            error={errors.role}
                                            touched={touched.role}
                                            isLoading={roleLoading}
                                            isClearable
                                        />  
                                        </FormGroup>
                                    </Col>
                                    <Col md="5">
                                        <FormGroup>
                                            <Field
                                                component={RSelectMulti}
                                                name="menu"
                                                id="menu"
                                                onChange={(ev:any) => menuFunc(ev,setFieldValue)}
                                                value={values.menu}
                                                options={menuData}
                                                isLoading={menuLoading}
                                                // isDisabled={isOptionDisabled}
                                                isClearable
                                                error={errors.menu}
                                                touched={touched.menu}
                                                />
                                            <FormFeedback>
                                            <ErrorMessage name="menu" />
                                            </FormFeedback>
                                        </FormGroup>
                                    </Col>
                                    <Col md="2">
                                        <Button type="submit" color="primary">{editData.length>0?"Update":"Save"}</Button>
                                    </Col>
                                    </Row>
                            </Form>
                            )}
                        </Formik>
                        </Col>
                    </Row> 
                
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

export default RoleMenu