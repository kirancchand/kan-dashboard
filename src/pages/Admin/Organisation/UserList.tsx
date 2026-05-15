import React, {
  useMemo,
  useState,
  useEffect,
} from "react";
import md from "../../../http/masterData";
import { toast } from "react-toastify";

import {
  Row,
  Col,
  Card,
  CardBody,
  Label,
  Input,
  Button,
} from "reactstrap";

import { TableContainer } from "../../../common/AnalyticsTable/TableContainerReactTable";
interface Props {
  setSelectedUser: React.Dispatch<React.SetStateAction<any>>;
  areaOptions: any[];   // Add this
  branchOptions: any[]; // Add this
}

interface UserType {
  id: number;
  state: string;
  district: string;
  area: string;
  branch: string;
  userName: string;

 
}


const initialFilter = {
  state: "",
  district: "",
  area: "",
  branch: "",
  userName: "",
  searchFrom: "mysql",
};

const UserList = ({
  setSelectedUser,areaOptions = [],   // Add this
  branchOptions = [], // Add this
}: Props) => {

  const [filters, setFilters] =useState(initialFilter);

  const [tableData, setTableData] = useState<UserType[]>([]);

  const [isSearched, setIsSearched] = useState(false);

  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const [mysqlData, setMysqlData] = useState<UserType[]>([]);
  const [elasticData, setElasticData] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(false);

  const getData = (): UserType[] => {
    return filters.searchFrom ===
      "mysql"
      ? mysqlData
      : elasticData;
  };

  const baseData = getData();

  const states = useMemo(
    () =>
      Array.from(
        new Set(
          baseData.map((x) => x.state)
        )
      ),
    [baseData]
  );

  const districts = useMemo(
    () =>
      Array.from(
        new Set(
          baseData.map(
            (x) => x.district
          )
        )
      ),
    [baseData]
  );

  const areas = useMemo(
    () =>
      Array.from(
        new Set(
          baseData.map((x) => x.area)
        )
      ),
    [baseData]
  );

  const branches = useMemo(
    () =>
      Array.from(
        new Set(
          baseData.map(
            (x) => x.branch
          )
        )
      ),
    [baseData]
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    const { name, value } =
      e.target;

    if (name === "state") {
      setFilters({
        ...filters,
        state: value,
        district: "",
        area: "",
        branch: "",
        userName: "",
      });

      return;
    }

    if (name === "district") {
      setFilters({
        ...filters,
        district: value,
        area: "",
        branch: "",
      });

      return;
    }

    if (name === "area") {
      setFilters({
        ...filters,
        area: value,
        branch: "",
      });

      return;
    }

    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const handleSearch = () => {

    const data = getData();

    const result = data.filter(
      (item) => {
        return (
          (filters.state ? item.state ===filters.state: true) &&

          (filters.district? item.district ===filters.district: true) &&

          (filters.area? item.area === filters.area: true) &&

          (filters.branch? item.branch ===filters.branch : true) &&

          (filters.userName? item.userName.toLowerCase()
                .includes(
                  filters.userName.toLowerCase()
                )
            : true)
        );
      }
    );

    setTableData(result);

    setIsSearched(true);
  };

  const handleReset = () => {

    setFilters(initialFilter);

    setTableData([]);

    setIsSearched(false);
  };

  const columns = useMemo(
    () => [
      {
        id: "slno",

        header: "Sl No",

        cell: ({ row }: any) =>
          row.index + 1,
      },

      {
        accessorKey: "userName",

        header: "User Name",

        enableColumnFilter: false,
      },

      {
        accessorKey: "state",

        header: "State",

        enableColumnFilter: false,
      },

      {
        accessorKey: "district",

        header: "District",

        enableColumnFilter: false,
      },

      {
        accessorKey: "area",

        header: "Area",

        enableColumnFilter: false,
      },

      {
        accessorKey: "branch",

        header: "Branch",

        enableColumnFilter: false,
      },

      {
        id: "action",

        header: "Action",

        cell: ({ row }: any) => {

          const isOpen =
            openMenuId ===
            row.original.id;

          return (
            <div
              style={{
                position:
                  "relative",
                display:
                  "inline-block",
              }}
            >
              <Button
                size="sm"
                color="light"
                onClick={() =>
                  setOpenMenuId(
                    isOpen
                      ? null
                      : row.original
                          .id
                  )
                }
              >
                ⋮
              </Button>

              {isOpen && (
                <div
                  style={{
                    position:
                      "absolute",
                    top: "35px",
                    right: 0,
                    background:
                      "#ffffff",
                    border:
                      "1px solid #ddd",
                    borderRadius:
                      "6px",
                    minWidth:
                      "120px",
                    zIndex: 9999,
                    boxShadow:
                      "0 2px 8px rgba(0,0,0,0.15)",
                  }}
                >
                  <div
  style={{
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    padding: "5px",
  }}
>
  {/* VIEW MAP BUTTON */}

  <button
    style={{
      width: "100%",
      padding: "8px",
      border: "none",
      borderRadius: "5px",
      background: "#2f3338f3",
      textAlign: "center",
      color: "white",
      cursor: "pointer",
    }}
    onClick={() => {

      setSelectedUser(
        row.original
      );

      setOpenMenuId(null);
    }}
  >
    View Map
  </button>

  {/* VIEW BUTTON */}

  <button
    style={{
      width: "100%",
      padding: "8px",
      border: "none",
      borderRadius: "5px",
       background: "#2f3338f3",
      textAlign: "center",
      color: "white",
      cursor: "pointer",
    }}
    onClick={() => {

      console.log(
        "View clicked",
        row.original
      );

      setOpenMenuId(null);
    }}
  >
    View
  </button>
</div>
                </div>
              )}
            </div>
          );
        },
      },
    ],
    [openMenuId, setSelectedUser]
  );

  return (
    <div className="page-content">

      <Row>

        <Col lg={12}>

          

              {/* FILTERS */}

              <Row className="g-3">

                {[
                  "state",
                  "district",
                  "area",
                  "branch",
                ].map((field) => (
                  <Col
                    md={2}
                    key={field}
                  >
                    <div className="filter-box">

                      <Label className="filter-label">
                        {field
                          .charAt(0)
                          .toUpperCase() +
                          field.slice(
                            1
                          )}
                      </Label>

                     <Input
  type="select"
  name={field}
  value={(filters as any)[field]}
  onChange={handleChange}
>
  <option value="">Select</option>

  {/* --- REPLACE FROM HERE --- */}
  {field === "area" ? (
    areaOptions.map((opt: any) => (
      <option key={opt.value} value={opt.label}>
        {opt.label}
      </option>
    ))
  ) : field === "branch" ? (
    branchOptions.map((opt: any) => (
      <option key={opt.value} value={opt.label}>
        {opt.label}
      </option>
    ))
  ) : (
    (field === "state" ? states : districts).map((s) => (
      <option key={s} value={s}>
        {s}
      </option>
    ))
  )}
  {/* --- TO HERE --- */}

</Input>
                    </div>
                  </Col>
                ))}

                <Col md={4}>

                  <div className="d-flex gap-2 align-items-end">

                    <div
                      style={{
                        minWidth:
                          "160px",
                      }}
                    >
                      <Label className="filter-label">
                        Search From
                      </Label>

                      <Input
                        type="select"
                        name="searchFrom"
                        value={
                          filters.searchFrom
                        }
                        onChange={
                          handleChange
                        }
                      >
                        <option value="mysql">
                          MySQL
                        </option>

                        <option value="elasticsearch">
                          Elasticsearch
                        </option>

                      </Input>
                    </div>

                    <div className="flex-grow-1">

                      <Label className="filter-label">
                        User Name
                      </Label>

                      <Input
                        type="text"
                        name="userName"
                        value={
                          filters.userName
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="Search user..."
                      />

                    </div>

                  </div>

                </Col>

                <Col
                  md={12}
                  className="d-flex justify-content-end gap-2 mt-3"
                >

                  <Button
        
                    onClick={
                      handleReset
                    }
                    style={{
                        background: "#2f3338f3",
                        minWidth: 120,
                        textAlign: "center",
                        color: "white",
                        cursor: "pointer",
                        border:"none",
                        borderRadius: "5px",
                    }}
                  >
                    Reset
                  </Button>

                  <Button
                    color="primary"
                    onClick={
                      handleSearch
                    }
                    style={{
                      minWidth: 120,
                    }}
                  >
                    Search
                  </Button>

                </Col>

              </Row>

              {/* TABLE */}

              {!isSearched ? (

                <div
                  style={{
                    textAlign:
                      "center",
                    padding: 20,
                    color: "#888",
                  }}
                >
                  Click <b>Search</b>{" "}
                  to display data
                </div>

              ) : tableData.length ===
                0 ? (

                <div
                  style={{
                    textAlign:
                      "center",
                    padding: 20,
                    color: "red",
                    fontWeight: 500,
                  }}
                >
                  User not found
                </div>

              ) : (

                <TableContainer
                  columns={columns}
                  data={tableData}
                  isGlobalFilter={
                    false
                  }
                  customPageSize={
                    10
                  }
                />

              )}

            

        </Col>

      </Row>

    </div>
  );
};

export default UserList;