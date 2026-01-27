import TableContainer from 'Components/Common/TableContainer';
import React, { useMemo, useState } from 'react'
import Swal from 'sweetalert2';

interface AnalyticsItem {
    id:Number,
    rating:Number,
    comment:String,
    product_id:Number,
    user_id:Number
}

let dummyReviews = [
    {
        "id": 1,
        "rating": 5,
        "comment": "Excellent quality, arrived early.",
        "product_id": 101,
        "user_id": 8850
    },
    {
        "id": 2,
        "rating": 2,
        "comment": "Product damaged while shipping.",
        "product_id": 102,
        "user_id": 8851
    },
    {
        "id": 3,
        "rating": 4,
        "comment": "Good value for money but shipping was slow.",
        "product_id": 101,
        "user_id": 8852
    },
    {
        "id": 4,
        "rating": 1,
        "comment": "Terrible. Does not match the images.",
        "product_id": 103,
        "user_id": 8850
    },
    {
        "id": 5,
        "rating": 5,
        "comment": "Love it! Will buy again.",
        "product_id": 104,
        "user_id": 8853
    }
]

const PlantsReviews = () => {

    const [reviews, setReviews] = useState(dummyReviews)

    const handleDelete = (index:Number) => {
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
                setReviews(prev=>prev.filter(item=>item.id !==index))
                Swal.fire({
                    title: "Success!",
                    text: "The Selected Review has been deleted.",
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
        id: "comment",
        header: "Comment",
        accessorKey: "comment",
        enableColumnFilter: false,
    },
    {
        id: "rating",
        header: "Rating",
        accessorKey: "rating",
        enableColumnFilter: false,
    },
    {
        id: "user_id",
        header: "User ID",
        accessorKey: "user_id",
        enableColumnFilter: false,
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({row}:{row:any}) => {
            return (
                <div>
                    <i className="ri-delete-bin-line" style={{ color: "red" }} onClick={()=>{
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
                <h1>Plants Reviews</h1>
            </div>
            <TableContainer
                columns={(columns || [])}
                data={(reviews || [])}
                tableClass="table-centered align-middle table-nowrap mb-0"
                theadClass="text-muted table-light"
                SearchPlaceholder='Search Orders...'
            />
        </div>
    </React.Fragment>
)
}

export default PlantsReviews