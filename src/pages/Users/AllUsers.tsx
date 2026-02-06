import React, { useMemo, useState } from 'react'
import { TableContainer } from "../../Responsive Table/TableContainerReactTable";
import { SortTanstackInterface } from '../../Typecomponents/ComponentsType';
import { FakeUsers } from './FakeUsers';
import UsersFormModal from './UsersFormModal';
import { http } from 'http/http';


const AllUsers = () => {
    const [users, setUsers] = useState(FakeUsers)
    const [page, setPage] = useState(1);
    const [sorting, setSorting] = useState<SortTanstackInterface[]>([]);
    const [selectedUser, setSelectedUser] = useState<any | null>(null);
    const [mode, setMode] = useState("");
    const [modal, setModal] = useState(false);

    const toggle = () => {
        setModal(!modal);
        if (modal) {
            setSelectedUser(null);
        }
    };

    const updateUser = (values: any) => {
        http.put("/users/:id",values)
        .then((response:any)=>{
            return response
        })
        .catch((error)=>{
            console.log(error);
        })
    }

    const deleteUser = (values: any) => {
        http.delete("/users/:id",values)
        .then((response:any)=>{
            return response
        })
        .catch((error)=>{
            console.log(error);
        })
    }

    const returnFunction = (val: any) => {
        console.log(val)
        mode === "update" ? updateUser(val) : deleteUser(val);
    }

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
                                setMode("delete")
                                setSelectedUser(row.original)
                                returnFunction(row.original.id)
                            }
                        }></i>
                        <i className="ri-edit-2-line" style={{ color: "red" }} onClick={() => {
                            setMode("update")
                            setSelectedUser(row.original)
                            toggle();
                        }}></i>
                    </div>
                )
            },
            enableColumnFilter: false,
        },

    ], [toggle])

    return (
        <React.Fragment>
            <div style={{ padding: '50px', marginTop: '50px' }}>
                <div className="plants-header">
                    <h1>Users Table</h1>
                    <UsersFormModal
                        selected={selectedUser}
                        mode={mode}
                        returnFunction={(val: any) => returnFunction(val)}
                        modal={modal}
                        toggle={toggle}
                    />
                </div>
                <TableContainer
                    columns={(columns || [])}
                    data={(users || [])}
                    tableClass="table-centered align-middle table-nowrap mb-0"
                    theadClass="text-muted table-light"
                    SearchPlaceholder='Search Users...'
                    isGlobalFilter={true}
                    page={page}
                    sorting={sorting}
                    setSorting={setSorting}
                    clickable={false}
                />
            </div>
        </React.Fragment>
    );
}

export default AllUsers