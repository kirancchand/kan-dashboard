import React, { useMemo, useState, useEffect } from 'react'
import { TableContainer } from "../../../Responsive Table/TableContainerReactTable";
import { SortTanstackInterface } from '../../../Typecomponents/ComponentsType';
// import UsersFormModal from '../../UsersFormModal';
import { SortInterface } from '../../../Typecomponents/ComponentsType';
// import AddUserModal from '../../AddUserModal';
import { http, GET_ORGANISATION_LIST,ADD_ORGANISATION_MEMBER } from '../../../http/http';
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
import UserList from './UserList';
import {UserSearch} from 'lucide-react';
import UserModal from './UserModal';
interface DataItem {
    organisationtype_id: number;
    organisation: string;
    organisationtype:string;
    
}

interface KeyValue{
    value:string;
    label:string;
  };



interface OrgMember {
  organisation_id:number;
  area: KeyValue | null;
  branch: KeyValue | null;
  user_id:string|null;
  usertype:KeyValue | null;
  status:KeyValue | null;
  is_thepointofcontact:boolean;

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


const RegisterOrganisationMember = ({respValue,setRespValue}:any) => {
    const [mode, setMode] = useState("");
    const [editId, setEditId] = useState<number | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [statusLoading, setStatusLoading] = useState(false);
    const [statusData, setStatusData] = useState([]);
    const [userTypeLoading, setUserTypeLoading] = useState(false);
    const [userTypeData, setUserTypeData] = useState([]);
    const [userData,setUserData]=useState([]);
    const [userLoading,setUserLoading]=useState(false);
    const [selectedUser, setSelectedUser] = useState<any>([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const toggle = () => {
        setShowModal(!showModal);
        if (showModal) {
            setSelectedUser([]);
        }
    };

    const addToggle = () => {
        setShowModal(!showModal);
    };


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

    async function getUserType() {
      setUserTypeLoading(true);
      md('getAll_Usertype')
        .then((r) => {
          setUserTypeData(r);
          setUserTypeLoading(false);
        }).catch((error) => {
          toast(error, { position: 'top-right', type: 'error' });
          setUserTypeLoading(false);
        });
    }
    useEffect(()=>{
        getStatus()
        getUserType()
    },[])




  



    async function saveOrganisationMember(data:any) {
        console.log('data', data);
        setLoading(true);
        await http({
        method: 'POST',
        url: ADD_ORGANISATION_MEMBER,
        data,
        })
        .then(function(response) {
            if (response.status === 200) {
            console.log(response.data);
            formik.resetForm();
            setSelectedUser([]);
            setRespValue({
                        nav:"OrganisationMember",
                        mode:"",
                        data:respValue.data,
                        origin:"OrganisationMember",
                        title:"Organisation Member"
                        })
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

    const formik = useFormik<OrgMember>({
        initialValues: {
          organisation_id:respValue.data.organisation_id,
          area:null,
          branch:null,
          user_id:null,
          usertype:null,
          status:null,
          is_thepointofcontact:false,
        },
        // validationSchema: schema,
    
        onSubmit: (values, { resetForm }) => {
            console.log('Form values:', selectedUser);
            saveOrganisationMember(selectedUser)
        }
      });


        async function returnFunc(data:any) {
            console.log(data)
            setSelectedUser([...selectedUser,...data])
            setShowModal(!showModal);
            // formik.setFieldValue("f_organisation_id",1);
            // formik.setFieldValue("f_user_id",data.user_id);
            // formik.setFieldValue("role",data.role);
            // formik.setFieldValue("status",data.status);
            // formik.setFieldValue("f_elastic_id",data.user_id);
            // formik.setFieldValue("is_thepointofcontact",data.is_thepointofcontact);

            // formik.setFieldValue("user_id",data.user_id)
        //   setLoading(true);
        //   await http({
        //     method: 'POST',
        //     url: ADD_ORGANISATION,
        //     data,
        //   })
        //     .then(function(response) {
        //       if (response.status === 200) {
        //         console.log(response.data);
        //         toast(response.data.message, {
        //           position: 'top-right',
        //           type: 'success',
        //         });
        //       } else {
        //         toast('Failed to Add State', {
        //           position: 'top-right',
        //           type: 'error',
        //         });
        //       }
        //       setLoading(false);
        //     })
        //     .catch(err => {
        //       toast(err, { position: 'top-right', type: 'error' });
        //       setLoading(false);
        //     });
        }

console.log(formik.values)
    
    return (
        <React.Fragment>
            <div style={{ padding: '50px', marginTop: '50px' }}>
                <Card>
                <CardHeader>
                    <h4>Register Organisation Member</h4>
                </CardHeader>
    
                <CardBody>
                    {successMsg && <Alert color="success">{successMsg}</Alert>}
    
                    <Form onSubmit={formik.handleSubmit}>
                        <Row>
                            <Col md="4">
                                <FormGroup>
                                    <Row>
                                        <Col md="12">
                                            <div className='d-flex justify-content-between'>
                                                <Label >
                                                    User Type                    
                                                </Label>
                                                <FormGroup switch>
                                                        <Input
                                                            type="checkbox"
                                                            role="switch"
                                                            name="is_thepointofcontact"
                                                            checked={formik.values.is_thepointofcontact}
                                                            onChange={formik.handleChange}
                                                        />

                                                        <Label check className="ms-2">
                                                            {formik.values.is_thepointofcontact
                                                            ? "Point Of Contact"
                                                            : "Not the Point Of Contact"}
                                                        </Label>
                                                        </FormGroup>
                                            </div>
                                        </Col>
                                    </Row>


                                    <RSelect
                                        name="usertype"
                                        id="usertype"
                                        value={formik.values.usertype}
                                        onChange={(ev: any) =>
                                            formik.setFieldValue("usertype", ev)
                                        }
                                        options={userTypeData}
                                        placeholder="--Select usertype--"
                                        error={formik.errors.usertype}
                                        touched={formik.touched.usertype}
                                        isLoading={userTypeLoading}
                                        isClearable
                                        />
                                    {formik.touched.usertype &&
                                        formik.errors.usertype && (
                                        <div className="text-danger">
                                            {formik.errors.usertype}
                                        </div>
                                        )}
                                    {/* <RSelect
                                        name="role"
                                        id="role"
                                        value={formik.values.role}
                                        onChange={(ev: any) =>
                                            formik.setFieldValue("role", ev)
                                        }
                                        options={roleData}
                                        placeholder="--Select Role--"
                                        error={formik.errors.role}
                                        touched={formik.touched.role}
                                        isLoading={roleLoading}
                                        isClearable
                                    />
                                    {formik.touched.role &&
                                        formik.errors.role && (
                                        <div className="text-danger">
                                            {formik.errors.role}
                                        </div>
                                        )} */}

                                </FormGroup>
                            </Col> 
                            {/* <Col md="4">
                                    <FormGroup>
                                    <Label>User Type</Label>
                                    <RSelect
                                        name="usertype"
                                        id="usertype"
                                        value={formik.values.usertype}
                                        onChange={(ev: any) =>
                                            formik.setFieldValue("usertype", ev)
                                        }
                                        options={userTypeData}
                                        placeholder="--Select usertype--"
                                        error={formik.errors.usertype}
                                        touched={formik.touched.usertype}
                                        isLoading={userTypeLoading}
                                        isClearable
                                        />
                                    {formik.touched.usertype &&
                                        formik.errors.usertype && (
                                        <div className="text-danger">
                                            {formik.errors.usertype}
                                        </div>
                                        )}

                                </FormGroup>
                            </Col> */}
                            <Col md="4">
                                    <FormGroup>
                                    <Label>Status</Label>
                                    <RSelect
                                        name="status"
                                        id="orgstatus"
                                        value={formik.values.status}
                                        onChange={(ev: any) =>
                                            formik.setFieldValue("status", ev)
                                        }
                                        options={statusData}
                                        placeholder="--Select status--"
                                        error={formik.errors.status}
                                        touched={formik.touched.status}
                                        isLoading={statusLoading}
                                        isClearable
                                        />
                                    {formik.touched.status &&
                                        formik.errors.status && (
                                        <div className="text-danger">
                                            {formik.errors.status}
                                        </div>
                                        )}

                                </FormGroup>
                            </Col>
                            <Col md="12">
                                <Label>Users <UserSearch onClick={()=>addToggle()}/></Label>
                                <div>
                                {
                                    selectedUser.length>0?selectedUser.map((selecteduser:any)=>{
                                        return <div>{selecteduser.f_user_id}&nbsp;&nbsp;{selecteduser.name}</div>
                                    }):"No User Selected"
                                }
                                </div>
                            </Col>
                            <Col md="12">
                                <div className="d-flex justify-content-end gap-2 mt-3">
                                <Button color="soft-secondary" onClick={() => setRespValue({
                                            nav:"OrganisationMember",
                                            mode:"",
                                            data:respValue.data,
                                            origin:"OrganisationMember",
                                            title:"Organisation Member"
                                            })}>
                                Cancel
                                </Button>
                                <Button color="primary" type="submit">
                                {editId ? 'Update' : 'Submit'}
                                </Button>
                            </div>
                            </Col>
                    <FormGroup>

                         {showModal&&<UserModal
                            isShowing={showModal}
                            hide={toggle}
                            name="Members"
                            style={{ maxWidth: '80%', height: 'auto' }}
                            loading={loading}
                            setLoading={setLoading}
                            modal={showModal}
                            toggle={toggle}
                            >
                            <UserList 
                                returnFunc={(ev:any)=>returnFunc(ev)}
                                formik_values={formik.values}
                                
                                />

                            </UserModal>
                            }


                    </FormGroup>

                    </Row>
                   
                 
                   

    
                    
                    </Form>
                </CardBody>
                </Card>
            </div>
        </React.Fragment>
    );
}

export default RegisterOrganisationMember