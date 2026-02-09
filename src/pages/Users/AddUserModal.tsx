import { Button, Modal, ModalHeader, ModalBody, Row, Col, Label, Input, FormGroup } from 'reactstrap';
import { Form as FormikForm, Field, ErrorMessage, Formik } from "formik";
import * as Yup from "yup";
import Swal from 'sweetalert2';
import { register_request, http } from '../../http/http'

const AddUserModal = (props: any) => {

    const initialValues = {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        username: ""
    }

    const addUserSchema = Yup.object().shape({
        firstName: Yup.string()
            .required("First Name is required!"),
        lastName: Yup.string()
            .required("Last Name is required!"),
        username: Yup.string()
            .required("Username is required!"),
        email: Yup.string().email()
            .required("Email is required!"),
        password: Yup.string()
            .required("Password is required!"),

    })

    const successNotification = () => {
        Swal.fire({
            title: "Success!",
            text: "User added Successfully!",
            icon: "success"
        })
    }

    const registerUser = async (values: any) => {
        await http.post(register_request, values)
            .then((response: any) => {
                console.log("response: ", response)
                if (response.status === 200) {
                    successNotification();
                }
                return response
            })
            .catch((error) => {
                console.log(error);
            })
    }


    return (
        <Modal isOpen={props.modal} toggle={props.toggle} size="lg" centered>
            <ModalHeader toggle={props.toggle}>
                {"Add New User"}
            </ModalHeader>
            <ModalBody>
                <div className='plants-form-content'>
                    <Formik
                        enableReinitialize
                        initialValues={initialValues}
                        validationSchema={addUserSchema}
                        onSubmit={(values, { resetForm }) => {
                            console.log("values: ", values)
                            props.toggle();
                            registerUser(values)
                            resetForm();
                        }}
                    >
                        {() => (
                            <FormikForm>

                                <Row>
                                    <Col md={6}>
                                        <FormGroup>
                                            <Label for="firstName">First Name</Label>
                                            <Field
                                                as={Input}
                                                id="firstName"
                                                name="firstName"
                                                type="text"
                                                placeholder="Enter First Name"
                                            />
                                            <ErrorMessage
                                                name="firstName"
                                                component="div"
                                                className="text-danger"
                                            />
                                        </FormGroup>
                                    </Col>

                                    <Col md={6}>
                                        <FormGroup>
                                            <Label for="lastName">Last Name</Label>
                                            <Field
                                                as={Input}
                                                id="lastName"
                                                name="lastName"
                                                type="text"
                                                placeholder="Enter Last Name"
                                            />
                                            <ErrorMessage
                                                name="lastName"
                                                component="div"
                                                className="text-danger"
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6}>
                                        <FormGroup>
                                            <Label for="username">Username</Label>
                                            <Field
                                                as={Input}
                                                id="username"
                                                name="username"
                                                type="text"
                                                placeholder="Enter Username"
                                            />
                                            <ErrorMessage
                                                name="username"
                                                component="div"
                                                className="text-danger"
                                            />
                                        </FormGroup>
                                    </Col>

                                    <Col md={6}>
                                        <FormGroup>
                                            <Label for="email">Email</Label>
                                            <Field
                                                as={Input}
                                                id="email"
                                                name="email"
                                                type="email"
                                                placeholder="Enter Email"
                                            />
                                            <ErrorMessage
                                                name="email"
                                                component="div"
                                                className="text-danger"
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={6}>
                                        <FormGroup>
                                            <Label for="password">Password</Label>
                                            <Field
                                                as={Input}
                                                id="password"
                                                name="password"
                                                type="password"
                                                placeholder="Enter Password"
                                            />
                                            <ErrorMessage
                                                name="password"
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

export default AddUserModal