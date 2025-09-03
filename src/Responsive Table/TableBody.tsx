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
type TableBodyProps = {
  table: any,
  rowColor: any,
  clickable: any,
  openRow?:boolean,
  getRowData?:any,
  useExpand?:boolean,
  expandedRowIds?: any;
  renderExpandedRow?:any;
};
const TableBody: React.FC<TableBodyProps> = ({
  table,
  rowColor,
  clickable,
  openRow,
  getRowData,
  useExpand,
  expandedRowIds,
  renderExpandedRow
}) => {
  // console.log('table', table)

  const [selectedRow, setSelectedRow] = useState('0');
  const [selectedOpenRow, setSelectedOpenRow] = useState(false);
  const [expandedRowId, setExpandedRowId] = useState<{ [key: number]: boolean }>({});

// console.log("table",table.columns)
  const handleRowClick=(rowdata:any)=>{
    if(clickable){
      setSelectedRow(rowdata.id)
      getRowData(rowdata)
    }

    if(openRow){    
      setSelectedOpenRow(true);
      setExpandedRowId((prev) => ({
        // ...prev,
        [rowdata.id]: !prev[rowdata.id], // Toggle expansion for the row
      }));
    }

  }

  console.log("expandedRowId",expandedRowId)

  return (
    <tbody>
      {table.getRowModel().rows.map((row: any) => {
        // console.log('row', row)
        // console.log('selectedRow', selectedRow)


        return (
          <>
          <tr key={row.id}
            onClick={() => handleRowClick(row)}
            style={clickable ? { backgroundColor: selectedRow === row.id ? rowColor : '', cursor: 'pointer' } : {}}

          >
            {row.getVisibleCells().map((cell: any) => {
              return (
                <td 
                  key={cell.id}>
                  {flexRender(cell.column.columnDef.cell,cell.getContext())}
                </td>
              );
            })}
          </tr>
          {(useExpand&&expandedRowIds[row.id]) && (
            <tr>
              <td colSpan={table.getAllColumns().length} className="p-2">
                {renderExpandedRow(row)}
              </td>
            </tr>
          )}

          {(selectedOpenRow&&expandedRowId[row.id])&& (
            <tr>
              <td colSpan={table.getAllColumns().length} className="p-2">
                {renderExpandedRow(row)}
              </td>
            </tr>
          )}

          </>
        );
      })}
    </tbody>
  )
}

export default TableBody