import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Col, Label, Row } from "reactstrap";
function Addusers() {
    const validationSchema = Yup.object({
        name: Yup.string().required("Book name is required"),
       author: Yup.string().required("Author name is required"),
      
      });
    return (
        <div>
            <div className="add-user-container">
                <div className="add-user-header">
                    <button className="btn btn-secondary">

                        Back to Users
                    </button>
                    <h1 className="centered-title">Add New User</h1>
                </div>
                   

                <div className="add-user-form-container">
                     <Formik
                    initialValues={{ name: "",author:"" }}
                    validationSchema={validationSchema}
                    onSubmit={(values) => {
                      console.log("Form submitted values:", values);
                   
                      }}
                  >
                    <Form className="add-user-form">
                        <div className="form-row">
                            <div className="form-group">
                                <Label htmlFor="name">Name *</Label>
                                <Field
                                    id="name"
                                    type="text"
                                    value=""
                                    name="name"
                                    placeholder="Enter user's full name"
                                />
                            <ErrorMessage name="name" component="div" className="error" />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email *</label>
                                <input
                                    id="email"
                                    type="email"
                                    value=""
                                    placeholder="Enter user's email address"
                                />

                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="username">Username *</label>
                                <input
                                    id="username"
                                    type="text"
                                    value=""
                                    placeholder="Enter username"
                                />

                            </div>

                            <div className="form-group">
                                <label htmlFor="phoneNumber">Phone Number *</label>
                                <input
                                    id="phoneNumber"
                                    type="tel"
                                    value=""
                                    placeholder="Enter phone number"
                                />

                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="pincode">Pincode</label>
                                <input
                                    id="pincode"
                                    type="text"
                                    value=""
                                    placeholder="Enter pincode"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="district">District</label>
                                <input
                                    id="district"
                                    type="text"
                                    value=""
                                    placeholder="Enter district"
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="state">State</label>
                                <input
                                    id="state"
                                    type="text"
                                    value=""
                                    placeholder="Enter state"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="country">Country</label>
                                <input
                                    id="country"
                                    type="text"
                                    value=""
                                    placeholder="Enter country"
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="role">Role</label>
                                <select
                                    id="role"
                                    value=""

                                >
                                    <option value="user">User</option>
                                    <option value="author">Author</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>

                            {/* <div className="form-group">
                                <label htmlFor="status">Status</label>
                                <select
                                    id="status"
                                    value=""

                                >
                                    <option value="active">Active</option>
                                    <option value="banned">Banned</option>
                                </select>
                            </div> */}
                        </div>

                        <div className="form-actions">
                            <button type="button" className="btn btn-secondary">
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary">

                                Create User
                            </button>
                        </div>
                    </Form>
                    </Formik>
                </div>
            </div>
        </div>
    )
}
export default Addusers