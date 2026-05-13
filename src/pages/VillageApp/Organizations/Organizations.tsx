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

interface OrgRow {
  id: number;
  name: string;
  owner: string;
  location: string;
  contact: string;
  idnumber: string;
  priority: number;
}

const schema = Yup.object({
  name: Yup.string().required("Required"),
  owner: Yup.string().required("Required"),
  location: Yup.string().required("Required"),
  contact: Yup.string().required("Required"),
  idnumber: Yup.string().required("Required"),
});

const Organizations = () => {

  const [data, setData] = useState<OrgRow[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const [successMsg, setSuccessMsg] = useState<string | null>(null);

 
  const [page, setPage] = useState(1);
  const [sizePerPage, setSizePerPage] = useState(10);
  const [sorting, setSorting] = useState<SortTanstackInterface[]>([]);

  const handleTableChange = ({ page, sizePerPage }: any) => {
    setPage(page);
    setSizePerPage(sizePerPage);
  };

  const formik = useFormik<OrgRow>({
    initialValues: {
      id: 0,
      name: '',
      owner: '',
      location: '',
      contact: '',
      idnumber: '',
      priority: 0,
    },
    validationSchema: schema,

    onSubmit: (values, { resetForm }) => {
      if (editId) {
        setData(data.map(d => d.id === editId ? { ...values, id: editId } : d));
        setEditId(null);
       // setSuccessMsg("Updated successfully");
      } else {
        const newEntry = {
          ...values,
          id: data.length ? Math.max(...data.map(d => d.id)) + 1 : 1
        };
        setData([...data, newEntry]);
      }

      resetForm();
      setShowForm(false);
    }
  });

  const handleEdit = (row: OrgRow) => {
    setEditId(row.id);
    formik.setValues(row);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    setData(data.filter(d => d.id !== id));
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
        header: 'Owner Name',
        accessorKey: 'owner',
        enableColumnFilter: false,
      },
      {
        header: 'Location',
        accessorKey: 'location',
        enableColumnFilter: false,
      },
      {
        header: 'Contact',
        accessorKey: 'contact',
        enableColumnFilter: false,
      },
      {
        header: 'f-Category-ID',
        accessorKey: 'idnumber',
        enableColumnFilter: false,
      },
      {
        header: 'Priority',
        accessorKey: 'priority',
        enableColumnFilter: false,
      },
      {
        header: 'Actions',
        cell: (cell: any) => {
          const row = cell.row.original;
          return (
            <div className="d-flex gap-2">
              <Button size="sm" color="warning" onClick={() => handleEdit(row)}>
                Edit
              </Button>
              <Button size="sm" color="danger" onClick={() => handleDelete(row.id)}>
                Delete
              </Button>
            </div>
          );
        },
      },
    ],
    [data]
  );
  const sortedData = useMemo(() => {
  return [...data].sort((a, b) => b.priority - a.priority);
}, [data]);
  

  return (
    <div className="page-content">
      <div className="container-fluid">

        {/* HEADER */}
        <Row>
          <Col xs="12">
            <div className="page-title-box d-flex justify-content-between">
              <h4>Organizations</h4>

              <Breadcrumb>
                <BreadcrumbItem>
                  <Link to="/villageapp">VillageApp</Link>
                </BreadcrumbItem>
                <BreadcrumbItem active>
                   Organizations
                </BreadcrumbItem>
              </Breadcrumb>
            </div>
          </Col>
        </Row>

        {/* FORM */}
        {showForm && (
          <Card>
            <CardHeader>
              <h4>Organization Form</h4>
            </CardHeader>

            <CardBody>
              {successMsg && <Alert color="success">{successMsg}</Alert>}

              <Form onSubmit={formik.handleSubmit}>
                <FormGroup>
                  <Label>Name</Label>
                  <Input name="name" onChange={formik.handleChange} value={formik.values.name} />
                </FormGroup>

                <FormGroup>
                  <Label>Owner</Label>
                  <Input name="owner" onChange={formik.handleChange} value={formik.values.owner} />
                </FormGroup>

                <FormGroup>
                  <Label>Location</Label>
                  <Input name="location" onChange={formik.handleChange} value={formik.values.location} />
                </FormGroup>

                <FormGroup>
                  <Label>Contact</Label>
                  <Input name="contact" onChange={formik.handleChange} value={formik.values.contact} />
                </FormGroup>

                <FormGroup>
                  <Label>Category ID</Label>
                  <Input name="idnumber" onChange={formik.handleChange} value={formik.values.idnumber} />
                </FormGroup>
                <FormGroup>
                  <Label>Priority</Label>
                  <Input name="priority" type="number" onChange={formik.handleChange} value={formik.values.priority}
  />
</FormGroup>

                <div className="d-flex gap-2 mt-3">
                  <Button color="soft-secondary" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                  <Button color="primary" type="submit">
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
                  <h4>Organizations</h4>

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
                    data={sortedData}
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

export default Organizations;