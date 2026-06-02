import React, { useEffect, useMemo, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
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
import { Link } from 'react-router-dom';
import { TableContainer } from '../../../common/AnalyticsTable/TableContainerReactTable';
import { SortInterface, SortTanstackInterface } from '../../../Typecomponents/ComponentsType';
import UserList from './UserList';
import {UserSearch} from 'lucide-react';
import UserModal from './UserModal';
import RSelect from '../../../Components/Common/RSelect/RSelect';
import md from '../../../http/masterData';
import mdurl from '../../../http/masterDataURL';
import { http } from '../../../http/http';
import { toast } from 'react-toastify';
import { ADD_VILLAGE_USERS, MD_URL,GET_VILLAGE_USERS,DELETE_VILLAGE_USERS,UPDATE_VILLAGE_USERS } from '../Api';

interface KeyValue {
  label: string;
  value: string;
}

interface UserRow {
  villageapp_userid: number;
  f_villageapp_id:KeyValue | null;
  f_role_id:KeyValue | null;
  villageapp_username: string;
  contact: string,
  isimportant: boolean,
  priority: string;
  f_user_id: string;
  f_elastic_id: string;
  // image: File | null;
}



const schema = Yup.object({
  villageapp_username: Yup.string().required("Username is required"),
  place: Yup.string().required("Locality is required"),
  mobile: Yup.string().required("Contact is required"),
  position: Yup.string().required("Position is required"),
  image: Yup.mixed().required("Image required"),
});

const Users = () => {

  const [tableData, setTableData] = useState<UserRow[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const [apiError, setApiError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [sizePerPage, setSizePerPage] = useState(10);
  const [sorting, setSorting] = useState<SortTanstackInterface[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [roleData,setRoleData]=useState<KeyValue[]>([]);
  const [roleLoading,setRoleLoading]=useState(false);
  const [villageAppData,setVillageAppData]=useState<KeyValue[]>([])
  const [villageAppDataLoading,setVillageAppDataLoading]=useState(false)
  const [totalCount, setTotalCount] = useState(0);
  const [data, setData] = useState<[]>([]);
  const [selectedRoleId,setSelectedRoleId]=useState<any>('');
  let sort: SortInterface[] = [];

  let initialRequest = {
    "start": 0,
    "sort": [],
    "numberOfRows": 10,
    "filters": []
}

  const fetchData = async (requestdata: any) => {
      const { start, numberOfRows } = requestdata;
      try {
          const response = await http.post(GET_VILLAGE_USERS, requestdata);
          //console.log(response.data)
          if (response.data) {
              setData(response.data.result)
              // setData(response.data.result);
              setTotalCount(response.data.totalCount);
          }
      } catch (error) {
          console.error("Error fetching analytics data:", error);
      }



  };


  const toggle = () => {
      setShowModal(!showModal);
      if (showModal) {
          setSelectedUser([]);
      }
  };

  const addToggle = () => {
      setShowModal(!showModal);
  };

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
  async function fetchVillageApps() {
      setVillageAppDataLoading(true);
      mdurl(MD_URL,'getAll_VillageApp')
        .then((r) => {
          setVillageAppData(r);
          setVillageAppDataLoading(false);
        }).catch((error) => {
          toast(error, { position: 'top-right', type: 'error' });
          setVillageAppDataLoading(false);
        });
    }
  useEffect(() => {
    // Fetch initial data here and setTableData
    getRole()
    fetchVillageApps()
    fetchData(initialRequest)
  }, []);


  async function saveUsers(data:any) {
      console.log('data', data);
      setLoading(true);
      await http({
      method: 'POST',
      url: ADD_VILLAGE_USERS,
      data,
      })
      .then(function(response) {
          if (response.status === 200) {
          console.log(response.data);
          formik.resetForm();
          setSelectedUser([]);
          toast(response.data.message, {
              position: 'top-right',
              type: 'success',
          });
          } else {
          toast('Failed to Add Users', {
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

    async function updateUsers(data:any) {
      console.log('data', data);
      setLoading(true);
      await http({
      method: 'POST',
      url: UPDATE_VILLAGE_USERS,
      data,
      })
      .then(function(response) {
          if (response.status === 200) {
             fetchData(initialRequest)
          toast(response.data.message, {
              position: 'top-right',
              type: 'success',
          });
          } else {
          toast('Failed to Add Users', {
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


  //  {
  //         "villageapp_username": item.Name,
  //         "contact": item.HouseName+" "+item.HouseNo,
  //         "isimportant": false,
  //         "f_role_id": roleData.length>0?roleData.find((role) => role.label === "Unauthorised User")?? "":"",
  //         "f_user_id": "",
  //         "f_elastic_id": item.SerialNo,
  //         "f_villageapp_id": formik.values.f_villageapp_id
  //       }


  const formik = useFormik<UserRow>({
    initialValues: {
      villageapp_userid: 0,
      f_villageapp_id: null,
      f_role_id: null,
      villageapp_username: "",
      contact: "",
      isimportant: false,
      priority: "",
      f_user_id: "",
      f_elastic_id: "",

    },
    // validationSchema: schema,

    onSubmit: (values, { resetForm, setSubmitting }) => {
      setApiError(null);
      setSuccessMsg(null);

      try {
        if (editId !== null) {
          // setTableData(prev =>
          //   prev.map(d => (d.id === editId ? { ...values, id: editId } : d))
          // );
          // setEditId(null);
          updateUsers(values)
        } else {
          saveUsers(selectedUser)

          // const newId = tableData.length
          //   ? Math.max(...tableData.map(d => d.id)) + 1
          //   : 1;

          // setTableData(prev => [...prev, { ...values, id: newId }]);
        }

        resetForm();
        setShowForm(false);
        // setSuccessMsg(editId ? "Updated successfully" : "Added successfully");

      } catch {
        setApiError("Something went wrong");
      }

      setSubmitting(false);
    }
  });

  const handleEdit = (row: UserRow) => {
    console.log(row)
    setEditId(row.villageapp_userid);
    formik.setFieldValue("villageapp_userid", row.villageapp_userid);
    formik.setFieldValue("f_villageapp_id", villageAppData.find((v: any) => v.value === row.f_villageapp_id));
    formik.setFieldValue("f_role_id", roleData.find((r: any) => r.value === row.f_role_id));
    formik.setFieldValue("villageapp_username", row.villageapp_username);
    formik.setFieldValue("contact", row.contact);
    formik.setFieldValue("isimportant", row.isimportant);
    formik.setFieldValue("priority", row.priority);
    formik.setFieldValue("f_user_id", row.f_user_id);
    formik.setFieldValue("f_elastic_id", row.f_elastic_id);
    setSelectedRoleId(row.f_role_id)
    setShowForm(true);
  };


    async function deleteUsers(data:any) {
      console.log('data', data);
      setLoading(true);
      await http({
      method: 'POST',
      url: DELETE_VILLAGE_USERS,
      data,
      })
      .then(function(response) {
          if (response.status === 200) {
          toast(response.data.message, {
              position: 'top-right',
              type: 'success',
          });
          fetchData(initialRequest)
          } else {
          toast('Failed to Delete Users', {
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

  const handleDelete = (row: any) => {
    // setTableData(prev => prev.filter(d => d.id !== id));
    console.log(row)
    deleteUsers({villageapp_userid: row.villageapp_userid})
  };

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

  const roleFunc = (celldata: any) => {
        // console.log(celldata)
        return <span>
                <div>{roleData.find((r:any)=>r.value==celldata.row.original.f_role_id)?.label}</div>
                </span>
    }

  const columns = useMemo(
    () => [
      {
        header: 'Sl No',
        cell: (cell: any) => cell.row.index + 1,
        enableColumnFilter: false,
      },
      {
        header: 'Name',
        accessorKey: 'villageapp_username',
        enableColumnFilter: false,
      },
      {
        header: 'Contact',
        accessorKey: 'contact',
        enableColumnFilter: false,
      },
       {
        header: 'villageapp Name',
        accessorKey: 'villageapp_name',
        enableColumnFilter: false,
      },
      {
        header: 'Role Name',
        accessorKey: 'f_role_id',
        enableColumnFilter: false,
        cell: (cell: any) => roleFunc(cell),
      },
      // {
      //   header: 'Image',
      //   enableColumnFilter: false,
      //   cell: (cell: any) => {
      //     const file = cell.row.original.image;
      //     if (!file) return null;

      //     const url = URL.createObjectURL(file);

      //     return (
      //       <img
      //         src={url}
      //         width="40"
      //         alt="user"
      //         onLoad={() => URL.revokeObjectURL(url)}
      //       />
      //     );
      //   },
      // },
      // {
      //   header: 'Position',
      //   accessorKey: 'position',
      //   enableColumnFilter: false,
      // },
      {
        header: 'Important',
        enableColumnFilter: false,
        cell: (cell: any) =>
          cell.row.original.isImportant ? (
            <span className="badge bg-success">Yes</span>
          ) : (
            <span className="badge bg-secondary">No</span>
          ),
      },
      {
        header: 'Actions',
        enableColumnFilter: false,
        cell: (cell: any) => {
          const row = cell.row.original;

          return (
            <div className="d-flex gap-2">
              <Button
                size="sm"
                color="soft-warning"
                onClick={() => handleEdit(row)}
              >
                Edit
              </Button>

              <Button
                size="sm"
                color="soft-danger"
                onClick={() => handleDelete(row)}
              >
                Delete
              </Button>
            </div>
          );
        },
      },
    ],
    [data]
  );



    async function returnFunc(data:any) {

      if(editId==null){
          let revisedData = data.map((item:any)=>{
          return {
            "villageapp_username": item.Name,
            "contact": item.contact,
            "priority": "10",
            "isimportant": false,
            "f_role_id": roleData.length>0?roleData.find((role) => role.label === "Unauthorised User")?? "":"",
            "f_user_id": item.f_user_id,
            "f_elastic_id": item.f_elastic_id,
            "f_villageapp_id": formik.values.f_villageapp_id
          }
        })
        setSelectedUser([...selectedUser,...revisedData])

      }else{
        formik.setFieldValue("f_user_id",data.f_user_id)

      }


      setShowModal(!showModal);
  }

  return (
    <div className="page-content">
      <div className="container-fluid">

        <Row>
          <Col xs="12">
            <div className="page-title-box d-flex justify-content-between">
              <h4>Users Details</h4>

              <Breadcrumb>
                <BreadcrumbItem>
                  <Link to="/villageapp">VillageApp</Link>
                </BreadcrumbItem>
                <BreadcrumbItem active>Users</BreadcrumbItem>
              </Breadcrumb>
            </div>
          </Col>
        </Row>

        {/* FORM */}
        {showForm && (
          <Card>
            <CardHeader><h4>User Form</h4></CardHeader>

            <CardBody>

              {apiError && <Alert color="danger">{apiError}</Alert>}
              {successMsg && <Alert color="success">{successMsg}</Alert>}

              <Form onSubmit={formik.handleSubmit}>
                <FormGroup>
                    <Label>Select Village App</Label>
                          <RSelect
                            name="f_villageapp_id"
                            id="f_villageapp_id"
                            value={formik.values.f_villageapp_id}
                            onChange={(ev: any) =>
                                formik.setFieldValue("f_villageapp_id", ev)
                            }
                            options={villageAppData}
                            placeholder="--Select Village--"
                            error={formik.errors.f_villageapp_id}
                            touched={formik.touched.f_villageapp_id}
                            isLoading={villageAppDataLoading}
                            isClearable
                            />
                        {formik.touched.f_villageapp_id &&
                            formik.errors.f_villageapp_id && (
                            <div className="text-danger">
                                {formik.errors.f_villageapp_id}
                            </div>
                            )}

                </FormGroup>
              
                  {
                    editId!==null?
                  <Col md="12">
                    <FormGroup>
                      <Label>Select Role</Label>
                          <RSelect
                            name="f_role_id"
                            id="f_role_id"
                            value={formik.values.f_role_id}
                            onChange={(ev: any) =>
                                formik.setFieldValue("f_role_id", ev)
                            }
                            options={roleData}
                            placeholder="--Select Village--"
                            error={formik.errors.f_role_id}
                            touched={formik.touched.f_role_id}
                            isLoading={roleLoading}
                            isClearable
                            />
                        {formik.touched.f_role_id &&
                            formik.errors.f_role_id && (
                            <div className="text-danger">
                                {formik.errors.f_role_id}
                            </div>
                            )}

                </FormGroup>
                <FormGroup>
                  <Label>Name</Label>
                  <Input name="villageapp_username" value={formik.values.villageapp_username} onChange={formik.handleChange} />
                </FormGroup>
                {
                  (selectedRoleId!=formik.values.f_role_id?.value)&&
                  <FormGroup>
                    <Label>Users <UserSearch onClick={()=>addToggle()}/></Label>
                    <Input name="f_user_id" value={formik.values.f_user_id} onChange={formik.handleChange} />
                  </FormGroup>
                  }
                <FormGroup>
                  <Label>Contact</Label>
                  <Input name="contact" value={formik.values.contact} onChange={formik.handleChange} />
                </FormGroup>

                <FormGroup>
                  <Label>Priority</Label>
                  <Input name="priority" value={formik.values.priority} onChange={formik.handleChange} />
                </FormGroup>

                <FormGroup check className="mb-3">
                  <Input
                    type="checkbox"
                    name="isimportant"
                    checked={formik.values.isimportant}
                    onChange={formik.handleChange}
                  />
                  <Label check>Is Important</Label>
                </FormGroup>

                {/* <FormGroup>
                  <Label>Image</Label>
                  <Input
                    type="file"
                    onChange={(e: any) =>
                      formik.setFieldValue("image", e.target.files[0])
                    }
                  />
                </FormGroup> */}
                  </Col>:
                    <Col md="12">
                      <Label>Users <UserSearch onClick={()=>addToggle()}/></Label>
                      <div>
                      {
                          selectedUser.length>0?selectedUser.map((selecteduser:any)=>{
                              return <div>{selecteduser.f_elastic_id}&nbsp;&nbsp;{selecteduser.villageapp_username}</div>
                          }):"No User Selected"
                      }
                      </div>
                  </Col>

                   }
                <div className="d-flex gap-2 mt-3">
                    <Button 
                      color="soft-secondary" 
                      onClick={() => setShowForm(false)}>
                      Cancel
                    </Button>
                    <Button 
                      color="primary"
                      type="submit">
                      {editId!=null ? 'Update' : 'Submit'}
                    </Button>
                  </div>

          
              </Form>
            </CardBody>
          </Card>
        )}

        {/* TABLE */}
        {!showForm && (
          <Row>
            <Col md="12">
              <Card>
                <CardHeader className="d-flex justify-content-between">
                  <h4>Users List</h4>

                  <Button
                    color="soft-success"
                    size="sm"
                    onClick={() => {
                      formik.resetForm();
                      setEditId(null);
                      setShowForm(true);
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
                              isGlobalFilter={false}
                              page={page}
                              sorting={sorting}
                              setSorting={setSorting}
                              sizePerPage={sizePerPage}
                              clickable={false}
                              totalCount={totalCount}
                              handleTableChange={handleTableChange}
                              loading={loading}
                              rowIdKey="SerialNo" 
                          />:"Loading..."}
                </CardBody>
              </Card>
            </Col>
          </Row>
        )}

  {showModal&&<UserModal
                isShowing={showModal}
                hide={toggle}
                name="Users"
                style={{ maxWidth: '80%', height: 'auto' }}
                loading={loading}
                setLoading={setLoading}
                modal={showModal}
                toggle={toggle}
                >
                <UserList 
                    returnFunc={(ev:any)=>returnFunc(ev)}
                    formik_values={formik.values}
                    requestType={editId!=null?"mysql":"elastic"}
                    />

                </UserModal>
                }

      </div>
    </div>
  );
};

export default Users;