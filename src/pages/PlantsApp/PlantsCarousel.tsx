import React, { useMemo, useEffect, useState } from 'react'
import { TableContainer } from "../../Responsive Table/TableContainerReactTable";
import { Button, Modal, ModalHeader, ModalBody, Row, Col, Label, Input, FormGroup } from 'reactstrap';
import { Form as FormikForm, Field, ErrorMessage, Formik } from "formik";
import Swal from 'sweetalert2';
import * as Yup from "yup";

interface AnalyticsItem {
    id: number,
    name: string,
    desc: string,
    price: number,
    rating: number,
    category: string,
    src: any,
}

const CarouselCategories = [
    { id: 0, name: "Select" },
    { id: 1, name: "Home" },
    { id: 2, name: "Search" },
    { id: 3, name: "Advertisements" },
];

let DummyCarousel = [
    { id: 1, name: "Plant Categories", category: "Home", src: ["1.jpg", "2.jpg"] },
    { id: 2, name: "Shoes Ad", category: "Advertisements", src: ["1.png", "2.png"] },
];

const PlantsCarousel = () => {

    const [files, setFiles] = useState([]);
    const [carousels, setCarousels] = useState(DummyCarousel)

    const handleDelete = (index: Number) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                setCarousels((prev) =>
                    prev.filter((item) => item.id !== index),
                );
                Swal.fire({
                    title: "Success!",
                    text: "The Selected Carousel has been deleted.",
                    icon: "success",
                });
            }
        });
    };

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

    const addCarousel = (values: any) => {
        const newId = DummyCarousel.length + 1;
        const newData = {
            id: newId,
            ...values,
            src: files,
        }
        const allDummyCarousel = [...carousels];
        allDummyCarousel.push(newData);
        console.log("New Data: ", allDummyCarousel)
        setCarousels(allDummyCarousel)
    }



    const successNotification = () => {
        Swal.fire({
            title: "Success!",
            text: "New Carousel Added.",
            icon: "success"
        })
    }


    const CarouselSchema = Yup.object().shape({
        name: Yup.string()
            .required("Carousel Name is required!"),
        category: Yup.string()
            .required("Carousel Category is required!"),
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
            header: "Carousel Name",
            accessorKey: "name",
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
            header: "Carousel Images",
            accessorKey: "src",
            cell: ({ getValue }: any) => {
                const images = getValue() as string[];
                return (
                    <div style={{ display: "flex", gap: "5px" }}>
                        {images.map((image, index) => (
                            <img key={index} src={`${image}`} height={60} width={120}></img>
                        ))}
                    </div>
                )
            },
            enableColumnFilter: false,
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }: { row: any }) => {
                return (
                    <div>
                        <i className="ri-delete-bin-line" style={{ color: "red" }} onClick={() => {
                            handleDelete(row.original.id)
                        }}></i>
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
                    <h1>Plants App Carousel</h1>
                    <button className="btn btn-primary" onClick={toggle}>
                        Add New Carousel
                    </button>
                    <Modal isOpen={modal} toggle={toggle} size="lg"
                        centered>
                        <ModalHeader toggle={toggle}>Add New Carousel</ModalHeader>
                        <ModalBody>
                            <div className='plants-form-content'>
                                <Formik
                                    initialValues={{ name: "", category: "", src: "", }}
                                    validationSchema={CarouselSchema}
                                    validateOnMount
                                    onSubmit={(values, { setSubmitting, resetForm }) => {
                                        console.log("Form values:", values);
                                        setSubmitting(false);
                                        toggle();
                                        addCarousel(values);
                                        successNotification();
                                        resetForm();
                                    }}
                                >
                                    {({ isSubmitting, isValid }) => (
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
                    data={(carousels || [])}
                    tableClass="table-centered align-middle table-nowrap mb-0"
                    theadClass="text-muted table-light"
                    SearchPlaceholder='Search Products...'
                />
            </div>
        </React.Fragment>
    );
}

export default PlantsCarousel