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



interface OrgMember {
  area: KeyValue | null;
  branch: KeyValue | null;
  userId:string;
  role:KeyValue | null;
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
    const [areaLoading, setAreaLoading] = useState(false);
    const [areaData, setAreaData] = useState([]);
    const [branchLoading, setBranchLoading] = useState(false);
    const [branchData, setBranchData] = useState([]);
    const [statusLoading, setStatusLoading] = useState(false);
    const [statusData, setStatusData] = useState([]);
    const [roleData,setRoleData]=useState([]);
    const [roleLoading,setRoleLoading]=useState(false);
    const [userIdData,setUserIdData]=useState([]);
    const [userIdLoading,setUserIdLoading]=useState(false);


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
        getArea()
        getRole()
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


    const [loading, setLoading] = useState(false);

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

    const formik = useFormik<OrgMember>({
        initialValues: {
          area:null,
          branch:null,
          userId:"",
          role:null,
          status:null,
          is_thepointofcontact:false,
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
        }
      });
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
                            <Col md="6">
                            <FormGroup>
                                <Label> Area</Label>
                                <RSelect
                                    name="area"
                                    id="area"
                                    value={formik.values.area}
                                    onChange={(ev: any) =>
                                        handleAreaChange( ev)
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
                            <Col md="6">
                                <FormGroup>
                                    <Label> Branch</Label>
                                <RSelect
                                    name="branch"
                                    id="branch"
                                    value={formik.values.branch}
                                    onChange={(ev: any) =>
                                        formik.setFieldValue("branch", ev)
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
                        </Row>
    
 
                     <FormGroup>
                        <Label>User</Label>
                         <RSelect
                                name="userId"
                                id="userId"
                                value={formik.values.userId}
                                onChange={(ev: any) =>
                                    formik.setFieldValue("userId", ev)
                                }
                                options={userIdData}
                                placeholder="--Select userId--"
                                error={formik.errors.userId}
                                touched={formik.touched.userId}
                                isLoading={userIdLoading}
                                isClearable
                                />
                            {formik.touched.userId &&
                                formik.errors.userId && (
                                <div className="text-danger">
                                    {formik.errors.userId}
                                </div>
                                )}
                    </FormGroup>
                    <Row> 
                          <Col md="6">
                            <FormGroup>
                                <Label>Role</Label>
                                 <RSelect
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
                                )}

                            </FormGroup>
                        </Col> 
                        <Col md="6">
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
                           

                    </Row>
                   
                 
                   
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
    
                    <div className="d-flex gap-2 mt-3">
                        <Button color="soft-secondary" onClick={() => setRespValue({
                                    nav:"OrganisationMember",
                                    mode:"",
                                    data:null,
                                    origin:"OrganisationMember",
                                    title:"Organisation Member"
                                    })}>
                        Cancel
                        </Button>
                        <Button color="primary" type="submit">
                        {editId ? 'Update' : 'Submit'}
                        </Button>
                    </div>
                    </Form>
                </CardBody>
                </Card>
            </div>
        </React.Fragment>
    );
}

export default RegisterOrganisationMember