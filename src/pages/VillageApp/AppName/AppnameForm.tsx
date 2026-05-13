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
  Alert,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { TableContainer } from '../../../common/AnalyticsTable/TableContainerReactTable';
import { SortTanstackInterface } from '../../../Typecomponents/ComponentsType';


interface AppnameRow {
  id: number;
  name: string;
  description: string;
  about: string;
}

const AppnameFormSchema = Yup.object().shape({
  

  name: Yup.string()
    .min(3, 'Name must be at least 3 characters')
    .max(60, 'Name must not exceed 60 characters')
    .required('Name is required'),

  description: Yup.string()
    .min(10, 'Description must be at least 10 characters')
    .max(200, 'Description must not exceed 200 characters')
    .required('Description is required'),

  about: Yup.string()
    .max(500, 'About must not exceed 500 characters')
    .optional(),
});

const AppnameForm = () => {
  const [tableData, setTableData] = useState<AppnameRow[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const [page, setPage] = useState(1);
  const [sizePerPage, setSizePerPage] = useState(3);
  const [sorting, setSorting] = useState<SortTanstackInterface[]>([]);
  
 
  
  

  const formik = useFormik<AppnameRow>({
    initialValues: {
  id: 0,   // instead of ''
  name: '',
  description: '',
  about: '',
},

    validationSchema: AppnameFormSchema,

    onSubmit: async (values, { resetForm, setSubmitting }) => {
  setApiError(null);
  setSuccessMsg(null);

  try {
    if (editId) {
      const updated = tableData.map((item) =>
        item.id === editId ? { ...values, id: editId } : item
      );

      setTableData(updated);
      setEditId(null);
    } else {
      const newEntry: AppnameRow = {
  ...values,
  id:
    tableData.length > 0
      ? Math.max(...tableData.map((item) => item.id)) + 1
      : 1,
};

      setTableData([...tableData, newEntry]);
    }
    
    resetForm();
    setShowForm(false);
  } catch (error) {
    setApiError('Something went wrong');
  } finally {
    setSubmitting(false);
  }
}
  });

 const handleEdit = (id: number) => {
  const selected = tableData.find((item) => item.id === id);
  if (!selected) return;

  setEditId(id);

  formik.setValues({
    id: selected.id,
    name: selected.name,
    description: selected.description,
    about: selected.about,
  });

  setShowForm(true);
};

  const handleDelete = (id: number) => {
  const filtered = tableData.filter((item) => item.id !== id);
  setTableData(filtered);
};

  const handleTableChange = ({ page, sizePerPage }: any) => {
    setPage(page+1);
    setSizePerPage(sizePerPage);
  };

  const columns = useMemo(
    () => [
      {
        header: 'Sl No',
          cell: (cell: any) => cell.row.index + 1,
      },
      
      
      {
        header: 'Name',
        accessorKey: 'name',
        enableColumnFilter: false,
      },
      {
        header: 'Description',
        accessorKey: 'description',
         enableColumnFilter: false,
      },
      {
        header: 'About',
        accessorKey: 'about',
         enableColumnFilter: false,
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
                onClick={() => handleEdit(row.id)}
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
    [page, sizePerPage, tableData]
  );
  const paginatedData = useMemo(() => {
  const start = (page - 1) * sizePerPage;
  const end = start + sizePerPage;
  return tableData.slice(start, end);
}, [tableData, page, sizePerPage]);

  return (
    <div className="page-content">
      <div className="container-fluid">

        {/* Breadcrumb */}
        <Row>
          <Col xs="12">
            <div className="page-title-box d-flex align-items-center justify-content-between">
              <h4 className="mb-0">Appname Form</h4>

              <Breadcrumb listClassName="m-0">
                <BreadcrumbItem>
                  <Link to="/villageapp">VillageApp</Link>
                </BreadcrumbItem>

                <BreadcrumbItem>
                  <Link to="#">Appname</Link>
                </BreadcrumbItem>

                <BreadcrumbItem active>
                  Appname Form
                </BreadcrumbItem>
              </Breadcrumb>
            </div>
          </Col>
        </Row>

        {/* FORM */}
        {showForm && (
          <Row>
            <Col md="12">
              <Card>
                <CardHeader className="d-flex justify-content-between align-items-center">
                  <h4 className="card-title mb-0">
                    Appname Details
                  </h4>
                </CardHeader>

                <CardBody>

                  {apiError && (
                    <Alert color="danger">
                      {apiError}
                    </Alert>
                  )}

                  {successMsg && (
                    <Alert color="success">
                      {successMsg}
                    </Alert>
                  )}

                  <Form onSubmit={formik.handleSubmit}>

                    <Row>
                     

                      <Col md={6}>
                        <FormGroup>
                          <Label>App Name</Label>

                          <Input
                            name="name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            invalid={
                              !!formik.errors.name &&
                              !!formik.touched.name
                            }
                          />

                          <FormFeedback>
                            {formik.errors.name}
                          </FormFeedback>
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={12}>
                        <FormGroup>
                          <Label>Description</Label>

                          <Input
                            type="textarea"
                            rows={3}
                            name="description"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            invalid={
                              !!formik.errors.description &&
                              !!formik.touched.description
                            }
                          />

                          <FormFeedback>
                            {formik.errors.description}
                          </FormFeedback>
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={12}>
                        <FormGroup>
                          <Label>About</Label>

                          <Input
                            type="textarea"
                            rows={4}
                            name="about"
                            value={formik.values.about}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          />
                        </FormGroup>
                      </Col>
                    </Row>

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
                  <h4 className="card-title mb-0">
                    Appnames
                  </h4>

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
                    data={paginatedData}
                    customPageSize={sizePerPage}
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

export default AppnameForm;