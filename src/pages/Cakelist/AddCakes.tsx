import { Col, Label, Row } from "reactstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { fetchaddCake } from '../../pages/Services/Api'
import { useNavigate } from "react-router-dom";
import { Card, CardBody } from "reactstrap";
const validationSchema = Yup.object({
  cake_name: Yup.string().required("Cake name is required"),
  cake_price: Yup.string()
    .matches(/^[0-9]+$/, "Price must contain only digits")
    .required("Price is required"),
  cake_details: Yup.string().required("Content is required"),
  cake_image: Yup.mixed()
    .required("Cake photo is required")
//     .test("fileType", "Only JPG, PNG or WEBP allowed", (value) =>
//       value ? ["image/jpeg", "image/png", "image/webp"].includes((value as File).type) : false
//     )
// .test("fileSize", "File size too large (max 2MB)", (value) => {
//   const file = value as File;
//   return file && file.size ? file.size <= 2 * 1024 * 1024 : false;
// }),
});

function AddCakes() {
  const navigate = useNavigate();
  return (
    <div style={{ marginTop: "110px", padding: "50px" }}>
      <h3 style={{ color: "#405189" }}>Add Cakes</h3>
      <div className="add-cakes" style={{ backgroundColor: "#fff", padding: "25px" }}>
        <Card>
           <CardBody>
        <Formik
          initialValues={{ cake_name: "", cake_price: "", cake_details: "", cake_image: "" }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            console.log("Form submitted values:", values);
            // alert("Form Submitted Successfully!");
             axios
            .post(fetchaddCake, values)
            .then((response) => {
              console.log("Success:", response.data);
              navigate("/cake-table");
            })
            .catch((error) => {
              console.error("Error:", error);
            });
       
          }}
        >
          {({ setFieldValue, values }) => (
           
            <Form>
               
              <Row>
                
                {/* Cake Name */}
                <Col md={6}>
                  <div className="cake-screen mb-3">
                    <Label htmlFor="cakename" className="form-label">Cake Name</Label>
                    <Field type="text" className="form-control" name="cake_name" placeholder="Enter cake name" />
                    <ErrorMessage name="cake_name" component="div" className="error" />
                  </div>
                </Col>

                {/* Price */}
                <Col md={6}>
                  <div className="cake-screen mb-3">
                    <Label htmlFor="price" className="form-label">Price</Label>
                    <Field type="text" className="form-control" name="cake_price" placeholder="Enter price" />
                    <ErrorMessage name="cake_price" component="div" className="error" />
                  </div>
                </Col>

                {/* Content */}
                <Col md={6}>
                  <div className="cake-screen mb-3">
                    <Label htmlFor="content" className="form-label">Content</Label>
                    <Field as="textarea" className="form-control" name="cake_details" placeholder="Enter content" />
                    <ErrorMessage name="cake_details" component="div" className="error" />
                  </div>
                </Col>

                {/* File Upload */}
                <Col md={6}>
                <div className="cake-screen mb-3">
                    <Label htmlFor="content" className="form-label">Image</Label>
                    <Field as="textarea" className="form-control" name="cake_image" placeholder="Enter content" />
                    <ErrorMessage name="cake_image" component="div" className="error" />
                  </div>
                  {/* <div className="mb-3">
                    <Label htmlFor="cakePhoto" className="form-label">
                      Upload <code>Cake Photo</code> here
                    </Label>
                    <input
                      id="cakePhoto"
                      name="cake_image"
                      type="file"
                      className="form-control form-control-lg"
                      onChange={(event) => setFieldValue("cake_image", event.currentTarget.files && event.currentTarget.files[0] ? event.currentTarget.files[0] : null)}
                    />
                    <ErrorMessage name="cake_image" component="div" className="error" /> */}
                    {/* {values.cake_image && (
                      <img
                        src={URL.createObjectURL(values.cake_image)}
                        alt="Preview"
                        width="120"
                        style={{ marginTop: "10px", borderRadius: "5px" }}
                      />
                    )} */}
                  {/* </div> */}
                </Col>

               
                <Col md={12}>
                  <div className="text-end">
                    <button type="submit" className="btn btn-primary">Submit</button>
                  </div>
                </Col>
                
              </Row>
              
            </Form>
          
          )}
        </Formik>
          </CardBody>
      </Card>
      </div>
    </div>
  );
}

export default AddCakes;
