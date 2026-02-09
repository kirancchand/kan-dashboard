import React, { useMemo, useState, useEffect } from 'react'
import { TableContainer } from "../../Responsive Table/TableContainerReactTable";
import { SortTanstackInterface } from '../../Typecomponents/ComponentsType';
import { FakeUsers } from './FakeUsers';
import UsersFormModal from './UsersFormModal';
import { delete_user_url, http, update_user_url } from 'http/http';
import { SortInterface } from '../../Typecomponents/ComponentsType';
import AddUserModal from './AddUserModal';

interface AnalyticsItem {
    first_name: string;
    middle_name: string;
    last_name: string;
    email_id: string;
    mobno: string;
    dateofbirth: string;
    f_gender_id: string;
}


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

    const addToggle = () => {
        setModal(!modal);
    };

    const updateUser = (values: any) => {
        http.put(update_user_url, values)
            .then((response: any) => {

                return response
            })
            .catch((error) => {
                console.log(error);
            })
    }

    const deleteUser = (values: any) => {
        http.delete(delete_user_url, values)
            .then((response: any) => {
                return response
            })
            .catch((error) => {
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

    const [totalCount, setTotalCount] = useState(0);
    const [analyticsData, setAnalyticsData] = useState<AnalyticsItem[]>([]);
    let sort: SortInterface[] = [];
    const [sizePerPage, setSizePerPage] = useState(10);
    const [loading, setLoading] = useState(false);

    let initialRequest = {
        "start": 0,
        "sort": [],
        "numberOfRows": 10,
        "filters": []
    }
    const fetchData = async (requestdata: any) => {
        const { start, numberOfRows } = requestdata
        const paginatedData = FakeUsers.slice(start, start + numberOfRows)
        setTotalCount(FakeUsers.length)
        setAnalyticsData(paginatedData)
    }

    useEffect(() => {
        fetchData(initialRequest);
    }, []);

    const handleTableChange = ({ pages, sizePerPages, sortField, sortOrder }: any) => {
        console.log("pages", pages)
        console.log("sizePerPages", sizePerPages)
        // console.log(sizePerPage)
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
        console.log("page", page)
    }

    return (
        <React.Fragment>
            <div style={{ padding: '50px', marginTop: '50px' }}>
                <div className="plants-header">
                    <h1>Users Table</h1>
                    <button className="btn btn-primary" onClick={() => {
                        addToggle()
                    }}>
                        Add New User
                    </button>
                    <UsersFormModal
                        selected={selectedUser}
                        mode={mode}
                        returnFunction={(val: any) => returnFunction(val)}
                        modal={modal}
                        toggle={toggle}
                    />
                    <AddUserModal
                        toggle={addToggle}
                        modal={modal}
                    />
                </div>
                <TableContainer
                    columns={(columns || [])}
                    data={(analyticsData || [])}
                    customPageSize={sizePerPage}
                    tableClass="table-centered align-middle table-nowrap mb-0"
                    theadClass="text-muted table-light"
                    SearchPlaceholder='Search Users...'
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
    );
}

export default AllUsers