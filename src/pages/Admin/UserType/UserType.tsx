import React, { useMemo, useState, useEffect } from "react";
import { TableContainer } from "../../../../src/Responsive Table/TableContainerReactTable";
import {
  SortTanstackInterface,
  SortInterface,
} from "../../../../src/Typecomponents/ComponentsType";
import { http } from "../../../../src/http/http";
import { GET_USERTYPE_LIST, ADD_USERTYPE } from "../../../http/http";
import { Formik, Field, Form } from "formik";
import { toast } from "react-toastify";
import { Row, Col, Input, Button } from "reactstrap";

interface DataItem {
  usertype_id: number;
  usertype_name: string;
}

const UserType = () => {
  const [page, setPage] = useState(1);
  const [sizePerPage, setSizePerPage] = useState(10);
  const [sorting, setSorting] = useState<SortTanstackInterface[]>([]);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [mode, setMode] = useState("");
  const [modal, setModal] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [data, setData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(false);
  let sort: SortInterface[] = [];
  const toggle = () => {
    setModal(!modal);
    if (modal) {
      setSelectedUser(null);
    }
  };
  const addToggle = () => {
    setModal(!modal);
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
        id: "UserType Name",
        header: "UserType Name",
        accessorKey: "usertype_name",
        enableColumnFilter: false,
      },
    ],
    [toggle, page, sizePerPage],
  );
  let initialRequest = {
    start: 0,
    sort: [],
    numberOfRows: 10,
    filters: [],
  };
  const fetchData = async (requestdata: any) => {
    try {
      const response = await http.post(GET_USERTYPE_LIST, requestdata);
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
    console.log("page", page);
  };
  const initialValue = {
    usertype_name: "",
  };
  async function addNewUserType(data: any) {
    console.log("data", data);
    setLoading(true);
    await http({
      method: "POST",
      url: ADD_USERTYPE,
      data,
    })
      .then(function (response) {
        if (response.status === 200) {
          console.log(response.data);
          fetchData(initialRequest);
          toast(response.data.message, {
            position: "top-right",
            type: "success",
          });
        } else {
          toast("Failed to Add UserType", {
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
    addNewUserType(values);
    resetForm();
  };
  return (
    <React.Fragment>
      <div style={{ padding: "50px", marginTop: "50px" }}>
        <Row>
          <Col md="12">
            <div className="plants-header">
              <h1>UserType</h1>
              <Formik initialValues={initialValue} onSubmit={handleSubmit}>
                {({ errors, touched, values }) => (
                  <Form>
                    <Row>
                      <Col md="12">
                        <div className="input-group">
                          <Field
                            type="text"
                            name="usertype_name"
                            id="usertype_name"
                            value={values.usertype_name}
                            placeholder="usertype"
                            as={Input}
                            invalid={
                              errors.usertype_name && touched.usertype_name
                            }
                            autoComplete="off"
                          />
                          <Button
                            className="primary"
                            type="submit"
                            color="primary"
                          >
                            Save
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  </Form>
                )}
              </Formik>
            </div>
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
export default UserType;
