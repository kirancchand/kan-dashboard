import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Col, Label, Row } from "reactstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import { fetchaddbookCategory } from '../../pages/Services/Api'
function Addcategory(){
     const validationSchema = Yup.object({
        book_category: Yup.string().required("supplier name is required"),
    //    bookdetails: Yup.string().required("Book Details is required"),
      
      });
        
   
    return(
                   <div className="book-form-container">
              <div className="book-form-header">
             <Link to='/book-category'>  <button className="btn btn-secondary" >
                  
                  Back to Category-List
                </button></Link>  
                <h2>Add New Category-List</h2>
              </div>
        
              <div className="book-form-content">
                
                  
                   <Formik initialValues={{ book_category: "" }}
                            validationSchema={validationSchema}
                             onSubmit={(values) => {
                                        console.log("Form submitted values:", values);
                                         axios
                                        .post(fetchaddbookCategory,values)
                                        .then((response) => {
                                          console.log("Success:", response);
                                          
                                        })
                                        .catch((error) => {
                                          console.error("Error:", error);
                                        });
                                   
                                      }}
                          >
                            <Form>
                  <div className="form-grid">
                    <div className="form-group">
                      <Label htmlFor="book_category">Category*</Label>
                      <Field
                        type="text"
                        id="name"
                        name="book_category"
                       placeholder="Enter category"
                      />
                     <ErrorMessage name="book_category" component="div" className="error" />
                    </div>
        <div className="form-actions">
                    
                    <div className="action-buttons">
                     
                      <button type="submit" className="btn btn-primary">
                        
                        Save Category-List
                      </button>
                    </div>
                  </div>
                  </div>
                  </Form>
              </Formik>
              </div>
            </div>
    )
}
export default Addcategory