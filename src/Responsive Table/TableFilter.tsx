import React, { useEffect, useState } from "react";
import { CardBody, Col, Row } from "reactstrap";
import { TableContainerProps } from '../Typecomponents/ComponentsType';


type TableFilterProps = TableContainerProps & {
  globalFilter: string;
  setGlobalFilter: React.Dispatch<React.SetStateAction<string>>;
};


const TableFilter: React.FC<TableFilterProps> = ({
 isGlobalFilter,
 SearchPlaceholder,
 globalFilter,
 setGlobalFilter
})=> {

// const TableFilter = ({
//     columns,
//     data,
//     isGlobalFilter,
//     customPageSize,
//     tableClass,
//     theadClass,
//     trClass,
//     thClass,
//     divClass,
//     SearchPlaceholder,
//   }: TableContainerProps & {table:any}) => {

    // const [globalFilter, setGlobalFilter] = useState('');
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
          if (inputRef.current) {
            // inputRef.current.focus();
          }
        }, [value]);

        useEffect(() => {
          const timeout = setTimeout(() => {
            onChange(value);
          }, debounce);
      
          return () => clearTimeout(timeout);
        }, [debounce, onChange, value]);
        const inputRef = React.useRef<HTMLInputElement>(null);

        return (
          <input {...props} value={value} id="search-bar-0" className="form-control border-0 search"  ref={inputRef} onChange={e => setValue(e.target.value)} />
        );
      };
  return (
        isGlobalFilter ?<Row className="mb-3">
        <CardBody className="border border-dashed border-end-0 border-start-0">
            <form>
                <Row>
                <Col sm={5}>
                    <div className="search-box me-2 mb-2 d-inline-block col-12">
                    <DebouncedInput
                        value={globalFilter ?? ''}
                        onChange={value => setGlobalFilter(String(value))}
                        placeholder={SearchPlaceholder}
                    />
                    <i className="bx bx-search-alt search-icon"></i>
                    </div>
                </Col>
                </Row>
            </form>
        </CardBody>
    </Row>:null
    
  )
}

export default TableFilter