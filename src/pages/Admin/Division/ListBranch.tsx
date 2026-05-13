import React, { useMemo, useState, useEffect } from 'react'
import { TableContainer } from "../../../Responsive Table/TableContainerReactTable";
import { SortTanstackInterface } from '../../../Typecomponents/ComponentsType';
// import UsersFormModal from '../../UsersFormModal';
import { SortInterface } from '../../../Typecomponents/ComponentsType';
// import AddUserModal from '../../AddUserModal';
import { http, GET_BRANCH_LIST } from '../../../http/http';
import {Button} from "reactstrap";
interface DataItem {
    branch_id: number;
    branch: string;
    area:string;
    district:string;
    state:string;
}


const ListBranch = (props:any) => {
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


    const serialNo = (celldata: any) => {
        return <span>{((page - 1) * sizePerPage) + (Number(celldata.row.id) + 1)}</span>
    }

    const handleEdit = (row: any) => {
        props.handleEdit(row)
    };
    const handleDelete = (id: number) => {
        props.handleDelete(id)
    };

    const columns = useMemo(() => [
        {
            id: "slno",
            header: "Sl No",
            accessorKey: "slno",
            enableColumnFilter: false,
            cell: (cell: any) => serialNo(cell),
        }, 
        {
            id: "branch_id",
            header: "Branch ID",
            accessorKey: "branch_id",
            enableColumnFilter: false,
        },
        {
            id: "Branch Name",
            header: "Branch Name",
            accessorKey: "branch",
            enableColumnFilter: false,
        },
        {
            id: "Area Name",
            header: "Area Name",
            accessorKey: "area",
            enableColumnFilter: false,
        },
        {
            id: "District Name",
            header: "District Name",
            accessorKey: "district",
            enableColumnFilter: false,
        },
        {
            id: "State Name",
            header: "State Name",
            accessorKey: "state",
            enableColumnFilter: false,
        },
        {
            header: "Actions",
            enableColumnFilter: false,
            cell: (cell: any) => {
            const row = cell.row.original;

            return (
                <div className="d-flex gap-2">
                <Button
                    size="sm"
                    color="soft-warning"
                    onClick={() =>
                    handleEdit(row)
                    }
                >
                    Edit
                </Button>

                <Button
                    size="sm"
                    color="soft-danger"
                    onClick={() =>
                    handleDelete(row.branch_id)
                    }
                >
                    Delete
                </Button>
                </div>
            );
            },
      },

    ], [toggle])

    const [totalCount, setTotalCount] = useState(0);
    const [data, setData] = useState<DataItem[]>([]);
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
        const { start, numberOfRows } = requestdata;
        try {
            const response = await http.post(GET_BRANCH_LIST, requestdata);
            if (response.data) {
                setData(response.data.result);
                setTotalCount(response.data.totalCount);
            }
        } catch (error) {
            console.error("Error fetching analytics data:", error);
        }
    };

    useEffect(() => {
        fetchData(initialRequest);
    }, []);

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
        console.log("page", page)
    }

    return (
        <React.Fragment>
                <TableContainer
                    columns={(columns || [])}
                    data={(data || [])}
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
        </React.Fragment>
    );
}

export default ListBranch