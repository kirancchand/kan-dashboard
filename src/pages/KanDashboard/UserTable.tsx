import React, { useEffect, useMemo, useState,Fragment } from 'react';
import {TableContainer} from "../../common/AnalyticsTable/TableContainerReactTable";
import { Link } from 'react-router-dom';
import { Spinner,Dropdown, DropdownItem, DropdownMenu, DropdownToggle,Row,Col } from 'reactstrap';
import { SortInterface,SortTanstackInterface } from '../../Typecomponents/ComponentsType';
import { Input } from 'reactstrap';
import { ListUser,LISTUSERDATA } from './api';
import SearchBar from './SearchBar';
import Section from './Section';
export const UserTable = (props:any) => {
  const [page, setPage] =useState(1);
  const [sizePerPage, setSizePerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [sorting, setSorting] = useState<SortTanstackInterface[]>([]);
  const tableProps = {striped: true,bordered: false};
  let sort:SortInterface[]=[]; 
  const [userData, setUserData] = useState([]); 
  const [loading, setLoading] = useState(false);  // Loading state
  const [error, setError] = useState(null); 


 let initialRequest={
  "start":0,
  "sort":[],
  "numberOfRows":10,
  "filters":[],
  "query":Array.from(props.selectedItems)
}

 const fetchData = async (reqData:any) => {
  console.log("reqData",reqData)
  setLoading(true);  // Set loading to true before the request
  setError(null);  // Reset the error state

  try {
     const response = await fetch(ListUser, {
          method: 'POST', // Specify the request method
          headers: {
              'Content-Type': 'application/json' // Set the content type to JSON
          },
          body: JSON.stringify(reqData) // Convert the JavaScript object to a JSON string
      });

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const result = await response.json();  // Parse JSON response
    console.log(result)
    setUserData(result.data);  // Update the data state
    setTotalCount(result.totalCount)
  } catch (err:any) {
    setError(err.message);  // Handle any errors
  } finally {
    setLoading(false);  // Set loading to false after the request
  }
};


const fetchDataReq = async (reqData:any) => {
  console.log("reqData",reqData)
  setLoading(true);  // Set loading to true before the request
  setError(null);  // Reset the error state
  // const query = buildElasticsearchQuery(props.selected);
  try {
     const response = await fetch(LISTUSERDATA, {
          method: 'POST', // Specify the request method
          headers: {
              'Content-Type': 'application/json' // Set the content type to JSON
          },
          body: JSON.stringify(reqData) // Convert the JavaScript object to a JSON string
      });

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const result = await response.json();  // Parse JSON response
    console.log(result)
    setUserData(result.data);  // Update the data state
    setTotalCount(result.totalCount)
  } catch (err:any) {
    setError(err.message);  // Handle any errors
  } finally {
    setLoading(false);  // Set loading to false after the request
  }
};





// Use effect to fetch data when the component mounts
useEffect(() => {
  console.log("props.selectedItems",props.selectedItems)
  console.log("initialRequest",initialRequest)
  console.log("props.selected",props.selected)
  // fetchData(initialRequest);
  fetchDataReq({
    "start":0,
    "sort":[],
    "numberOfRows":10,
    "filters":[],
    "query":props.selected
    // buildElasticsearchQuery(props.selected)
  });
}, [props.selectedItems,props.selected]); 


const handleTableChange=({ pages, sizePerPages, sortField, sortOrder }:any)=>{
  console.log("pages",pages)
  console.log("sizePerPages",sizePerPages)
  setPage(pages)
  setSizePerPage(sizePerPages)
  if (sortField !== "" && sortOrder !== "") {
    sort = [{
      "columnName": sortField,
      "sortOrder": sortOrder
    }]
  }
  // fetchData({
  //   "start":(pages-1)*sizePerPages,
  //   "sort":sort,
  //   "numberOfRows":sizePerPages,
  //   "filters":[],
  //   "query":Array.from(props.selectedItems)
  // });
  fetchDataReq({
    "start":(pages-1)*sizePerPages,
    "sort":sort,
    "numberOfRows":sizePerPages,
    "filters":[],
    "query":props.selected
  });
}

console.log("page",page)
console.log("sizePerPage",sizePerPage)

const LocalBodyColumnFilter=()=>{

  const [isTopPageDropdown, setTopPageDropdown] = useState<boolean>(false);
  const toggleDropdown = () => { 
    console.log("toggleDropdown",!isTopPageDropdown)
    setTopPageDropdown(!isTopPageDropdown); 
  };
  return <div className="flex-shrink-0">
  <Dropdown isOpen={isTopPageDropdown} toggle={toggleDropdown} className="card-header-dropdown">
      <DropdownToggle tag="a" className="text-reset dropdown-btn" role="button">
      Localbody &nbsp;<span className="text-muted fs-12"> <i className="ri-filter-fill"></i></span>
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



  const HeaderFunc=()=>{
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
    <DropdownMenu style={{zIndex:"100000 !important"}}>
      <DropdownItem onClick={() => alert('Action 1')}>Action 1</DropdownItem>
      <DropdownItem onClick={() => alert('Action 2')}>Action 2</DropdownItem>
    </DropdownMenu>
  </Dropdown>
    
  }

  const DetailFunc=()=>{
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
    <DropdownMenu style={{zIndex:"100000 !important"}}>
      <DropdownItem onClick={() => alert('Action 1')}>Action 1</DropdownItem>
      <DropdownItem onClick={() => alert('Action 2')}>Action 2</DropdownItem>
    </DropdownMenu>
  </Dropdown>
    
  }

const [expandedRowIds, setExpandedRowIds] = useState<{ [key: number]: boolean }>({});



const _idFunc = (celldata: any) => {
  return <span>{((page - 1) * sizePerPage) + (Number(celldata.row.id) + 1)}</span>
}

function SerialNoFunc(rowdata:any){
  return <div>
  <div>{rowdata.getValue()}</div>
  <span className="badge bg-info-subtle  text-info">{rowdata.row.original.ID}</span>
  </div>
}

function NameFunc(rowdata:any){
  return <div>
  <div>{rowdata.getValue()}</div>
  <span>{rowdata.row.original.Gender} - {rowdata.row.original.Age}</span>
  <div>C/O {rowdata.row.original.Guardian}</div>
  </div>
}

function DistrictFunc(rowdata:any){
  return <div>
  <div>{rowdata.getValue()}</div>

  </div>
}

function LocalBodyColumnFunc(rowdata:any){
  return <div>
  <div>{rowdata.row.original.local_body_name}</div>
  <span className="badge bg-success-subtle  text-success">{rowdata.row.original.local_body_type}</span>
  </div>
}

function AddressFunc(rowdata:any){
  return <div>
  <div>{rowdata.getValue()}</div>
  <span>{rowdata.row.original.HouseNo}</span>
  </div>
}

  const columns = useMemo(
    () => [
      {
        id: "_id",
        header: ()=>HeaderFunc(),
        accessorKey: "_id",
        enableColumnFilter: false,
        cell: (cell: any) => _idFunc(cell),
      },
      {
        header: "SerialNo",
        accessorKey: "SerialNo",
        enableColumnFilter: false,
        sortDescFirst: false,
        enableSorting:true,
        cell:(cell:any)=>SerialNoFunc(cell)
      },
      {
        header: "Name",
        accessorKey: "Name",
        enableColumnFilter: false,
        sortDescFirst: false,
        enableSorting:true,
        cell:(cell:any)=>NameFunc(cell)
      },
      {
        id: "Address",
        accessorKey: "HouseName",
        enableColumnFilter: false,
        headerId: 'vertical-header',
        cell:(cell:any)=>AddressFunc(cell)
      },
      {
        id: "District",
        header: "District",
        accessorKey: "district",
        enableColumnFilter: false,
        headerId: 'vertical-header',
        cell:(cell:any)=>DistrictFunc(cell)
      },
      {
        id: "Localbody",
        header: ()=>LocalBodyColumnFilter(),
        accessorKey: "panchayat",
        enableColumnFilter: false,
        headerId: 'vertical-header',
        cell:(cell:any)=>LocalBodyColumnFunc(cell)
      },
      {
        id: "Ward",
        accessorKey: "ward",
        enableColumnFilter: false,
        headerId: 'vertical-header',
      },
      {
        header: "Actions",
        enableColumnFilter: false,
        cell: (cell: any) => {
          return (
            <React.Fragment>
             {DetailFunc()}
            </React.Fragment>
          );
        },
      },
    ],
    [page]
  );


const getRowData=(row:any)=>{
  console.log("rowdata",row)
}


const MoreInfo=({ row }: { row: any })=>{
  console.log("row",row)
  return   <div className="p-2 bg-gray-50 border rounded">
      <p className="text-sm">More info about{row.original.email_id} </p>
      <p className="text-sm text-gray-600">Email:</p>
</div>
}

const setFilterSearch=(filterreq:any)=>{
  // fetchData({
  //   "start":0,
  //   "sort":sort,
  //   "numberOfRows":sizePerPage,
  //   "filters":[filterreq],
  //   "query":Array.from(props.selectedItems)
  // });

  fetchDataReq({
    "start":0,
    "sort":sort,
    "numberOfRows":sizePerPage,
    "filters":[filterreq],
    "query":props.selected
  });
  
}
  return (
    <React.Fragment >
        <Row>
          <Col md="12" >
            <Section rightClickBtn={props.rightClickBtn}>
                <SearchBar setFilterSearch={setFilterSearch}/>
            </Section>
          </Col>
        </Row>
       <Row>
        <Col md="12">
            <TableContainer
              columns={(columns || [])}
              data={(userData || [])}
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
              openRow={false}
              useExpand={false}
              expandedRowIds={expandedRowIds} 
              renderExpandedRow={(row:any) => <MoreInfo row={row}/>}
          />
        </Col>

       </Row>
        

    </React.Fragment >
  );



}
