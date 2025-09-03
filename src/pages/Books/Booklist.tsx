import React, { useEffect, useMemo, useState } from 'react';
import {TableContainer} from "../../Responsive Table/TableContainerReactTable"
import { Link } from 'react-router-dom';
import { Spinner,Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import { SortInterface,SortTanstackInterface } from '../../Typecomponents/ComponentsType';
import Swal from 'sweetalert2';
import { Input,Button,Col,Row } from 'reactstrap';
import { useNavigate } from "react-router-dom";
import {  Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import axios from "axios";
import { fetchGetAllBooks } from '../../pages/Services/Api';
interface AnalyticsItem {
  user_id: number;
  first_name: string;
  book_for: string;
  bookquantity: number;
  status: string;
  language:string;
}

// const tableData = [
//   { user_id: 1,Order_id:"c11", first_name: "User 1", book_for: "Rent", bookquantity: 5,language:"malayalam", status: "Rented" ,Booktype:"Drama",Buyprice:"255.99",RentPrice:"100.99"},
//   { user_id: 2,order_id:"c11", first_name: "User 2", book_for: "Buy", bookquantity: 2,language:"English", status: "Sold out",Booktype:"Novel",Buyprice:"105.99",RentPrice:"100.99" },
//   { user_id: 3,order_id:"c11", first_name: "User 3", book_for: "Rent", bookquantity: 2,language:"Hindi", status: "Available",Booktype:"short story",Buyprice:"150.99",RentPrice:"100.99" },
//   { user_id: 4,order_id:"c11", first_name: "User 4", book_for: "Buy", bookquantity: 5,language:"malayalam", status: "Rented",Booktype:"Novel",Buyprice:"159.99",RentPrice:"100.99" },
//   { user_id: 5,order_id:"c11", first_name: "User 5", book_for: "Buy", bookquantity: 3,language:"malayalam", status: "Available",Booktype:"Drama",Buyprice:"315.99",RentPrice:"100.99" },
//   { user_id: 6,order_id:"c11", first_name: "User 6", book_for: "Buy", bookquantity: 4,language:"English", status: "Available",Booktype:"Novel",Buyprice:"915.99",RentPrice:"100.99" },
 
// ];
function Booklist(){
   const [page, setPage] =useState(1);
     const [sizePerPage, setSizePerPage] = useState(10);
     const [totalCount, setTotalCount] = useState(0);
     const [sorting, setSorting] = useState<SortTanstackInterface[]>([]);
     const tableProps = {striped: true,bordered: false};
     let sort:SortInterface[]=[]; 
     const [analyticsData, setAnalyticsData] = useState<AnalyticsItem[]>([]); 
     const [loading, setLoading] = useState(false);  // Loading state
     const [error, setError] = useState(null); 

     const [modal, setModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<AnalyticsItem | null>(null);
const [formData, setFormData] = useState<any>(null);

  const toggle = () => setModal(!modal);
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
    try {
      const response = await axios.post(fetchGetAllBooks, {
        "requestName": "getAll_BookFor"
      });
      console.log("Fetched:", response);

    } catch (error) {
      console.error("Error fetching keyValue:", error);
      throw error;
    }
  };


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
   
  const DetailFunc = ({ rowData }: { rowData: AnalyticsItem }) => {
     const navigate = useNavigate();
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
      const handleeditClick = () => {
          navigate("/add-books", { state: { book: rowData } });
      // setModal(true)
       setSelectedRow(rowData);
       setFormData(rowData); 
      }
        return  <div>
          <span 
          className="text-muted fs-12" 
          style={{ cursor: "pointer" }}
          onClick={handleeditClick}
        >
          <i className="ri-delete-bin-line" style={{color:"red"}}></i>
        </span>

         <span 
          className="text-muted fs-12" 
          style={{ cursor: "pointer" }}
          onClick={handleeditClick}
        >
          <i className="ri-edit-2-line" style={{color:"red",marginLeft:"15px"}}></i>
        </span>
          </div>
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
           header: "Books",
           accessorKey: "order_id",
           enableColumnFilter: false,
           sortDescFirst: false,
           enableSorting:true,
           // headerStyle: verticalHeaderStyle, 
         },
         {
           header: "Author",
           accessorKey: "first_name",
           enableColumnFilter: false,
           sortDescFirst: false,
           enableSorting:true,
           // headerStyle: verticalHeaderStyle, 
         },
        
         {
           header: "Book For",
           accessorKey: "book_for",
           enableColumnFilter: false,
           cell:(cell:any)=>totalFunc(cell)
         },
         {
           header: "Quantity",
           accessorKey: "bookquantity",
           enableColumnFilter: false,
           cell:(cell:any)=>totalFunc(cell)
         },
          {
           header: "Listed BY",
           accessorKey: "first_name",
           enableColumnFilter: false,
           cell:(cell:any)=>totalFunc(cell)
         },
         {
           header: "Language",
           accessorKey: "language",
           enableColumnFilter: false,
           cell:(cell:any)=>totalFunc(cell)
         },
         {
           header: "Booktype",
           accessorKey: "Booktype",
           enableColumnFilter: false,
           cell:(cell:any)=>totalFunc(cell)
         },
         {
           header: "Buy Price",
           accessorKey: "Buyprice",
           enableColumnFilter: false,
           cell:(cell:any)=>totalFunc(cell)
         },
         {
           header: "Rent Price",
           accessorKey: "RentPrice",
           enableColumnFilter: false,
           cell:(cell:any)=>totalFunc(cell)
         },
         {
           header: "Status",
           enableColumnFilter: false,
           accessorKey: "status",
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
         {
                 header: "Actions",
                 enableColumnFilter: false,
                 cell: (cell: any) => {
                   return (
                     <React.Fragment>
                       <DetailFunc rowData={cell.row.original} />
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
   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev: any) => ({
        ...prev,
        [name]: value,
      }));
};
   
     
     return (
       <React.Fragment >
        <div style={{padding:'50px',marginTop:'50px',border:'1px solid #000'}}>
          <div className="book-header">
            <h1>Book List</h1>
        <Link to='/add-books'>   <button className="btn btn-primary"  >
              
              Add New Book
            </button></Link> 
          </div>
         
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
           clickable={true}
           openRow={false}
           useExpand={true}
           expandedRowIds={expandedRowIds} 
           renderExpandedRow={(row:any) => <MoreInfo row={row}/>}
         />
         </div>
       </React.Fragment >
     );
}
export default Booklist