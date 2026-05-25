import React, { useMemo, useState, useEffect, Fragment } from 'react'
import { TableContainer } from "../../../Responsive Table/TableContainerReactTable";
import { SortTanstackInterface } from '../../../Typecomponents/ComponentsType';
// import UsersFormModal from '../../UsersFormModal';
import { SortInterface } from '../../../Typecomponents/ComponentsType';
// import AddUserModal from '../../AddUserModal';
import { http, GET_ORGANISATION_MEMBER_LIST,DELETE_ORGANISATION_MEMBER } from '../../../http/http';
import {
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Breadcrumb,
  BreadcrumbItem,
  Alert,
} from 'reactstrap';
import { toast } from 'react-toastify';
const OrganisationMember = ({respValue,setRespValue}:any) => {
    const [page, setPage] = useState(1);
    const [sorting, setSorting] = useState<SortTanstackInterface[]>([]);
    const [data, setData] = useState<[]>([]);

   


    const serialNo = (celldata: any) => {
        return <span>{((page - 1) * sizePerPage) + (Number(celldata.row.id) + 1)}</span>
    }


    const handleDelete=(organisation_member_id:number)=>{
              async function deleteOrganisationMember(organisation_member_id:any) {
                   setLoading(true);
                   await http({
                     method: 'DELETE',
                     url: DELETE_ORGANISATION_MEMBER+'/'+organisation_member_id
                   })
                     .then(function(response) {
                       if (response.status === 200) {
                         console.log(response.data);
                        fetchData(initialRequest)
                         toast(response.data.message, {
                           position: 'top-right',
                           type: 'success',
                         });
                       } else {
                         toast('Failed to Add State', {
                           position: 'top-right',
                           type: 'error',
                         });
                       }
                       setLoading(false);
                     })
                     .catch(err => {
                       toast(err, { position: 'top-right', type: 'error' });
                       setLoading(false);
                     });
                  }

                  deleteOrganisationMember(organisation_member_id)
    }

    const columns = useMemo(() => [
        {
            id: "slno",
            header: "Sl No",
            accessorKey: "slno",
            enableColumnFilter: false,
            cell: (cell: any) => serialNo(cell),
        }, 
        {
            id: "member_name",
            header: "Member Name",
            accessorKey: "member_name",
            enableColumnFilter: false,
        },
        {
            id: "f_user_id",
            header: "User Id",
            accessorKey: "f_user_id",
            enableColumnFilter: false,
        },
         {
            id: "role_name",
            header: "Role Name",
            accessorKey: "role_name",
            enableColumnFilter: false,
        },
        {
                header: "Actions",
                cell: (cell: any) => {
        
                  const row = cell.row.original;
        
                  return (
                    
                <div className="d-flex gap-2">
                
                      <Button
                        size="sm"
                        color="soft-danger"
                        onClick={() =>
                          handleDelete(row.organisation_member_id)
                        }
                      >
                        Delete
                      </Button>
        
                    </div>
                    
                  );
                },
              },

    ], [])

    const [totalCount, setTotalCount] = useState(0);

    let sort: SortInterface[] = [];
    const [sizePerPage, setSizePerPage] = useState(10);
    const [loading, setLoading] = useState(false);

    let initialRequest = {
        "start": 0,
        "sort": [],
        "numberOfRows": 10,
        "filters": [{
           "columnName":"f_organisation_id",
           "value":respValue.data.organisation_id
        }]
    }
    const fetchData = async (requestdata: any) => {
        const { start, numberOfRows } = requestdata;
        try {
            const response = await http.post(GET_ORGANISATION_MEMBER_LIST, requestdata);
            if (response.data) {
                setData(response.data.result);
                setTotalCount(response.data.totalCount);
            }
        } catch (error) {
            console.error("Error fetching analytics data:", error);
        }
    };

    useEffect(() => {
        fetchData(initialRequest);
    }, []);

    const handleTableChange = ({ pages, sizePerPages, sortField, sortOrder }: any) => {
        setPage(pages)
        setSizePerPage(sizePerPages)
        if (sortField !== "" && sortOrder !== "") {
            sort = [{
                "columnName": sortField,
                "sortOrder": sortOrder
            }]
        }
        fetchData({
            "start": (pages - 1) * sizePerPages,
            "sort": sort,
            "numberOfRows": sizePerPages,
            "filters": []
        });
        console.log("page", page)
    }


    return (
        <React.Fragment>
            <div style={{ padding: '50px', marginTop: '50px' }}>
               
               <Row>
                    <Col md="12">
                    <Card>

                        <CardHeader className="d-flex justify-content-between">
                        <h4>{respValue.title} of {respValue.data?.organisation}</h4>

                          <span>
                            <Button
                                color="soft-dark"
                                size="sm"
                                onClick={() => {
                                 setRespValue({
                                    nav:"Organisation",
                                    mode:"",
                                    data:null,
                                    origin:"OrganisationMember",
                                    title:"Organisation"
                                  })
                                }}
                            >
                                Back
                            </Button>    
                            &nbsp;&nbsp;
                            <Button
                                color="soft-success"
                                size="sm"
                                onClick={() => {
                                 setRespValue({
                                    nav:"RegisterOrganisationMember",
                                    mode:"add",
                                    data:respValue.data,
                                    origin:"OrganisationMember",
                                    title:"Register Organisation Member"
                                    })
                                }}
                            >
                                + Add New
                            </Button>    
                          </span>
                        </CardHeader>

                        <CardBody>
                        
                        {!loading?<TableContainer
                            columns={(columns || [])}
                            data={(data || [])}
                            customPageSize={sizePerPage}
                            tableClass="table-centered align-middle table-nowrap mb-0"
                            theadClass="text-muted table-light"
                            SearchPlaceholder='Search Users...'
                            isGlobalFilter={false}
                            page={page}
                            sorting={sorting}
                            setSorting={setSorting}
                            sizePerPage={sizePerPage}
                            clickable={false}
                            totalCount={totalCount}
                            handleTableChange={handleTableChange}
                            loading={loading}
                        />:"Loading..."}
                        </CardBody>

                    </Card>
                    </Col>
                </Row>
              
            </div>
        </React.Fragment>
    );
}

export default OrganisationMember