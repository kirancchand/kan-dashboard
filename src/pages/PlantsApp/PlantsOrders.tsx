import React, { useMemo, useState, useEffect } from 'react'
import { TableContainer } from "../../Responsive Table/TableContainerReactTable";
import { Button, Modal, ModalHeader, ModalBody, Row, Col, Label, Input, FormGroup } from 'reactstrap';
import { Form as FormikForm, Field, ErrorMessage, Formik } from "formik";
import Swal from 'sweetalert2';
import * as Yup from "yup";
import { SortInterface } from 'Typecomponents/ComponentsType';
import axios from 'axios';

type Order = {
    id: number,
    username: string,
    address: string,
    total: number,
    order_date: string,
    delivery_date: string,
    status: string
}

const orderStatus = [
    { id: 1, name: "pending" },
    { id: 2, name: "shipping" },
    { id: 3, name: "out of delivery" },
    { id: 4, name: "delivered" }
]

const successNotification = () => {
    Swal.fire({
        title: "Success!",
        text: "Selected Product Updated.",
        icon: "success"
    })
}


const PlantsOrders = () => {

    const [orders, setOrders] = useState<Order[]>([]);
    const [sorting, setSorting] = useState<[]>([]);
    const [loading, setLoading] = useState(false);
    const [sizePerPage, setSizePerPage] = useState(10);
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    let sort: SortInterface[] = [];

    const [modal, setModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null)
    const toggle = () => setModal(!modal);

    const orderSchema = Yup.object().shape({
        status: Yup.string(),
    });


    let initialRequest = {
        "start": 0,
        "sort": [],
        "numberOfRows": 10,
        "filters": []
    }

    const fetchData = async (requestData: any) => {
        axios.get("http://localhost:5000/api/orders")
            .then((response: any) => {
                const paginatedData = response.slice(start, start + numberOfRows)
                setOrders(paginatedData);
                setTotalCount(response.length)
            })
            .catch((error) => console.log(error));

        const { start, numberOfRows } = requestData
    }

    useEffect(() => {
        fetchData(initialRequest);
    }, []);

    const deleteOrder = async (index: number) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        });
        if (!result.isConfirmed) return;
        try {
            await axios.delete(`http://localhost:5000/api/orders/${index}`);
            await fetchData({
                start: (page - 1) * sizePerPage,
                sort,
                numberOfRows: sizePerPage,
                filters: []
            });
        }
        catch (error) {

        }

        await Swal.fire({
            title: "Success!",
            text: "The selected category has been deleted.",
            icon: "success",
        });
    };

    const updateOrder = async (values: any) => {
        try {
            await axios.put(`http://localhost:5000/api/orders/${selectedOrder}`, values)
            await fetchData({
                start: (page - 1) * sizePerPage,
                sort,
                numberOfRows: sizePerPage,
                filters: []
            });
            await successNotification();
        } catch (error) {
            console.log(error)
        }
    };

    const handleTableChange = ({ pages, sizePerPages, sortField, sortOrder }: any) => {
        setPage(pages)
        setSizePerPage(sizePerPages)
        if (sortField !== "" && sortOrder !== "") {
            sort = [{
                "columnName": sortField,
                "sortOrder": sortOrder
            }]
        }
        fetchData({
            "start": (pages - 1) * sizePerPages,
            "sort": sort,
            "numberOfRows": sizePerPages,
            "filters": []
        });
    }

    const columns = useMemo(() => [
        {
            id: "id",
            header: "Id",
            accessorKey: "id",
            enableColumnFilter: false,
        },
        {
            id: "username",
            header: "User",
            accessorKey: "username",
            enableColumnFilter: false,
        },
        {
            id: "address",
            header: "Address",
            accessorKey: "address",
            enableColumnFilter: false,
        },
        {
            id: "total",
            header: "Total",
            accessorKey: "total",
            enableColumnFilter: false,
        },
        {
            id: "order_date",
            header: "Ordered Date",
            accessorKey: "order_date",
            enableColumnFilter: false,
        },
        {
            id: "delivery_date",
            header: "Delivery Date",
            accessorKey: "delivery_date",
            enableColumnFilter: false,
        },
        {
            id: "order_status",
            header: "Status",
            accessorKey: "order_status",
            enableColumnFilter: false,
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }: { row: any }) => {
                return (
                    <div>
                        <i className="ri-delete-bin-line" style={{ color: "red" }} onClick={() => {
                            deleteOrder(row.original.id)
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
                    <h1>Orders</h1>
                    <Modal isOpen={modal} toggle={toggle} size="lg" centered>
                        <ModalHeader toggle={toggle}>Update Order Status</ModalHeader>
                        <ModalBody>
                            <div className="plants-form-content">
                                <Formik
                                    initialValues={orders.find(o => o.id === selectedOrder) || { order_status: 'pending' }}
                                    validationSchema={orderSchema}
                                    validateOnMount
                                    onSubmit={(values, { setSubmitting, resetForm }) => {
                                        console.log("Form values:", values);
                                        setSubmitting(false);
                                        toggle();
                                        updateOrder(values)
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
                                                            id="order_status"
                                                            name="order_status"
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
                    isGlobalFilter={true}
                    page={page}
                    sorting={sorting}
                    setSorting={setSorting}
                    sizePerPage={sizePerPage}
                    clickable={false}
                    totalCount={totalCount}
                    handleTableChange={handleTableChange}
                    loading={loading}
                />
            </div>
        </React.Fragment>
    )
}

export default PlantsOrders