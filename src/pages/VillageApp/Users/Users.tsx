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
  Button,
  Breadcrumb,
  BreadcrumbItem,
  Alert,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { TableContainer } from '../../../common/AnalyticsTable/TableContainerReactTable';
import { SortTanstackInterface } from '../../../Typecomponents/ComponentsType';

interface UserRow {
  id: number;
  name: string;
  place: string;
  mobile: string;
  image: File | null;
  position: string;
  isImportant: boolean;
}

const schema = Yup.object({
  name: Yup.string().required("Name is required"),
  place: Yup.string().required("Locality is required"),
  mobile: Yup.string().required("Contact is required"),
  position: Yup.string().required("Position is required"),
  image: Yup.mixed().required("Image required"),
});

const Users = () => {

  const [tableData, setTableData] = useState<UserRow[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const [apiError, setApiError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [sizePerPage, setSizePerPage] = useState(10);
  const [sorting, setSorting] = useState<SortTanstackInterface[]>([]);

  const formik = useFormik<UserRow>({
    initialValues: {
      id: 0,
      name: '',
      place: '',
      mobile: '',
      position: '',
      isImportant: false,
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

  const handleEdit = (row: UserRow) => {
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
        cell: (cell: any) => cell.row.index + 1,
        enableColumnFilter: false,
      },
      {
        header: 'Name',
        accessorKey: 'name',
        enableColumnFilter: false,
      },
      {
        header: 'Locality',
        accessorKey: 'place',
        enableColumnFilter: false,
      },
      {
        header: 'Contact',
        accessorKey: 'mobile',
        enableColumnFilter: false,
      },
      {
        header: 'Image',
        enableColumnFilter: false,
        cell: (cell: any) => {
          const file = cell.row.original.image;
          if (!file) return null;

          const url = URL.createObjectURL(file);

          return (
            <img
              src={url}
              width="40"
              alt="user"
              onLoad={() => URL.revokeObjectURL(url)}
            />
          );
        },
      },
      {
        header: 'Position',
        accessorKey: 'position',
        enableColumnFilter: false,
      },
      {
        header: 'Important',
        enableColumnFilter: false,
        cell: (cell: any) =>
          cell.row.original.isImportant ? (
            <span className="badge bg-success">Yes</span>
          ) : (
            <span className="badge bg-secondary">No</span>
          ),
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

        <Row>
          <Col xs="12">
            <div className="page-title-box d-flex justify-content-between">
              <h4>Users Details</h4>

              <Breadcrumb>
                <BreadcrumbItem>
                  <Link to="/villageapp">VillageApp</Link>
                </BreadcrumbItem>
                <BreadcrumbItem active>Users</BreadcrumbItem>
              </Breadcrumb>
            </div>
          </Col>
        </Row>

        {/* FORM */}
        {showForm && (
          <Card>
            <CardHeader><h4>User Form</h4></CardHeader>

            <CardBody>

              {apiError && <Alert color="danger">{apiError}</Alert>}
              {successMsg && <Alert color="success">{successMsg}</Alert>}

              <Form onSubmit={formik.handleSubmit}>

                <FormGroup>
                  <Label>Name</Label>
                  <Input name="name" value={formik.values.name} onChange={formik.handleChange} />
                </FormGroup>

                <FormGroup>
                  <Label>Locality</Label>
                  <Input name="place" value={formik.values.place} onChange={formik.handleChange} />
                </FormGroup>

                <FormGroup>
                  <Label>Contact</Label>
                  <Input name="mobile" value={formik.values.mobile} onChange={formik.handleChange} />
                </FormGroup>

                <FormGroup>
                  <Label>Position</Label>
                  <Input name="position" value={formik.values.position} onChange={formik.handleChange} />
                </FormGroup>

                <FormGroup check className="mb-3">
                  <Input
                    type="checkbox"
                    name="isImportant"
                    checked={formik.values.isImportant}
                    onChange={formik.handleChange}
                  />
                  <Label check>Is Important</Label>
                </FormGroup>

                <FormGroup>
                  <Label>Image</Label>
                  <Input
                    type="file"
                    onChange={(e: any) =>
                      formik.setFieldValue("image", e.target.files[0])
                    }
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
          <Row>
            <Col md="12">
              <Card>
                <CardHeader className="d-flex justify-content-between">
                  <h4>Users List</h4>

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

export default Users;