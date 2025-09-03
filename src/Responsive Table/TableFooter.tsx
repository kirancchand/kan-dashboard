import React from "react";
// import { TableContainerProps } from '../../types/ComponentsType';
import {  Row } from "reactstrap";
// import { Link } from "react-router-dom";

type TableFooterProps = {
    table: any,
    handleAnalyticsTableChange:any
};


const TableFooter: React.FC<TableFooterProps> = ({
    table,
    handleAnalyticsTableChange
  })=> {

    const paginationRange = () => {
      const range = [];
      // const maxPageDisplay = 5; // Adjust as needed
      const startPage = Math.max(1, table.getState().pagination.pageIndex - 2);
      const endPage = Math.min(table.getPageCount(), table.getState().pagination.pageIndex + 2);
      for (let i = startPage; i <= endPage; i++) {
        range.push(i);
      }
      return range;
    };

    const handlePageSizeChange=(pageSize:string)=>{
      // console.log(pageSize)
       table.setPageSize(Number(pageSize))
       handleAnalyticsTableChange({
        type:"pageSizeChange",
        payload:{
          page:1,
          sizePerPages:Number(pageSize)
        }
      })
    }

    // console.log("pagesize",table.getState().pagination.pageSize)
    // console.log("currentPage",table.getState().pagination.pageIndex)
    // console.log("getRowModel",table.getRowModel().rows.length)

    // (currentPage - 1) * rowsPerPage
  return (
    <Row className="align-items-center mt-2 g-3 text-center text-sm-start">
    <div className="col-sm">
      <div className="text-muted">Showing
          <span className="fw-semibold ms-1">
            {((table.getState().pagination.pageIndex-1)*table.getState().pagination.pageSize)+1}
          </span>
          &nbsp;
            to 
            <span className="fw-semibold ms-1">
            {((table.getState().pagination.pageIndex-1)*table.getState().pagination.pageSize)+table.getRowModel().rows.length}
          </span> of <span className="fw-semibold">{table.getFilteredRowModel().rows.length}</span> Results
          &nbsp;
          <select 
          value={table.getState().pagination.pageSize} 
          onChange={e=>handlePageSizeChange(e.target.value)}
          // onChange={e => table.setPageSize(Number(e.target.value))}
          style={{border:0}}
          >
          <option value={5}>5 rows per page</option>
          <option value={10}>10 rows per page</option>
          <option value={20}>20 rows per page</option>
        </select>
      </div>
    </div>
    <div className="col-sm-auto">
      <ul className="pagination pagination-separated pagination-md justify-content-center justify-content-sm-start mb-0">
      <li className={table.getState().pagination.pageIndex===1 ? "page-item disabled" : "page-item"}>

          <a href="#" className="page-link"  onClick={() => handleAnalyticsTableChange({
            type:"first",
            payload:null
          })}>First</a>


        </li>
        <li className={table.getState().pagination.pageIndex===1 ? "page-item disabled" : "page-item"}>
          <a href="#" className="page-link"  onClick={() => handleAnalyticsTableChange({
          type:"previous",
          payload:null
        })}>Previous</a>
        </li>


        {paginationRange().map((page: any, key: number) => (
          <React.Fragment key={key}>
            <li className="page-item">
              <a 
                href="#" 
                className={table.getState().pagination.pageIndex === page ? "page-link active" : "page-link"} 
                onClick={() => handleAnalyticsTableChange({
                  type:"direct",
                  payload:{page:page}
                })} 
              >
                  {page}
              </a>
            </li>
          </React.Fragment>
        ))}
        <li className={table.getState().pagination.pageIndex===table.getPageCount() ? "page-item disabled" : "page-item"}>
          <a href="#" className="page-link"onClick={() => handleAnalyticsTableChange({
          type:"next",
          payload:null
        })} >Next</a>
        </li>
        <li className={table.getState().pagination.pageIndex===table.getPageCount() ? "page-item disabled" : "page-item"}>
          <a href="#" className="page-link"onClick={() => handleAnalyticsTableChange({
          type:"last",
          payload:null
        })} >Last</a>
        </li>
      </ul>
    </div>
    {/* table.firstPage() */}
    {/* table.previousPage() */}
    {/* table.nextPage() */}
    {/* table.lastPage() */}
    {/* table.getCanPreviousPage() disabled={table.getState().pagination.pageIndex==1}*/}
    {/* disabled={!table.getCanPreviousPage()} */}
    {/* !table.getCanNextPage() */}
     <div className="pagination">
        {/* <button onClick={() => handleAnalyticsTableChange({
          type:"first",
          payload:null
        })} disabled={table.getState().pagination.pageIndex==1}>First</button>
        <button onClick={() => handleAnalyticsTableChange({
          type:"previous",
          payload:null
        })} disabled={table.getState().pagination.pageIndex==1}>Previous</button>
        {paginationRange().map(page => (
          <button key={page} onClick={() => handleAnalyticsTableChange({
            type:"direct",
            payload:{page:page}
          })} className={table.getState().pagination.pageIndex === page ? 'active' : ''}>
            {page}
          </button>
        ))}
        <button onClick={() => handleAnalyticsTableChange({
          type:"next",
          payload:null
        })} disabled={table.getState().pagination.pageIndex==table.getPageCount()}>Next</button>
        <button onClick={() => handleAnalyticsTableChange({
          type:"last",
          payload:null
        })} disabled={table.getState().pagination.pageIndex==table.getPageCount()}>Last</button> */}
        {/* <select 
          value={table.getState().pagination.pageSize} 
          onChange={e=>handlePageSizeChange(e.target.value)}
          // onChange={e => table.setPageSize(Number(e.target.value))}
          >
          <option value={5}>5 rows per page</option>
          <option value={10}>10 rows per page</option>
          <option value={20}>20 rows per page</option>
        </select> */}
      </div>
  </Row>
  )
}

export default TableFooter