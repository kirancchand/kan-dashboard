
import Dropzone from "react-dropzone"
import { Col, Label, Input, Row } from "reactstrap"
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
const validationSchema = Yup.object({
    cakename: Yup.string().required("Splash name is required"),
    cakePhoto: Yup.mixed()
        .required("Cake photo is required")
        .test("fileType", "Only JPG, PNG or WEBP allowed", (value) =>
            value ? ["image/jpeg", "image/png", "image/webp"].includes((value as File).type) : false
        )
        .test("fileSize", "File size too large (max 2MB)", (value) => {
            const file = value as File;
            return file && file.size ? file.size <= 2 * 1024 * 1024 : false;
        }),
});
function Splash() {
    return (
        <div style={{ marginTop: '110px', padding: '50px' }}>
            <h4> Splash Screen</h4>
            <div style={{ marginTop: '10px', backgroundColor: '#fff', padding: '20px' }}>
                <Formik
                    initialValues={{ splashname: "", cakePhoto: null }}
                    validationSchema={validationSchema}
                    onSubmit={(values) => {
                        console.log("Form submitted values:", values);
                        alert("Form Submitted Successfully!");
                    }}
                >
                    {({ setFieldValue, values }) => (
                        <Form>
                            <Row>
                                <Col md={5}>
                                    <div className="splash-screen" >
                                        <div className="mb-3">
                                            <Label for="firstNameinput" className="form-label">Splash Name</Label>
                                            <Field type="text" className="form-control" name="splashname" placeholder="Enter cake name" />
                                            <ErrorMessage name="splashname" component="div" className="error" />
                                        </div>
                                    </div>
                                </Col>
                                <Col md={5}>
                                    <h5 className="fs-14">Upload <code>Splash Photos</code> here</h5>
                                    <div>
                                        <input
                                            id="cakePhoto"
                                            name="cakePhoto"
                                            type="file"
                                            className="form-control form-control-lg"
                                            onChange={(event) => setFieldValue("cakePhoto", event.currentTarget.files && event.currentTarget.files[0] ? event.currentTarget.files[0] : null)}
                                        />
                                        <ErrorMessage name="cakePhoto" component="div" className="error" />
                                        {values.cakePhoto && (
                                            <img
                                                src={URL.createObjectURL(values.cakePhoto)}
                                                alt="Preview"
                                                width="120"
                                                style={{ marginTop: "10px", borderRadius: "5px" }}
                                            />
                                        )}
                                    </div>
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






            </div>
        </div>

    )
}
export default Splash