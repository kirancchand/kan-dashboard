import React, { useMemo, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { TableContainer } from "../../Responsive Table/TableContainerReactTable";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col, Label, Input, FormGroup } from 'reactstrap';
import { Form as FormikForm, Field, ErrorMessage, Formik } from "formik";
import Swal from 'sweetalert2';
import * as Yup from "yup";

interface AnalyticsItem {
    id: number,
    category: string,
    parent_id: number
}

let PlantsCategoryData = [
    { id: 1, category: "Indoor Plants", parent_id: 0 },
    { id: 2, category: "Outdoor Plants", parent_id: 0 },
    { id: 3, category: "Succulents", parent_id: 1 },
    { id: 4, category: "Flowering Plants", parent_id: 2 },
    { id: 5, category: "Herbal Plants", parent_id: 2 }
]

const PlantsCategory = () => {

    const addPlantCategory = (values: any) => {
        const newId = plantsCategoryData.length + 1
        const newData = {
            id: newId,
            ...values
        }
        const allPlantCategories = [...PlantsCategoryData];
        allPlantCategories.push(newData);
        PlantsCategoryData = allPlantCategories;
        console.log(plantsCategoryData);
    }

    const PlantsCategorySchema = Yup.object().shape({
        category: Yup.string()
            .required("Category name is required!"),
        parent_id: Yup.number()
    })

    const successNotification = () => {
        Swal.fire({
            title: "Success!",
            text: "New Category Added.",
            icon: "success"
        })
    }

    const [modal, setModal] = useState(false);

    const toggle = () => setModal(!modal);

    const [plantsCategoryData, setPlantsCategoryData] = useState<AnalyticsItem[]>([]);
    const [totalCount, setTotalCount] = useState(0);

    let initialRequest = {
        "start": 0,
        "sort": [],
        "numberOfRows": 10,
        "filters": []
    }

    const parentCategoryMap = useMemo(() => {
        const parent: Record<number, string> = {};
        PlantsCategoryData.forEach(item => {
            parent[item.id] = item.category;
        });
        return parent
    }, [PlantsCategoryData])

    const columns = useMemo(() => [
        {
            id: "id",
            header: "Id",
            accessorKey: "id",
            enableColumnFilter: false,
        },
        {
            id: "name",
            header: "Category Name",
            accessorKey: "category",
            enableColumnFilter: false,
        },
        {
            id: "parent_id",
            header: "Parent Category",
            accessorFn: (row: any) => {
                return parentCategoryMap[row.parent_id] ?? "-"
            },
            enableColumnFilter: false,
        },
    ], [parentCategoryMap])

    const fetchData = async (reqData: any) => {
        setPlantsCategoryData(PlantsCategoryData);
        setTotalCount(100)
    }

    useEffect(() => {
        fetchData(initialRequest)
    })

    return (
        <React.Fragment>
            <div style={{ padding: '50px', marginTop: '50px' }}>
                <div className="plants-header">
                    <h1>Plant Categories</h1>
                    <button className="btn btn-primary" onClick={toggle} >
                        Add New Category
                    </button>
                    <Modal isOpen={modal} toggle={toggle} size="lg"
                        centered>
                        <ModalHeader toggle={toggle}>Add New Plant Category</ModalHeader>
                        <ModalBody>
                            <div className='plants-form-content'>
                                <Formik
                                    initialValues={{ category: "", parent_id: "" }}
                                    validationSchema={PlantsCategorySchema}
                                    validateOnMount
                                    onSubmit={(values, { setSubmitting, resetForm }) => {
                                        console.log("Form values:", values);
                                        setSubmitting(false);
                                        toggle();
                                        successNotification();
                                        addPlantCategory(values);
                                        resetForm();
                                    }}
                                >
                                    {({ isSubmitting, isValid }) => (
                                        <FormikForm>
                                            <Row>
                                                <Col md={6}>
                                                    <FormGroup>
                                                        <Label for="exampleSelect">
                                                            Select Category
                                                        </Label>
                                                        <Field
                                                            as={Input}
                                                            id="parent_id"
                                                            name="parent_id"
                                                            type="select"
                                                        >
                                                            <option value={""}>
                                                                Select Parent Category
                                                            </option>
                                                            {plantsCategoryData.map(item => (
                                                                <option key={item.category} value={item.id}>{item.category}</option>
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
                    data={(plantsCategoryData || [])}
                    tableClass="table-centered align-middle table-nowrap mb-0"
                    theadClass="text-muted table-light"
                    SearchPlaceholder='Search Products...'
                />
            </div>
        </React.Fragment>
    )
}

export default PlantsCategory