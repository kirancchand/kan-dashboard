import React, { useMemo, useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
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
} from "reactstrap";
import { Link } from "react-router-dom";
import { TableContainer } from "../../../common/AnalyticsTable/TableContainerReactTable";
import LocationFilter from "../../../Components/Common/LocationFilter"; // Adjust path to LocationFilter as needed
import {
  SortTanstackInterface,
  SortInterface,
} from "../../../Typecomponents/ComponentsType";
import { http } from "../../../http/http";
import {
  ADD_VILLAGE_NAME,
  GET_VILLAGE_NAME,
  UPDATE_VILLAGE_NAME,
  DELETE_VILLAGE_NAME,
} from "../Api";
import { toast } from "react-toastify";

interface SelectOption {
  value: string | number;
  label: string;
}

interface LocationValues {
  state: SelectOption | null;
  district: SelectOption | null;
  region: SelectOption | null;
  area: SelectOption | null;
  branch: SelectOption | null;
}

interface AppnameRow {
  villageapp_id: number;
  villageapp_name: string;
  villageapp_desc: string;
  villageapp_about: string;
}

const AppnameFormSchema = Yup.object().shape({
  villageapp_name: Yup.string()
    .min(3, "Name must be at least 3 characters")
    .max(60, "Name must not exceed 60 characters")
    .required("Name is required"),

  villageapp_desc: Yup.string()
    .min(10, "Description must be at least 10 characters")
    .max(200, "Description must not exceed 200 characters")
    .required("Description is required"),

  villageapp_about: Yup.string()
    .max(500, "About must not exceed 500 characters")
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
  const [loading, setLoading] = useState(false);

  const [totalCount, setTotalCount] = useState(0);
  const [data, setData] = useState<[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [tempName, setTempName] = useState("");

  // Location filter state
  const [locationValues, setLocationValues] = useState<LocationValues>({
    state: null,
    district: null,
    region: null,
    area: null,
    branch: null,
  });

  const handleLocationChange = (field: string, value: SelectOption | null) => {
    setLocationValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  let sort: SortInterface[] = [];

  let initialRequest = {
    start: 0,
    sort: [],
    numberOfRows: 10,
    filters: [],
  };

  async function saveVillageName(data: any) {
    setLoading(true);
    await http({
      method: "POST",
      url: ADD_VILLAGE_NAME,
      data,
    })
      .then(function (response) {
        if (response.status === 200) {
          formik.resetForm();
          toast(response.data.message, {
            position: "top-right",
            type: "success",
          });
          setShowForm(false);
          fetchData(initialRequest);
        } else {
          toast("Failed to Add village", {
            position: "top-right",
            type: "error",
          });
        }
        setLoading(false);
      })
      .catch((err) => {
        toast(err, { position: "top-right", type: "error" });
        setLoading(false);
      });
  }

  async function updateVillageName(data: any) {
    setLoading(true);
    await http({
      method: "POST",
      url: UPDATE_VILLAGE_NAME,
      data,
    })
      .then(function (response) {
        if (response.status === 200) {
          fetchData(initialRequest);
          setShowForm(false);
          toast(response.data.message, {
            position: "top-right",
            type: "success",
          });
        } else {
          toast("Failed to Add Users", {
            position: "top-right",
            type: "error",
          });
        }
        setLoading(false);
      })
      .catch((err) => {
        toast(err, { position: "top-right", type: "error" });
        setLoading(false);
      });
  }

  const formik = useFormik<AppnameRow>({
    initialValues: {
      villageapp_id: 0,
      villageapp_name: "",
      villageapp_desc: "",
      villageapp_about: "",
    },
    validationSchema: AppnameFormSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setApiError(null);
      setSuccessMsg(null);

      try {
        if (editId) {
          updateVillageName(values);
        } else {
          saveVillageName(values);
        }
      } catch (error) {
        setApiError("Something went wrong");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleEdit = (row: any) => {
    setEditId(row.villageapp_id);
    formik.setFieldValue("villageapp_id", row.villageapp_id);
    formik.setFieldValue("villageapp_name", row.villageapp_name);
    formik.setFieldValue("villageapp_desc", row.villageapp_desc);
    formik.setFieldValue("villageapp_about", row.villageapp_about);
    setShowForm(true);
  };

  async function deleteVillage(data: any) {
    setLoading(true);
    await http({
      method: "POST",
      url: DELETE_VILLAGE_NAME,
      data,
    })
      .then(function (response) {
        if (response.status === 200) {
          toast(response.data.message, {
            position: "top-right",
            type: "success",
          });
          fetchData(initialRequest);
        } else {
          toast("Failed to Delete Users", {
            position: "top-right",
            type: "error",
          });
        }
        setLoading(false);
      })
      .catch((err) => {
        toast(err, { position: "top-right", type: "error" });
        setLoading(false);
      });
  }

  const handleDelete = (row: any) => {
    deleteVillage({ villageapp_id: row.villageapp_id });
  };

  const columns = useMemo(
    () => [
      {
        header: "Sl No",
        cell: (cell: any) => cell.row.index + 1,
      },
      {
        header: "Name",
        accessorKey: "villageapp_name",
        enableColumnFilter: false,
      },
      {
        header: "Description",
        accessorKey: "villageapp_desc",
        enableColumnFilter: false,
      },
      {
        header: "About",
        accessorKey: "villageapp_about",
        enableColumnFilter: false,
      },
      {
        header: "Actions",
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
                onClick={() => handleDelete(row)}
              >
                Delete
              </Button>
            </div>
          );
        },
      },
    ],
    [page, sizePerPage, tableData],
  );

  const fetchData = async (requestdata: any) => {
    try {
      const response = await http.post(GET_VILLAGE_NAME, requestdata);
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

  const handleTableChange = ({
    pages,
    sizePerPages,
    sortField,
    sortOrder,
  }: any) => {
    setPage(pages);
    setSizePerPage(sizePerPages);
    if (sortField !== "" && sortOrder !== "") {
      sort = [
        {
          columnName: sortField,
          sortOrder: sortOrder,
        },
      ];
    }
    fetchData({
      start: (pages - 1) * sizePerPages,
      sort: sort,
      numberOfRows: sizePerPages,
      filters: [],
    });
  };

  const handleApplyFilter = () => {
    const filters: any[] = [];

    if (tempName) {
      filters.push({
        columnName: "villageapp_name",
        value: tempName,
      });
    }

    if (locationValues.state) {
      filters.push({
        columnName: "state",
        value: locationValues.state.value,
      });
    }

    if (locationValues.district) {
      filters.push({
        columnName: "district",
        value: locationValues.district.value,
      });
    }

    if (locationValues.region) {
      filters.push({
        columnName: "region",
        value: locationValues.region.value,
      });
    }

    if (locationValues.area) {
      filters.push({
        columnName: "area",
        value: locationValues.area.value,
      });
    }

    if (locationValues.branch) {
      filters.push({
        columnName: "branch",
        value: locationValues.branch.value,
      });
    }

    fetchData({
      start: 0,
      sort: [],
      numberOfRows: sizePerPage,
      filters,
    });
  };

  const handleClearFilter = () => {
    setTempName("");
    setLocationValues({
      state: null,
      district: null,
      region: null,
      area: null,
      branch: null,
    });
    fetchData(initialRequest);
  };

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

                <BreadcrumbItem active>Appname Form</BreadcrumbItem>
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
                  <h4 className="card-title mb-0">Appname Details</h4>
                </CardHeader>

                <CardBody>
                  {apiError && <Alert color="danger">{apiError}</Alert>}
                  {successMsg && <Alert color="success">{successMsg}</Alert>}

                  <Form onSubmit={formik.handleSubmit}>
                    <Row>
                      <Col md={6}>
                        <FormGroup>
                          <Label>App Name</Label>
                          <Input
                            name="villageapp_name"
                            value={formik.values.villageapp_name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            invalid={
                              !!formik.errors.villageapp_name &&
                              !!formik.touched.villageapp_name
                            }
                          />
                          <FormFeedback>
                            {formik.errors.villageapp_name}
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
                            name="villageapp_desc"
                            value={formik.values.villageapp_desc}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            invalid={
                              !!formik.errors.villageapp_desc &&
                              !!formik.touched.villageapp_desc
                            }
                          />
                          <FormFeedback>
                            {formik.errors.villageapp_desc}
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
                            name="villageapp_about"
                            value={formik.values.villageapp_about}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          />
                        </FormGroup>
                      </Col>
                    </Row>

                    <div className="d-flex gap-2 mt-3">
                      <Button
                        color="soft-secondary"
                        onClick={() => setShowForm(false)}
                      >
                        Cancel
                      </Button>
                      <Button color="primary" type="submit">
                        {editId ? "Update" : "Submit"}
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
                  <h4 className="card-title mb-0">Appnames</h4>
                  <div className="d-flex gap-2">
                    <Button
                      color={filterOpen ? "secondary" : "soft-primary"}
                      size="sm"
                      onClick={() => setFilterOpen(!filterOpen)}
                    >
                      <i className="mdi mdi-filter-outline me-1"></i>
                      {filterOpen ? "Hide Filters" : "Filter"}
                    </Button>

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
                  </div>
                </CardHeader>

                {/* FILTER PANEL */}
                {filterOpen && (
                  <CardBody className="border-bottom bg-light">
                    <Row className="g-2">
                      <Col md={3}>
                        <FormGroup className="mb-0">
                          <Label className="form-label font-size-13 text-muted">
                            App Name
                          </Label>
                          <Input
                            type="text"
                            placeholder="Search App Name"
                            value={tempName}
                            onChange={(e) => setTempName(e.target.value)}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={9}>
                        <Label className="form-label font-size-13 text-muted">
                          Location Filters
                        </Label>
                        <div className="d-flex flex-wrap gap-2">
                          <LocationFilter
                            values={locationValues}
                            setFieldValue={handleLocationChange}
                          />
                        </div>
                      </Col>
                    </Row>
                    <div className="d-flex justify-content-end gap-2 mt-3">
                      <Button
                        color="soft-secondary"
                        size="sm"
                        onClick={handleClearFilter}
                      >
                        Clear
                      </Button>
                      <Button
                        color="primary"
                        size="sm"
                        onClick={handleApplyFilter}
                      >
                        Apply Filter
                      </Button>
                    </div>
                  </CardBody>
                )}

                <CardBody>
                  {!loading ? (
                    <TableContainer
                      columns={columns || []}
                      data={data || []}
                      customPageSize={sizePerPage}
                      tableClass="table-centered align-middle table-wrap mb-0"
                      theadClass="text-muted table-light"
                      SearchPlaceholder="Search Users..."
                      isGlobalFilter={false}
                      page={page}
                      sorting={sorting}
                      setSorting={setSorting}
                      sizePerPage={sizePerPage}
                      clickable={false}
                      totalCount={totalCount}
                      handleTableChange={handleTableChange}
                      loading={loading}
                    />
                  ) : (
                    "Loading..."
                  )}
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