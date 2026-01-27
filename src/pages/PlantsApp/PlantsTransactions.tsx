import React, { useMemo, useState } from 'react'
import TableContainer from 'Components/Common/TableContainer';
import Swal from 'sweetalert2';


let DummyTransactions = [
    { id: 1, product_id: 1018, user_id: 9001, quantity: 3, cost: 1500, order_id: 1 },
    { id: 2, product_id: 1022, user_id: 9045, quantity: 2, cost: 1000, order_id: 2 },
    { id: 3, product_id: 1032, user_id: 9045, quantity: 2, cost: 1000, order_id: 2 },
    { id: 4, product_id: 1077, user_id: 9074, quantity: 1, cost: 500, order_id: 3 },
]

const PlantsTransactions = () => {

    const [transactions, setTransactions] = useState(DummyTransactions)

    const handleDelete = (index: Number) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                setTransactions(prev => prev.filter(item => item.id !== index))
                console.log("item popped")
                Swal.fire({
                    title: "Success!",
                    text: "The Selected Transaction has been deleted.",
                    icon: "success"
                });
            }
        });
    };

    const columns = useMemo(() => [
        {
            id: "id",
            header: "Id",
            accessorKey: "id",
            enableColumnFilter: false,
        },
        {
            id: "product_id",
            header: "Product ID",
            accessorKey: "product_id",
            enableColumnFilter: false,
        },
        {
            id: "user_id",
            header: "User ID",
            accessorKey: "user_id",
            enableColumnFilter: false,
        },
        {
            id: "quantity",
            header: "Quantity",
            accessorKey: "quantity",
            enableColumnFilter: false,
        },
        {
            id: "cost",
            header: "Cost",
            accessorKey: "cost",
            enableColumnFilter: false,
        },
        {
            id: "order_id",
            header: "Order ID",
            accessorKey: "order_id",
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
                    <h1>Plants Transactions</h1>
                </div>
                <TableContainer
                    columns={(columns || [])}
                    data={(transactions || [])}
                    tableClass="table-centered align-middle table-nowrap mb-0"
                    theadClass="text-muted table-light"
                    SearchPlaceholder='Search Transactions...'
                />
            </div>
        </React.Fragment>
    )
}

export default PlantsTransactions
