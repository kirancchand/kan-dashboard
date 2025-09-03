import React, { useEffect, useMemo, useState } from 'react';
import {TableContainer} from "../Responsive Table/TableContainerReactTable"
import { Link } from 'react-router-dom';
import { Spinner,Dropdown, DropdownItem, DropdownMenu, DropdownToggle,Card,CardBody } from 'reactstrap';
import { SortInterface,SortTanstackInterface } from '../Typecomponents/ComponentsType';
import { Input } from 'reactstrap';
import { Button } from "reactstrap"
import Swal from 'sweetalert2';
import { fetchCategoryApi } from '../pages/Services/Api'
interface AnalyticsItem {
  user_id: number;
  category_name: string;
  sub_title: string;
}



const AnalyicsCustomTable = () => {
  const [page, setPage] =useState(1);
  const [sizePerPage, setSizePerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [sorting, setSorting] = useState<SortTanstackInterface[]>([]);
  const tableProps = {striped: true,bordered: false};
  let sort:SortInterface[]=[]; 
  const [analyticsData, setAnalyticsData] = useState<AnalyticsItem[]>([]); 
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
 let initialRequest={
  "start":0,
  "sort":[],
  "numberOfRows":10,
  "filters":[]
}
 const fetchData = async (reqData:any) => {
  setLoading(true);  // Set loading to true before the request
  setError(null);  // Reset the error state

  try {
     const response = await fetch(fetchCategoryApi, {
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
    console.log('.......................',result.data)
    setAnalyticsData(result.data);  // Update the data state
    setTotalCount(100);
  } catch (err:any) {
    setError(err.message);  // Handle any errors
  } finally {
    setLoading(false);  // Set loading to false after the request
  }
  

};

// Use effect to fetch data when the component mounts
useEffect(() => {
  fetchData(initialRequest);

}, []); 

// console.log(error)
// Empty dependency array ensures this only runs once on mount
// let sort=<SortInterface[]>[]; 
// var arr = <SortInterface[]>[];
// var sort = [] as SortInterface[];

const handleTableChange=({ pages, sizePerPages, sortField, sortOrder }:any)=>{
  console.log("pages",pages)
  console.log("sizePerPages",sizePerPages)
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
    "start":(pages-1)*sizePerPages,
    "sort":sort,
    "numberOfRows":sizePerPages,
    "filters":[]
  });
    console.log("page",page)
}


  function totalFunc(celldata:any){
    // console.log("celldata",celldata)
    return celldata.getValue();
  }


   function handleSelectCheckboxRow(row:any,event: React.ChangeEvent<HTMLInputElement>){
    console.log("celldata",row)
    // row.getToggleSelectedHandler()
    row.getToggleSelectedHandler()(event);
  }


  function handleSelectRadioRow(row:any,event: React.ChangeEvent<HTMLInputElement>){
      console.log(row)
      row.toggleSelected(true);
  }



const EmailColumnFilter=()=>{

  const [isTopPageDropdown, setTopPageDropdown] = useState<boolean>(false);
  const toggleDropdown = () => { 
    console.log("toggleDropdown",!isTopPageDropdown)
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



  const HeaderFunc=()=>{
  //   const [dropdownOpen, setDropdownOpen] = useState(false);
  //   const toggleDropdown = () => {
  //     setDropdownOpen(prevState => !prevState)
  //   }
  //   return <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown as any} direction="down">
  //   <DropdownToggle
  //     tag="span"
  //     data-toggle="dropdown"
  //     // aria-expanded={dropdownOpen}
  //     style={{ cursor: 'pointer' }}
  //   >
  //   ID  <span className="text-muted fs-12"> <i className="ri-filter-fill"></i></span>
  //   </DropdownToggle>
  //   <DropdownMenu style={{zIndex:"100000 !important"}}>
  //     <DropdownItem onClick={() => alert('Action 1')}>Action 1</DropdownItem>
  //     <DropdownItem onClick={() => alert('Action 2')}>Action 2</DropdownItem>
  //   </DropdownMenu>
  // </Dropdown>
    
  }

  const DetailFunc=()=>{
    const handleDeleteClick = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success"
        });
      }
    });
  };
    return  <span 
      className="text-muted fs-12" 
      style={{ cursor: "pointer" }}
      onClick={handleDeleteClick}
    >
      <i className="ri-delete-bin-line" style={{color:"red"}}></i>
    </span>
    
  }


  // const [expandedRowIds, setExpandedRowIds] = useState({});
  const [isExpand,setIsExpand]=useState(false)

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
        header: ()=>HeaderFunc(),
        accessorKey: "cake_category_id",
        enableColumnFilter: false,
      },
      {
        header: "Category Name",
        accessorKey: "category_name",
        enableColumnFilter: false,
        sortDescFirst: false,
        enableSorting:true,
        // headerStyle: verticalHeaderStyle, 
      },
        {
        header: "Sub Title",
        accessorKey: "category_subtitle",
        enableColumnFilter: false,
        sortDescFirst: false,
        enableSorting:true,
        // headerStyle: verticalHeaderStyle, 
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
    []
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


const openRowFunc=(row:any)=>{
  expandRowFunc(row.id)
  return true
}

  
  return (
    <React.Fragment >
         <div style={{padding:'20px'}}>
           <Card>
                      <CardBody>
       <TableContainer 
        columns={(columns || [])}
        data={(analyticsData || [])}
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
       </CardBody>
            </Card>
      </div>
    </React.Fragment >

  );
}

export {AnalyicsCustomTable}