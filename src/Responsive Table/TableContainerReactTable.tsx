import React, { Fragment, useEffect, useState } from "react";
import { Table } from "reactstrap";
// import { Link } from "react-router-dom";
import { Spinner } from 'reactstrap';
import {
  Table as ReactTable,
  ColumnFiltersState,
  FilterFn,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  PaginationState,
} from '@tanstack/react-table';
import { rankItem } from '@tanstack/match-sorter-utils';
import { TableContainerProps } from '../Typecomponents/ComponentsType'
// import {TableHandleContext} from './config';
import TableHeader from "./TableHeader";
import TableFilter from "./TableFilter";
import TableBody from "./TableBody";
import TableFooter from "./TableFooter";
export function TableContainer({
  columns,
  data,
  isGlobalFilter,
  customPageSize,
  tableClass,
  theadClass,
  trClass,
  thClass,
  divClass,
  SearchPlaceholder,
  handleTableChange,
  page,
  sizePerPage,
  totalCount,
  sorting,
  setSorting,
  loading,
  tableProps,
  rowColor,
  clickable,
  getRowData,
  openRow,
  useExpand,
  expandedRowIds,
  renderExpandedRow,
}: TableContainerProps) {

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: page,
    pageSize: sizePerPage,
  })
 
  const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
    const itemRank = rankItem(row.getValue(columnId), value);
    addMeta({
      itemRank
    });
    return itemRank.passed;
  };

  const table = useReactTable({
    columns,
    data,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      columnFilters,
      globalFilter,
      pagination,
      sorting
    },
    rowCount: totalCount,
    manualPagination: true,
    manualSorting: true,
    enableSorting: false,
    enableRowSelection: true,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    // getSortedRowModel: getSortedRowModel(),
    getRowId: (row) => row.id,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    enableColumnFilters: true,
    
  });

  useEffect(() => {
    Number(customPageSize) && table.setPageSize(Number(customPageSize));
  }, [customPageSize, table.setPageSize]);

  const handleAnalyticsTableChange = (handleReqArgs: any) => {
    if (handleReqArgs.type === "first") {
      table.setPageIndex(1)
      handleTableChange({
        pages: 1,
        sizePerPages: sizePerPage,
        sortField: "",
        sortOrder: ""
      })
    }
    else if (handleReqArgs.type === "previous") {
      table.setPageIndex(page - 1)
      handleTableChange({
        pages: page - 1,
        sizePerPages: sizePerPage,
        sortField: "",
        sortOrder: ""
      })
    }
    else if (handleReqArgs.type === "next") {
      table.setPageIndex(page + 1)
      handleTableChange({
        pages: page + 1,
        sizePerPages: sizePerPage,
        sortField: "",
        sortOrder: ""
      })
    } else if (handleReqArgs.type === "last") {
      table.setPageIndex(table.getPageCount())
      handleTableChange({
        pages: table.getPageCount(),
        sizePerPages: sizePerPage,
        sortField: "",
        sortOrder: ""
      })
    } else if (handleReqArgs.type === "direct") {
      table.setPageIndex(handleReqArgs.payload.page)
      handleTableChange({
        pages: handleReqArgs.payload.page,
        sizePerPages: sizePerPage,
        sortField: "",
        sortOrder: ""
      })
    }
    else if (handleReqArgs.type === "pageSizeChange") {
      table.setPageIndex(handleReqArgs.payload.page)
      handleTableChange({
        pages: handleReqArgs.payload.page,
        sizePerPages: handleReqArgs.payload.sizePerPages,
        sortField: "",
        sortOrder: ""
      })
    } else if (handleReqArgs.type === "sort") {
      setSorting([{ id: handleReqArgs.payload.sortField, desc: handleReqArgs.payload.sortOrder === "desc" ? true : false }]);
      handleTableChange({
        pages: page,
        sizePerPages: sizePerPage,
        sortField: handleReqArgs.payload.sortField,
        sortOrder: handleReqArgs.payload.sortOrder
      })
    }

  }
console.log("totalCount",totalCount)
  return (
    <Fragment>
      {!loading ? <div>
        <TableFilter isGlobalFilter={isGlobalFilter} globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
        <div className={divClass}>
          <Table hover className={tableClass} {...tableProps} >
            <TableHeader table={table} handleAnalyticsTableChange={handleAnalyticsTableChange} />
            <TableBody 
                table={table}   
                rowColor={rowColor}  
                clickable={clickable}
                openRow={openRow}
                getRowData={getRowData}
                useExpand={useExpand}
                expandedRowIds={expandedRowIds} 
                renderExpandedRow={renderExpandedRow}
              />
          </Table>
        </div>
        <TableFooter table={table} handleAnalyticsTableChange={handleAnalyticsTableChange} />
      </div>
        : <div className="text-center"><Spinner animation="border" variant="primary" /></div>
      }

    </Fragment>
  );
};

// export default TableContainer;