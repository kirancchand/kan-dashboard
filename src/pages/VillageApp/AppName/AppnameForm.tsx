import React, { useMemo, useState,useEffect, Fragment } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
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
  FormFeedback,
  Button,
  Breadcrumb,
  BreadcrumbItem,
  Spinner,
  Alert,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { TableContainer } from '../../../common/AnalyticsTable/TableContainerReactTable';
import TableFilterDropdown from '../../../common/AnalyticsTable/TableFilterDropdown';
import { SortTanstackInterface,SortInterface } from '../../../Typecomponents/ComponentsType';
import { http } from '../../../http/http';
import { ADD_VILLAGE_NAME,GET_VILLAGE_NAME } from '../Api';
import { toast } from 'react-toastify';
interface AppnameRow {
  id: number;
  villageapp_name: string;
  villageapp_desc: string;
  villageapp_about: string;
}

const AppnameFormSchema = Yup.object().shape({
  

  villageapp_name: Yup.string()
    .min(3, 'Name must be at least 3 characters')
    .max(60, 'Name must not exceed 60 characters')
    .required('Name is required'),

  villageapp_desc: Yup.string()
    .min(10, 'Description must be at least 10 characters')
    .max(200, 'Description must not exceed 200 characters')
    .required('Description is required'),

  villageapp_about: Yup.string()
    .max(500, 'About must not exceed 500 characters')
    .optional(),
});

const AppnameForm = () => {
  const [tableData, setTableData] = useState<AppnameRow[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const [page, setPage] = useState(1);
  const [sizePerPage, setSizePerPage] = useState(3);
  const [sorting, setSorting] = useState<SortTanstackInterface[]>([]);
  const [loading, setLoading] = useState(false);

  const [totalCount, setTotalCount] = useState(0);
  const [data, setData] = useState<[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterName, setFilterName] = useState("");
  const [tempName, setTempName] = useState("");
  let sort: SortInterface[] = [];
    
      
 
  let initialRequest = {
      "start": 0,
      "sort": [],
      "numberOfRows": 10,
      "filters": []
  }
  async function saveVillageName(data:any) {
      setLoading(true);
      await http({
        method: 'POST',
        url: ADD_VILLAGE_NAME,
        data,
      }).then(function(response) {
          if (response.status === 200) {
            formik.resetForm();
            toast(response.data.message, { position: 'top-right',type: 'success' });
            setShowForm(false);
            fetchData(initialRequest);

          } else {
            toast('Failed to Add village', {position: 'top-right',type: 'error'});
          }
          setLoading(false);
      })
      .catch(err => {
          toast(err, { position: 'top-right', type: 'error' });
          setLoading(false);
      });
  }
  

  const formik = useFormik<AppnameRow>({
    initialValues: {
      id: 0, 
      villageapp_name: '',
      villageapp_desc: '',
      villageapp_about: '',
    },
    validationSchema: AppnameFormSchema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      setApiError(null);
      setSuccessMsg(null);

      try {
          if (editId) {
                const updated = tableData.map((item) =>
                  item.id === editId ? { ...values, id: editId } : item
                );
                setTableData(updated);
                setEditId(null);
            } else {
              saveVillageName(values);
            }
        

      } catch (error) {
        setApiError('Something went wrong');
      } finally {
        setSubmitting(false);
      }
    }
  });

 const handleEdit = (id: number) => {
  const selected = tableData.find((item) => item.id === id);
  if (!selected) return;

  setEditId(id);

  // formik.setValues({
  //   id: selected.id,
  //   villageapp_name: selected.villageapp_name,
  //   villageapp_desc: selected.villageapp_desc,
  //   villageapp_about: selected.villageapp_about,
  // });

  setShowForm(true);
};

  const handleDelete = (id: number) => {
  const filtered = tableData.filter((item) => item.id !== id);
  setTableData(filtered);
};



  const columns = useMemo(
    () => [
      {
        header: 'Sl No',
          cell: (cell: any) => cell.row.index + 1,
      },
      
      
      {
        header: 'Name',
        accessorKey: 'villageapp_name',
        enableColumnFilter: false,
      },
      {
        header: 'Description',
        accessorKey: 'villageapp_desc',
         enableColumnFilter: false,
      },
      {
        header: 'About',
        accessorKey: 'villageapp_about',
         enableColumnFilter: false,
      },
      {
        header: 'Actions',
         enableColumnFilter: false,
        cell: (cell: any) => {
          const row = cell.row.original;
        

          return (
            <div className="d-flex gap-2">
              <Button
                size="sm"
                color="soft-warning"
                onClick={() => handleEdit(row.id)}
              >
                Edit
              </Button>

              <Button
                size="sm"
                color="soft-danger"
                onClick={() => handleDelete(row.id)}
              >
                Delete
              </Button>
            </div>
          );
        },
      },
    ],
    [page, sizePerPage, tableData]
  );

      const fetchData = async (requestdata: any) => {
          const { start, numberOfRows } = requestdata;
          try {
              const response = await http.post(GET_VILLAGE_NAME, requestdata);
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
    <div className="page-content">
      <div className="container-fluid">

        {/* Breadcrumb */}
        <Row>
          <Col xs="12">
            <div className="page-title-box d-flex align-items-center justify-content-between">
              <h4 className="mb-0">Appname Form</h4>

              <Breadcrumb listClassName="m-0">
                <BreadcrumbItem>
                  <Link to="/villageapp">VillageApp</Link>
                </BreadcrumbItem>

                <BreadcrumbItem>
                  <Link to="#">Appname</Link>
                </BreadcrumbItem>

                <BreadcrumbItem active>
                  Appname Form
                </BreadcrumbItem>
              </Breadcrumb>
            </div>
          </Col>
        </Row>

        {/* FORM */}
        {showForm && (
          <Row>
            <Col md="12">
              <Card>
                <CardHeader className="d-flex justify-content-between align-items-center">
                  <h4 className="card-title mb-0">
                    Appname Details
                  </h4>
                </CardHeader>

                <CardBody>

                  {apiError && (
                    <Alert color="danger">
                      {apiError}
                    </Alert>
                  )}

                  {successMsg && (
                    <Alert color="success">
                      {successMsg}
                    </Alert>
                  )}

                  <Form onSubmit={formik.handleSubmit}>

                    <Row>
                     

                      <Col md={6}>
                        <FormGroup>
                          <Label>App Name</Label>

                          <Input
                            name="villageapp_name"
                            value={formik.values.villageapp_name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            invalid={
                              !!formik.errors.villageapp_name &&
                              !!formik.touched.villageapp_name
                            }
                          />

                          <FormFeedback>
                            {formik.errors.villageapp_name}
                          </FormFeedback>
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={12}>
                        <FormGroup>
                          <Label>Description</Label>

                          <Input
                            type="textarea"
                            rows={3}
                            name="villageapp_desc"
                            value={formik.values.villageapp_desc}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            invalid={
                              !!formik.errors.villageapp_desc &&
                              !!formik.touched.villageapp_desc
                            }
                          />

                          <FormFeedback>
                            {formik.errors.villageapp_desc}
                          </FormFeedback>
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={12}>
                        <FormGroup>
                          <Label>About</Label>

                          <Input
                            type="textarea"
                            rows={4}
                            name="villageapp_about"
                            value={formik.values.villageapp_about}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          />
                        </FormGroup>
                      </Col>
                    </Row>

                    <div className="d-flex gap-2 mt-3">
                                                         <Button 
                                                            color="soft-secondary" 
                                                            onClick={() => setShowForm(false)}>
                                                           Cancel
                                                         </Button>
                                                         <Button 
                                                            color="primary"
                                                            type="submit">
                                                           {editId ? 'Update' : 'Submit'}
                                                         </Button>
                                                       </div>

                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        )}

        {/* TABLE */}
        {!showForm && (
          <Row>
            <Col md="12">
              <Card>

                <CardHeader className="d-flex justify-content-between align-items-center">
                  <h4 className="card-title mb-0">
                    Appnames
                  </h4>
                   <div className="d-flex gap-2">

                      <TableFilterDropdown
                        isOpen={filterOpen}
                        toggle={() => setFilterOpen(!filterOpen)}
                        fields={[
                          {
                            label: "App Name",
                            value: tempName,
                            onChange: setTempName,
                            placeholder: "Search Name",
                          },
                        ]}
                        onClear={() => {
                          setTempName("");
                          setFilterName("");
                        }}
                        onApply={() => {
                          setFilterName(tempName);
                          setFilterOpen(false);
                        }}
                      />

                    <Button
                      color="soft-success"
                      size="sm"
                      onClick={() => {
                        formik.resetForm();
                        setEditId(null);
                        setShowForm(true);
                      }}
                    >
                      + Add New
                    </Button>
                    </div>
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
        )}

      </div>
    </div>
  );
};

export default AppnameForm;