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
import ListArea from "./ListArea";
import RSelect from '../../../Components/Common/RSelect/RSelect';
import md from '../../../http/masterData';
import { toast } from 'react-toastify';
import { http, ADD_AREA,UPDATE_AREA,DELETE_AREA } from '../../../http/http';
interface KeyValue{
    value:string;
    label:string;
  };
interface AreaRow {
  area_id: number;
  region: KeyValue | null;
  localbodytype: KeyValue | null;
  area: string;
  geoarea: File | null;
  addAllLocalBody: boolean;
}

const schema = Yup.object({
  region: Yup.object().required("Required"),
  localbodytype: Yup.object().required("Required"),
  area: Yup.string().required("Required"),
  geoarea: Yup.mixed().nullable(),
  // .required("Required"),
  addAllLocalBody: Yup.boolean(),
});

const Area = () => {

  const [data, setData] = useState<AreaRow[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [sizePerPage, setSizePerPage] = useState(10);
  const [sorting, setSorting] = useState<SortTanstackInterface[]>([]);

  const [geoPreview, setGeoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
    const [regionData,setRegionData]=useState([]);
  const [localbodytypeData,setLocalbodytypeData]=useState([]);
  const [stateLoading,setStateLoading]=useState(false);
  const [districtLoading,setDistrictLoading]=useState(false);
  const [regionLoading,setRegionLoading]=useState(false);
  const [localbodytypeLoading,setLocalbodytypeLoading]=useState(false);

  const [regions] = useState([
    { id: "1", name: "South Region" },
    { id: "2", name: "North Region" },
    { id: "3", name: "Central Region" },
  ]);

  const [localBodyTypes] = useState([
    { id: "1", name: "Panchayat" },
    { id: "2", name: "Municipality" },
    { id: "3", name: "Corporation" },
  ]);

  const handleTableChange = ({ page, sizePerPage }: any) => {
    setPage(page);
    setSizePerPage(sizePerPage);
  };

  async function addNewArea(data:any) {
      console.log('data', data);
      setLoading(true);
      await http({
        method: 'POST',
        url: ADD_AREA,
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


    async function updateArea(data:any) {
      console.log('data', data);
      setLoading(true);
      await http({
        method: 'PUT',
        url: UPDATE_AREA+'/'+data.area_id,
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

  const formik = useFormik<AreaRow>({
    initialValues: {
      area_id: 0,
      region: null,
      localbodytype: null,
      area: "",
      geoarea: null,
      addAllLocalBody: false,
    },

    validationSchema: schema,

    onSubmit: (values, { resetForm }) => {

       if (editId) {
        // setData(data.map(d => d.id === editId ? { ...values, id: editId } : d));
        // addNewState(values);
        updateArea(values)
        setEditId(null);
      } else {
        addNewArea(values);
      }

      setSuccessMsg("Saved Successfully");

      resetForm();
      setGeoPreview(null);
      setShowForm(false);
    },
  });

  // const handleEdit = (row: AreaRow) => {

  //   setEditId(row.area);

  //   formik.setValues({
  //     ...row,
  //     geoarea: null,
  //   });

  //   if (row.geoarea) {
  //     setGeoPreview(
  //       URL.createObjectURL(row.geoarea)
  //     );
  //   } else {
  //     setGeoPreview(null);
  //   }

  //   setShowForm(true);
  // };

  // const handleDelete = (id: number) => {
  //   setData(data.filter((d) => d.id !== id));
  // };

  async function deleteArea(area_id:any) {
       setLoading(true);
       await http({
         method: 'DELETE',
         url: DELETE_AREA+'/'+area_id
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
  

  const handleEdit = (row: AreaRow) => {
    setEditId(row.area_id);
    let selectedRow=JSON.parse(JSON.stringify(row))
    let selectedRegion=regionData.find((sd:any)=>sd.label==row.region)
    let selectedLocalbodytype=localbodytypeData.find((sd:any)=>sd.label==row.localbodytype)

    selectedRow.region=selectedRegion;
    selectedRow.localbodytype=selectedLocalbodytype;
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

  const handleDelete = (area_id: number) => {
    deleteArea(area_id)
  };

  const columns = useMemo(
    () => [
      {
        header: "Sl No",
        enableColumnFilter: false,
        cell: (cell: any) =>
          cell.row.index + 1,
      },

      {
        header: "Region",
        enableColumnFilter: false,
        accessorKey: "region",
      },

      {
        header: "Local Body Type",
        enableColumnFilter: false,
        accessorKey: "localbodytype",
      },

      {
        header: "Area",
        enableColumnFilter: false,
        accessorKey: "area",
      },

      {
        header: "Geo Area",
        enableColumnFilter: false,
        cell: (cell: any) => {

          const file =
            cell.row.original.geoarea;

          return file ? (
            <a
              href={URL.createObjectURL(file)}
              target="_blank"
              rel="noreferrer"
            >
              View File
            </a>
          ) : null;
        },
      },

      {
        header: "Add All Local Body",
        enableColumnFilter: false,
        cell: (cell: any) =>
          cell.row.original.addAllLocalBody
            ? "Yes"
            : "No",
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
                  handleDelete(row.area_id)
                }
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
    async function getLocalbodytype() {
      setLocalbodytypeLoading(true);
      md('getAll_Localbodytype')
        .then((r) => {
          setLocalbodytypeData(r);
          setLocalbodytypeLoading(false);
        }).catch((error) => {
          toast(error, { position: 'top-right', type: 'error' });
          setLocalbodytypeLoading(false);
        });
    }

    useEffect(()=>{
      getRegion({
      "requestName": "getAll_RegionByDistrict",
      "params":[
        {
          "paramValue":4,
          "paramEncrypted": "Y"
        }
      ]
    })
      getLocalbodytype()
    },[])

  return (
    <div className="page-content">
      <div className="container-fluid">

        {/* FORM */}
        {showForm && (

          <Card>

            <CardHeader>
              <h4>Area Form</h4>
            </CardHeader>

            <CardBody>

              {successMsg && (
                <Alert color="success">
                  {successMsg}
                </Alert>
              )}

              <Form onSubmit={formik.handleSubmit}>

                {/* REGION */}
                <FormGroup>

                  <Label>Region</Label>

                   <RSelect
                      name="region"
                      id="region"
                      value={formik.values.region}
                      onChange={(ev: any) =>
                        formik.setFieldValue("region", ev)
                      }
                      options={regionData}
                      placeholder="--Select State--"
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

                {/* LOCAL BODY TYPE */}
                <FormGroup>

                  <Label>
                    Local Body Type
                  </Label>

                   <RSelect
                      name="localbodytype"
                      id="localbodytype"
                      value={formik.values.localbodytype}
                      onChange={(ev: any) =>
                        formik.setFieldValue("localbodytype", ev)
                      }
                      options={localbodytypeData}
                      placeholder="--Select State--"
                      error={formik.errors.localbodytype}
                      touched={formik.touched.localbodytype}
                      isLoading={localbodytypeLoading}
                      isClearable
                    />
                  {formik.touched.localbodytype &&
                    formik.errors.localbodytype && (
                      <div className="text-danger">
                        {formik.errors.localbodytype}
                      </div>
                    )}

                </FormGroup>

                {/* AREA */}
                <FormGroup>

                  <Label>Area</Label>

                  <Input
                    type="text"
                    name="area"
                    value={formik.values.area}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    invalid={
                      formik.touched.area &&
                      !!formik.errors.area
                    }
                  />

                  {formik.touched.area &&
                    formik.errors.area && (
                      <div className="text-danger">
                        {formik.errors.area}
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
                      name="addAllLocalBody"
                      checked={
                        formik.values
                          .addAllLocalBody
                      }
                      onChange={
                        formik.handleChange
                      }
                    />

                    {" "}
                    Add All Local Body

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

                  <h4>Area List</h4>

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

                    {!loading?<ListArea
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

export default Area;