import { Button, Modal, ModalHeader, ModalBody, Row, Col, Label, Input, FormGroup } from 'reactstrap';
import { Form as FormikForm, Field, ErrorMessage, Formik } from "formik";
import * as Yup from "yup";
import Swal from 'sweetalert2';
import { appendFile } from 'fs';

const CarouselModal = (props: any) => {
    const CarouselCategories = [
        { id: 0, name: "Select" },
        { id: 1, name: "Home" },
        { id: 2, name: "Search" },
        { id: 3, name: "Advertisements" },
    ];

    const CarouselSchema = Yup.object().shape({
        name: Yup.string()
            .required("Carousel Name is required!"),
        category: Yup.string()
            .required("Carousel Category is required!"),
        images: Yup.array()
    })

    const successNotification = () => {
        Swal.fire({
            title: "Success!",
            text: "New Carousel Added.",
            icon: "success"
        })
    }

    const initialVals = { name: "", category: "", images: [], }

    return (
        <Modal isOpen={props.modal} toggle={props.toggle} size="lg"
            centered>
            <ModalHeader toggle={props.toggle}>{props.mode === "add" ? "Add New Carousel" : "Update Carousel"}</ModalHeader>
            <ModalBody>
                <div className='plants-form-content'>
                    <Formik
                        initialValues={props.mode === "add" ? initialVals : props.selected}
                        validationSchema={CarouselSchema}
                        validateOnMount
                        onSubmit={(values, { setSubmitting, resetForm }) => {

                            const formData = new FormData();

                            formData.append("name", values.name);
                            formData.append("category", values.category);

                            if (values.images && values.images.length > 0) {
                                values.images.forEach((file: File) => {
                                    formData.append("images", file);
                                });
                            }

                            setSubmitting(false);
                            props.returnFunction(formData)
                            props.toggle();
                            resetForm();
                        }}
                    >
                        {({ isSubmitting, setFieldValue }) => (
                            <FormikForm>
                                <Row>
                                    <Col md={6}>
                                        <FormGroup>
                                            <Label for="selectCategory">
                                                Select Category
                                            </Label>
                                            <Field
                                                as={Input}
                                                id="category"
                                                name="category"
                                                type="select"
                                            >   {CarouselCategories.map(item => (
                                                <option key={item.id} value={item.name}>{item.name}</option>
                                            ))}
                                            </Field>
                                            <ErrorMessage
                                                name="category"
                                                component="div"
                                                className="text-danger"
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md={6}>
                                        <FormGroup>
                                            <Label for="name">Carousel Name</Label>
                                            <Field
                                                as={Input}
                                                id="name"
                                                name="name"
                                                type="text"
                                                placeholder="Enter Carousel Name"
                                            />
                                            <ErrorMessage
                                                name="name"
                                                component="div"
                                                className="text-danger"
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <FormGroup>
                                    <Label
                                        for="src"
                                        sm={2}
                                    >
                                        File
                                    </Label>
                                    <Col sm={12}>
                                        <Input
                                            id="images"
                                            name="images"
                                            type="file"
                                            multiple
                                            onChange={(event) => {
                                                const files = Array.from(event.currentTarget.files || []);
                                                setFieldValue("images", files);
                                            }}
                                        />
                                    </Col>
                                </FormGroup>
                                <Button className='float-end' type="submit" disabled={isSubmitting}>
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

export default CarouselModal