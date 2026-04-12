import React, { useEffect, useMemo, useState } from 'react'
import { SortInterface } from 'Typecomponents/ComponentsType';
import { TableContainer } from "../../Responsive Table/TableContainerReactTable";
import axios from 'axios';
import Swal from 'sweetalert2';
import DeliveryPersonModal from './DeliveryPersonModal';
type DeliveryPerson = {
    id: number;
    name: string;
    mobno: number;
    location: string[];
};

const DeliveryPerson = () => {
    let sort: SortInterface[] = [];
    const [data, setData] = useState<DeliveryPerson[]>([]);
    const [selectedId, setSelectedId] = useState(0);
    const [files, setFiles] = useState([]);
    const [modal, setModal] = useState(false);
    const [sorting, setSorting] = useState<[]>([]);
    const [loading, setLoading] = useState(false);
    const [sizePerPage, setSizePerPage] = useState(10);
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);


    const toggle = () => {
        setModal(!modal);
        if (modal) {
            setFiles([]);
        }
    };

    let initialRequest = {
        "start": 0,
        "sort": [],
        "numberOfRows": 10,
        "filters": []
    }

    useEffect(() => {
        fetchData(initialRequest);
    }, []);

    const fetchData = async (requestData: any) => {
        // const { start, numberOfRows } = requestData;
        // setLoading(true);
        // axios.get(`${plant_url}paginate`, {
        //     params: {
        //         start: start,
        //         limit: numberOfRows
        //     }
        // })
        //     .then((response: any) => {
        //         const products = response.products;
        //         const total = response.total;
        //         setProducts(products);
        //         setTotalCount(total);
        //     })
        //     .catch((error) => console.error("Error fetching paginated products:", error))
        //     .finally(() => setLoading(false));
        setData([{
            "id":1,
            "name":"abcd",
            "mobno":987654321,
            "location":["abcd","efgh"]
        }])
    }

    const successNotification = () => {
        Swal.fire({
            title: "Success!",
            text: mode == "update" ? "Selected Product Updated." : "New Product Added",
            icon: "success"
        })
    }

    const addProduct = async (values: any) => {
        // try {
        //     await axios.post(`${plant_url}`, values, {
        //         headers: {
        //             'Content-Type': 'multipart/form-data',
        //         },
        //     })
        //     await fetchData({
        //         start: (page - 1) * sizePerPage,
        //         sort,
        //         numberOfRows: sizePerPage,
        //         filters: []
        //     });
        //     await successNotification();
        // } catch (error) {
        //     console.log(error)
        // }
    }

    const updateProduct = async (values: any) => {
        // try {
        //     await axios.put(`${plant_url + selectedProductId}`, values)
        //     await fetchData({
        //         start: (page - 1) * sizePerPage,
        //         sort,
        //         numberOfRows: sizePerPage,
        //         filters: []
        //     });
        //     await successNotification();
        // } catch (error) {
        //     console.log(error)
        // }
    };

    const deletePerson = async (index: number) => {
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
            // await axios.delete(`${plant_url + index}`);
            // await fetchData({
            //     start: (page - 1) * sizePerPage,
            //     sort,
            //     numberOfRows: sizePerPage,
            //     filters: []
            // });
        }
        catch (error) {

        }

        await Swal.fire({
            title: "Success!",
            text: "The selected person is deleted.",
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
            "numberOfRows": sizePerPages,
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
            id: "name",
            header: "Name",
            accessorKey: "name",
            enableColumnFilter: false,
        },
        {
            id: "mobno",
            header: "Mobile",
            accessorKey: "mobno",
            enableColumnFilter: false,
        },
        {
            id: "location",
            header: "Location",
            accessorKey: "location",
            enableColumnFilter: false,
            cell: (row:any) => {
                const value = row.getValue();
                return value.toString();
            },
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }: { row: any }) => {
                return (
                    <div>
                        <i className="ri-delete-bin-line" style={{ color: "red" }} onClick={
                            () => {
                                deletePerson(row.original.id)
                            }
                        }></i>
                        <i className="ri-edit-2-line" style={{ color: "red" }} onClick={() => {
                            setMode("update")
                            setSelectedId(row.original.id)
                            toggle();
                        }}></i>
                    </div>
                )
            },
            enableColumnFilter: false,
        },

    ], [toggle])

    const [mode, setMode] = useState("");

    const returnFunc = (val: any) => {
        mode === "add" ? addProduct(val) : updateProduct(val);
    }

    return (
        <React.Fragment>
            <div style={{ padding: '50px', marginTop: '50px' }}>
                <div className="plants-header">
                    <h1>Delivery Person Table</h1>
                    <button className="btn btn-primary" onClick={() => {
                        setMode("add")
                        toggle()
                    }}>
                        Add New Person
                    </button>

                    <DeliveryPersonModal
                        selected={selectedId}
                        mode={mode}
                        returnFunc={(val: any) => returnFunc(val)}
                        modal={modal}
                        toggle={toggle}
                        files={files}
                    // onchange={handleChange}
                    />
                </div>
                <TableContainer
                    columns={(columns || [])}
                    data={(data || [])}
                    tableClass="table-centered align-middle table-nowrap mb-0"
                    theadClass="text-muted table-light"
                    SearchPlaceholder='Search Products...'
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

export default DeliveryPerson