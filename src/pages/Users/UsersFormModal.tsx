import { Button, Modal, ModalHeader, ModalBody, Row, Col, Label, Input, FormGroup } from 'reactstrap';
import { Form as FormikForm, Field, ErrorMessage, Formik } from "formik";
// import Swal from 'sweetalert2';
import * as Yup from "yup";

const UsersFormModal = (props: any) => {
    const mode = props.mode

    const initialVals = {
        first_name: "",
        last_name: "",
        middle_name: "",
        email_id: "",
        mobno: "",
        dateofbirth: "",
        f_gender_id: ""
    }

    const UserSchema = Yup.object().shape({
        first_name: Yup.string()
            .required("First Name is required!"),
        last_name: Yup.string()
            .required("Last Name is required!"),
        mobno: Yup.string()
            .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits")
            .required("Mobile No. is required!"),
        email_id: Yup.string()
            .required("Email is required!"),
        dateofbirth: Yup.string()
            .required("Date of Birth is required!"),
        f_gender_id: Yup.string()
            .required("Gender is required")
    })

    // const successNotification = () => {
    //     Swal.fire({
    //         title: "Success!",
    //         text: props.selected ? "Selected User Updated." : "New User Added",
    //         icon: "success"
    //     })
    // }

    return (
        <Modal isOpen={props.modal} toggle={props.toggle} size="lg"
            centered>
            <ModalHeader toggle={props.toggle}>{props.selected ? "Update User Info" : "Add New User"}</ModalHeader>
            <ModalBody>
                <div className='plants-form-content'>
                    <Formik
                        enableReinitialize
                        initialValues={mode === "add" ? initialVals : props.selected}
                        validationSchema={UserSchema}
                        onSubmit={(values, { resetForm }) => {

                            // successNotification();
                            props.returnFunction(values)
                            props.toggle()
                            resetForm();
                        }}
                    >
                        {({ isSubmitting, isValid }) => (
                            <FormikForm>
                                <Row>
                                    <Col md={4}>
                                        <FormGroup>
                                            <Label for="first_name">First Name</Label>
                                            <Field
                                                as={Input}
                                                id="first_name"
                                                name="first_name"
                                                type="text"
                                                placeholder="Enter First Name"
                                            />
                                            <ErrorMessage
                                                name="first_name"
                                                component="div"
                                                className="text-danger"
                                            />
                                        </FormGroup>
                                    </Col>

                                    <Col md={4}>
                                        <FormGroup>
                                            <Label for="middle_name">Middle Name</Label>
                                            <Field
                                                as={Input}
                                                id="middle_name"
                                                name="middle_name"
                                                type="text"
                                                placeholder="Enter Middle Name"
                                            />
                                            <ErrorMessage
                                                name="middle_name"
                                                component="div"
                                                className="text-danger"
                                            />
                                        </FormGroup>
                                    </Col>

                                    <Col md={4}>
                                        <FormGroup>
                                            <Label for="last_name">Last Name</Label>
                                            <Field
                                                as={Input}
                                                id="last_name"
                                                name="last_name"
                                                type="text"
                                                placeholder="Enter Last Name"
                                            />
                                            <ErrorMessage
                                                name="last_name"
                                                component="div"
                                                className="text-danger"
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={4}>
                                        <FormGroup>
                                            <Label for="email_id">Email</Label>
                                            <Field
                                                as={Input}
                                                id="email_id"
                                                name="email_id"
                                                type="email"
                                                placeholder="Enter Email"
                                            />
                                            <ErrorMessage
                                                name="email_id"
                                                component="div"
                                                className="text-danger"
                                            />
                                        </FormGroup>
                                    </Col>

                                    <Col md={4}>
                                        <FormGroup>
                                            <Label for="mobno">Mobile Number</Label>
                                            <Field
                                                as={Input}
                                                id="mobno"
                                                name="mobno"
                                                type="text"
                                                placeholder="Enter Mobile Number"
                                            />
                                            <ErrorMessage
                                                name="mobno"
                                                component="div"
                                                className="text-danger"
                                            />
                                        </FormGroup>
                                    </Col>

                                    <Col md={4}>
                                        <FormGroup>
                                            <Label for="dateofbirth">Date of Birth</Label>
                                            <Field
                                                as={Input}
                                                id="dateofbirth"
                                                name="dateofbirth"
                                                type="date"
                                            />
                                            <ErrorMessage
                                                name="dateofbirth"
                                                component="div"
                                                className="text-danger"
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={4}>
                                        <FormGroup>
                                            <Label for="f_gender_id">Gender</Label>
                                            <Field
                                                as="select"
                                                name="f_gender_id"
                                                className="form-control"
                                            >
                                                <option value="">Select Gender</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </Field>

                                            <ErrorMessage
                                                name="f_gender_id"
                                                component="div"
                                                className="text-danger"
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Button className="float-end" type="submit">
                                    Submit
                                </Button>
                            </FormikForm>

                        )}
                    </Formik>
                </div>
            </ModalBody>
        </Modal>
    )
}

export default UsersFormModal