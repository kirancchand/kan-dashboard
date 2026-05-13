import React, { useMemo, useState } from 'react';
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
import { SortTanstackInterface } from '../../../Typecomponents/ComponentsType';

interface CarousalRow {
  id: number;
  name: string;
  description: string;
  image: File | null;
  position: number;
  important: boolean;
  enabled: boolean;
}

const CarousalTable = () => {
  const [data, setData] = useState<CarousalRow[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [sizePerPage, setSizePerPage] = useState(10);
  const [sorting, setSorting] = useState<SortTanstackInterface[]>([]);

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

  const formik = useFormik<CarousalRow>({
    initialValues: {
      id: 0,
      name: '',
      description: '',
      image: null,
      position: 1,
      important: false,
      enabled: true,
    },
    validationSchema,
    
    onSubmit: (values, { resetForm, setSubmitting }) => {

      if (editId) {
        setData(data.map(d =>
          d.id === editId
            ? {
                ...values,
                image: values.image || d.image, // ✅ preserve old image
                id: editId
              }
            : d
        ));
        setEditId(null);
      } else {
        setData([
          ...data,
          {
            ...values,
            id: data.length ? Math.max(...data.map(d => d.id)) + 1 : 1
          }
        ]);
      }

      resetForm();
      setImagePreview(null);
      setShowForm(false);
      setSubmitting(false);
    }
  });

  const handleEdit = (row: CarousalRow) => {
    setEditId(row.id);

    formik.setValues({
      ...row,
      image: row.image, // ✅ keep existing image
    });

    if (row.image) {
      setImagePreview(URL.createObjectURL(row.image));
    } else {
      setImagePreview(null);
    }

    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    setData(data.filter(d => d.id !== id));
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
      accessorKey: 'name',
    },
    {
      header: 'Image',
      cell: (cell: any) => {
        const file = cell.row.original.image;
        return file ? (
          <img src={URL.createObjectURL(file)} width="50" alt="img" />
        ) : null;
      }
    },
    {
      header: 'Position',
      enableColumnFilter: false,
      accessorKey: 'position',
    },
    {
      header: 'Status',
      cell: (cell: any) => {
        const enabled = cell.row.original.enabled;
        return (
          <Badge color={enabled ? 'success' : 'danger'} pill>
            {enabled ? 'Enabled' : 'Disabled'}
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
            <Button size="sm" color="soft-danger" onClick={() => handleDelete(row.id)}>
              Delete
            </Button>
          </div>
        );
      }
    }
  ], [data]);

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
                          <Label>Name</Label>
                          <Input
                            name="name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            invalid={!!formik.errors.name && !!formik.touched.name}
                          />
                          <FormFeedback>{formik.errors.name}</FormFeedback>
                        </FormGroup>
                      </Col>

                      <Col md={6}>
                        <FormGroup>
                          <Label>Position</Label>
                          <Input
                            type="number"
                            name="position"
                            value={formik.values.position}
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
                        name="description"
                        value={formik.values.description}
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
                            formik.setFieldTouched("image", true);

                            if (file) {
                              formik.setFieldValue("image", file);
                              setImagePreview(URL.createObjectURL(file));
                            }
                          }}
                        />
                      )}

                      {formik.errors.image && formik.touched.image && (
                        <div className="text-danger mt-1">
                          {formik.errors.image as string}
                        </div>
                      )}
                    </FormGroup>

                    {/* Toggle */}
                    <div className="form-check form-switch">
                      <Input
                        type="switch"
                        name="enabled"
                        checked={formik.values.enabled}
                        onChange={formik.handleChange}
                      />
                      <Label className="ms-2">
                        {formik.values.enabled ? 'Enabled' : 'Disabled'}
                      </Label>
                    </div>

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