import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Col, Label, Row } from "reactstrap";
import { Link } from "react-router-dom";
function Addnewpurchase(){
     const validationSchema = Yup.object({
        supplier: Yup.string().required("supplier name is required"),
       bookdetails: Yup.string().required("Book Details is required"),
      quantity:Yup.string().required("Quantity is required"),
        unitcost: Yup.string().required("Unit cost is required")
                                .matches(/^\d+(\.\d{1,2})?$/, "Enter a valid unit cost (e.g. 100 or 100.50)"),
    totalcost: Yup.string()
    .required("Total cost is required")
    .matches(/^\d+(\.\d{1,2})?$/, "Enter a valid Total cost (e.g. 100 or 100.50)")
      });
        
   
    return(
                   <div className="book-form-container">
              <div className="book-form-header">
             <Link to='/Buy-orders'>  <button className="btn btn-secondary" >
                  
                  Back to BuyList
                </button></Link>  
                <h2>Add New Orders</h2>
              </div>
        
              <div className="book-form-content">
                
                  
                   <Formik
                            initialValues={{ supplier: "",bookdetails:"",quantity:"",unitcost:"",totalcost:"" }}
                            validationSchema={validationSchema}
                            onSubmit={(values) => {
                              console.log("Form submitted values:", values);
                           
                              }}
                          >
                            <Form>
                  <div className="form-grid">
                    <div className="form-group">
                      <Label htmlFor="supplier">Supplier*</Label>
                      <Field
                        type="text"
                        id="name"
                        name="supplier"
                       placeholder="Enter supplier name"
                      />
                     <ErrorMessage name="supplier" component="div" className="error" />
                    </div>
        
                    <div className="form-group">
                      <Label htmlFor="bookdetails">Book Details *</Label>
                      <Field
                        type="text"
                        id="author"
                        name="bookdetails"
                       
                        placeholder="Enter Book Details"
                      />
                     <ErrorMessage name="bookdetails" component="div" className="error" />
                    </div>
        
                    {/* <div className="form-group">
                      <label htmlFor="condition">Quantity</label>
                      <select
                        id="condition"
                        name="condition"
                      
                      >
                        <option value="new">New</option>
                        <option value="good">Good</option>
                        <option value="fair">Fair</option>
                        <option value="poor">Poor</option>
                      </select>
                    </div> */}
        
                    <div className="form-group">
                      <Label htmlFor="quantity">Quantity*</Label>
                      <Field
                        type="text"
                        id="publisher"
                        name="quantity"
                      
                        placeholder="Enter quantity"
                      />
                       <ErrorMessage name="quantity" component="div" className="error" />
                    </div>
        
                    <div className="form-group">
                      <label htmlFor="unitcost">Unit Cost*</label>
                      <input
                        type="text"
                        id="listerBy"
                        name="unitcost"
                      
                        placeholder="Enter lister name"
                      />
                      <ErrorMessage name="unitcost" component="div" className="error" />
                    </div>
        
                    <div className="form-group">
                      <label htmlFor="totalcost">Total cost ($)*</label>
                      <input
                        type="text"
                        id="isbn"
                        name="totalcost"
                        
                        placeholder=""
                      />
                      <ErrorMessage name="totalcost" component="div" className="error" />
                    </div>
        
                    <div className="form-group">
                      <label htmlFor="publishedYear">Order Date</label>
                      <input
                        type="number"
                        id="publishedYear"
                        name="publishedYear"
                       
                        min="1000"
                        max={new Date().getFullYear()}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="publishedYear">Expected Delivery</label>
                      <input
                        type="number"
                        id="publishedYear"
                        name="publishedYear"
                       
                        min="1000"
                        max={new Date().getFullYear()}
                      />
                    </div>
        
            
        
                  <div className="form-actions">
                    
                    <div className="action-buttons">
                      <button type="button" className="btn btn-secondary" >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary">
                        
                        Save Orders
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
export default Addnewpurchase