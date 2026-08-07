import React, { useMemo, useState, useEffect, useRef } from "react";
import { TableContainer } from "../../../../src/Responsive Table/TableContainerReactTable";
import {
  SortTanstackInterface,
  SortInterface,
} from "../../../../src/Typecomponents/ComponentsType";
import {
  http,
  GET_ROLE_MENU_LIST,
  addRoleMenu,
  GET_MENU_BY_ROLE_ID,
  UPDATE_ROLEMENU,
} from "../../../http/http";
import { toast } from "react-toastify";
import { Formik, Field, Form, ErrorMessage } from "formik";
import md from "../../../http/masterData";

import { Row, Col, FormGroup, Input, Button, FormFeedback } from "reactstrap";
import RSelect from "../../../../src/Components/Common/RSelect/RSelect";
import RSelectMulti from "../../../../src/Components/Common/RSelectMulti/RSelectMulti";

interface DataItem {
  usertype_id: number;
  usertype: string;
  role: string;
}

const staticRoleData = [
  { value: "1", label: "Admin" },
  { value: "2", label: "Owner" },
  { value: "3", label: "Manager" },
  { value: "4", label: "User" },
  { value: "5", label: "Guest" },
];

const staticUserTypeData = [
  { value: "1", label: "Admin" },
  { value: "2", label: "Owner" },
  { value: "3", label: "Manager" },
  { value: "4", label: "User" },
  { value: "5", label: "Guest" },
];

const UserTypeRole = () => {
  const [page, setPage] = useState(1);
  const [sizePerPage, setSizePerPage] = useState(10);
  const [sorting, setSorting] = useState<SortTanstackInterface[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [data, setData] = useState<DataItem[]>([]);

  const [roleData, setRoleData] = useState<any[]>(staticRoleData);
  const [userTypeData, setUserTypeData] = useState<any[]>(staticUserTypeData);
  const [roleLoading, setRoleLoading] = useState(false);
  const [userTypeLoading, setUserTypeLoading] = useState(false);
  const [editData, setEditData] = useState<any>([]);

  const formRef = useRef<any>(null);

  useEffect(() => {
    async function getRole() {
      setRoleLoading(true);
      md("getAll_Role")
        .then((r) => {
          if (r && r.length > 0) setRoleData(r);
          setRoleLoading(false);
        })
        .catch(() => {
          setRoleLoading(false);
        });
    }

    async function getUserType() {
      setUserTypeLoading(true);
      md("getAll_Usertype")
        .then((r) => {
          if (r && r.length > 0) setUserTypeData(r);
          setUserTypeLoading(false);
        })
        .catch(() => {
          setUserTypeLoading(false);
        });
    }

    getRole();
    getUserType();
  }, []);

  useEffect(() => {
    if (editData.length > 0 && formRef.current) {
      formRef.current.setFieldValue(
        "usertype",
        userTypeData.find(
          (u: any) => u.value === editData[0].f_usertype_id.toString(),
        ),
      );

      let roles = editData.map((item: any) =>
        roleData.find((r: any) => r.value === item.f_role_id.toString()),
      );
      formRef.current.setFieldValue("role", roles);
    }
  }, [editData, userTypeData, roleData]);

  let initialValue = {
    usertype: null,
    role: [],
  };

  const userTypeFunc = (value: any, setFieldValue: any) => {
    setFieldValue("usertype", value);
  };

  const roleFunc = (value: any, setFieldValue: any) => {
    setFieldValue("role", value);
  };

  async function getUserTypeRole(usertype_id: any) {
    setLoading(true);
    await http({
      method: "GET",
      url: GET_MENU_BY_ROLE_ID + "/" + usertype_id,
    })
      .then(function (response) {
        if (response.status === 200) {
          setEditData(response.data.data);
        } else {
          toast("Failed to Get Data", { position: "top-right", type: "error" });
        }
        setLoading(false);
      })
      .catch((err) => {
        toast(err, { position: "top-right", type: "error" });
        setLoading(false);
      });
  }

  const handleUpdate = (row: any) => {
    getUserTypeRole(row.usertype_id);
  };

  const serialNo = (celldata: any) => {
    return (
      <span>{(page - 1) * sizePerPage + (Number(celldata.row.index) + 1)}</span>
    );
  };

  const columns = useMemo(
    () => [
      {
        id: "slno",
        header: "Sl No",
        accessorKey: "slno",
        enableColumnFilter: false,
        cell: (cell: any) => serialNo(cell),
      },
      {
        id: "User Type",
        header: "User Type",
        accessorKey: "usertype",
        enableColumnFilter: false,
      },
      {
        id: "Role Name",
        header: "Role Name",
        accessorKey: "role",
        enableColumnFilter: false,
      },
      {
        header: "Actions",
        cell: (cell: any) => {
          const row = cell.row.original;
          return (
            <div className="d-flex gap-2">
              <Button
                size="sm"
                color="soft-danger"
                onClick={() => handleUpdate(row)}
              >
                Edit
              </Button>
            </div>
          );
        },
      },
    ],
    [page, sizePerPage],
  );

  let initialRequest = {
    start: 0,
    sort: [],
    numberOfRows: 10,
    filters: [],
  };

  const fetchData = async (requestdata: any) => {
    try {
      const response = await http.post(GET_ROLE_MENU_LIST, requestdata);
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
    let sort: SortInterface[] = [];
    if (sortField !== "" && sortOrder !== "") {
      sort = [{ columnName: sortField, sortOrder: sortOrder }];
    }
    fetchData({
      start: (pages - 1) * sizePerPages,
      sort: sort,
      numberOfRows: sizePerPages,
      filters: [],
    });
  };

  async function addNewUserTypeRole(data: any) {
    setLoading(true);
    await http({
      method: "POST",
      url: addRoleMenu,
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
          toast("Failed to Add State", {
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

  async function updateUserTypeRole(data: any) {
    setLoading(true);
    await http({
      method: "POST",
      url: UPDATE_ROLEMENU,
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
          toast("Failed to Add State", {
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

  const handleSubmit = (values: any, { resetForm }: any) => {
    if (editData.length > 0) {
      updateUserTypeRole(values);
    } else {
      addNewUserTypeRole(values);
    }
    resetForm();
  };

  return (
    <React.Fragment>
      <div style={{ padding: "50px", marginTop: "50px" }}>
        <Row>
          <Col md="12">
            <Row>
              <Col md="5">
                <h1>User Type Role</h1>
              </Col>
              <Col md="7">
                <Formik
                  initialValues={initialValue}
                  onSubmit={handleSubmit}
                  innerRef={formRef}
                >
                  {({ errors, touched, values, setFieldValue }) => (
                    <Form>
                      <Row>
                        <Col md="5">
                          <FormGroup>
                            <Field
                              component={RSelect}
                              name="usertype"
                              id="usertype"
                              value={values.usertype}
                              onChange={(ev: any) =>
                                userTypeFunc(ev, setFieldValue)
                              }
                              options={userTypeData}
                              placeholder="--Select User Type--"
                              error={errors.usertype}
                              touched={touched.usertype}
                              isLoading={userTypeLoading}
                              isClearable
                            />
                          </FormGroup>
                        </Col>

                        <Col md="5">
                          <FormGroup>
                            <Field
                              component={RSelectMulti}
                              name="role"
                              id="role"
                              onChange={(ev: any) =>
                                roleFunc(ev, setFieldValue)
                              }
                              value={values.role}
                              options={roleData}
                              placeholder="--Select Role--"
                              isLoading={roleLoading}
                              isClearable
                              error={errors.role}
                              touched={touched.role}
                            />
                            <FormFeedback>
                              <ErrorMessage name="role" />
                            </FormFeedback>
                          </FormGroup>
                        </Col>

                        <Col md="2">
                          <Button type="submit" color="primary">
                            {editData.length > 0 ? "Update" : "Save"}
                          </Button>
                        </Col>
                      </Row>
                    </Form>
                  )}
                </Formik>
              </Col>
            </Row>
          </Col>
        </Row>

        <Row>
          <Col md="12">
            <TableContainer
              columns={columns || []}
              data={data || []}
              customPageSize={sizePerPage}
              tableClass="table-centered align-middle table-nowrap mb-0"
              theadClass="text-muted table-light"
              SearchPlaceholder="Search Users..."
              isGlobalFilter={true}
              page={page}
              sorting={sorting}
              setSorting={setSorting}
              sizePerPage={sizePerPage}
              clickable={false}
              totalCount={totalCount}
              handleTableChange={handleTableChange}
              loading={loading}
            />
          </Col>
        </Row>
      </div>
    </React.Fragment>
  );
};

export default UserTypeRole;
