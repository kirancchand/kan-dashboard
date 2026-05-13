import React, { useMemo, useState, useEffect } from 'react'
import { TableContainer } from "../../../Responsive Table/TableContainerReactTable";
import { SortTanstackInterface } from '../../../Typecomponents/ComponentsType';
// import UsersFormModal from '../../UsersFormModal';
import { SortInterface } from '../../../Typecomponents/ComponentsType';
// import AddUserModal from '../../AddUserModal';
import { http, GET_USER_LIST, delete_user_url, update_user_url } from '../../../http/http';

interface DataItem {
    unit_id: number;
    unit: string;
    sector:string;
    branch:string;
    area:string;
    district:string;
    state:string;
}


const Unit = () => {
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


    const columns = useMemo(() => [
        {
            id: "slno",
            header: "Sl No",
            accessorKey: "slno",
            enableColumnFilter: false,
            cell: (cell: any) => serialNo(cell),
        }, 
        {
            id: "unit_id",
            header: "Unit ID",
            accessorKey: "unit_id",
            enableColumnFilter: false,
        },
        {
            id: "Unit Name",
            header: "Unit Name",
            accessorKey: "unit",
            enableColumnFilter: false,
        },
        {
            id: "Sector Name",
            header: "Sector Name",
            accessorKey: "sector",
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
        }

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
            const response = await http.post(GET_USER_LIST, requestdata);
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
            <div style={{ padding: '50px', marginTop: '50px' }}>
                <div className="plants-header">
                    <h1>Unit</h1>
                    <button className="btn btn-primary" onClick={() => {
                        addToggle()
                    }}>
                        Add New Unit
                    </button>
                    {/* <UsersFormModal
                        selected={selectedUser}
                        mode={mode}
                        returnFunction={(val: any) => returnFunction(val)}
                        modal={modal}
                        toggle={toggle}
                    /> */}
                    {/* <AddUserModal
                        toggle={addToggle}
                        modal={modal}
                    /> */}
                </div>
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
            </div>
        </React.Fragment>
    );
}

export default Unit