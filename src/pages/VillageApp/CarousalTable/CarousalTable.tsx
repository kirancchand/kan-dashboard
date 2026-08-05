import React, { useMemo, useState,useEffect } from 'react';
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
  FormFeedback,
  Button,
  Breadcrumb,
  BreadcrumbItem,
  Spinner,
  Badge
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { TableContainer } from '../../../common/AnalyticsTable/TableContainerReactTable';
import { SortTanstackInterface,SortInterface } from '../../../Typecomponents/ComponentsType';
import RSelect from '../../../Components/Common/RSelect/RSelect';
import { http } from '../../../http/http';
import { ADD_VILLAGE_CAROUSEL,GET_VILLAGE_CAROUSEL,MD_URL,UPDATE_VILLAGE_CAROUSEL,DELETE_VILLAGE_CAROUSEL } from '../Api';
import { toast } from 'react-toastify';
import mdurl from '../../../http/masterDataURL';
interface keyValue{
  value:number;
  label:string;
}
interface CarousalRow {
  carousel_id: number;
  carousel_name: string;
  carousel_desc: string;
  carousel_image: File | null;
  carousel_position: number;
  isenabled: boolean;
  f_villageapp_id:keyValue | null;
}

const CarousalTable = () => {
  const [data, setData] = useState<CarousalRow[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [sizePerPage, setSizePerPage] = useState(10);
  const [sorting, setSorting] = useState<SortTanstackInterface[]>([]);
  const [villageAppData,setVillageAppData]=useState([])
  const [villageAppDataLoading,setVillageAppDataLoading]=useState(false)
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
    let sort: SortInterface[] = [];
  // ✅ Validation with conditional image requirement
  const validationSchema = Yup.object({
    name: Yup.string().min(3, "Minimum 3 characters").required("Name is required"),
    description: Yup.string().min(10, "Minimum 10 characters").required("Description is required"),
    position: Yup.number().typeError("Must be a number").required("Position is required"),
    image: Yup.mixed().test(
      "required-image",
      "Image is required",
      function (value) {
        const { editId } = this.options.context || {};
        if (editId) return true; // edit → optional
        return !!value; // add → required
      }
    )
  });



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
  },[])

      
  let initialRequest = {
      "start": 0,
      "sort": [],
      "numberOfRows": 10,
      "filters": []
  }

  async function saveVillageCarousel(data:any) {
      setLoading(true);
      await http({
        method: 'POST',
        url: ADD_VILLAGE_CAROUSEL,
        data,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }).then(function(response) {
          if (response.status === 200) {
            formik.resetForm();
            toast(response.data.message, { position: 'top-right',type: 'success' });
            setShowForm(false);
            fetchData(initialRequest);

          } else {
            toast('Failed to Add village', {position: 'top-right',type: 'error'});
          }
          setLoading(false);
      })
      .catch(err => {
          toast(err, { position: 'top-right', type: 'error' });
          setLoading(false);
      });
  }
  
  async function updateVillageCarousel(data:any) {
      setLoading(true);
      await http({
        method: 'POST',
        url: UPDATE_VILLAGE_CAROUSEL,
        data,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }).then(function(response) {
          if (response.status === 200) {
            formik.resetForm();
            toast(response.data.message, { position: 'top-right',type: 'success' });
            setShowForm(false);
            fetchData(initialRequest);

          } else {
            toast('Failed to Add village', {position: 'top-right',type: 'error'});
          }
          setLoading(false);
      })
      .catch(err => {
          toast(err, { position: 'top-right', type: 'error' });
          setLoading(false);
      });
  }


  const formik = useFormik<CarousalRow>({
    initialValues: {
      carousel_id: 0,
      carousel_name: '',
      carousel_desc: '',
      carousel_image: null,
      carousel_position: 1,
      isenabled: false,
      f_villageapp_id: null,
    },
    // validationSchema,
    onSubmit: (values, { resetForm, setSubmitting }) => {

      if (editId) {

        const formData = new FormData();
        formData.append("carousel_id", values.carousel_id.toString());
        formData.append("carousel_name", values.carousel_name);
        formData.append("carousel_desc", values.carousel_desc);
        formData.append("carousel_position", values.carousel_position.toString());
        formData.append("isenabled", values.isenabled.toString());
        formData.append("f_villageapp_id",values.f_villageapp_id?.value.toString() || "");

        if (values.carousel_image) {
          formData.append(
            "carousel_image",
            values.carousel_image
          );
        }



        updateVillageCarousel(formData);
      } else {

        const formData = new FormData();
        formData.append("carousel_name", values.carousel_name);
        formData.append("carousel_desc", values.carousel_desc);
        formData.append("carousel_position", values.carousel_position.toString());
        formData.append("isenabled", values.isenabled.toString());
        formData.append("f_villageapp_id",values.f_villageapp_id?.value.toString() || "");

        if (values.carousel_image) {
          formData.append(
            "carousel_image",
            values.carousel_image
          );
        }



        saveVillageCarousel(formData);
      }

      resetForm();
      setImagePreview(null);
      setShowForm(false);
      setSubmitting(false);
    }
  });

  const handleEdit = (row: CarousalRow) => {
    setEditId(row.carousel_id);
    formik.setFieldValue("carousel_id", row.carousel_id);
    formik.setFieldValue("carousel_name", row.carousel_name);
    formik.setFieldValue("carousel_desc", row.carousel_desc);
    formik.setFieldValue("carousel_image", row.carousel_image);
    formik.setFieldValue("carousel_position", row.carousel_position);
    formik.setFieldValue("isenabled", row.isenabled);
    formik.setFieldValue("f_villageapp_id", villageAppData.find((v: any) => v.value === row.f_villageapp_id));
    setShowForm(true);
  };


    async function deleteCarousel(data:any) {
      console.log('data', data);
      setLoading(true);
      await http({
      method: 'POST',
      url: DELETE_VILLAGE_CAROUSEL,
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
    deleteCarousel({carousel_id: row.carousel_id})
  };

  const columns = useMemo(() => [
    {
      header: 'Sl No',
      enableColumnFilter: false,
      cell: (cell: any) => cell.row.index + 1,
    },
    {
      header: 'Name',
      enableColumnFilter: false,
      accessorKey: 'carousel_name',
    },
    {
      header: 'Image',
      cell: (cell: any) => {
        const file = cell.row.original.carousel_image;

        return file ? (
          <img
            src={file}
            width="50"
            height="50"
            alt="img"
          />
        ) : null;
      }
    },
    {
      header: 'Position',
      enableColumnFilter: false,
      accessorKey: 'carousel_position',
    },
    {
      header: 'Village App',
      enableColumnFilter: false,
      accessorKey: 'villageapp_name',
    },
    {
      header: 'Status',
      cell: (cell: any) => {
        const isenabled = cell.row.original.isenabled;
        return (
          <Badge color={isenabled ? 'success' : 'danger'} pill>
            {isenabled ? 'Enabled' : 'Disabled'}
          </Badge>
        );
      }
    },
    {
      header: 'Actions',
      cell: (cell: any) => {
        const row = cell.row.original;
        return (
          <div className="d-flex gap-2">
            <Button size="sm" color="soft-warning" onClick={() => handleEdit(row)}>
              Edit
            </Button>
            <Button size="sm" color="soft-danger" onClick={() => handleDelete(row)}>
              Delete
            </Button>
          </div>
        );
      }
    }
  ], [data]);

  const fetchData = async (requestdata: any) => {
      const { start, numberOfRows } = requestdata;
      try {
          const response = await http.post(GET_VILLAGE_CAROUSEL, requestdata);
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

  return (
    <div className="page-content">
      <div className="container-fluid">

        {/* FORM */}
        {showForm && (
          <Row>
            <Col md="12">
              <Card>
                <CardHeader><h4>Carousal Form</h4></CardHeader>
                <CardBody>
                  <Form onSubmit={formik.handleSubmit}>

                    {/* Name + Position */}
                    <Row>
                      <Col md={6}>
                        <FormGroup>
                          <Label>Carousel Name</Label>
                          <Input
                            name="carousel_name"
                            value={formik.values.carousel_name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            invalid={!!formik.errors.carousel_name && !!formik.touched.carousel_name}
                          />
                          <FormFeedback>{formik.errors.carousel_name}</FormFeedback>
                        </FormGroup>
                      </Col>

                      <Col md={6}>
                        <FormGroup>
                          <Label>Position</Label>
                          <Input
                            type="number"
                            name="carousel_position"
                            value={formik.values.carousel_position}
                            onChange={formik.handleChange}
                          />
                        </FormGroup>
                      </Col>
                    </Row>

                    {/* Description */}
                    <FormGroup>
                      <Label>Description</Label>
                      <Input
                        type="textarea"
                        name="carousel_desc"
                        value={formik.values.carousel_desc}
                        onChange={formik.handleChange}
                      />
                    </FormGroup>

                    {/* Image */}
                    <FormGroup>
                      <Label>Image</Label>

                      {imagePreview ? (
                        <div style={{ position: "relative", width: 150 }}>
                          <img src={imagePreview} style={{ width: "100%" }} />
                         <button
                         type="button"
                         onClick={() => {
                         setImagePreview(null);
                         formik.setFieldValue("carousel_image", null);
                   }}
                      style={{
                            position: "absolute",
                            top: 5,
                            right: 5,
                            background: "red",
                            color: "#fff",
                            border: "none",
                            borderRadius: "50%",
                            width: "25px",
                            height: "25px",
                            cursor: "pointer",
                  }}
                  >
                    ✕
                  </button>
                        </div>
                      ) : (
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e: any) => {
                            const file = e.target.files[0];
                            formik.setFieldTouched("carousel_image", true);

                            if (file) {
                              formik.setFieldValue("carousel_image", file);
                              setImagePreview(URL.createObjectURL(file));
                            }
                          }}
                        />
                      )}

                      {formik.errors.carousel_image && formik.touched.carousel_image && (
                        <div className="text-danger mt-1">
                          {formik.errors.carousel_image as string}
                        </div>
                      )}
                    </FormGroup>

                    {/* Toggle */}
                    <div className="form-check form-switch">
                      <Input
                        type="switch"
                        name="isenabled"
                        checked={formik.values.isenabled}
                        onChange={formik.handleChange}
                      />
                      <Label className="ms-2">
                        {formik.values.isenabled ? 'Enabled' : 'Disabled'}
                      </Label>
                    </div>

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


                    {/* Buttons */}
                   <div className="d-flex gap-2 mt-3">
                                     <Button 
                                        color="soft-secondary" 
                                        onClick={() => setShowForm(false)}>
                                       Cancel
                                     </Button>
                                     <Button 
                                        color="primary"
                                        type="submit">
                                       {editId ? 'Update' : 'Submit'}
                                     </Button>
                                   </div>

                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        )}

        {/* TABLE */}
        {!showForm && (
          <Card>
            <CardHeader className="d-flex justify-content-between">
              <h4>Carousal List</h4>
              <Button
                color="soft-success"
                size="sm" 
                onClick={() => {
                formik.resetForm();
                setImagePreview(null);
                setEditId(null);
                setShowForm(true);
              }}>
                + Add New
              </Button>
            </CardHeader>

            <CardBody>
              <TableContainer
                columns={columns}
                data={data}
                page={page}
                sizePerPage={sizePerPage}
                totalCount={data.length}
                handleTableChange={({ page, sizePerPage }: any) => {
                  setPage(page);
                  setSizePerPage(sizePerPage);
                }}
                sorting={sorting}
                setSorting={setSorting}
              />
            </CardBody>
          </Card>
        )}

      </div>
    </div>
  );
};

export default CarousalTable;