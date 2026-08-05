import React, { useEffect, useMemo, useState } from 'react';
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
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { SortInterface, SortTanstackInterface } from '../../../Typecomponents/ComponentsType';
import OrganisationModal from './OrganisationModal';
import OrganisationList from './OrganisationList';
import {House} from 'lucide-react';
import RSelect from 'Components/Common/RSelect/RSelect';
import { toast } from 'react-toastify';
import { ADD_VILLAGE_ORGANISATION,DELETE_VILLAGE_ORGANISATION,GET_VILLAGE_ORGANISATION, MD_URL, UPDATE_VILLAGE_ORGANISATION } from '../Api';
import mdurl from '../../../http/masterDataURL';
import { http } from 'http/http';
import { update } from 'lodash';
import row from 'gridjs/dist/src/row';
interface OrgRow {
  villageorganisation_id: number;
  organisation_name: string;
  organisation_type: string;
  f_organisation_id: string;
  f_villageapp_id: number;
  isemergency: boolean;
  priority: number;
  contact: string;
  owner: string;
}

const schema = Yup.object({
  name: Yup.string().required("Required"),
  owner: Yup.string().required("Required"),
  location: Yup.string().required("Required"),
  contact: Yup.string().required("Required"),
  idnumber: Yup.string().required("Required"),
});

const Organizations = () => {

  const [data, setData] = useState<OrgRow[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [sizePerPage, setSizePerPage] = useState(10);
  const [sorting, setSorting] = useState<SortTanstackInterface[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrganisation, setSelectedOrganisation] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [villageAppData,setVillageAppData]=useState([])
  const [villageAppDataLoading,setVillageAppDataLoading]=useState(false)
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
              const response = await http.post(GET_VILLAGE_ORGANISATION, requestdata);
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

  const toggle = () => {
      setShowModal(!showModal);
      if (showModal) {
          setSelectedOrganisation([]);
      }
  };

  const addToggle = () => {
      setShowModal(!showModal);
  };

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
    fetchVillageApps()
    fetchData(initialRequest);
  },[])
  

    async function addOrganisation(data:any) {
        console.log('data', data);
        setLoading(true);
        await http({
          method: 'POST',
          url: ADD_VILLAGE_ORGANISATION,
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
          method: 'POST',
          url: UPDATE_VILLAGE_ORGANISATION,
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

  const formik = useFormik<OrgRow>({
    initialValues: {
      villageorganisation_id: 0,
      organisation_name: '',
      organisation_type: '',
      f_organisation_id: '',
      f_villageapp_id: 0,
      isemergency: false,
      priority: 0,
      contact: '',
      owner: '',
    },
    // validationSchema: schema,

    onSubmit: (values, { resetForm }) => {
      if (editId) {
        updateOrganisation(values)
      } else {
        addOrganisation(values)
      }

      resetForm();
      setShowForm(false);
    }
  });


    async function deleteUsers(data:any) {
      console.log('data', data);
      setLoading(true);
      await http({
      method: 'POST',
      url: DELETE_VILLAGE_ORGANISATION,
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
    
    const handleEdit = (row: any) => {
    console.log(row)
    setEditId(row.villageorganisation_id);
    formik.setFieldValue("villageorganisation_id", row.villageorganisation_id);
    formik.setFieldValue("organisation_name", row.organisation_name);
    formik.setFieldValue("organisation_type",row.organisation_type);
    formik.setFieldValue("f_organisation_id", row.f_organisation_id);
    formik.setFieldValue("f_villageapp_id", villageAppData.find((v: any) => v.value === row.f_villageapp_id));
    formik.setFieldValue("isemergency", row.isemergency);
    formik.setFieldValue("priority", row.priority);
    formik.setFieldValue("contact", row.contact);
    formik.setFieldValue("owner", row.owner);
    setShowForm(true);
  };

  const handleDelete = (row: any) => {
     deleteUsers({villageorganisation_id: row.villageorganisation_id})
  };

    const serialNo = (celldata: any) => {
        return <span>{((page - 1) * sizePerPage) + (Number(celldata.row.index) + 1)}</span>
    }

  const columns = useMemo(
    () => [
      {
        header: 'Sl No',
        enableColumnFilter: false,
        cell: (cell: any) => serialNo(cell),
      },
      {
        header: 'Name',
        accessorKey: 'organisation_name',
        enableColumnFilter: false,
      },
      {
        header: 'Owner Name',
        accessorKey: 'owner',
        enableColumnFilter: false,
      },
      {
        header: 'Contact',
        accessorKey: 'contact',
        enableColumnFilter: false,
      },
       {
        header: 'Is Emergency Service',
        accessorKey: 'isemergency',
        enableColumnFilter: false,
      },
      {
        header: 'Priority',
        accessorKey: 'priority',
        enableColumnFilter: false,
      },
      {
        header: 'Actions',
        cell: (cell: any) => {
          const row = cell.row.original;
          return (
            <div className="d-flex gap-2">
              <Button size="sm" color="warning" onClick={() => handleEdit(row)}>
                Edit
              </Button>
              <Button size="sm" color="danger" onClick={() => handleDelete(row)}>
                Delete
              </Button>
            </div>
          );
        },
      },
    ],
    [data]
  );
  const sortedData = useMemo(() => {
  return [...data].sort((a, b) => b.priority - a.priority);
}, [data]);
  
async function returnFunc(data:any) {
            console.log(data)
            formik.setFieldValue("organisation_name",data.organisation);
            formik.setFieldValue("organisation_type",data.organisation_type);
            formik.setFieldValue("f_organisation_id",data.organisation_id);
            formik.setFieldValue("contact",data.contact);
            formik.setFieldValue("owner",data.ownerName);
            setShowModal(!showModal);
        }


  return (
    <div className="page-content">
      <div className="container-fluid">

        {/* HEADER */}
        <Row>
          <Col xs="12">
            <div className="page-title-box d-flex justify-content-between">
              <h4>Organizations</h4>

              <Breadcrumb>
                <BreadcrumbItem>
                  <Link to="/villageapp">VillageApp</Link>
                </BreadcrumbItem>
                <BreadcrumbItem active>
                   Organizations
                </BreadcrumbItem>
              </Breadcrumb>
            </div>
          </Col>
        </Row>

        {/* FORM */}
        {showForm && (
          <Card>
            <CardHeader>
              <h4>Organization Form</h4>
            </CardHeader>

            <CardBody>
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
                <Col md="12">
                    <Label>Organisations <House onClick={()=>addToggle()}/></Label>
                    <div>
                    {/* {
                        selectedOrganisation.length>0?selectedOrganisation.map((selectedorg:any)=>{
                            return <div>{selectedorg.f_organisation_id}&nbsp;&nbsp;{selectedorg.name}</div>
                        }):"No Organisation Selected"
                    } */}
                    </div>
                </Col>
                <FormGroup>
                  <Label>Name</Label>
                  <Input name="organisation_name" value={formik.values.organisation_name} disabled/>
                </FormGroup>

                <FormGroup>
                  <Label>Owner</Label>
                  <Input name="owner" value={formik.values.owner} disabled/>
                </FormGroup>

                {/* <FormGroup>
                  <Label>Location</Label>
                  <Input name="location" onChange={formik.handleChange} value={formik.values.location} />
                </FormGroup> */}

                <FormGroup>
                  <Label>Contact</Label>
                  <Input name="contact" onChange={formik.handleChange} value={formik.values.contact} />
                </FormGroup>

                {/* <FormGroup>
                  <Label>Category ID</Label>
                  <Input name="idnumber" onChange={formik.handleChange} value={formik.values.idnumber} />
                </FormGroup> */}
                <FormGroup>
                  <Label>Priority</Label>
                  <Input name="priority" type="number" onChange={formik.handleChange} value={formik.values.priority}/>
              </FormGroup>
               <Col md="12">
                <div>
                    <FormGroup switch>
                            <Input
                                type="checkbox"
                                role="switch"
                                name="isemergency"
                                checked={formik.values.isemergency}
                                onChange={formik.handleChange}
                            />

                            <Label check className="ms-2">
                                {formik.values.isemergency
                                ? "Emergency Service"
                                : "Not an Emergency Service"}
                            </Label>
                            </FormGroup>
                </div>
            </Col>

                <div className="d-flex gap-2 mt-3">
                  <Button color="soft-secondary" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                  <Button color="primary" type="submit">
                    {editId ? 'Update' : 'Submit'}
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
                  <h4>Organizations</h4>

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
                  
                  <TableContainer
                    columns={columns}
                    data={sortedData}
                    page={page}
                    sizePerPage={sizePerPage}
                    totalCount={data.length}
                    handleTableChange={handleTableChange}
                    sorting={sorting}
                    setSorting={setSorting}
                  />
                </CardBody>

              </Card>
            </Col>
          </Row>
        )}

      {showModal&&<OrganisationModal
                        isShowing={showModal}
                        hide={toggle}
                        name="Members"
                        style={{ maxWidth: '80%', height: 'auto' }}
                        loading={loading}
                        setLoading={setLoading}
                        modal={showModal}
                        toggle={toggle}
                        >
                        <OrganisationList 
                            returnFunc={(ev:any)=>returnFunc(ev)}
                            formik_values={formik.values}
                            
                            />

                        </OrganisationModal>
                        }

      </div>
    </div>
  );
};

export default Organizations;