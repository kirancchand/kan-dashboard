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
import ListState from "./ListState";
import { http, ADD_STATE,UPDATE_STATE,DELETE_STATE } from '../../../http/http';
import { toast } from 'react-toastify';
interface StateRow{
    state_id:number;
    state:string;
    file:File | null;
}

const schema = Yup.object({
  state: Yup.string().required("Required"),
  file: Yup.mixed().nullable()
  // .required("Required"),
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
  const [loading, setLoading] = useState(false);


  async function addNewState(data:any) {
      console.log('data', data);
      setLoading(true);
      await http({
        method: 'POST',
        url: ADD_STATE,
        data,
      })
        .then(function(response) {
          if (response.status === 200) {
            console.log(response.data);
  
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

    async function updateState(data:any) {
      console.log('data', data);
      setLoading(true);
      await http({
        method: 'PUT',
        url: UPDATE_STATE+'/'+data.state_id,
        data,
      })
        .then(function(response) {
          if (response.status === 200) {
            console.log(response.data);
  
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

    async function deleteState(state_id:any) {
      setLoading(true);
      await http({
        method: 'DELETE',
        url: DELETE_STATE+'/'+state_id
      })
        .then(function(response) {
          if (response.status === 200) {
            console.log(response.data);
  
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

  const formik = useFormik<StateRow>({
      initialValues: {
                      state_id:0,
                      state: '',
                      file: null,
                     },
        validationSchema: schema,
   

    onSubmit: (values, { resetForm }) => {
      if (editId) {
        // setData(data.map(d => d.id === editId ? { ...values, id: editId } : d));
        // addNewState(values);
        updateState(values)
        setEditId(null);
      } else {
        addNewState(values);
      }

     // setSuccessMsg("Saved successfully");
      resetForm();
      setShowForm(false);
    }
  });

   const handleEdit = (row: StateRow) => {

      setEditId(row.state_id);
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
      // setData(data.filter(d => d.id !== id));
      deleteState(id)
  };
  
           return (
               <div className="page-content">
                 <div className="container-fluid">
                     
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
                             name="state"
                             onChange={formik.handleChange} 
                             value={formik.values.state}
                             onBlur={formik.handleBlur} 
                             invalid={formik.touched.state && !!formik.errors.state} />
                             {formik.touched.state && formik.errors.state && (
                             <div className="text-danger">{formik.errors.state}</div>
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
                             {!loading?<ListState 
                                handleEdit={handleEdit}
                                handleDelete={handleDelete}
                                />:"loading.."}
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