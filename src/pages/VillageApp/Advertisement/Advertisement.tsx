import React, { useMemo, useState } from 'react';
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
import { SortTanstackInterface } from '../../../Typecomponents/ComponentsType';

interface AdRow {
  id: number;
  product_name: string;
  image:  File |null ;
  f_organization_id: number;
  start_date: string;
  end_date: string;
  exclusive: boolean;
}

const schema = Yup.object({
  product_name: Yup.string().required("Required"),
  image: Yup.mixed().nullable().required("Required"),
  f_organization_id: Yup.number().required("Required"),
  start_date: Yup.string().required("Required"),
  end_date: Yup.string().required("Required"),
  exclusive: Yup.boolean(),
});

const Advertisement = () => {

  const [data, setData] = useState<AdRow[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [sizePerPage, setSizePerPage] = useState(10);
  const [sorting, setSorting] = useState<SortTanstackInterface[]>([]);
  const [organizations] = useState([{ id:"", name: "" },]);
  const carouselAds = data.filter(ad => ad.exclusive);
  const normalAds = data.filter(ad => !ad.exclusive);
  const [imagePreview,setImagePreview]=useState<string | null>(null);


  const handleTableChange = ({ page, sizePerPage }: any) => {
    setPage(page);
    setSizePerPage(sizePerPage);
  };

  const formik = useFormik<AdRow>({
      initialValues: {
      id: 0,
      product_name: '',
      image: null,
      f_organization_id: 0,
      start_date: '',
      end_date: '',
      exclusive: false,
    },
    validationSchema: schema,
   

    onSubmit: (values, { resetForm }) => {
      if (editId) {
        setData(data.map(d => d.id === editId ? { ...values, id: editId } : d));
        setEditId(null);
      } else {
        const newEntry = {
          ...values,
          id: data.length ? Math.max(...data.map(d => d.id)) + 1 : 1
        };
        setData([...data, newEntry]);
      }

     // setSuccessMsg("Saved successfully");
      resetForm();
      setShowForm(false);
    }
  });

  const handleEdit = (row: AdRow) => {
    setEditId(row.id);
    formik.setValues({...row,image:null,});
    if(row.image){
      setImagePreview(URL.createObjectURL(row.image));
    }else{
      setImagePreview(null);
    }
    
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    setData(data.filter(d => d.id !== id));
  };

  const columns = useMemo(
    () => [
      {
        header: 'Sl No',
        
        cell: (cell: any) => cell.row.index + 1,
      },
      {
        header: 'Product Name',
        enableColumnFilter: false,
        accessorKey: 'product_name',
      },
       {
      header: 'Image',
      enableColumnFilter: false,
      cell: (cell: any) => {
        const file = cell.row.original.image;
        return file ? (
          <img
            src={URL.createObjectURL(file)}
            alt="img"
            width="50"
          />
        ) : null;
      }
      
      },
      {
  header: 'Organization Name',
  cell: (cell: any) => {
    const orgId = cell.row.original.f_organization_id;
    const org = organizations.find(o => o.id === orgId);
    return org ? org.name : 'N/A';
     },
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
        header: 'Is Exclusive',
        cell: (cell: any) =>
        cell.row.original.exclusive ? 'Yes' : 'No',
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
        },
      },
    ],
    [data]
  );

  return (
    <div className="page-content">
      <div className="container-fluid">

        {/* HEADER */}
        <Row>
          <Col xs="12">
            <div className="page-title-box d-flex justify-content-between">
              <h4>Advertisement</h4>

              <Breadcrumb>
                <BreadcrumbItem>
                  <Link to="/villageapp">VillageApp</Link>
                </BreadcrumbItem>
                <BreadcrumbItem active>
                  Advertisement
                </BreadcrumbItem>
              </Breadcrumb>
            </div>
          </Col>
        </Row>

        {/* FORM */}
        {showForm && (
          <Card>
            <CardHeader>
              <h4>Advertisement Form</h4>
            </CardHeader>

            <CardBody>
              {successMsg && <Alert color="success">{successMsg}</Alert>}

              <Form onSubmit={formik.handleSubmit}>
                <FormGroup>
                  <Label>Product Name</Label>
                  <Input 
                  name="product_name" 
                  onChange={formik.handleChange} 
                  value={formik.values.product_name}
                  onBlur={formik.handleBlur} 
                  invalid={formik.touched.product_name && !!formik.errors.product_name} />
                  {formik.touched.product_name && formik.errors.product_name && (
                  <div className="text-danger">{formik.errors.product_name}</div>
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
                         formik.setFieldValue("image", null);
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
                   if (file) {
                      formik.setFieldValue("image", file);
                      setImagePreview(URL.createObjectURL(file));
                      }
                    }}
                  />
               )}
                </FormGroup>
                <FormGroup>
                   <Label>Organization ID</Label>
                   <Input type="select"
                           name="f_organization_id"
                            onChange={formik.handleChange}
                           value={formik.values.f_organization_id}
                            onBlur={formik.handleBlur}
                            invalid={formik.touched.f_organization_id && !!formik.errors.f_organization_id}
                   >
                    {formik.touched.f_organization_id && formik.errors.f_organization_id && (
                     <div className="text-danger">{formik.errors.f_organization_id}</div>
                    )}
                   <option value="">Select</option>
                           {organizations.map(org => (
                   <option key={org.id} value={org.id}>
                           {org.name}
                   </option>
               ))}
                   </Input>
                </FormGroup>

                <FormGroup>
                  <Label> Start Date</Label>
                  <Input type="date" name="start_date" onChange={formik.handleChange} value={formik.values.start_date} />
                </FormGroup>

                <FormGroup>
                  <Label> End Date</Label>
                  <Input type="date" name="end_date" onChange={formik.handleChange} value={formik.values.end_date} />
                </FormGroup>
                <FormGroup>
                  <Label>
                  <Input
                      type="checkbox"
                      name="exclusive"
                      onChange={formik.handleChange}
                      checked={formik.values.exclusive}
                  />
                  {' '}Show in Carousel (Exclusive Ad)
                  </Label>
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
          <Row>
            <Col md="12">
              <Card>

                <CardHeader className="d-flex justify-content-between">
                  <h4>Advertisement</h4>

                  <Button
                    color="soft-success"
                    size="sm"
                    onClick={() => {
                      formik.resetForm();
                      setImagePreview(null);
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
                    data={data}
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

      </div>
    </div>
  );
};

export default Advertisement;