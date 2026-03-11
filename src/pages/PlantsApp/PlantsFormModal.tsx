import { Button, Modal, ModalHeader, ModalBody, Row, Col, Label, Input, FormGroup } from 'reactstrap';
import { Form as FormikForm, Field, ErrorMessage, Formik } from "formik";
import * as Yup from "yup";
import axios from 'axios';
import { useEffect, useState } from 'react';

type Category = {
    id: number;
    name: string;
    subcategory: number | string;
};

type Product = {
    id: number;
    name: string;
    price: number;
    category: string;
    images: string[];
    description: string;
    rating: number;
};

const PlantsFormModal = (props: any) => {
    const mode = props.mode
    const [CategoryData, setCategoryData] = useState<Category[]>([]);
    const [product, setProduct] = useState<Product | any>(null);

    const fetchProduct = async () => {
        if (mode !== "update" || !props.selected) return;
        await axios.get(`http://localhost:5000/api/products/${props.selected}`)
            .then((response: any) => {
                setProduct(response)
            })
            .catch((error) => console.log(error));
    }

    const fetchCategories = async () => {
        await axios.get('http://localhost:5000/api/categories')
            .then((response: any) => {
                setCategoryData(response)
            })
            .catch((error) => console.log(error));
    }

    useEffect(() => {
        fetchCategories();
    }, [])

    useEffect(() => {
        fetchProduct();
    }, [props.selected, props.modal]);

    const initialVals = {
        name: "",
        category: "",
        price: "",
        description: "",
        images: [],
        rating: 0
    }

    const PlantSchema = Yup.object().shape({
        name: Yup.string()
            .required("Product Name is required!"),
        description: Yup.string()
            .required("Product Description is required!"),
        category: Yup.string()
            .required("Product Category is required!"),
        price: Yup.number()
            .required("Product Price is required!"),
        images: Yup.array(),
        rating: Yup.number(),
    })

    return (
        <Modal isOpen={props.modal} toggle={props.toggle} size="lg"
            centered>
            <ModalHeader toggle={props.toggle}>{props.selected ? "Update Product" : "Add New Product"}</ModalHeader>
            <ModalBody>
                <div className='plants-form-content'>
                    <Formik
                        enableReinitialize
                        initialValues={mode === "add" ? initialVals : product}
                        validationSchema={PlantSchema}
                        onSubmit={(values, { resetForm }) => {

                            const formData = new FormData();

                            formData.append("name", values.name);
                            formData.append("category", values.category);
                            formData.append("price", values.price);
                            formData.append("description", values.description);
                            formData.append("rating", values.rating);

                            if (values.images && values.images.length > 0) {
                                values.images.forEach((file: File) => {
                                    formData.append("images", file);
                                });
                            }

                            props.returnFunc(formData)
                            props.toggle()
                            resetForm();
                        }}
                    >
                        {({ isSubmitting, setFieldValue }) => (
                            <FormikForm>
                                <Row>
                                    <Col md={4}>
                                        <FormGroup>
                                            <Label for="selectCategory">
                                                Select Category
                                            </Label>
                                            <Field
                                                as={Input}
                                                id="category"
                                                name="category"
                                                type="select"
                                            >
                                                <option >Select Category</option>
                                                {CategoryData.map(item => (
                                                    <option key={item.name} value={item.name}>{item.name}</option>
                                                ))}
                                            </Field>
                                            <ErrorMessage
                                                name="category"
                                                component="div"
                                                className="text-danger"
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md={4}>
                                        <FormGroup>
                                            <Label for="name">Product Name</Label>
                                            <Field
                                                as={Input}
                                                id="name"
                                                name="name"
                                                type="text"
                                                placeholder="Enter Product Name"
                                            />
                                            <ErrorMessage
                                                name="name"
                                                component="div"
                                                className="text-danger"
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md={4}>
                                        <FormGroup>
                                            <Label for="price">Product Price</Label>
                                            <Field
                                                as={Input}
                                                id="price"
                                                name="price"
                                                type="text"
                                                placeholder="Enter Product Price"
                                            />
                                            <ErrorMessage
                                                name="price"
                                                component="div"
                                                className="text-danger"
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <FormGroup>
                                        <Label for="description">
                                            Product Description
                                        </Label>
                                        <Field
                                            as={Input}
                                            id="description"
                                            name="description"
                                            type="text"
                                            placeholder="Enter Product Description"
                                        />
                                        <ErrorMessage
                                            name="description"
                                            component="div"
                                            className="text-danger"
                                        />
                                    </FormGroup>
                                </Row>
                                <FormGroup>
                                    <Label
                                        for="images"
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

export default PlantsFormModal