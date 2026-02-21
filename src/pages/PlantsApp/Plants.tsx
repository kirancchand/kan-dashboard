import React, { useEffect, useMemo, useState } from 'react'
import { TableContainer } from "../../Responsive Table/TableContainerReactTable";
import Swal from 'sweetalert2';
import PlantsFormModal from './PlantsFormModal';
import axios from 'axios';
import { SortInterface } from 'Typecomponents/ComponentsType';

type Product = {
    id: number;
    name: string;
    price: number;
    category: string;
    rating: number;
    images: string[];
    description: string;
};

const Plants = () => {
    let sort: SortInterface[] = [];
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProductId, setSelectedProductId] = useState(0);
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
        const { start, numberOfRows } = requestData
        axios.get("http://localhost:5000/api/products")
            .then((response: any) => {
                const paginatedData = response.slice(start, start + numberOfRows)
                setProducts(paginatedData);
                setTotalCount(response.length)
            })
            .catch((error) => console.log(error));
    }

    const successNotification = () => {
        Swal.fire({
            title: "Success!",
            text: mode == "update" ? "Selected Product Updated." : "New Product Added",
            icon: "success"
        })
    }

    const addProduct = async (values: any) => {
        try {
            await axios.post("http://localhost:5000/api/products", values, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            await fetchData({
                start: (page - 1) * sizePerPage,
                sort,
                numberOfRows: sizePerPage,
                filters: []
            });
            await successNotification();
        } catch (error) {
            console.log(error)
        }
    }

    const updateProduct = async (values: any) => {
        try {
            await axios.put(`http://localhost:5000/api/products/${selectedProductId}`, values)
            await fetchData({
                start: (page - 1) * sizePerPage,
                sort,
                numberOfRows: sizePerPage,
                filters: []
            });
            await successNotification();
        } catch (error) {
            console.log(error)
        }
    };

    const deleteProduct = async (index: number) => {
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
            await axios.delete(`http://localhost:5000/api/products/${index}`);
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
            id: "name",
            header: "Product Name",
            accessorKey: "name",
            enableColumnFilter: false,
        },
        {
            id: "price",
            header: "Price",
            accessorKey: "price",
            enableColumnFilter: false,
        },
        {
            id: "description",
            header: "Description",
            accessorKey: "description",
            enableColumnFilter: false,
        },
        {
            id: "rating",
            header: "Rating",
            accessorKey: "rating",
            enableColumnFilter: false,
        },
        {
            id: "category",
            header: "Category",
            accessorKey: "category",
            enableColumnFilter: false,
        },
        {
            id: "images",
            header: "Product Images",
            accessorKey: "images",
            cell: ({ getValue }: any) => {
                const images = (getValue() as string[] | null) ?? [];
                return (
                    <div style={{ display: "flex", gap: "5px" }}>
                        {images.map((image, index) => (
                            <img alt="productimg" key={index} src={`${image}`} height={60} width={60}></img>
                        ))}
                    </div>
                )
            },
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
                                deleteProduct(row.original.id)
                            }
                        }></i>
                        <i className="ri-edit-2-line" style={{ color: "red" }} onClick={() => {
                            setMode("update")
                            setSelectedProductId(row.original.id)
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
                    <h1>Plants App Table</h1>
                    <button className="btn btn-primary" onClick={() => {
                        setMode("add")
                        toggle()
                    }}>
                        Add New Product
                    </button>

                    <PlantsFormModal
                        selected={selectedProductId}
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
                    data={(products || [])}
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

export default Plants