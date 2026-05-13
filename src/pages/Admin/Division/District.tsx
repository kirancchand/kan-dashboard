import React, { useEffect, useMemo, useState } from "react";
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
} from "reactstrap";
import { Link } from "react-router-dom";
import { TableContainer } from "../../../common/AnalyticsTable/TableContainerReactTable";
import { useFormik } from "formik";
import * as Yup from "yup";
import { SortTanstackInterface } from '../../../Typecomponents/ComponentsType';
import ListDistrict from "./ListDistrict";
import { toast } from 'react-toastify';
import md from '../../../http/masterData';
import { http, ADD_DISTRICT,UPDATE_DISTRICT,DELETE_DISTRICT } from '../../../http/http';
import { Formik, Field, ErrorMessage } from 'formik';
import RSelect from '../../../Components/Common/RSelect/RSelect';

interface KeyValue{
    value:string;
    label:string;
  };
interface DistrictRow {
  district_id: number;
  district: string;
  state: KeyValue | null;
  geoarea: File | null;
  addAllDistrict: boolean;
}

const schema = Yup.object({
  district: Yup.string().required("Required"),
  state: Yup.object()
  .nullable()
  .required("Required"),
  geoarea: Yup.mixed().nullable(),
  addAllDistrict: Yup.boolean(),
});

const District = () => {
  const [data, setData] = useState<DistrictRow[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [sizePerPage, setSizePerPage] = useState(10);
  const [sorting, setSorting] = useState<SortTanstackInterface[]>([]);
  const [stateLoading,setStateLoading]=useState(false);
  const [stateData,setStateData]=useState([]);
  const [geoPreview, setGeoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

   useEffect(()=>{
     async function getState() {
       setStateLoading(true);
       md('getAll_State')
         .then((r:any) => {
           setStateData(r);
           setStateLoading(false);
         }).catch((error:any) => {
           toast(error, { position: 'top-right', type: 'error' });
           setStateLoading(false);
         });
     }
 
     getState()
   },[])

       async function updateDistrict(data:any) {
         console.log('data', data);
         setLoading(true);
         await http({
           method: 'PUT',
           url: UPDATE_DISTRICT+'/'+data.district_id,
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
   
       async function deleteDistrict(district_id:any) {
         setLoading(true);
         await http({
           method: 'DELETE',
           url: DELETE_DISTRICT+'/'+district_id
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


       async function addNewDistrict(data:any) {
            console.log('data', data);
            setLoading(true);
            await http({
              method: 'POST',
              url: ADD_DISTRICT,
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


  const formik = useFormik<DistrictRow>({
    initialValues: {
      district_id: 0,
      district: "",
      state:  null,
      geoarea: null,
      addAllDistrict: false,
    },

    validationSchema: schema,

    onSubmit: (values, { resetForm }) => {
       if (editId) {
        // setData(data.map(d => d.id === editId ? { ...values, id: editId } : d));
        // addNewState(values);
        updateDistrict(values)
        setEditId(null);
      } else {
        addNewDistrict(values);
      }

      setSuccessMsg("Saved Successfully");

      resetForm();
      setGeoPreview(null);
      setShowForm(false);
    },
  });

  const handleEdit = (row: DistrictRow) => {
    setEditId(row.district_id);
    let selectedRow=JSON.parse(JSON.stringify(row))
    let selectedState=stateData.find((sd:any)=>sd.label==row.state)
    selectedRow.state=selectedState;
    formik.setValues({
      ...selectedRow,
      geoarea: null,
    });

    if (selectedRow.geoarea) {
      setGeoPreview(URL.createObjectURL(selectedRow.geoarea));
    } else {
      setGeoPreview(null);
    }

    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    deleteDistrict(id)
  };



  return (
    <div className="page-content">
      <div className="container-fluid">
        {/* FORM */}
        {showForm && (
          <Card>
            <CardHeader>
              <h4>District Form</h4>
            </CardHeader>

            <CardBody>

              {successMsg && (
                <Alert color="success">
                  {successMsg}
                </Alert>
              )}

              <Form onSubmit={formik.handleSubmit}>

                
                <FormGroup>
                  <Label>District</Label>

                  <Input
                    name="district"
                    value={formik.values.district}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    invalid={
                      formik.touched.district &&
                      !!formik.errors.district
                    }
                  />

                  {formik.touched.district &&
                    formik.errors.district && (
                      <div className="text-danger">
                        {formik.errors.district}
                      </div>
                    )}
                </FormGroup>

                {/* STATE */}
                <FormGroup>
                  <Label>State</Label>

                  <RSelect
                      name="state"
                      id="state"
                      value={formik.values.state}
                      onChange={(ev: any) =>
                        formik.setFieldValue("state", ev)
                      }
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

                {/* GEO AREA */}
                <FormGroup>
                  <Label>Geo Area</Label>

                  {geoPreview ? (
                    <div className="d-flex gap-2 align-items-center">

                      <a
                        href={geoPreview}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View Uploaded File
                      </a>

                      <Button
                        size="sm"
                        color="danger"
                        type="button"
                        onClick={() => {
                          setGeoPreview(null);
                          formik.setFieldValue(
                            "geoarea",
                            null
                          );
                        }}
                      >
                        X
                      </Button>
                    </div>
                  ) : (
                    <Input
                      type="file"
                      onChange={(e: any) => {
                        const file = e.target.files[0];

                        if (file) {
                          formik.setFieldValue(
                            "geoarea",
                            file
                          );

                          setGeoPreview(
                            URL.createObjectURL(file)
                          );
                        }
                      }}
                    />
                  )}

                  {formik.touched.geoarea &&
                    formik.errors.geoarea && (
                      <div className="text-danger">
                        {formik.errors.geoarea as string}
                      </div>
                    )}
                </FormGroup>

              
                <FormGroup check>
                  <Label check>
                    <Input
                      type="checkbox"
                      name="addAllDistrict"
                      checked={
                        formik.values.addAllDistrict
                      }
                      onChange={formik.handleChange}
                    />

                    {" "}
                    Add All District
                  </Label>
                </FormGroup>

                {/* BUTTONS */}
                <div className="d-flex gap-2 mt-3">

                  <Button
                    color="soft-secondary"
                    type="button"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </Button>

                  <Button
                    color="primary"
                    type="submit"
                  >
                    {editId ? "Update" : "Submit"}
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
                  <h4>List District</h4>

                  <Button
                    color="soft-success"
                    size="sm"
                    onClick={() => {
                      formik.resetForm();
                      setGeoPreview(null);
                      setEditId(null);
                      setShowForm(true);
                    }}
                  >
                    + Add New
                  </Button>
                </CardHeader>

                <CardBody>
                    {!loading?<ListDistrict
                                handleEdit={handleEdit}
                                handleDelete={handleDelete}
                                />:"loading.."}
                </CardBody>

              </Card>
            </Col>
          </Row>
        )}

      </div>
    </div>
  );
};

export default District;