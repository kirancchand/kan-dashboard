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

interface CategoryRow {
  id: number;
  category: string;
  discription: string;
}

const CategorySchema = Yup.object().shape({
  category: Yup.string()
    .min(3, 'Category must be at least 3 characters')
    .required('Category is required'),

  discription: Yup.string()
    .min(5, 'Description must be at least 5 characters')
    .required('Description is required'),
});

const Category = () => {

  const [tableData, setTableData] = useState<CategoryRow[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const [apiError, setApiError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [sizePerPage, setSizePerPage] = useState(10);
  const [sorting, setSorting] = useState<SortTanstackInterface[]>([]);

  const formik = useFormik<CategoryRow>({
    initialValues: {
      id: 0,
      category: '',
      discription: '',
    },
    validationSchema: CategorySchema,

    onSubmit: (values, { resetForm, setSubmitting }) => {
      setApiError(null);
      setSuccessMsg(null);

      try {
        if (editId) {
          const updated = tableData.map(item =>
            item.id === editId ? { ...values, id: editId } : item
          );
          setTableData(updated);
          setEditId(null);
          //setSuccessMsg("Updated successfully");
        } else {
          const newEntry = {
            ...values,
            id: tableData.length
              ? Math.max(...tableData.map(i => i.id)) + 1
              : 1,
          };
          setTableData([...tableData, newEntry]);
         // setSuccessMsg("Added successfully");
        }

        resetForm();
        setShowForm(false);

      } catch {
        setApiError("Something went wrong");
      }

      setSubmitting(false);
    }
  });

  const handleEdit = (id: number) => {
    const selected = tableData.find(item => item.id === id);
    if (!selected) return;

    setEditId(id);

    formik.setValues({
      id: selected.id,
      category: selected.category,
      discription: selected.discription,
    });

    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    setTableData(tableData.filter(item => item.id !== id));
  };

  const handleTableChange = ({ page, sizePerPage }: any) => {
    setPage(page);
    setSizePerPage(sizePerPage);
  };

 
  const columns = useMemo(
    () => [
      {
        header: 'Sl No',
        cell: (cell: any) => cell.row.index + 1,
        enableColumnFilter: false,
      },
      {
        header: 'Category Name',
        accessorKey: 'category',
        enableColumnFilter: false,
      },
      {
        header: 'Description',
        accessorKey: 'discription',
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
    [tableData]
  );

  return (
    <div className="page-content">
      <div className="container-fluid">

        {/* Breadcrumb */}
        <Row>
          <Col xs="12">
            <div className="page-title-box d-flex align-items-center justify-content-between">
              <h4 className="mb-0">Category</h4>

              <Breadcrumb listClassName="m-0">
                <BreadcrumbItem>
                  <Link to="/villageapp">VillageApp</Link>
                </BreadcrumbItem>

                <BreadcrumbItem active>
                  Category
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
                <CardHeader>
                  <h4 className="card-title mb-0">
                    Category Form
                  </h4>
                </CardHeader>

                <CardBody>

                  {apiError && <Alert color="danger">{apiError}</Alert>}
                  {successMsg && <Alert color="success">{successMsg}</Alert>}

                  <Form onSubmit={formik.handleSubmit}>

                    <Row className="mb-3">
                      <Col md={6}>
                        <FormGroup className="mb-3">
                          <Label>Category Name</Label>
                          <Input
                            name="category"
                            value={formik.values.category}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            invalid={!!formik.errors.category && !!formik.touched.category}
                          />
                          <FormFeedback>{formik.errors.category}</FormFeedback>
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row className="mb-3">
                      <Col md={12}>
                        <FormGroup className="mb-3">
                          <Label>Description</Label>
                          <Input
                            type="textarea"
                            rows={3}
                            name="discription"
                            value={formik.values.discription}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            invalid={!!formik.errors.discription && !!formik.touched.discription}
                          />
                          <FormFeedback>{formik.errors.discription}</FormFeedback>
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
                    Category List
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

export default Category;