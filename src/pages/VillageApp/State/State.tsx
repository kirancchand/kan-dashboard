import React, { useMemo, useState } from 'react';
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
import { Link } from 'react-router-dom';
import { TableContainer } from '../../../common/AnalyticsTable/TableContainerReactTable';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { SortTanstackInterface } from '../../../Typecomponents/ComponentsType';

interface StateRow{
    id:number;
    name:string;
    file:File | null;
}

const schema = Yup.object({
  name: Yup.string().required("Required"),
  file: Yup.mixed().nullable().required("Required"),
});

const State = () => {

  const [data, setData] = useState<StateRow[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [sizePerPage, setSizePerPage] = useState(10);
  const [sorting, setSorting] = useState<SortTanstackInterface[]>([]);
  const [imagePreview,setImagePreview]=useState<string | null>(null);

   const handleTableChange = ({ page, sizePerPage }: any) => {
    setPage(page);
    setSizePerPage(sizePerPage);
  };
  const formik = useFormik<StateRow>({
      initialValues: {
                      id: 0,
                      name: '',
                      file: null,
                     },
        validationSchema: schema,
   

    onSubmit: (values, { resetForm }) => {
      if (editId) {
        setData(data.map(d => d.id === editId ? { ...values, id: editId } : d));
        setEditId(null);
      } else {
        const newEntry = {
          ...values,
          id: data.length ? Math.max(...data.map(d => d.id)) + 1 : 1
        };
        setData([...data, newEntry]);
      }

     // setSuccessMsg("Saved successfully");
      resetForm();
      setShowForm(false);
    }
  });
   const handleEdit = (row: StateRow) => {
  setEditId(row.id);

  formik.setValues({
    ...row,
    file: null,
  });

  setImagePreview(
    row.file && row.file.type.startsWith("image/")
      ? URL.createObjectURL(row.file)
      : null
  );

  setShowForm(true);
};
  const handleDelete = (id: number) => {
      setData(data.filter(d => d.id !== id));
    };
  
    const columns = useMemo(
      () => [
        {
          header: 'Sl No',
          
          cell: (cell: any) => cell.row.index + 1,
        },
        {
          header: 'Name',
          enableColumnFilter: false,
          accessorKey: 'name',
        },
         {
  header: 'File',
  cell: (cell: any) => {
    const file = cell.row.original.file;

    if (!file) return null;

    if (file.type.startsWith("image/")) {
      return (
        <img
          src={URL.createObjectURL(file)}
          alt="preview"
          width="50"
        />
      );
    }

    return <span>{file.name}</span>;
  }
},
         {
                header: 'Actions',
                cell: (cell: any) => {
                  const row = cell.row.original;
                  return (
                    <div className="d-flex gap-2">
                      <Button size="sm" color="soft-warning" onClick={() => handleEdit(row)}>
                        Edit
                      </Button>
                      <Button size="sm" color="soft-danger" onClick={() => handleDelete(row.id)}>
                        Delete
                      </Button>
                    </div>
                  );
                },
              },
            ],
            [data]
          );
           return (
               <div className="page-content">
                 <div className="container-fluid">
           
                   {/* HEADER */}
                   <Row>
                     <Col xs="12">
                       <div className="page-title-box d-flex justify-content-between">
                         <h4>State</h4>
           
                         <Breadcrumb>
                           <BreadcrumbItem>
                             <Link to="/villageapp">VillageApp</Link>
                           </BreadcrumbItem>
                           <BreadcrumbItem active>
                             State
                           </BreadcrumbItem>
                         </Breadcrumb>
                       </div>
                     </Col>
                   </Row>
           
                   {/* FORM */}
                   {showForm && (
                     <Card>
                       <CardHeader>
                         <h4>State Form</h4>
                       </CardHeader>
           
                       <CardBody>
                         {successMsg && <Alert color="success">{successMsg}</Alert>}
           
                         <Form onSubmit={formik.handleSubmit}>
                           <FormGroup>
                             <Label>Name</Label>
                             <Input 
                             name="name"
                             onChange={formik.handleChange} 
                             value={formik.values.name}
                             onBlur={formik.handleBlur} 
                             invalid={formik.touched.name && !!formik.errors.name} />
                             {formik.touched.name && formik.errors.name && (
                             <div className="text-danger">{formik.errors.name}</div>
                             )}
                           </FormGroup>
           
                           <FormGroup>
                              <Label>File</Label>
           
                                {imagePreview ? (
                             <div style={{ position: "relative", width: "150px" }}>
                                 <img
                                    src={imagePreview}
                                    alt="preview"
                                    style={{ width: "100%", borderRadius: "8px" }}
                                 />
           
                 
                             <button
                                    type="button"
                                    onClick={() => {
                                    setImagePreview(null);
                                    formik.setFieldValue("file", null);
                              }}
                                 style={{
                                       position: "absolute",
                                       top: 5,
                                       right: 5,
                                       background: "red",
                                       color: "#fff",
                                       border: "none",
                                       borderRadius: "50%",
                                       width: "25px",
                                       height: "25px",
                                       cursor: "pointer",
                             }}
                             >
                               ✕
                             </button>
                             </div>
                                  ) : (
                               <Input
                                     type="file"
                                      onChange={(e: any) => {
                                      const file = e.target.files[0];

                                    if (file) {
                                      formik.setFieldValue("file", file);

     
                                     if (file.type.startsWith("image/")) {
                                     setImagePreview(URL.createObjectURL(file));
                                      } else {
                                    setImagePreview(null);
                                      }
                                     }
                                     }}
                                 />
                          )}
                           </FormGroup>
                           
           
                          
           
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
                   )}
           
                   {/* TABLE */}
                   {!showForm && (
                     <Row>
                       <Col md="12">
                         <Card>
           
                           <CardHeader className="d-flex justify-content-between">
                             <h4>State</h4>
           
                             <Button
                               color="soft-success"
                               size="sm"
                               onClick={() => {
                                 formik.resetForm();
                                 setImagePreview(null);
                                 setEditId(null);
                                 setShowForm(true);
                               }}
                             >
                               + Add New
                             </Button>
                           </CardHeader>
           
                           <CardBody>
                             <TableContainer
                               columns={columns}
                               data={data}
                               page={page}
                               sizePerPage={sizePerPage}
                               totalCount={data.length}
                               handleTableChange={handleTableChange}
                               sorting={sorting}
                               setSorting={setSorting}
                             />
                           </CardBody>
           
                         </Card>
                       </Col>
                     </Row>
                   )}
           
                 </div>
               </div>
             );
           };

export default State;