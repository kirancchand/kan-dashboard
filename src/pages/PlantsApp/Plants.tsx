import React, { useMemo, useState } from 'react'
import { TableContainer } from "../../Responsive Table/TableContainerReactTable";
import Swal from 'sweetalert2';
import PlantsFormModal from './PlantsFormModal';

let DummyPlants = [
    { id: 1, name: "Rose", desc: "Rose is a really good plant for home.", price: 400, rating: 4.7, category: "Indoor Plant", src: ["1.webp", "2.webp", "3.webp", "4.webp"] },
    { id: 2, name: "Monstera", desc: "Monstera is a really good plant for home.", price: 400, rating: 4.7, category: "Indoor Plant", src: ["5.webp", "6.webp", "7.webp", "8.webp"] },
];

const Plants = () => {
    const [products, setProducts] = useState(DummyPlants)
    const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
    const [files, setFiles] = useState([]);
    const [modal, setModal] = useState(false);

    const toggle = () => {
        setModal(!modal);
        if (modal) {
            setSelectedProduct(null);
            setFiles([]);
        }
    };


    const addProduct = (values: any) => {
        const newId = DummyPlants.length + 1;
        const newData = {
            id: newId,
            ...values,
            rating: 0,
            src: files,
        }
        const allDummyProducts = [...products];
        allDummyProducts.push(newData);
        console.log("New Data: ", allDummyProducts)
        setProducts(allDummyProducts)
    }

    const handleChange = (e: any) => {
        console.log(e.target)
        const selectedFiles: any = Array.from(e.target.files);
        const allImages: any = [];
        selectedFiles.map((item: any) => {
            return allImages.push(item.name);
        })
        console.log(allImages) 
        setFiles(allImages);
    };

    const updateProduct = (values: any) => {
        setProducts(prev =>
            prev.map(item => item.id === selectedProduct.id ? { ...item, ...values, src: files.length ? files : item.src } : item)
        );
    };

    const deleteProduct = (index: Number) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            setProducts(prev => prev.filter(item => item.id !== index))
            if (result.isConfirmed) {
                Swal.fire({
                    title: "Success!",
                    text: "The Selected Review has been deleted.",
                    icon: "success"
                });
            }
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
            header: "Plant Name",
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
            id: "desc",
            header: "Description",
            accessorKey: "desc",
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
            id: "src",
            header: "Product Images",
            accessorKey: "src",
            cell: ({ getValue }: any) => {
                const images = getValue() as string[];
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
                            setFiles(row.original.src);
                            setSelectedProduct(row.original)
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
        console.log(val)
        mode === "add" ? addProduct(val) : updateProduct(val);
    }

    console.log(modal)
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
                        selected={selectedProduct}
                        mode={mode}
                        returnFunc={(val: any) => returnFunc(val)}
                        modal={modal}
                        toggle={toggle}
                        files={files}
                        onchange={handleChange}
                    />
                </div>
                <TableContainer
                    columns={(columns || [])}
                    data={(products || [])}
                    tableClass="table-centered align-middle table-nowrap mb-0"
                    theadClass="text-muted table-light"
                    SearchPlaceholder='Search Products...'
                />
            </div>
        </React.Fragment>
    );
}

export default Plants