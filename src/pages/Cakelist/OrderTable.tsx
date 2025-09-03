import React, { useEffect, useMemo, useState } from 'react';
import {TableContainer} from "../../Responsive Table/TableContainerReactTable"
import { Spinner,Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import { SortInterface,SortTanstackInterface } from '../../Typecomponents/ComponentsType';
import { fetchGetAllOrders, fetchGetIndividualOrders } from "../../pages/Services/Api";
import axios from "axios";
interface AnalyticsItem {
  user_id: number;
  first_name: string;
  email_id: string;
  age: number;
  status: string;
  available_kg:number;
}


function OrderTable(){
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
 const fetchData = async (reqData: any) => {
  setLoading(true);
  setError(null);

  try {
  
    const response = await axios.get(fetchGetAllOrders, {
      headers: {
        "Content-Type": "application/json",
      },
      params: reqData, 
    });

    console.log("allorders......", response.data);
    setAnalyticsData(response.data);
    setTotalCount(100);

  } catch (err: any) {
    setError(err.message);
    console.error("Error fetching data:", err);
  } finally {
    setLoading(false);
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
           accessorKey: "order_slno",
           enableColumnFilter: false,
         },
          {
           header: "Order id",
           accessorKey: "order_id",
           enableColumnFilter: false,
           sortDescFirst: false,
           enableSorting:true,
           // headerStyle: verticalHeaderStyle, 
         },
         {
           header: "Name",
           accessorKey: "user_name",
           enableColumnFilter: false,
           sortDescFirst: false,
           enableSorting:true,
           // headerStyle: verticalHeaderStyle, 
         },
        
         {
           header: "Kg",
           accessorKey: "age",
           enableColumnFilter: false,
           cell:(cell:any)=>totalFunc(cell)
         },
         {
           header: "Available (kg)",
           accessorKey: "total_items",
           enableColumnFilter: false,
           cell:(cell:any)=>totalFunc(cell)
         },
         {
           header: "Status",
           enableColumnFilter: false,
           accessorKey: "f_order_status",
           cell: (cell: any) => {
             switch (cell.getValue()) {
               case "Paid":
                 return (<span className="badge bg-success-subtle text-success text-uppercase"> {cell.getValue()}</span>);
               case "Refund":
                 return (<span className="badge bg-warning-subtle  text-warning text-uppercase"> {cell.getValue()}</span>);
               default:
                 return (<span className="badge bg-danger-subtle  text-danger text-uppercase"> {cell.getValue()}</span>);
             }
           },
         },
       
       
       ],
       []
     );
   
   
   const getRowData=(row:any)=>{
     console.log("rowdata",row)
   }
   
   
   const MoreInfo=({ row }: { row: any })=>{
      const [individualOrderItem, setIndividualOrderItem] = useState<AnalyticsItem[]>([]);
    const fetchindiviualData = async (reqData: any) => {
  try {
  
    const response = await axios.get(fetchGetIndividualOrders, {
      headers: {
        "Content-Type": "application/json",
      },
      params: reqData, 
    });

    console.log("individual order......", response.data.data.item_details);
    setIndividualOrderItem(response.data.data.item_details);
    setTotalCount(100);

  } catch (err: any) {
    setError(err.message);
    console.error("Error fetching data:", err);
  } finally {
    setLoading(false);
  }
};
 useEffect(() => {
    fetchindiviualData(initialRequest)
   }, []); 
     console.log("row",row)
     return   <div className="p-2 bg-gray-50 border rounded">
         <p className="text-sm">More info about{row.individualOrderItem.cake_name} </p>
         <p className="text-sm text-gray-600">Email:</p>
   </div>
   }
   
   
   const openRowFunc=(row:any)=>{
     expandRowFunc(row.id)
     return true
   }
   
     
     return (
       <React.Fragment >
        <div style={{padding:'50px',marginTop:'50px',border:'1px solid #000'}}>
          <TableContainer 
           columns={(columns || [])}
           data={(analyticsData || [])}
           customPageSize={sizePerPage}
           tableClass="table-centered align-middle table-nowrap mb-0"
           theadClass="text-muted table-light"
           SearchPlaceholder='Search Products...'
           isGlobalFilter={true}//added search bar in table
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
           renderExpandedRow={(row:any) => <MoreInfo row={row}/>}
         />
         </div>
       </React.Fragment >
     );
}
export default OrderTable