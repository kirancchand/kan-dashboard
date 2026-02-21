import React, { useMemo, useState, useEffect } from 'react'
import { TableContainer } from "../../Responsive Table/TableContainerReactTable";
import Swal from 'sweetalert2';
import axios from 'axios';
import { SortInterface } from 'Typecomponents/ComponentsType';


type Transaction = {
    id: number,
    username: string,
    product: string,
    quantity: number,
    total: number,
    order_id: number
}


const PlantsTransactions = () => {

    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [sorting, setSorting] = useState<[]>([]);
    const [loading, setLoading] = useState(false);
    const [sizePerPage, setSizePerPage] = useState(10);
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    let sort: SortInterface[] = [];

    let initialRequest = {
        "start": 0,
        "sort": [],
        "numberOfRows": 10,
        "filters": []
    }

    const fetchData = async (requestData: any) => {
        axios.get("http://localhost:5000/api/transactions")
            .then((response: any) => {
                const paginatedData = response.slice(start, start + numberOfRows)
                setTransactions(paginatedData);
                setTotalCount(response.length)
            })
            .catch((error) => console.log(error));

        const { start, numberOfRows } = requestData
    }

    useEffect(() => {
        fetchData(initialRequest);
    }, []);

    const deleteTransaction = async (index: number) => {
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
            await axios.delete(`http://localhost:5000/api/transactions/${index}`);
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
            id: "product",
            header: "Product",
            accessorKey: "product",
            enableColumnFilter: false,
        },
        {
            id: "quantity",
            header: "Quantity",
            accessorKey: "quantity",
            enableColumnFilter: false,
        },
        {
            id: "total",
            header: "Total",
            accessorKey: "total",
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
                            deleteTransaction(row.original.id)
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
                    <h1>Transactions</h1>
                </div>
                <TableContainer
                    columns={(columns || [])}
                    data={(transactions || [])}
                    tableClass="table-centered align-middle table-nowrap mb-0"
                    theadClass="text-muted table-light"
                    SearchPlaceholder='Search Transactions...'
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

export default PlantsTransactions
