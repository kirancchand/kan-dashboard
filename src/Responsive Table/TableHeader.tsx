import React, { Fragment, useEffect, useState } from "react";
import { TableContainerProps } from '../Typecomponents/ComponentsType';
import {
    Column,
    Table as ReactTable,
    flexRender
  } from '@tanstack/react-table';
  const Filter = ({
    column
  }: {
    column: Column<any, unknown>;
    table: ReactTable<any>;
  }) => {
    const columnFilterValue = column.getFilterValue();
  
    return (
      <>
        <DebouncedInput
          type="text"
          value={(columnFilterValue ?? '') as string}
          onChange={value => column.setFilterValue(value)}
          placeholder="Search..."
          className="w-36 border shadow rounded"
          list={column.id + 'list'}
        />
        <div className="h-1" />
      </>
    );
  };

  const DebouncedInput = ({
    value: initialValue,
    onChange,
    debounce = 500,
    ...props
  }: {
    value: string | number;
    onChange: (value: string | number) => void;
    debounce?: number;
  } & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) => {
    const [value, setValue] = useState(initialValue);
  
    useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);
  
    useEffect(() => {
      const timeout = setTimeout(() => {
        onChange(value);
      }, debounce);
  
      return () => clearTimeout(timeout);
    }, [debounce, onChange, value]);
  
    return (
      <input {...props} value={value} id="search-bar-0" className="form-control border-0 search" onChange={e => setValue(e.target.value)} />
    );
  };

type TableHeaderProps = TableContainerProps & {
    table: any,
    handleAnalyticsTableChange:any
};

const TableHeader: React.FC<Omit<TableHeaderProps,'columns'|'data'>> = ({
    table,
    isGlobalFilter,
    customPageSize,
    tableClass,
    theadClass,
    trClass,
    thClass,
    divClass,
    SearchPlaceholder,
    handleAnalyticsTableChange
  })=> {

  const handleAnalyticsSortChange=(headerData:any)=>{

    
    // console.log("getIsSorted",headerData.column.getIsSorted())
    // header.column.getToggleSortingHandler()
    headerData.column.getToggleSortingHandler()
    let setOrder='';
    if(!headerData.column.getIsSorted()||headerData.column.getIsSorted()==="desc"){
      setOrder="asc"
    }
    else{
      setOrder="desc"
    }
    handleAnalyticsTableChange({
      type:"sort",
      payload:{
        sortField:headerData.column.id,
        sortOrder:setOrder
        }
    })
  }

  // console.log(table.getHeaderGroups())
  return (
    <thead className={theadClass}>
    {table.getHeaderGroups().map((headerGroup: any) => (
      <tr className={trClass} key={headerGroup.id}>
        {headerGroup.headers.map((header: any) => (
          // console.log(header.column.getIsSorted()),
          <th key={header.id}  style={header.column.columnDef.headerStyle} id={header.column.columnDef.headerId} className={thClass}  {...{onClick: ()=>header.column.columnDef.enableSorting&&handleAnalyticsSortChange(header)}}>
            {header.isPlaceholder ? null : (
              <React.Fragment>
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
                {
                  header.column.columnDef.enableSorting?<span>
                  {{
                    false: <i className="ri-expand-up-down-fill"></i>,
                    asc: <i className="ri-expand-up-down-fill"></i>,
                    desc: <i className="ri-expand-up-down-fill"></i>,
                  }[header.column.getIsSorted() as string] ?? null}
                </span>:null}

               
               

                {header.column.getCanFilter() ? (
                  <div>
                    <Filter column={header.column} table={table} />
                  </div>
                ) : null}
              </React.Fragment>
            )}
          </th>
        ))}
      </tr>
    ))}
  </thead>
  )
}

export default TableHeader