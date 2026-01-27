import React, { useMemo, useEffect, useState } from 'react'
import { TableContainer } from "../../Responsive Table/TableContainerReactTable";
import { Button, Modal, ModalHeader, ModalBody, Row, Col, Label, Input, FormGroup } from 'reactstrap';
import { Form as FormikForm, Field, ErrorMessage, Formik } from "formik";
import Swal from 'sweetalert2';
import * as Yup from "yup";
import { all } from 'axios';

interface AnalyticsItem {
    id: number,
    name: string,
    desc: string,
    price: number,
    rating: number,
    category: string,
    src: any,
}

const PlantCategories = [
    { id: 0, name: "Select" },
    { id: 1, name: "Indoor Plant" },
    { id: 2, name: "Outdoor Plant" },
    { id: 3, name: "Seeds" },
    { id: 4, name: "Flowering Plant" },
];

let DummyPlants = [
    { id: 1, name: "Rose", desc: "Rose is a really good plant for home.", price: 400, rating: 4.7, category: "Indoor Plant", src: ["1.webp", "2.webp", "3.webp", "4.webp"] },
    { id: 2, name: "Monstera", desc: "Monstera is a really good plant for home.", price: 400, rating: 4.7, category: "Indoor Plant", src: ["5.webp", "6.webp", "7.webp", "8.webp"] },
];

const Plants = () => {
    const [products,setProducts] = useState(DummyPlants)
    const [files, setFiles] = useState([]);
    const handleChange = (e: any) => {
        console.log(e.target)
        const selectedFiles: any = Array.from(e.target.files);
        const allImages: any = [];
        const group = selectedFiles.map((item: any) => {
            allImages.push(item.name);
        })
        console.log(allImages)
        setFiles(allImages);
    };

    const addProduct = (values: any) => {
        const newId = DummyPlants.length + 1;
        const newData = {
            id: newId,
            ...values,
            rating: 0,
            src: files,
        }
        const allDummyProducts = [...products];
        allDummyProducts.push(newData);
        console.log("New Data: ", allDummyProducts)
        setProducts(allDummyProducts)
    }

    const deleteProduct = (index:Number) =>{
        Swal.fire({
                    title: "Are you sure?",
                    text: "You won't be able to revert this!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Yes, delete it!"
                }).then((result) => {
                    setProducts(prev=>prev.filter(item=>item.id!==index))
                    if (result.isConfirmed) {
                        Swal.fire({
                            title: "Success!",
                            text: "The Selected Review has been deleted.",
                            icon: "success"
                        });
                    }
                });
    }

    const successNotification = () => {
        Swal.fire({
            title: "Success!",
            text: "New Product Added.",
            icon: "success"
        })
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

    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);

    const columns = useMemo(() => [
        {
            id: "id",
            header: "Id",
            accessorKey: "id",
            enableColumnFilter: false,
        },
        {
            id: "name",
            header: "Plant Name",
            accessorKey: "name",
            enableColumnFilter: false,
        },
        {
            id: "price",
            header: "Price",
            accessorKey: "price",
            enableColumnFilter: false,
        },
        {
            id: "desc",
            header: "Description",
            accessorKey: "desc",
            enableColumnFilter: false,
        },
        {
            id: "rating",
            header: "Rating",
            accessorKey: "rating",
            enableColumnFilter: false,
        },
        {
            id: "category",
            header: "Category",
            accessorKey: "category",
            enableColumnFilter: false,
        },
        {
            id: "src",
            header: "Product Images",
            accessorKey: "src",
            cell: ({ getValue }: any) => {
                const images = getValue() as string[];
                return (
                    <div style={{ display: "flex", gap: "5px" }}>
                        {images.map((image, index) => (
                            <img key={index} src={`${image}`} height={60} width={60}></img>
                        ))}
                    </div>
                )
            },
            enableColumnFilter: false,
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({row}:{row:any}) => {
                return (
                    <div>
                        <i className="ri-delete-bin-line" style={{ color: "red" }} onClick={
                            ()=>{
                                deleteProduct(row.original.id)
                            }
                        }></i>
                        <i className="ri-edit-2-line" style={{ color: "red" }}></i>
                    </div>
                )
            },
            enableColumnFilter: false,
        },

    ], [])

    return (
        <React.Fragment>
            <div style={{ padding: '50px', marginTop: '50px' }}>
                <div className="plants-header">
                    <h1>Plants App Table</h1>
                    <button className="btn btn-primary" onClick={toggle}>
                        Add New Product
                    </button>
                    <Modal isOpen={modal} toggle={toggle} size="lg"
                        centered>
                        <ModalHeader toggle={toggle}>Add New Product</ModalHeader>
                        <ModalBody>
                            <div className='plants-form-content'>
                                <Formik
                                    initialValues={{ name: "", category: "", price: "", src: "", desc: "", }}
                                    validationSchema={PlantSchema}
                                    validateOnMount
                                    onSubmit={(values, { setSubmitting, resetForm }) => {
                                        console.log("Form values:", values);
                                        setSubmitting(false);
                                        toggle();
                                        addProduct(values);
                                        successNotification();
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
                                                        onChange={handleChange}
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
                </div>
                <TableContainer
                    columns={(columns || [])}
                    data={(products || [])}
                    tableClass="table-centered align-middle table-nowrap mb-0"
                    theadClass="text-muted table-light"
                    SearchPlaceholder='Search Products...'
                />
            </div>
        </React.Fragment>
    );
}

export default Plants