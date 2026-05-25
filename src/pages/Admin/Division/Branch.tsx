import React, { useMemo, useState,useEffect } from "react";
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
import ListBranch from "./ListBranch";
import RSelect from '../../../Components/Common/RSelect/RSelect';
import md from '../../../http/masterData';
import { toast } from 'react-toastify';
import { http, ADD_BRANCH,UPDATE_BRANCH,DELETE_BRANCH } from '../../../http/http';
interface KeyValue{
    value:string;
    label:string;
  };
interface BranchRow {
  branch_id: number;
  state:KeyValue | null,
  district:KeyValue | null,
  region:KeyValue | null,
  area: string;
  branch: string;
  geoarea: File | null;
  addAllBranch: boolean;
}

const schema = Yup.object({
  state: Yup.object(),
  district: Yup.object(),
  region: Yup.object(),
  area: Yup.object().required("Required"),
  branch: Yup.string().required("Required"),
  geoarea: Yup.mixed().nullable(),
  addAllBranch: Yup.boolean(),
});

const Branch = () => {
  const [data, setData] = useState<BranchRow[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [sizePerPage, setSizePerPage] = useState(10);
  const [sorting, setSorting] = useState<
    SortTanstackInterface[]
  >([]);

  const [geoPreview, setGeoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
    const [stateData,setStateData]=useState([]);
  const [districtData,setDistrictData]=useState([]);
  const [regionData,setRegionData]=useState([]);
  const [areaData,setAreaData]=useState([]);
  const [stateLoading,setStateLoading]=useState(false);
  const [districtLoading,setDistrictLoading]=useState(false);
  const [regionLoading,setRegionLoading]=useState(false);
  const [areaLoading,setAreaLoading]=useState(false);
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
  

  async function deleteBranch(branch_id:any) {
         setLoading(true);
         await http({
           method: 'DELETE',
           url: DELETE_BRANCH+'/'+branch_id
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


    async function updateBranch(data:any) {
      console.log('data', data);
      setLoading(true);
      await http({
        method: 'PUT',
        url: UPDATE_BRANCH+'/'+data.branch_id,
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

      async function addNewBranch(data:any) {
        setLoading(true)
        await http({
          method: 'POST',
          url: ADD_BRANCH,
          data: data,
        })
          .then(function (response) {
            if (response.status === 200) {
              console.log(response.data)
    
              toast(response.data.message, { position: 'top-right', type: 'success' });
    
            }
            else {
              toast("Failed to Add State", { position: 'top-right', type: 'error' });
            }
            setLoading(false)
          })
          .catch(err => {
            toast(err, { position: 'top-right', type: 'error' });
            setLoading(false)
          });
      }

  const formik = useFormik<BranchRow>({
    initialValues: {
      branch_id: 0,
      state:null,
      district:null,
      region:null,
      area: "",
      branch: "",
      geoarea: null,
      addAllBranch: false,
    },

    validationSchema: schema,

    onSubmit: (values, { resetForm }) => {
       if (editId) {
        // setData(data.map(d => d.id === editId ? { ...values, id: editId } : d));
        // addNewState(values);
        updateBranch(values)
        setEditId(null);
      } else {
        addNewBranch(values);
      }

      setSuccessMsg("Saved Successfully");

      resetForm();
      setGeoPreview(null);
      setShowForm(false);
    },
  });

  const handleEdit = (row: BranchRow) => {
     setEditId(row.branch_id);
    let selectedRow=JSON.parse(JSON.stringify(row))
    let selectedState=stateData.find((sd:any)=>sd.label==row.state)
    let selectedDistrict=districtData.find((sd:any)=>sd.label==row.district)
    let selectedRegion=regionData.find((sd:any)=>sd.label==row.region)
    let selectedArea=areaData.find((sd:any)=>sd.label==row.area)
 

    selectedRow.state=selectedState;
    selectedRow.district=selectedDistrict;
    selectedRow.region=selectedRegion;
    selectedRow.area=selectedArea;
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

  const handleDelete = (branch_id: number) => {
        deleteBranch(branch_id)
  };


  return (
    <div className="page-content">
      <div className="container-fluid">
        {/* FORM */}
        {showForm && (
          <Card>

            <CardHeader>
              <h4>Branch Form</h4>
            </CardHeader>

            <CardBody>

              {successMsg && (
                <Alert color="success">
                  {successMsg}
                </Alert>
              )}

              <Form onSubmit={formik.handleSubmit}>
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

                {/* AREA */}
                <FormGroup>

                  <Label>Area</Label>
                    <RSelect
                        name="area"
                        id="area"
                        value={formik.values.area}
                        onChange={(ev: any) =>
                          formik.setFieldValue("area", ev)
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

                {/* BRANCH */}
                <FormGroup>

                  <Label>Branch</Label>

                       <Input
                          type="text"
                          name="branch"
                          value={formik.values.branch}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          invalid={
                            formik.touched.branch &&
                            !!formik.errors.branch
                          }
                        />
      
                        {formik.touched.branch &&
                          formik.errors.branch && (
                            <div className="text-danger">
                              {formik.errors.branch}
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

                        const file =
                          e.target.files[0];

                        if (file) {

                          formik.setFieldValue(
                            "geoarea",
                            file
                          );

                          setGeoPreview(
                            URL.createObjectURL(
                              file
                            )
                          );
                        }
                      }}
                    />
                  )}

                  {formik.touched.geoarea &&
                    formik.errors.geoarea && (
                      <div className="text-danger">
                        {
                          formik.errors
                            .geoarea as string
                        }
                      </div>
                    )}

                </FormGroup>

                {/* BOOLEAN */}
                <FormGroup check>

                  <Label check>

                    <Input
                      type="checkbox"
                      name="addAllBranch"
                      checked={
                        formik.values
                          .addAllBranch
                      }
                      onChange={
                        formik.handleChange
                      }
                    />

                    {" "}
                    Add All Branch

                  </Label>

                </FormGroup>

                {/* BUTTONS */}
                <div className="d-flex gap-2 mt-3">

                  <Button
                    color="soft-secondary"
                    type="button"
                    onClick={() =>
                      setShowForm(false)
                    }
                  >
                    Cancel
                  </Button>

                  <Button
                    color="primary"
                    type="submit"
                  >
                    {editId
                      ? "Update"
                      : "Submit"}
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

                  <h4>Branch List</h4>

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

                 {!loading?<ListBranch
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

export default Branch;