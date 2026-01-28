import { Button, Modal, ModalHeader, ModalBody, Row, Col, Label, Input, FormGroup } from 'reactstrap';
import React, { useMemo, useEffect, useState } from 'react'
import { Form as FormikForm, Field, ErrorMessage, Formik } from "formik";
import Swal from 'sweetalert2';
import * as Yup from "yup";

const PlantsFormModal = (props: any) => {
    const mode = props.mode

    const PlantCategories = [
        { id: 0, name: "Select" },
        { id: 1, name: "Indoor Plant" },
        { id: 2, name: "Outdoor Plant" },
        { id: 3, name: "Seeds" },
        { id: 4, name: "Flowering Plant" },
    ];

    const initialVals = {
        name: "",
        category: "",
        price: "",
        desc: "",
        src: ""
    }



    const PlantSchema = Yup.object().shape({
        name: Yup.string()
            .required("Product Name is required!"),
        desc: Yup.string()
            .required("Product Description is required!"),
        category: Yup.string()
            .required("Product Category is required!"),
        price: Yup.number()
            .required("Product Price is required!"),
        src: Yup.array()
    })

    const successNotification = () => {
        Swal.fire({
            title: "Success!",
            text: props.selected ? "Selected Product Updated." : "New Product Added",
            icon: "success"
        })
    }

    return (
        <Modal isOpen={props.modal} toggle={props.toggle} size="lg"
            centered>
            <ModalHeader toggle={props.toggle}>{props.selected ? "Update Product" : "Add New Product"}</ModalHeader>
            <ModalBody>
                <div className='plants-form-content'>
                    <Formik
                        enableReinitialize
                        // initialValues={{
                        //     name: selectedProduct?.name || "",
                        //     category: selectedProduct?.category || "",
                        //     price: selectedProduct?.price || "",
                        //     desc: selectedProduct?.desc || "",
                        //     src: "",
                        // }}
                        initialValues={mode == "add" ? initialVals : props.selected}
                        validationSchema={PlantSchema}
                        onSubmit={(values, { resetForm }) => {
                            // if (selectedProduct) {
                            //     updateProduct(values);
                            // } else {
                            //     addProduct(values);
                            // }
  
                            successNotification();
                            props.returnFunc(values)
                            props.toggle()
                            resetForm();
                        }}
                    >
                        {({ isSubmitting, isValid }) => (
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
                                            >   {PlantCategories.map(item => (
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
                                        <Label for="desc">
                                            Product Description
                                        </Label>
                                        <Field
                                            as={Input}
                                            id="desc"
                                            name="desc"
                                            type="text"
                                            placeholder="Enter Product Description"
                                        />
                                        <ErrorMessage
                                            name="desc"
                                            component="div"
                                            className="text-danger"
                                        />
                                    </FormGroup>
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
                                            id="src"
                                            name="src"
                                            type="file"
                                            multiple
                                            onChange={props.onchange}
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