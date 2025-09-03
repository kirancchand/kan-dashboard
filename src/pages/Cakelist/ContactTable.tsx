import React, { useEffect, useMemo, useState } from 'react';
import {TableContainer} from "../../Responsive Table/TableContainerReactTable"
import { Link } from 'react-router-dom';
import { Spinner,Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import { SortInterface,SortTanstackInterface } from '../../Typecomponents/ComponentsType';
import { Input } from 'reactstrap';
import { Button } from "reactstrap"
interface AnalyticsItem {
  user_id: number;
  first_name: string;
  email_id: string;
  phone: number;
  message: string;
  location:string;
}

const tableData = [
  { user_id: 1, first_name: "User 1", email_id: "user1@example.com", phone: 1234567890, location: "Paid",message:"Best i have ever had" },
  { user_id: 2, first_name: "User 2", email_id: "user2@example.com", phone: 1234567890, location: "Refund",message:"Best i have ever had" },
  { user_id: 3, first_name: "User 3", email_id: "user3@example.com", phone: 1234567890, location: "Pending",message:"Best i have ever had" },
  { user_id: 4, first_name: "User 4", email_id: "user4@example.com", phone: 1234567890, location: "Paid" ,message:"Best i have ever had"},
  { user_id: 5, first_name: "User 5", email_id: "user5@example.com", phone: 1234567890, location: "Refund",message:"Best i have ever had" },
  { user_id: 6, first_name: "User 6", email_id: "user6@example.com", phone: 1234567890, location: "Paid" ,message:"Best i have ever had"},
  { user_id: 7, first_name: "User 7", email_id: "user7@example.com", phone: 1234567890, location: "Pending",message:"Best i have ever had" },
  { user_id: 8, first_name: "User 8", email_id: "user8@example.com", phone: 1234567890, location: "Paid",message:"Best i have ever had" },
  { user_id: 9, first_name: "User 9", email_id: "user9@example.com", phone: 1234567890, location: "Refund",message:"Best i have ever had" },
  { user_id: 10, first_name: "User 10", email_id: "user10@example.com", phone: 1234567890, location: "Paid",message:"Best i have ever had" },
  { user_id: 11, first_name: "User 11", email_id: "user11@example.com", phone: 1234567890, location: "Pending" ,message:"Best i have ever had"},
  { user_id: 12, first_name: "User 12", email_id: "user12@example.com", phone: 1234567890, location: "Paid",message:"Best i have ever had" },
  { user_id: 13, first_name: "User 13", email_id: "user13@example.com", phone: 1234567890, location: "Refund",message:"Best i have ever had" },
  { user_id: 14, first_name: "User 14", email_id: "user14@example.com", phone: 1234567890, location: "Paid",message:"Best i have ever had" },
  { user_id: 15, first_name: "User 15", email_id: "user15@example.com", phone: 1234567890, location: "Pending",message:"Best i have ever had" },
  { user_id: 16, first_name: "User 16", email_id: "user16@example.com", phone: 1234567890, location: "Paid",message:"Best i have ever had" },
  { user_id: 17, first_name: "User 17", email_id: "user17@example.com", phone: 1234567890, location: "Refund",message:"Best i have ever had" },
  { user_id: 18, first_name: "User 18", email_id: "user18@example.com", phone: 1234567890, location: "Paid",message:"Best i have ever had" },
  { user_id: 19, first_name: "User 19", email_id: "user19@example.com", phone: 1234567890, location: "Pending",message:"Best i have ever had" },
  { user_id: 20, first_name: "User 20", email_id: "user20@example.com", phone: 1234567890, location: "Paid",message:"Best i have ever had" },
  { user_id: 21, first_name: "User 21", email_id: "user21@example.com", phone: 1234567890, location: "Refund",message:"Best i have ever had" },
  { user_id: 22, first_name: "User 22", email_id: "user22@example.com", phone: 1234567890, location: "Pending",message:"Best i have ever had" },
  { user_id: 23, first_name: "User 23", email_id: "user23@example.com", phone: 1234567890, location: "Paid",message:"Best i have ever had" },
  { user_id: 24, first_name: "User 24", email_id: "user24@example.com", phone: 1234567890, location: "Refund",message:"Best i have ever had" },
  { user_id: 25, first_name: "User 25", email_id: "user25@example.com", phone: 1234567890, location: "Pending",message:"Best i have ever had" },
  { user_id: 26, first_name: "User 26", email_id: "user26@example.com", phone: 1234567890, location: "Paid",message:"Best i have ever had" },
  { user_id: 27, first_name: "User 27", email_id: "user27@example.com", phone: 1234567890, location: "Refund",message:"Best i have ever had" },
  { user_id: 28, first_name: "User 28", email_id: "user28@example.com", phone: 1234567890, location: "Paid",message:"Best i have ever had" },
  { user_id: 29, first_name: "User 29", email_id: "user29@example.com", phone: 1234567890, location: "Pending",message:"Best i have ever had" },
  { user_id: 30, first_name: "User 30", email_id: "user30@example.com", phone: 1234567890, location: "Paid",message:"Best i have ever had" },
];

function ContactTable(){
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
       //   setLoading(true);  // Set loading to true before the request
       //   setError(null);  // Reset the error state
       
       //   try {
       //      const response = await fetch('http://localhost:8000/data_route/handle-request', {
       //           method: 'POST', // Specify the request method
       //           headers: {
       //               'Content-Type': 'application/json' // Set the content type to JSON
       //           },
       //           body: JSON.stringify(reqData) // Convert the JavaScript object to a JSON string
       //       });
       
       //     if (!response.ok) {
       //       throw new Error('Failed to fetch data');
       //     }
       //     const result = await response.json();  // Parse JSON response
       //     console.log(result)
           
       //   } catch (err:any) {
       //     setError(err.message);  // Handle any errors
       //   } finally {
       //     setLoading(false);  // Set loading to false after the request
       //   }
         setAnalyticsData(tableData);  // Update the data state
           setTotalCount(100);
       
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
               accessorKey: "user_id",
               enableColumnFilter: false,
             },
             {
               header: "Name",
               accessorKey: "first_name",
               enableColumnFilter: false,
               sortDescFirst: false,
               enableSorting:true,
               // headerStyle: verticalHeaderStyle, 
             },
             {
               id: "Email",
               header: ()=>EmailColumnFilter(),
               accessorKey: "email_id",
               enableColumnFilter: false,
               headerId: 'vertical-header'
             },
             {
               header: "Location",
               accessorKey: "location",
               enableColumnFilter: false,
               cell:(cell:any)=>totalFunc(cell)
             },
             {
               header: "Message",
               accessorKey: "message",
               enableColumnFilter: false,
               cell:(cell:any)=>totalFunc(cell)
             },
             {
               header: "Phone",
               enableColumnFilter: false,
               accessorKey: "phone",
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
export default ContactTable