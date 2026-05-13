import React, { useMemo, useState } from "react";
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

interface DistrictRow {
  id: number;
  district: string;
  state: string;
  geoarea: File | null;
  addAllDistrict: boolean;
}

const schema = Yup.object({
  district: Yup.string().required("Required"),
  state: Yup.string().required("Required"),
  geoarea: Yup.mixed().nullable().required("Required"),
  addAllDistrict: Yup.boolean(),
});

const District = () => {
  const [data, setData] = useState<DistrictRow[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [sizePerPage, setSizePerPage] = useState(10);
  const [sorting, setSorting] = useState<SortTanstackInterface[]>([]);

  const [geoPreview, setGeoPreview] = useState<string | null>(null);

  const [states] = useState([
    { id: "1", name: "Kerala" },
    { id: "2", name: "Tamil Nadu" },
    { id: "3", name: "Karnataka" },
  ]);

  const handleTableChange = ({ page, sizePerPage }: any) => {
    setPage(page);
    setSizePerPage(sizePerPage);
  };

  const formik = useFormik<DistrictRow>({
    initialValues: {
      id: 0,
      district: "",
      state: "",
      geoarea: null,
      addAllDistrict: false,
    },

    validationSchema: schema,

    onSubmit: (values, { resetForm }) => {
      if (editId) {
        setData(
          data.map((d) =>
            d.id === editId ? { ...values, id: editId } : d
          )
        );

        setEditId(null);
      } else {
        const newEntry = {
          ...values,
          id: data.length
            ? Math.max(...data.map((d) => d.id)) + 1
            : 1,
        };

        setData([...data, newEntry]);
      }

      setSuccessMsg("Saved Successfully");

      resetForm();
      setGeoPreview(null);
      setShowForm(false);
    },
  });

  const handleEdit = (row: DistrictRow) => {
    setEditId(row.id);

    formik.setValues({
      ...row,
      geoarea: null,
    });

    if (row.geoarea) {
      setGeoPreview(URL.createObjectURL(row.geoarea));
    } else {
      setGeoPreview(null);
    }

    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    setData(data.filter((d) => d.id !== id));
  };

  const columns = useMemo(
    () => [
      {
        header: "Sl No",
        enableColumnFilter: false,
        cell: (cell: any) => cell.row.index + 1,
      },

      {
        header: "District",
        enableColumnFilter: false,
        accessorKey: "district",
      },

      {
        header: "State",
        enableColumnFilter: false,
        accessorKey: "state",
      },

      {
        header: "Geo Area",
        enableColumnFilter: false,
        cell: (cell: any) => {
          const file = cell.row.original.geoarea;

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
        header: "Add All District",
        cell: (cell: any) =>
          cell.row.original.addAllDistrict ? "Yes" : "No",
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
    [data]
  );

  return (
    <div className="page-content">
      <div className="container-fluid">

        {/* HEADER */}
        <Row>
          <Col xs="12">
            <div className="page-title-box d-flex justify-content-between">
              <h4>District</h4>

              <Breadcrumb>
                <BreadcrumbItem>
                  <Link to="/villageapp">VillageApp</Link>
                </BreadcrumbItem>

                <BreadcrumbItem active>
                  District
                </BreadcrumbItem>
              </Breadcrumb>
            </div>
          </Col>
        </Row>

        {/* FORM */}
        {showForm && (
          <Card>
            <CardHeader>
              <h4>District Form</h4>
            </CardHeader>

            <CardBody>

              {successMsg && (
                <Alert color="success">
                  {successMsg}
                </Alert>
              )}

              <Form onSubmit={formik.handleSubmit}>

                
                <FormGroup>
                  <Label>District</Label>

                  <Input
                    name="district"
                    value={formik.values.district}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    invalid={
                      formik.touched.district &&
                      !!formik.errors.district
                    }
                  />

                  {formik.touched.district &&
                    formik.errors.district && (
                      <div className="text-danger">
                        {formik.errors.district}
                      </div>
                    )}
                </FormGroup>

                {/* STATE */}
                <FormGroup>
                  <Label>State</Label>

                  <Input
                    type="select"
                    name="state"
                    value={formik.values.state}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    invalid={
                      formik.touched.state &&
                      !!formik.errors.state
                    }
                  >
                    <option value="">
                      Select State
                    </option>

                    {states.map((state) => (
                      <option
                        key={state.id}
                        value={state.name}
                      >
                        {state.name}
                      </option>
                    ))}
                  </Input>

                  {formik.touched.state &&
                    formik.errors.state && (
                      <div className="text-danger">
                        {formik.errors.state}
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
                        const file = e.target.files[0];

                        if (file) {
                          formik.setFieldValue(
                            "geoarea",
                            file
                          );

                          setGeoPreview(
                            URL.createObjectURL(file)
                          );
                        }
                      }}
                    />
                  )}

                  {formik.touched.geoarea &&
                    formik.errors.geoarea && (
                      <div className="text-danger">
                        {formik.errors.geoarea as string}
                      </div>
                    )}
                </FormGroup>

              
                <FormGroup check>
                  <Label check>
                    <Input
                      type="checkbox"
                      name="addAllDistrict"
                      checked={
                        formik.values.addAllDistrict
                      }
                      onChange={formik.handleChange}
                    />

                    {" "}
                    Add All District
                  </Label>
                </FormGroup>

                {/* BUTTONS */}
                <div className="d-flex gap-2 mt-3">

                  <Button
                    color="soft-secondary"
                    type="button"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </Button>

                  <Button
                    color="primary"
                    type="submit"
                  >
                    {editId ? "Update" : "Submit"}
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
                  <h4>District List</h4>

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

export default District;