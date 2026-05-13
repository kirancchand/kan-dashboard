import React, { useState, useEffect,Fragment,Suspense } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';
import Loader from 'react-loaders';
import PageTitle from '../../../Layout/AppPageTitle';
import {
    Row,Col,Card,CardBody,CardTitle,CardHeader,FormGroup,
    Input,InputGroup,InputGroupAddon,InputGroupText,
    Button,Label,FormFeedback,CardFooter
  } from 'reactstrap';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import RemotePagination from '../../../../components/Common/ReactDatatableNext/BootstrapTableNext.js';
export default function ListMuncipality(props)
{

    console.log(props)
    const [loading,setLoading]=useState(false);
    const [page, setPage] = useState(props.page);
    const [sizePerPage, setSizePerPage] = useState(props.sizePerPage);
    const [keyField, setKeyField] = useState(props.keyField);
    const [totalSize, setTotalSize] = useState(props.totalSize);
    const [currentIndexPage, setCurrentIndexPage] = useState(0);
    const [data,setData]=useState([]);
    const [defaultSorted,setDefaultSorted]=useState([])
    const [filters,setFilters]=useState([]);

    let tempJsonSort = {
        start: 0,
        numberOfRows: sizePerPage,
        sort: defaultSorted,
        filters: filters,
      };

    useEffect(() => {
        setData(props.data);
        setPage(props.page);
        setSizePerPage(props.sizePerPage);
        setKeyField(props.keyField);
        setTotalSize(props.totalSize);
    }, [props.data])

    const handleTableChange = (
        type,
        { page, sizePerPage, sortField, sortOrder }
      ) => {
    
        if (loading === false) {
          const currentIndex = (page - 1) * sizePerPage;
          let sort = [];
          // setLoading(true);
          setPage(page);
          setSizePerPage(sizePerPage);
          setCurrentIndexPage(currentIndex);
    
          if (sortField !== null && sortOrder !== null) {
            sort = [{
              "columnName": sortField,
              "sortOrder": sortOrder
            }]
          }
          else {
            sort = defaultSorted;
          }
    
          tempJsonSort = {
            'start': currentIndex,
            'numberOfRows': sizePerPage,
            'sort': sort,
            'filters': []
          };
        //   getFirList(tempJsonSort);
        }
    
      };

      
    const columns = [

        {
          text:props.field[0].fieldName,
          width: 5,
          dataField: props.field[0].fieldData,
          // sort: true,
        //   formatter: slDisplay,
          style: { width: '75px' },
        },
        {
          text: props.field[1].fieldName,
          dataField: props.field[1].fieldData,
          sort: true,
          editorStyle: {
            backgroundColor: '#20B2AA'
          },
          formatter: fieldTwo,
          style: { width: '150px' },
        },
        {
            text: props.field[2].fieldName,
            dataField: props.field[2].fieldData,
            sort: true,
            editorStyle: {
              backgroundColor: '#20B2AA'
            },
            formatter: fieldThree,
            style: { width: '150px' },
          },
          {
            text: props.field[3].fieldName,
            dataField: props.field[3].fieldData,
            sort: true,
            editorStyle: {
              backgroundColor: '#20B2AA'
            },
            formatter: fieldFour,
            style: { width: '150px' },
          },
          {
            text: props.field[4].fieldName,
            dataField: props.field[4].fieldData,
            sort: true,
            editorStyle: {
              backgroundColor: '#20B2AA'
            },
            // formatter: fieldThree,
            style: { width: '150px' },
          },
      ];
      function slDisplay(cell, row, rowIndex, formatExtraData) {
        // console.log(rowIndex);
        let slno;
        return <div>{currentIndexPage + rowIndex + 1}</div>;
      }
      function fieldTwo(cell, row, rowIndex, formatExtraData) {
        return <div>{row[props.field[1].fieldData].label}</div>;
      }

      function fieldThree(cell, row, rowIndex, formatExtraData) {
        return <div>{
          row[props.field[2].fieldData].label
          }</div>;
      }

      function fieldFour(cell, row, rowIndex, formatExtraData) {
        return <div>{
          row[props.field[3].fieldData]
          }</div>;
      }
    return(
        <Fragment>
      <BlockUi tag="div" blocking={loading} loader={<Loader active type='ball-spin-fade-loader' />}>
            <RemotePagination
              loading={loading}
              keyField={keyField}
              columns={columns}
              data={data}
              page={page}
              sizePerPage={10}
              totalSize={totalSize}
              onTableChange={handleTableChange}
            // expandRow={ handleExpandRow }      
            />
      </BlockUi>
    </Fragment>
    )
}