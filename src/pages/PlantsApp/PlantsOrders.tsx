import React, { useMemo,  useState } from 'react'
import { TableContainer } from "../../Responsive Table/TableContainerReactTable";
import { Button, Modal, ModalHeader, ModalBody, Row, Col, Label, Input, FormGroup } from 'reactstrap';
import { Form as FormikForm, Field, ErrorMessage, Formik } from "formik";
import Swal from 'sweetalert2';
import * as Yup from "yup";

let dummyOrders = [
    { id: 1, user_id: 9001, address_id: 301, date: "27-01-2026", cost: 1500, delivery_date: "01-02-2026", ostatus: "shipped" },
    { id: 2, user_id: 9045, address_id: 308, date: "26-01-2026", cost: 2000, delivery_date: "03-02-2026", ostatus: "out of delivery" },
    { id: 3, user_id: 9074, address_id: 367, date: "24-01-2026", cost: 500, delivery_date: "27-01-2026", ostatus: "delivered" },
]

const orderStatus = [
    { id: 1, name: "pending" },
    { id: 2, name: "shipping" },
    { id: 3, name: "out of delivery" },
    { id: 4, name: "delivered" }
]

const PlantsOrders = () => {

    const [orders, setOrders] = useState(dummyOrders);
    const [modal, setModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null)
    const toggle = () => setModal(!modal);

    const orderSchema = Yup.object().shape({
        ostatus: Yup.string(),
    });

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
                setOrders((prev) =>
                    prev.filter((item) => item.id !== index),
                );
                Swal.fire({
                    title: "Success!",
                    text: "The Selected Category has been deleted.",
                    icon: "success",
                });
            }
        });
    };

    const handleUpdate = (values: any) => {
        console.log("updated value: ", values)
        setOrders(prev => prev.map((order) =>
            order.id === selectedOrder ? { ...order, ostatus: values.ostatus } : order)
        )

    }

    const columns = useMemo(() => [
        {
            id: "id",
            header: "Id",
            accessorKey: "id",
            enableColumnFilter: false,
        },
        {
            id: "user_id",
            header: "User ID",
            accessorKey: "user_id",
            enableColumnFilter: false,
        },
        {
            id: "address_id",
            header: "Address ID",
            accessorKey: "address_id",
            enableColumnFilter: false,
        },
        {
            id: "date",
            header: "Ordered Date",
            accessorKey: "date",
            enableColumnFilter: false,
        },
        {
            id: "delivery_date",
            header: "Delivery Date",
            accessorKey: "delivery_date",
            enableColumnFilter: false,
        },
        {
            id: "cost",
            header: "Cost",
            accessorKey: "cost",
            enableColumnFilter: false,
        },
        {
            id: "ostatus",
            header: "Status",
            accessorKey: "ostatus",
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
                        <i className="ri-edit-2-line" style={{ color: "red" }} onClick={() => {
                            setSelectedOrder(row.original.id)
                            toggle();
                        }}></i>
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
                    <h1>Plant App Orders</h1>
                    <Modal isOpen={modal} toggle={toggle} size="lg" centered>
                        <ModalHeader toggle={toggle}>Update Order Status</ModalHeader>
                        <ModalBody>
                            <div className="plants-form-content">
                                <Formik
                                    initialValues={{ ostatus: orders.find(o => o.id === selectedOrder)?.ostatus || "pending" }}
                                    validationSchema={orderSchema}
                                    validateOnMount
                                    onSubmit={(values, { setSubmitting, resetForm }) => {
                                        console.log("Form values:", values);
                                        setSubmitting(false);
                                        toggle();
                                        handleUpdate(values)
                                        resetForm();
                                    }}
                                >
                                    {({ isSubmitting }) => (
                                        <FormikForm>
                                            <Row>
                                                <Col md={6}>
                                                    <FormGroup>
                                                        <Label for="exampleSelect">Select Status</Label>
                                                        <Field
                                                            as={Input}
                                                            id="ostatus"
                                                            name="ostatus"
                                                            type="select"
                                                            className="form-select"
                                                        >   <option>Select Order Status</option>
                                                            {orderStatus.map((item) => (
                                                                <option key={item.id} value={item.name}>
                                                                    {item.name}
                                                                </option>
                                                            ))}
                                                        </Field>
                                                        <ErrorMessage
                                                            name="status"
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
                </div>
                <TableContainer
                    columns={(columns || [])}
                    data={(orders || [])}
                    tableClass="table-centered align-middle table-nowrap mb-0"
                    theadClass="text-muted table-light"
                    SearchPlaceholder='Search Orders...'
                />
            </div>
        </React.Fragment>
    )
}

export default PlantsOrders