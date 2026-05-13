import React, { useState, useEffect, Fragment, Suspense } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';
import Loader from 'react-loaders';
import {
    Row,Col,Card,CardBody,CardTitle,CardHeader,FormGroup,
    Input,InputGroup,InputGroupAddon,InputGroupText,
    Button,Label,FormFeedback,CardFooter
  } from 'reactstrap';
import RemotePagination from 'components/Common/ReactDatatableNext/BootstrapTableNext.js';
import {listUser} from '../../Api';
import { toast } from 'react-toastify';
import http from 'services/http';
import PageTitle from '../../../Layout/AppPageTitle';
export default function ListMenu(props) {
  console.log(props);
  const [loading,setLoading]=useState(props.loading);
  const [page, setPage] = useState(1);
  const [sizePerPage, setSizePerPage] = useState(10);
  const [currentIndexPage, setCurrentIndexPage] = useState(0);
  const [defaultSorted,setDefaultSorted]=useState([])
  const [filters,setFilters]=useState([]);
  const [data,setData]=useState({
    result:[],
    totalCount:0
  });

  let tempJsonSort = {
    start: 0,
    numberOfRows: sizePerPage,
    sort: defaultSorted,
    filters: filters,
  };

  async function fetchAllMenu(tempJsonData) {
    await http({
      method: 'POST',
      url: listUser,
      data:tempJsonData
    })
      .then(function (response) {
        if (response.status === 200) {
          console.log(response.data)
          setData(response.data)
          toast(response.data.message, { position: 'top-right', type: 'success' });
        }
        } else {
          toast("Failed to Add State", { position: 'top-right', type: 'error' });
        }
        }
      })
      .catch(err => {
        toast(err, { position: 'top-right', type: 'error' });
      });
  }



  useEffect(() => {
    fetchAllMenu(tempJsonSort)
  }, [])

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
      fetchAllMenu(tempJsonSort)
    }
  };

  const columns = [
    {
      text:"id",
      width: 5,
      dataField: "user_id",
      // sort: true,
      formatter: slDisplay,
      style: { width: '75px' },
    },
    {
      text: "First Name",
      dataField: "first_name",
      sort: true,
      editorStyle: {
        backgroundColor: '#20B2AA'
      },
      style: { width: '150px' },
    },
    {
      text: "Middle Name",
      dataField: "middle_name",
      sort: true,
      editorStyle: {
        backgroundColor: '#20B2AA'
      },
      style: { width: '150px' },
    },
    {
      text: "Last Name",
      dataField: "last_name",
      sort: true,
      editorStyle: {
        backgroundColor: '#20B2AA'
      },
      style: { width: '150px' },
    },
    {
      text: "Email",
      dataField: "email_id",
      sort: true,
      editorStyle: {
        backgroundColor: '#20B2AA'
      },
      style: { width: '150px' },
    },
    {
      text: "Mob No",
      dataField: "mob_no",
      sort: true,
      editorStyle: {
        backgroundColor: '#20B2AA'
      },
      style: { width: '150px' },
    },
    {
      text: "Branch",
      dataField: "branch",
      sort: true,
      editorStyle: {
        backgroundColor: '#20B2AA'
      },
      style: { width: '150px' },
    },
    {
      text: "User Type",
      dataField: "usertype",
      sort: true,
      editorStyle: {
        backgroundColor: '#20B2AA'
      },
      style: { width: '150px' },
    },
    {
      text: "Status",
      dataField: "status",
      sort: true,
      editorStyle: {
        backgroundColor: '#20B2AA'
      },
      style: { width: '150px' },
    },
    {
      text: "Action",
      dataField: 'action',
      sort: true,
      editorStyle: {
        backgroundColor: '#20B2AA'
      },
      style: { width: '150px' },
      formatter: actionFunc,
    },
  ];
  function slDisplay(cell, row, rowIndex, formatExtraData) {
    // console.log(rowIndex);
    let slno;
    return <div>{currentIndexPage + rowIndex + 1}</div>;
  }

  function actionFunc(cell, row, rowIndex, formatExtraData) {
    return <div>sdfsd</div>;
  }
  return(
    <Fragment>
      <BlockUi
        tag="div"
        blocking={loading}
        loader={<Loader active type="ball-spin-fade-loader" />}
        <RemotePagination
          loading={loading}
          keyField="state_id"
          columns={columns}
          data={data.result}
          page={page}
          sizePerPage={10}
          totalSize={data.totalCount}
          onTableChange={handleTableChange}   
        />
      </BlockUi>
    </Fragment>
  )
}
