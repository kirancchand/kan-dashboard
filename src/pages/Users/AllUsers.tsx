import React, { useMemo, useState } from 'react'
import { TableContainer } from "../../Responsive Table/TableContainerReactTable";
import Swal from 'sweetalert2';
import PlantsFormModal from 'pages/PlantsApp/PlantsFormModal';

let DummyUsers = [
  {
    "first_name": "Rahul",
    "middle_name": "Kumar",
    "last_name": "Sharma",
    "email_id": "rahul.sharma@example.com",
    "mobno": "9876543210",
    "dateofbirth": "1995-06-15",
    "f_gender_id": "Male"
  },
  {
    "first_name": "Anjali",
    "middle_name": "R",
    "last_name": "Menon",
    "email_id": "anjali.menon@example.com",
    "mobno": "9123456780",
    "dateofbirth": "1998-11-23",
    "f_gender_id": "Female"
  },
  {
    "first_name": "Arjun",
    "middle_name": "S",
    "last_name": "Nair",
    "email_id": "arjun.nair@example.com",
    "mobno": "9012345678",
    "dateofbirth": "1992-02-10",
    "f_gender_id": "Male"
  },
  {
    "first_name": "Meera",
    "middle_name": "Lakshmi",
    "last_name": "Iyer",
    "email_id": "meera.iyer@example.com",
    "mobno": "8899776655",
    "dateofbirth": "1997-08-05",
    "f_gender_id": "Female"
  },
  {
    "first_name": "Vikram",
    "middle_name": "",
    "last_name": "Patel",
    "email_id": "vikram.patel@example.com",
    "mobno": "9988776655",
    "dateofbirth": "1990-12-30",
    "f_gender_id": "Male"
  },
  {
    "first_name": "Sneha",
    "middle_name": "T",
    "last_name": "Pillai",
    "email_id": "sneha.pillai@example.com",
    "mobno": "9090909090",
    "dateofbirth": "1996-04-18",
    "f_gender_id": "Female"
  },
  {
    "first_name": "Karthik",
    "middle_name": "V",
    "last_name": "Reddy",
    "email_id": "karthik.reddy@example.com",
    "mobno": "9345678123",
    "dateofbirth": "1993-09-09",
    "f_gender_id": "Male"
  },
  {
    "first_name": "Divya",
    "middle_name": "",
    "last_name": "Nambiar",
    "email_id": "divya.nambiar@example.com",
    "mobno": "9785634120",
    "dateofbirth": "1999-01-27",
    "f_gender_id": "Female"
  },
  {
    "first_name": "Amit",
    "middle_name": "Raj",
    "last_name": "Verma",
    "email_id": "amit.verma@example.com",
    "mobno": "9654321780",
    "dateofbirth": "1991-07-14",
    "f_gender_id": "Male"
  },
  {
    "first_name": "Neha",
    "middle_name": "K",
    "last_name": "Gupta",
    "email_id": "neha.gupta@example.com",
    "mobno": "9823456712",
    "dateofbirth": "1994-03-03",
    "f_gender_id": "Female"
  }
]

const AllUsers = () => {
    const [users, setUsers] = useState(DummyUsers)


    const columns = useMemo(() => [
        {
            id: "first_name",
            header: "First Name",
            accessorKey: "first_name",
            enableColumnFilter: false,
        },
        {
            id: "middle_name",
            header: "Middle Name",
            accessorKey: "middle_name",
            enableColumnFilter: false,
        },
        {
            id: "last_name",
            header: "Last Name",
            accessorKey: "last_name",
            enableColumnFilter: false,
        },
        {
            id: "email_id",
            header: "Email",
            accessorKey: "email_id",
            enableColumnFilter: false,
        },
        {
            id: "mobno",
            header: "Phone Number",
            accessorKey: "mobno",
            enableColumnFilter: false,
        },
        {
            id: "dateofbirth",
            header: "DOB",
            accessorKey: "dateofbirth",
            enableColumnFilter: false,
        },
        {
            id: "f_gender_id",
            header: "Gender",
            accessorKey: "f_gender_id",
            enableColumnFilter: false,
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }: { row: any }) => {
                return (
                    <div>
                        <i className="ri-delete-bin-line" style={{ color: "red" }} onClick={
                            () => {
                                alert("Delete Button Pressed!")
                            }
                        }></i>
                        <i className="ri-edit-2-line" style={{ color: "red" }} onClick={() => {
                            alert("Update Button Pressed!")
                        }}></i>
                    </div>
                )
            },
            enableColumnFilter: false,
        },

    ], [])

    const [mode, setMode] = useState("");
    
    return (
        <React.Fragment>
            <div style={{ padding: '50px', marginTop: '50px' }}>
                <div className="plants-header">
                    <h1>Users Table</h1>


                </div>
                <TableContainer
                    columns={(columns || [])}
                    data={(users || [])}
                    tableClass="table-centered align-middle table-nowrap mb-0"
                    theadClass="text-muted table-light"
                    SearchPlaceholder='Search Products...'
                />
            </div>
        </React.Fragment>
    );
}

export default AllUsers