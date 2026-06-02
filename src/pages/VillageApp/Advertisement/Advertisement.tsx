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
  Badge,
  Alert
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { TableContainer } from '../../../common/AnalyticsTable/TableContainerReactTable';
import { SortTanstackInterface,SortInterface } from '../../../Typecomponents/ComponentsType';
import RSelect from '../../../Components/Common/RSelect/RSelect';
import { http } from '../../../http/http';
import { ADD_VILLAGE_ADVERTISEMENT,GET_VILLAGE_ADVERTISEMENT,MD_URL } from '../Api';
import { toast } from 'react-toastify';
import mdurl from '../../../http/masterDataURL';
interface keyValue{
  value:number;
  label:string;
}
interface AdvRow {
  advertisement_name: string;
  advertisement_image: File | null;
  advertisement_desc: string;
  start_date: string;
  end_date: string;
  f_villageapp_id: keyValue | null;
  f_villageorganisation_id:keyValue | null;
}



const Advertisement = () => {
  const [data, setData] = useState<AdvRow[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [sizePerPage, setSizePerPage] = useState(10);
  const [sorting, setSorting] = useState<SortTanstackInterface[]>([]);
  const [villageAppData,setVillageAppData]=useState([])
  const [villageAppDataLoading,setVillageAppDataLoading]=useState(false)
  const [villageOrganisationData,setVillageOrganisationData]=useState([])
  const [villageOrganisationDataLoading,setVillageOrganisationDataLoading]=useState(false)

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

  async function fetchVillageOrganisation() {
      setVillageOrganisationDataLoading(true);
      mdurl(MD_URL,'getAll_VillageOrganisation')
        .then((r) => {
          setVillageOrganisationData(r);
          setVillageOrganisationDataLoading(false);
        }).catch((error) => {
          toast(error, { position: 'top-right', type: 'error' });
          setVillageOrganisationDataLoading(false);
        });
    }

  useEffect(() => {
    fetchVillageApps()
    fetchVillageOrganisation()
  },[])

      
  let initialRequest = {
      "start": 0,
      "sort": [],
      "numberOfRows": 10,
      "filters": []
  }

  async function saveVillageAdvertisement(data:any) {
      setLoading(true);
      await http({
        method: 'POST',
        url: ADD_VILLAGE_ADVERTISEMENT,
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
  

  const formik = useFormik<AdvRow>({
    initialValues: {
      advertisement_name: '',
      advertisement_image: null,
      advertisement_desc: '',
      start_date: '',
      end_date: '',
      f_villageapp_id: null,
      f_villageorganisation_id: null,
    },
    // validationSchema,
    onSubmit: (values, { resetForm, setSubmitting }) => {

      if (editId) {
        // setData(data.map(d =>
        //   d.id === editId
        //     ? {
        //         ...values,
        //         image: values.image || d.image, // ✅ preserve old image
        //         id: editId
        //       }
        //     : d
        // ));
        // setEditId(null);
      } else {
        const formData = new FormData();
        formData.append("advertisement_name", values.advertisement_name);
        formData.append("advertisement_desc", values.advertisement_desc);
        formData.append("start_date", values.start_date || "");
        formData.append("end_date", values.end_date || "");
        formData.append("f_villageapp_id",values.f_villageapp_id?.value.toString() || "");
        formData.append("f_villageorganisation_id",values.f_villageorganisation_id?.value.toString()||"");

        if (values.advertisement_image) {
          formData.append(
            "advertisement_image",
            values.advertisement_image
          );
        }
        saveVillageAdvertisement(formData);
      }

      resetForm();
      setImagePreview(null);
      setShowForm(false);
      setSubmitting(false);
    }
  });

  const handleEdit = (row: AdvRow) => {
    // setEditId(row.id);

    // formik.setValues({
    //   ...row,
    //   image: row.image, // ✅ keep existing image
    // });

    // if (row.image) {
    //   setImagePreview(URL.createObjectURL(row.image));
    // } else {
    //   setImagePreview(null);
    // }

    // setShowForm(true);
  };



  const handleDelete = (id: number) => {
    // setData(data.filter(d => d.id !== id));
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
      accessorKey: 'advertisement_name',
    },
    {
      header: 'Image',
      cell: (cell: any) => {
        const file = cell.row.original.advertisement_image;

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
      header: 'Advertisement Desc',
      enableColumnFilter: false,
      accessorKey: 'advertisement_desc',
    },
    {
      header: 'Start Date',
      enableColumnFilter: false,
      accessorKey: 'start_date',
    },
    {
      header: 'End Date',
      enableColumnFilter: false,
      accessorKey: 'end_date',
    },
    {
      header: 'Village App',
      enableColumnFilter: false,
      accessorKey: 'villageapp_name',
    },
    {
      header: 'Village Organisation',
      enableColumnFilter: false,
      accessorKey: 'organisation_name',
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
            <Button size="sm" color="soft-danger" onClick={() => handleDelete(row.id)}>
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
          const response = await http.post(GET_VILLAGE_ADVERTISEMENT, requestdata);
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
          <Card>
            <CardHeader>
              <h4>Advertisement Form</h4>
            </CardHeader>

            <CardBody>
              {/* {successMsg && <Alert color="success">{successMsg}</Alert>} */}

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
                    <FormGroup>
                    <Label>Select Organisation</Label>
                          <RSelect
                            name="f_villageorganisation_id"
                            id="f_villageorganisation_id"
                            value={formik.values.f_villageorganisation_id}
                            onChange={(ev: any) =>
                                formik.setFieldValue("f_villageorganisation_id", ev)
                            }
                            options={villageOrganisationData}
                            placeholder="--Select Organisation--"
                            error={formik.errors.f_villageorganisation_id}
                            touched={formik.touched.f_villageorganisation_id}
                            isLoading={villageOrganisationDataLoading}
                            isClearable
                            />
                        {formik.touched.f_villageorganisation_id &&
                            formik.errors.f_villageorganisation_id && (
                            <div className="text-danger">
                                {formik.errors.f_villageorganisation_id}
                            </div>
                            )}

                    </FormGroup>
                <FormGroup>
                  <Label>Advertisement Name</Label>
                  <Input 
                  name="advertisement_name" 
                  onChange={formik.handleChange} 
                  value={formik.values.advertisement_name}
                  onBlur={formik.handleBlur} 
                  invalid={formik.touched.advertisement_name && !!formik.errors.advertisement_name} />
                  {formik.touched.advertisement_name && formik.errors.advertisement_name && (
                  <div className="text-danger">{formik.errors.advertisement_name}</div>
                  )}
                </FormGroup>
                 <FormGroup>
                  <Label>Advertisement Description</Label>
                  <Input 
                  name="advertisement_desc" 
                  onChange={formik.handleChange} 
                  value={formik.values.advertisement_desc}
                  onBlur={formik.handleBlur} 
                  invalid={formik.touched.advertisement_desc && !!formik.errors.advertisement_desc} />
                  {formik.touched.advertisement_desc && formik.errors.advertisement_desc && (
                  <div className="text-danger">{formik.errors.advertisement_desc}</div>
                  )}
                </FormGroup>

                <FormGroup>
                   <Label>Image</Label>

                     {imagePreview ? (
                  <div style={{ position: "relative", width: "150px" }}>
                      <img
                         src={imagePreview}
                         alt="preview"
                         style={{ width: "100%", borderRadius: "8px" }}
                      />

      
                  <button
                         type="button"
                         onClick={() => {
                         setImagePreview(null);
                         formik.setFieldValue("advertisement_image", null);
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
                            formik.setFieldTouched("advertisement_image", true),
                            console.log(file)
                            if (file) {
                              formik.setFieldValue("advertisement_image", file);
                              setImagePreview(URL.createObjectURL(file));
                            }
                          }}
                        />
               )}
                </FormGroup>
                <FormGroup>
                  <Label> Start Date</Label>
                  <Input
                    type="date"
                    name="start_date"
                    onChange={formik.handleChange}
                    value={formik.values.start_date || ''}
                  />
                </FormGroup>

                <FormGroup>
                  <Label> End Date</Label>
                  <Input
                    type="date"
                    name="end_date"
                    onChange={formik.handleChange}
                    value={formik.values.end_date || ''}
                  />
                </FormGroup>

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
        )}
        {/* TABLE */}
        {!showForm && (
          <Card>
            <CardHeader className="d-flex justify-content-between">
              <h4>Advertisement List</h4>
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
                />:"Loading..."}
            </CardBody>
          </Card>
        )}

      </div>
    </div>
  );
};

export default Advertisement;