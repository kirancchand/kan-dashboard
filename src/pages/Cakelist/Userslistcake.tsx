import React, { useEffect, useMemo, useState } from 'react';
import { TableContainer } from "../../Responsive Table/TableContainerReactTable"
import { Link } from 'react-router-dom';
import { Spinner, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Card, CardBody } from 'reactstrap';
import { SortInterface, SortTanstackInterface } from '../../Typecomponents/ComponentsType';
import { Input } from 'reactstrap';
import { Button } from "reactstrap"
import { fetchgetAllusers } from '../../pages/Services/Api'
import axios from "axios";
interface AnalyticsItem {
  user_id: number;
  first_name: string;
  email_id: string;
  phone: number;
  message: string;
  image: any

}

function Userslistcake() {
  const [page, setPage] = useState(1);
  const [sizePerPage, setSizePerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [sorting, setSorting] = useState<SortTanstackInterface[]>([]);
  const tableProps = { striped: true, bordered: false };
  let sort: SortInterface[] = [];
  const [cakeUserlist, setCakeUserlist] = useState<AnalyticsItem[]>([]);
  const [loading, setLoading] = useState(false);  // Loading state
  const [error, setError] = useState(null);
  // Async function to fetch data from the API
  const verticalHeaderStyle = {
    writingMode: 'vertical-rl',
    transform: 'rotate(180deg)',
    whiteSpace: 'nowrap',
    // textAlign: 'center',
    verticalAlign: 'middle',
    // height: '150px',
    // width: '40px',
  };
  let initialRequest = {
    "start": 0,
    "sort": [],
    "numberOfRows": 10,
    "filters": []
  }
  const fetchData = async (reqData: any) => {
    setLoading(true);  // Set loading to true before the request
    setError(null);  // Reset the error state

    try {
      const response = await axios.post(fetchgetAllusers,reqData, {
        headers: {
          "Content-Type": "application/json",
        }
      });

      console.log("...........", response.data.result);

      setCakeUserlist(response.data.result); 
      setTotalCount(response.data.total_count)
      
    } catch (err: any) {
      setError(err.response?.data?.message || err.message); 
    } finally {
      setLoading(false); // stop loading
    }
  };


  useEffect(() => {
    fetchData(initialRequest);

  }, []);
  const handleTableChange = ({ pages, sizePerPages, sortField, sortOrder }: any) => {
    console.log("pages", pages)
    console.log("sizePerPages", sizePerPages)
    // console.log(sizePerPage)
    setPage(pages)
    setSizePerPage(sizePerPages)
    if (sortField !== "" && sortOrder !== "") {
      sort = [{
        "columnName": sortField,
        "sortOrder": sortOrder
      }]
    }
    fetchData({
      "start": (pages - 1) * sizePerPages,
      "sort": sort,
      "numberOfRows": sizePerPages,
      "filters": []
    });
    console.log("page", page)
  }


  function totalFunc(celldata: any) {
    // console.log("celldata",celldata)
    return celldata.getValue();
  }


  function handleSelectCheckboxRow(row: any, event: React.ChangeEvent<HTMLInputElement>) {
    console.log("celldata", row)
    // row.getToggleSelectedHandler()
    row.getToggleSelectedHandler()(event);
  }


  function handleSelectRadioRow(row: any, event: React.ChangeEvent<HTMLInputElement>) {
    console.log(row)
    row.toggleSelected(true);
  }



  const EmailColumnFilter = () => {

    const [isTopPageDropdown, setTopPageDropdown] = useState<boolean>(false);
    const toggleDropdown = () => {
      console.log("toggleDropdown", !isTopPageDropdown)
      setTopPageDropdown(!isTopPageDropdown);
    };
    return <div className="flex-shrink-0">
      <Dropdown isOpen={isTopPageDropdown} toggle={toggleDropdown} className="card-header-dropdown">
        <DropdownToggle tag="a" className="text-reset dropdown-btn" role="button">
          Email id &nbsp;<span className="text-muted fs-12"> <i className="ri-filter-fill"></i></span>
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-end">
          <DropdownItem>Today</DropdownItem>
          <DropdownItem>Last Week</DropdownItem>
          <DropdownItem>Last Month</DropdownItem>
          <DropdownItem>Current Year</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  }



  const HeaderFunc = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggleDropdown = () => {
      setDropdownOpen(prevState => !prevState)
    }
    return <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown as any} direction="down">
      <DropdownToggle
        tag="span"
        data-toggle="dropdown"
        // aria-expanded={dropdownOpen}
        style={{ cursor: 'pointer' }}
      >
        ID  <span className="text-muted fs-12"> <i className="ri-filter-fill"></i></span>
      </DropdownToggle>
      <DropdownMenu style={{ zIndex: "100000 !important" }}>
        <DropdownItem onClick={() => alert('Action 1')}>Action 1</DropdownItem>
        <DropdownItem onClick={() => alert('Action 2')}>Action 2</DropdownItem>
      </DropdownMenu>
    </Dropdown>

  }

  const DetailFunc = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggleDropdown = () => {
      setDropdownOpen(prevState => !prevState)
    }
    return <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown as any} direction="down">
      <DropdownToggle
        tag="span"
        data-toggle="dropdown"
        // aria-expanded={dropdownOpen}
        style={{ cursor: 'pointer' }}
      >
        <span className="text-muted fs-12"> <i className="ri-menu-fill"></i></span>
      </DropdownToggle>
      <DropdownMenu style={{ zIndex: "100000 !important" }}>
        <DropdownItem onClick={() => alert('Action 1')}>Action 1</DropdownItem>
        <DropdownItem onClick={() => alert('Action 2')}>Action 2</DropdownItem>
      </DropdownMenu>
    </Dropdown>

  }


  // const [expandedRowIds, setExpandedRowIds] = useState({});
  const [isExpand, setIsExpand] = useState(false)

  const [expandedRowIds, setExpandedRowIds] = useState<{ [key: number]: boolean }>({});

  const expandRowFunc = (index: number) => {
    setExpandedRowIds((prev) => ({
      ...prev,
      [index]: !prev[index], // Toggle expansion for the row
    }));
  };
  // console.log("isExpand",isExpand)

  const columns = useMemo(
    () => [

      {
        id: "user_id",
        header: () => HeaderFunc(),
        accessorKey: "user_id",
        enableColumnFilter: false,
      },
      {
        header: "Name",
        accessorKey: "first_name",
        enableColumnFilter: false,
        sortDescFirst: false,
        enableSorting: true,
        // headerStyle: verticalHeaderStyle, 
      },
      {
        header: "Email",
        accessorKey: "email_id",
        enableColumnFilter: false,
        sortDescFirst: false,
        enableSorting: true,
        // headerStyle: verticalHeaderStyle, 
      },
      {
        header: "City",
        accessorKey: "city",
        enableColumnFilter: false,
        sortDescFirst: false,
        enableSorting: true,
        // headerStyle: verticalHeaderStyle, 
      },
      {
        header: "DOB",
        accessorKey: "date_of_birth",
        enableColumnFilter: false,
        sortDescFirst: false,
        enableSorting: true,
        // headerStyle: verticalHeaderStyle, 
      },
      
     





    ],
    []
  );


  const getRowData = (row: any) => {
    console.log("rowdata.........", row)
  }


  const MoreInfo = ({ row }: { row: any }) => {
    console.log("row", row)
    return <div className="p-2 bg-gray-50 border rounded">
      <p className="text-sm"><strong>More comments</strong>
        <ul>
          <li>{row.original.comments}</li>
        </ul>
      </p>
      <p className="text-sm text-gray-600"></p>
    </div>
  }


  const openRowFunc = (row: any) => {
    expandRowFunc(row.id)
    return true
  }


  return (
    <React.Fragment >

      <div style={{ padding: '50px', marginTop: '50px' }}>
        <h3>User Management</h3>
        <Card>
          <CardBody>
            <TableContainer
              columns={(columns || [])}
              data={(cakeUserlist || [])}
              customPageSize={sizePerPage}
              tableClass="table-centered align-middle table-nowrap mb-0"
              theadClass="text-muted table-light"
              SearchPlaceholder='Search Products...'
              isGlobalFilter={false}//added search bar in table
              handleTableChange={handleTableChange}
              page={page}
              sorting={sorting}
              setSorting={setSorting}
              sizePerPage={sizePerPage}
              totalCount={totalCount}
              loading={loading}
              tableProps={tableProps}
              getRowData={getRowData}
              rowColor="#fcba03"
              clickable={false}
              openRow={true}
              useExpand={true}
              expandedRowIds={expandedRowIds}
              renderExpandedRow={(row: any) => <MoreInfo row={row} />}
            />
          </CardBody>
        </Card>
      </div>

    </React.Fragment >
  );
}
export default Userslistcake







