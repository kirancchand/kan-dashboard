import React, { useMemo, useState, useEffect } from 'react'
import { TableContainer } from "../../../../Responsive Table/TableContainerReactTable";
import { SortTanstackInterface } from '../../../../Typecomponents/ComponentsType';
// import UsersFormModal from '../../UsersFormModal';
import { SortInterface } from '../../../../Typecomponents/ComponentsType';
// import AddUserModal from '../../AddUserModal';
import { http, GET_MENU_LIST} from '../../../../http/http';
import MenuModal from './MenuModal';
interface DataItem {
    menu_id: number;
    menu_name: string;
}



const Menu = () => {
    const [page, setPage] = useState(1);
    const [sorting, setSorting] = useState<SortTanstackInterface[]>([]);
    const [selectedUser, setSelectedUser] = useState<any | null>(null);
    const [mode, setMode] = useState("");
    const [showModal, setShowModal] = useState(false);

    const toggle = () => {
        setShowModal(!showModal);
        if (showModal) {
            setSelectedUser(null);
        }
    };

    const addToggle = () => {
        setShowModal(!showModal);
    };


    const serialNo = (celldata: any) => {
        return <span>{((page - 1) * sizePerPage) + (Number(celldata.row.index) + 1)}</span>
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
            id: "Menu Name",
            header: "Menu Name",
            accessorKey: "menu",
            enableColumnFilter: false,
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
            const response = await http.post(GET_MENU_LIST, requestdata);
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

    const returnFunc = () => {
    }
    return (
        <React.Fragment>
            <div style={{ padding: '50px', marginTop: '50px' }}>
                <div className="plants-header">
                    <h1>Menu</h1>
                    <button className="btn btn-primary" onClick={() => {
                        addToggle()
                    }}>
                        Add New Menu
                    </button>
                     {showModal&&<MenuModal
                        isShowing={showModal}
                        hide={toggle}
                        name="Menu"
                        style={{ maxWidth: '50%', height: 'auto' }}
                        returnFunc={returnFunc}
                        loading={loading}
                        setLoading={setLoading}
                        modal={showModal}
                        toggle={toggle}
                        />}
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

export default Menu