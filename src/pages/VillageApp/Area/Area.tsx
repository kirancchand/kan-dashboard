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

interface AreaRow {
  id: number;
  region: string;
  localbodytype: string;
  area: string;
  geoarea: File | null;
  addAllLocalBody: boolean;
}

const schema = Yup.object({
  region: Yup.string().required("Required"),
  localbodytype: Yup.string().required("Required"),
  area: Yup.string().required("Required"),
  geoarea: Yup.mixed().nullable().required("Required"),
  addAllLocalBody: Yup.boolean(),
});

const Area = () => {

  const [data, setData] = useState<AreaRow[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [sizePerPage, setSizePerPage] = useState(10);
  const [sorting, setSorting] = useState<SortTanstackInterface[]>([]);

  const [geoPreview, setGeoPreview] = useState<string | null>(null);

  const [regions] = useState([
    { id: "1", name: "South Region" },
    { id: "2", name: "North Region" },
    { id: "3", name: "Central Region" },
  ]);

  const [localBodyTypes] = useState([
    { id: "1", name: "Panchayat" },
    { id: "2", name: "Municipality" },
    { id: "3", name: "Corporation" },
  ]);

  const handleTableChange = ({ page, sizePerPage }: any) => {
    setPage(page);
    setSizePerPage(sizePerPage);
  };

  const formik = useFormik<AreaRow>({
    initialValues: {
      id: 0,
      region: "",
      localbodytype: "",
      area: "",
      geoarea: null,
      addAllLocalBody: false,
    },

    validationSchema: schema,

    onSubmit: (values, { resetForm }) => {

      if (editId) {

        setData(
          data.map((d) =>
            d.id === editId
              ? { ...values, id: editId }
              : d
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

  const handleEdit = (row: AreaRow) => {

    setEditId(row.id);

    formik.setValues({
      ...row,
      geoarea: null,
    });

    if (row.geoarea) {
      setGeoPreview(
        URL.createObjectURL(row.geoarea)
      );
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
        cell: (cell: any) =>
          cell.row.index + 1,
      },

      {
        header: "Region",
        enableColumnFilter: false,
        accessorKey: "region",
      },

      {
        header: "Local Body Type",
        enableColumnFilter: false,
        accessorKey: "localbodytype",
      },

      {
        header: "Area",
        enableColumnFilter: false,
        accessorKey: "area",
      },

      {
        header: "Geo Area",
        enableColumnFilter: false,
        cell: (cell: any) => {

          const file =
            cell.row.original.geoarea;

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
        header: "Add All Local Body",
        enableColumnFilter: false,
        cell: (cell: any) =>
          cell.row.original.addAllLocalBody
            ? "Yes"
            : "No",
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
                onClick={() =>
                  handleEdit(row)
                }
              >
                Edit
              </Button>

              <Button
                size="sm"
                color="soft-danger"
                onClick={() =>
                  handleDelete(row.id)
                }
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

              <h4>Area</h4>

              <Breadcrumb>

                <BreadcrumbItem>
                  <Link to="/villageapp">
                    VillageApp
                  </Link>
                </BreadcrumbItem>

                <BreadcrumbItem active>
                  Area
                </BreadcrumbItem>

              </Breadcrumb>
            </div>
          </Col>
        </Row>

        {/* FORM */}
        {showForm && (

          <Card>

            <CardHeader>
              <h4>Area Form</h4>
            </CardHeader>

            <CardBody>

              {successMsg && (
                <Alert color="success">
                  {successMsg}
                </Alert>
              )}

              <Form onSubmit={formik.handleSubmit}>

                {/* REGION */}
                <FormGroup>

                  <Label>Region</Label>

                  <Input
                    type="select"
                    name="region"
                    value={formik.values.region}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    invalid={
                      formik.touched.region &&
                      !!formik.errors.region
                    }
                  >

                    <option value="">
                      Select Region
                    </option>

                    {regions.map((region) => (
                      <option
                        key={region.id}
                        value={region.name}
                      >
                        {region.name}
                      </option>
                    ))}

                  </Input>

                  {formik.touched.region &&
                    formik.errors.region && (
                      <div className="text-danger">
                        {formik.errors.region}
                      </div>
                    )}

                </FormGroup>

                {/* LOCAL BODY TYPE */}
                <FormGroup>

                  <Label>
                    Local Body Type
                  </Label>

                  <Input
                    type="select"
                    name="localbodytype"
                    value={
                      formik.values.localbodytype
                    }
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    invalid={
                      formik.touched
                        .localbodytype &&
                      !!formik.errors
                        .localbodytype
                    }
                  >

                    <option value="">
                      Select Local Body Type
                    </option>

                    {localBodyTypes.map((item) => (
                      <option
                        key={item.id}
                        value={item.name}
                      >
                        {item.name}
                      </option>
                    ))}

                  </Input>

                  {formik.touched
                    .localbodytype &&
                    formik.errors
                      .localbodytype && (
                      <div className="text-danger">
                        {
                          formik.errors
                            .localbodytype
                        }
                      </div>
                    )}

                </FormGroup>

                {/* AREA */}
                <FormGroup>

                  <Label>Area</Label>

                  <Input
                    type="text"
                    name="area"
                    value={formik.values.area}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    invalid={
                      formik.touched.area &&
                      !!formik.errors.area
                    }
                  />

                  {formik.touched.area &&
                    formik.errors.area && (
                      <div className="text-danger">
                        {formik.errors.area}
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

                        const file =
                          e.target.files[0];

                        if (file) {

                          formik.setFieldValue(
                            "geoarea",
                            file
                          );

                          setGeoPreview(
                            URL.createObjectURL(
                              file
                            )
                          );
                        }
                      }}
                    />

                  )}

                  {formik.touched.geoarea &&
                    formik.errors.geoarea && (
                      <div className="text-danger">
                        {
                          formik.errors
                            .geoarea as string
                        }
                      </div>
                    )}

                </FormGroup>

                {/* BOOLEAN */}
                <FormGroup check>

                  <Label check>

                    <Input
                      type="checkbox"
                      name="addAllLocalBody"
                      checked={
                        formik.values
                          .addAllLocalBody
                      }
                      onChange={
                        formik.handleChange
                      }
                    />

                    {" "}
                    Add All Local Body

                  </Label>

                </FormGroup>

                {/* BUTTONS */}
                <div className="d-flex gap-2 mt-3">

                  <Button
                    color="soft-secondary"
                    type="button"
                    onClick={() =>
                      setShowForm(false)
                    }
                  >
                    Cancel
                  </Button>

                  <Button
                    color="primary"
                    type="submit"
                  >
                    {editId
                      ? "Update"
                      : "Submit"}
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

                  <h4>Area List</h4>

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
                    handleTableChange={
                      handleTableChange
                    }
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

export default Area;