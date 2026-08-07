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
  Spinner,
  Badge,
  Alert,
} from "reactstrap";
import { Link } from "react-router-dom";
import { TableContainer } from "../../../common/AnalyticsTable/TableContainerReactTable";
import {
  SortTanstackInterface,
  SortInterface,
} from "../../../Typecomponents/ComponentsType";
import RSelect from "../../../Components/Common/RSelect/RSelect";
import LocationFilter from "../../../Components/Common/LocationFilter";
import { http } from "../../../http/http";
import {
  ADD_VILLAGE_ADVERTISEMENT,
  GET_VILLAGE_ADVERTISEMENT,
  MD_URL,
  UPDATE_VILLAGE_ADVERTISEMENT,
  DELETE_VILLAGE_ADVERTISEMENT,
} from "../Api";
import { toast } from "react-toastify";
import mdurl from "../../../http/masterDataURL";

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

interface keyValue {
  value: number;
  label: string;
}

interface AdvRow {
  villageadvertisement_id: number;
  advertisement_name: string;
  advertisement_image: File | null;
  advertisement_desc: string;
  start_date: string;
  end_date: string;
  f_villageapp_id: keyValue | null;
  f_villageorganisation_id: keyValue | null;
}

const Advertisement = () => {
  const [data, setData] = useState<AdvRow[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [sizePerPage, setSizePerPage] = useState(10);
  const [sorting, setSorting] = useState<SortTanstackInterface[]>([]);
  const [villageAppData, setVillageAppData] = useState([]);
  const [villageAppDataLoading, setVillageAppDataLoading] = useState(false);
  const [villageOrganisationData, setVillageOrganisationData] = useState([]);
  const [villageOrganisationDataLoading, setVillageOrganisationDataLoading] =
    useState(false);
  const [filterName, setFilterName] = useState("");
  const [filterVillageApp, setFilterVillageApp] = useState("");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");

  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  // Location Filter State
  const [filterOpen, setFilterOpen] = useState(false);
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

  // Validation with conditional image requirement
  const validationSchema = Yup.object({
    advertisement_name: Yup.string()
      .min(3, "Minimum 3 characters")
      .required("Name is required"),
    advertisement_desc: Yup.string()
      .min(10, "Minimum 10 characters")
      .required("Description is required"),
    image: Yup.mixed().test(
      "required-image",
      "Image is required",
      function (value) {
        const { editId } = this.options.context || {};
        if (editId) return true;
        return !!value;
      },
    ),
  });

  async function fetchVillageApps() {
    setVillageAppDataLoading(true);
    mdurl(MD_URL, "getAll_VillageApp")
      .then((r) => {
        setVillageAppData(r);
        setVillageAppDataLoading(false);
      })
      .catch((error) => {
        toast(error, { position: "top-right", type: "error" });
        setVillageAppDataLoading(false);
      });
  }

  async function fetchVillageOrganisation() {
    setVillageOrganisationDataLoading(true);
    mdurl(MD_URL, "getAll_VillageOrganisation")
      .then((r) => {
        setVillageOrganisationData(r);
        setVillageOrganisationDataLoading(false);
      })
      .catch((error) => {
        toast(error, { position: "top-right", type: "error" });
        setVillageOrganisationDataLoading(false);
      });
  }

  useEffect(() => {
    fetchVillageApps();
    fetchVillageOrganisation();
  }, []);

  let initialRequest = {
    start: 0,
    sort: [],
    numberOfRows: 10,
    filters: [],
  };

  async function saveVillageAdvertisement(data: any) {
    setLoading(true);
    await http({
      method: "POST",
      url: ADD_VILLAGE_ADVERTISEMENT,
      data,
      headers: {
        "Content-Type": "multipart/form-data",
      },
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

  async function updateVillageAdvertisement(data: any) {
    setLoading(true);
    await http({
      method: "POST",
      url: UPDATE_VILLAGE_ADVERTISEMENT,
      data,
      headers: {
        "Content-Type": "multipart/form-data",
      },
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

  const formik = useFormik<AdvRow>({
    initialValues: {
      villageadvertisement_id: 0,
      advertisement_name: "",
      advertisement_image: null,
      advertisement_desc: "",
      start_date: "",
      end_date: "",
      f_villageapp_id: null,
      f_villageorganisation_id: null,
    },
    onSubmit: (values, { resetForm, setSubmitting }) => {
      const formData = new FormData();
      formData.append("advertisement_name", values.advertisement_name);
      formData.append("advertisement_desc", values.advertisement_desc);
      formData.append("start_date", values.start_date || "");
      formData.append("end_date", values.end_date || "");
      formData.append(
        "f_villageapp_id",
        values.f_villageapp_id?.value.toString() || "",
      );
      formData.append(
        "f_villageorganisation_id",
        values.f_villageorganisation_id?.value.toString() || "",
      );

      if (values.advertisement_image) {
        formData.append("advertisement_image", values.advertisement_image);
      }

      if (editId) {
        formData.append(
          "villageadvertisement_id",
          values.villageadvertisement_id.toString(),
        );
        updateVillageAdvertisement(formData);
      } else {
        saveVillageAdvertisement(formData);
      }

      resetForm();
      setImagePreview(null);
      setShowForm(false);
      setSubmitting(false);
    },
  });

  const handleEdit = (row: AdvRow) => {
    setEditId(row.villageadvertisement_id);
    formik.setFieldValue(
      "villageadvertisement_id",
      row.villageadvertisement_id,
    );
    formik.setFieldValue("advertisement_name", row.advertisement_name);
    formik.setFieldValue("advertisement_image", row.advertisement_image);
    formik.setFieldValue("advertisement_desc", row.advertisement_desc);
    formik.setFieldValue("start_date", row.start_date);
    formik.setFieldValue("end_date", row.end_date);
    formik.setFieldValue(
      "f_villageapp_id",
      villageAppData.find((vap: any) => vap.value == row.f_villageapp_id),
    );
    formik.setFieldValue(
      "f_villageorganisation_id",
      villageOrganisationData.find(
        (vap: any) => vap.value == row.f_villageorganisation_id,
      ),
    );
    setShowForm(true);
  };

  async function deleteAdv(data: any) {
    setLoading(true);
    await http({
      method: "POST",
      url: DELETE_VILLAGE_ADVERTISEMENT,
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
    deleteAdv({ villageadvertisement_id: row.villageadvertisement_id });
  };

  const columns = useMemo(
    () => [
      {
        header: "Sl No",
        enableColumnFilter: false,
        cell: (cell: any) => cell.row.index + 1,
      },
      {
        header: "Name",
        enableColumnFilter: false,
        accessorKey: "advertisement_name",
      },
      {
        header: "Image",
        cell: (cell: any) => {
          const file = cell.row.original.advertisement_image;

          return file ? (
            <img src={file} width="50" height="50" alt="img" />
          ) : null;
        },
      },
      {
        header: "Advertisement Desc",
        enableColumnFilter: false,
        accessorKey: "advertisement_desc",
      },
      {
        header: "Start Date",
        enableColumnFilter: false,
        accessorKey: "start_date",
      },
      {
        header: "End Date",
        enableColumnFilter: false,
        accessorKey: "end_date",
      },
      {
        header: "Village App",
        enableColumnFilter: false,
        accessorKey: "villageapp_name",
      },
      {
        header: "Village Organisation",
        enableColumnFilter: false,
        accessorKey: "organisation_name",
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
                onClick={() => handleDelete(row)}
              >
                Delete
              </Button>
            </div>
          );
        },
      },
    ],
    [data],
  );

  const fetchData = async (requestdata: any) => {
    try {
      const response = await http.post(GET_VILLAGE_ADVERTISEMENT, requestdata);
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

  const getActiveFilters = () => {
    const filters: any[] = [];
    if (locationValues.state)
      filters.push({ columnName: "state", value: locationValues.state.value });
    if (locationValues.district)
      filters.push({
        columnName: "district",
        value: locationValues.district.value,
      });
    if (locationValues.region)
      filters.push({
        columnName: "region",
        value: locationValues.region.value,
      });
    if (locationValues.area)
      filters.push({ columnName: "area", value: locationValues.area.value });
    if (locationValues.branch)
      filters.push({
        columnName: "branch",
        value: locationValues.branch.value,
      });
    return filters;
  };

  const handleApplyFilter = () => {
    fetchData({
      start: 0,
      sort: sort,
      numberOfRows: sizePerPage,
      filters: getActiveFilters(),
    });
  };

  const handleClearFilter = () => {
    setLocationValues({
      state: null,
      district: null,
      region: null,
      area: null,
      branch: null,
    });
    fetchData(initialRequest);
  };

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
      filters: getActiveFilters(),
    });
  };

  return (
    <div className="page-content">
      <div className="container-fluid">
        {/* Breadcrumb */}
        <Row>
          <Col xs="12">
            <div className="page-title-box d-flex justify-content-between align-items-center">
              <h4 className="mb-0">Advertisement Form</h4>

              <Breadcrumb listClassName="m-0">
                <BreadcrumbItem>
                  <Link to="/villageapp">VillageApp</Link>
                </BreadcrumbItem>
                <BreadcrumbItem active>Advertisement</BreadcrumbItem>
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
              <Form onSubmit={formik.handleSubmit}>
                <FormGroup>
                  <Label>Select Village App</Label>
                  <RSelect
                    name="f_villageapp_id"
                    id="f_villageapp_id"
                    value={formik.values.f_villageapp_id}
                    onChange={(ev: any) =>
                      formik.setFieldValue("f_villageapp_id", ev)
                    }
                    options={villageAppData}
                    placeholder="--Select Village--"
                    error={formik.errors.f_villageapp_id}
                    touched={formik.touched.f_villageapp_id}
                    isLoading={villageAppDataLoading}
                    isClearable
                  />
                  {formik.touched.f_villageapp_id &&
                    formik.errors.f_villageapp_id && (
                      <div className="text-danger">
                        {formik.errors.f_villageapp_id as string}
                      </div>
                    )}
                </FormGroup>

                <FormGroup>
                  <Label>Select Organisation</Label>
                  <RSelect
                    name="f_villageorganisation_id"
                    id="f_villageorganisation_id"
                    value={formik.values.f_villageorganisation_id}
                    onChange={(ev: any) =>
                      formik.setFieldValue("f_villageorganisation_id", ev)
                    }
                    options={villageOrganisationData}
                    placeholder="--Select Organisation--"
                    error={formik.errors.f_villageorganisation_id}
                    touched={formik.touched.f_villageorganisation_id}
                    isLoading={villageOrganisationDataLoading}
                    isClearable
                  />
                  {formik.touched.f_villageorganisation_id &&
                    formik.errors.f_villageorganisation_id && (
                      <div className="text-danger">
                        {formik.errors.f_villageorganisation_id as string}
                      </div>
                    )}
                </FormGroup>

                <FormGroup>
                  <Label>Advertisement Name</Label>
                  <Input
                    name="advertisement_name"
                    onChange={formik.handleChange}
                    value={formik.values.advertisement_name}
                    onBlur={formik.handleBlur}
                    invalid={
                      formik.touched.advertisement_name &&
                      !!formik.errors.advertisement_name
                    }
                  />
                  {formik.touched.advertisement_name &&
                    formik.errors.advertisement_name && (
                      <div className="text-danger">
                        {formik.errors.advertisement_name}
                      </div>
                    )}
                </FormGroup>

                <FormGroup>
                  <Label>Advertisement Description</Label>
                  <Input
                    name="advertisement_desc"
                    onChange={formik.handleChange}
                    value={formik.values.advertisement_desc}
                    onBlur={formik.handleBlur}
                    invalid={
                      formik.touched.advertisement_desc &&
                      !!formik.errors.advertisement_desc
                    }
                  />
                  {formik.touched.advertisement_desc &&
                    formik.errors.advertisement_desc && (
                      <div className="text-danger">
                        {formik.errors.advertisement_desc}
                      </div>
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
                          formik.setFieldValue("advertisement_image", null);
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
                        formik.setFieldTouched("advertisement_image", true);
                        if (file) {
                          formik.setFieldValue("advertisement_image", file);
                          setImagePreview(URL.createObjectURL(file));
                        }
                      }}
                    />
                  )}
                </FormGroup>

                <FormGroup>
                  <Label> Start Date</Label>
                  <Input
                    type="date"
                    name="start_date"
                    onChange={formik.handleChange}
                    value={formik.values.start_date || ""}
                  />
                </FormGroup>

                <FormGroup>
                  <Label> End Date</Label>
                  <Input
                    type="date"
                    name="end_date"
                    onChange={formik.handleChange}
                    value={formik.values.end_date || ""}
                  />
                </FormGroup>

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
        )}

        {/* TABLE */}
        {!showForm && (
          <Card>
            <CardHeader className="d-flex justify-content-between align-items-center">
              <h4 className="card-title mb-0">Advertisement List</h4>

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
                    setImagePreview(null);
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
                  <Col md={4}>
                    <FormGroup className="mb-0">
                      <Label className="form-label font-size-13 text-muted">
                        Organization name
                      </Label>
                      <Input
                        type="text"
                        placeholder="Search Organization Name"
                        value={filterName}
                        onChange={(e) => setFilterName(e.target.value)}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup className="mb-0">
                      <Label className="form-label font-size-13 text-muted">
                        Village App name
                      </Label>
                      <RSelect
                        value={filterVillageApp}
                        onChange={(selected: any) =>
                          setFilterVillageApp(selected)
                        }
                        options={villageAppData}
                        placeholder="Select Village App"
                        isLoading={villageAppDataLoading}
                        isClearable
                      />
                    </FormGroup>
                  </Col>
                  <Col md={2}>
                    <FormGroup className="mb-0">
                      <Label className="form-label font-size-13 text-muted">
                        Start Date
                      </Label>
                      <Input
                        type="date"
                        value={filterStartDate}
                        onChange={(e) => setFilterStartDate(e.target.value)}
                      />
                    </FormGroup>
                  </Col>

                  <Col md={2}>
                    <FormGroup className="mb-0">
                      <Label className="form-label font-size-13 text-muted">
                        End Date
                      </Label>
                      <Input
                        type="date"
                        value={filterEndDate}
                        onChange={(e) => setFilterEndDate(e.target.value)}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={12}>
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
                  <Button color="primary" size="sm" onClick={handleApplyFilter}>
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
        )}
      </div>
    </div>
  );
};

export default Advertisement;
