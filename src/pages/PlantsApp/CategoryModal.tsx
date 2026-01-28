import { Button, Modal, ModalHeader, ModalBody, Row, Col, Label, Input, FormGroup } from 'reactstrap';
import { Form as FormikForm, Field, ErrorMessage, Formik } from "formik";
import Swal from 'sweetalert2';
import * as Yup from "yup";

const CategoryModal = (props:any) => {

    const PlantsCategorySchema = Yup.object().shape({
        category: Yup.string().required("Category name is required!"),
        parent_id: Yup.number(),
    });
    const successNotification = () => {
        Swal.fire({
            title: "Success!",
            text: props.mode==="add"?"New category added.":"Selected category updated.",
            icon: "success",
        });
    };

    const initialVals = { category: "", parent_id: "" }
    return (
        <Modal isOpen={props.modal} toggle={props.toggle} size="lg" centered>
            <ModalHeader toggle={props.toggle}>{props.mode==="add"?"Add New Category":"Update Category"}</ModalHeader>
            <ModalBody>
                <div className="plants-form-content">
                    <Formik
                        initialValues={props.mode==="add"?initialVals:props.selected}
                        validationSchema={PlantsCategorySchema}
                        validateOnMount
                        onSubmit={(values, { setSubmitting, resetForm }) => {
                            console.log("Form values:", values);
                            setSubmitting(false);
                            props.toggle();
                            successNotification();
                            props.returnFunction(values);
                            resetForm();
                        }}
                    >
                        {({ isSubmitting, isValid }) => (
                            <FormikForm>
                                <Row>
                                    <Col md={6}>
                                        <FormGroup>
                                            <Label for="exampleSelect">Select Category</Label>
                                            <Field
                                                as={Input}
                                                id="parent_id"
                                                name="parent_id"
                                                type="select"
                                            >
                                                <option value={""}>Select Parent Category</option>
                                                {props.plantsCategoryData.map((item:any) => (
                                                    <option key={item.category} value={item.id}>
                                                        {item.category}
                                                    </option>
                                                ))}
                                            </Field>
                                            <ErrorMessage
                                                name="parent_id"
                                                component="div"
                                                className="text-danger"
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md={6}>
                                        <FormGroup>
                                            <Label for="category">Category Name</Label>
                                            <Field
                                                as={Input}
                                                id="category"
                                                name="category"
                                                type="text"
                                                placeholder="Enter Category Name"
                                            />
                                            <ErrorMessage
                                                name="category"
                                                component="div"
                                                className="text-danger"
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>

                                <Button
                                    className="float-end"
                                    type="submit"
                                    disabled={isSubmitting}
                                >
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

export default CategoryModal