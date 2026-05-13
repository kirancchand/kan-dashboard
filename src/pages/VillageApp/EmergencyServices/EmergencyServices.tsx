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
  Alert,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { TableContainer } from '../../../common/AnalyticsTable/TableContainerReactTable';
import { SortTanstackInterface } from '../../../Typecomponents/ComponentsType';

interface EmergencyRow {
  id: number;
  name: string;
  mobilenumber: string;
  image: any;
}

const schema = Yup.object({
  name: Yup.string().required("Name is required"),
  mobilenumber: Yup.string().required("Contact is required"),
  image: Yup.mixed().required("Image required"),
});

const EmergencyServices = () => {

  const [tableData, setTableData] = useState<EmergencyRow[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const [apiError, setApiError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [sizePerPage, setSizePerPage] = useState(10);
  const [sorting, setSorting] = useState<SortTanstackInterface[]>([]);

  const formik = useFormik<EmergencyRow>({
    initialValues: {
      id: 0,
      name: '',
      mobilenumber: '',
      image: null,
    },
    validationSchema: schema,

    onSubmit: (values, { resetForm, setSubmitting }) => {
      setApiError(null);
      setSuccessMsg(null);

      try {
        if (editId !== null) {
          setTableData(prev =>
            prev.map(d => (d.id === editId ? { ...values, id: editId } : d))
          );
          setEditId(null);
        } else {
          const newId = tableData.length
            ? Math.max(...tableData.map(d => d.id)) + 1
            : 1;

          setTableData(prev => [...prev, { ...values, id: newId }]);
        }

        resetForm();
        setShowForm(false);
        // setSuccessMsg(editId ? "Updated successfully" : "Added successfully");

      } catch {
        setApiError("Something went wrong");
      }

      setSubmitting(false);
    }
  });

  const handleEdit = (row: EmergencyRow) => {
    setEditId(row.id);
    formik.setValues(row);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    setTableData(prev => prev.filter(d => d.id !== id));
  };

  const handleTableChange = ({ page, sizePerPage }: any) => {
    setPage(page);
    setSizePerPage(sizePerPage);
  };

  const columns = useMemo(
    () => [
      {
        header: 'Sl No',
        enableColumnFilter: false,
        cell: (cell: any) => cell.row.index + 1,
      },
      {
        header: 'Name',
        accessorKey: 'name',
        enableColumnFilter: false,
      },
      {
        header: 'Contact',
        accessorKey: 'mobilenumber',
        enableColumnFilter: false,
      },
      {
        header: 'IconImage',
        enableColumnFilter: false,
        cell: (cell: any) => {
          const file = cell.row.original.image;
          return file ? (
            <img
              src={URL.createObjectURL(file)}
              width="40"
              alt="icon"
            />
          ) : null;
        }
      },
      {
        header: 'Actions',
        enableColumnFilter: false,
        cell: (cell: any) => {
          const row = cell.row.original;

          return (
            <div className="d-flex gap-2">
              <Button
                size="sm"
                color="soft-warning"
                onClick={() => handleEdit(row)}
              >
                Edit
              </Button>

              <Button
                size="sm"
                color="soft-danger"
                onClick={() => handleDelete(row.id)}
              >
                Delete
              </Button>
            </div>
          );
        },
      },
    ],
    [tableData]
  );

  return (
    <div className="page-content">
      <div className="container-fluid">

        {/* Breadcrumb */}
        <Row>
          <Col xs="12">
            <div className="page-title-box d-flex align-items-center justify-content-between">
              <h4 className="mb-0">Emergency Services</h4>

              <Breadcrumb listClassName="m-0">
                <BreadcrumbItem>
                  <Link to="/villageapp">VillageApp</Link>
                </BreadcrumbItem>
                <BreadcrumbItem active>Emergency Services</BreadcrumbItem>
              </Breadcrumb>
            </div>
          </Col>
        </Row>

        {/* FORM */}
        {showForm && (
          <Row>
            <Col md="12">
              <Card>
                <CardHeader>
                  <h4 className="card-title mb-0">Emergency Form</h4>
                </CardHeader>

                <CardBody>

                  {apiError && <Alert color="danger">{apiError}</Alert>}
                  {successMsg && <Alert color="success">{successMsg}</Alert>}

                  <Form onSubmit={formik.handleSubmit}>

                    <FormGroup className="mb-3">
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

                    <FormGroup className="mb-3">
                      <Label>Contact</Label>
                      <Input
                        name="mobilenumber"
                        value={formik.values.mobilenumber}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        invalid={!!formik.errors.mobilenumber && !!formik.touched.mobilenumber}
                      />
                      <FormFeedback>{formik.errors.mobilenumber}</FormFeedback>
                    </FormGroup>

                    <FormGroup className="mb-3">
                      <Label>Icon Image</Label>
                      <Input
                        type="file"
                        onChange={(e: any) =>
                          formik.setFieldValue("image", e.target.files[0])
                        }
                        onBlur={formik.handleBlur}
                        invalid={!!formik.errors.image && !!formik.touched.image}
                      />
                      <FormFeedback>{formik.errors.image as string}</FormFeedback>
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
            </Col>
          </Row>
        )}

        {/* TABLE */}
        {!showForm && (
          <Row>
            <Col md="12">
              <Card>

                <CardHeader className="d-flex justify-content-between align-items-center">
                  <h4 className="card-title mb-0">Emergency</h4>

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
                    data={tableData}
                    page={page}
                    sizePerPage={sizePerPage}
                    totalCount={tableData.length}
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

export default EmergencyServices;