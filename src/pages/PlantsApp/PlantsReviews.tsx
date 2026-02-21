import { TableContainer } from "../../Responsive Table/TableContainerReactTable";
import React, { useMemo, useState, useEffect } from 'react'
import Swal from 'sweetalert2';
import axios from 'axios';
import { SortInterface } from 'Typecomponents/ComponentsType';


type Review = {
    id: number,
    rating: number,
    comment: string,
    product: string,
    username: string
}

const PlantsReviews = () => {

    const [reviews, setReviews] = useState<Review[]>([]);
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
        axios.get("http://localhost:5000/api/reviews")
            .then((response: any) => {
                const paginatedData = response.slice(start, start + numberOfRows)
                setReviews(paginatedData);
                setTotalCount(response.length)
            })
            .catch((error) => console.log(error));

        const { start, numberOfRows } = requestData
    }

    useEffect(() => {
        fetchData(initialRequest);
    }, []);


    const deleteReview = async (index: number) => {
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
            await axios.delete(`http://localhost:5000/api/reviews/${index}`);
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
            id: "product",
            header: "Product",
            accessorKey: "product",
            enableColumnFilter: false,
        },
        {
            id: "username",
            header: "User",
            accessorKey: "username",
            enableColumnFilter: false,
        },
        {
            id: "rating",
            header: "Rating",
            accessorKey: "rating",
            enableColumnFilter: false,
        },
        {
            id: "comment",
            header: "Comment",
            accessorKey: "comment",
            enableColumnFilter: false,
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }: { row: any }) => {
                return (
                    <div>
                        <i className="ri-delete-bin-line" style={{ color: "red" }} onClick={() => {
                            deleteReview(row.original.id)
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
                    <h1>Reviews</h1>
                </div>
                <TableContainer
                    columns={(columns || [])}
                    data={(reviews || [])}
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

export default PlantsReviews