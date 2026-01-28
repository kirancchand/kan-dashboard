import React, { useMemo, useState } from 'react'
import { TableContainer } from "../../Responsive Table/TableContainerReactTable";
import Swal from 'sweetalert2';
import CarouselModal from './CarouselModal';

let DummyCarousel = [
    { id: 1, name: "Plant Categories", category: "Home", src: ["1.jpg", "2.jpg"] },
    { id: 2, name: "Shoes Ad", category: "Advertisements", src: ["1.png", "2.png"] },
];

const PlantsCarousel = () => {

    const [files, setFiles] = useState([]);
    const [mode, setMode] = useState("")
    const [carousels, setCarousels] = useState(DummyCarousel)
    const [selectedCarousel, setSelectedCarousel] = useState<any | null>(null);

    const returnFunction = (val: any) => {
        console.log(val)
        mode === "add" ? addCarousel(val) : updateCarousel(val);
    }

    const handleDelete = (index: Number) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                setCarousels((prev) =>
                    prev.filter((item) => item.id !== index),
                );
                Swal.fire({
                    title: "Success!",
                    text: "The Selected Carousel has been deleted.",
                    icon: "success",
                });
            }
        });
    };

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

    const addCarousel = (values: any) => {
        const newId = DummyCarousel.length + 1;
        const newData = {
            id: newId,
            ...values,
            src: files,
        }
        const allDummyCarousel = [...carousels];
        allDummyCarousel.push(newData);
        console.log("New Data: ", allDummyCarousel)
        setCarousels(allDummyCarousel)
    }

    const updateCarousel = (values: any) => {
        setCarousels(prev =>
            prev.map(item => item.id === selectedCarousel.id ? { ...item, ...values, src: files.length ? files : item.src } : item)
        );
    }

    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);

    const columns = useMemo(() => [
        {
            id: "id",
            header: "Id",
            accessorKey: "id",
            enableColumnFilter: false,
        },
        {
            id: "name",
            header: "Carousel Name",
            accessorKey: "name",
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
            header: "Carousel Images",
            accessorKey: "src",
            cell: ({ getValue }: any) => {
                const images = getValue() as string[];
                return (
                    <div style={{ display: "flex", gap: "5px" }}>
                        {images.map((image, index) => (
                            <img alt="carouselimg" key={index} src={`${image}`} height={60} width={120}></img>
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
                        <i className="ri-delete-bin-line" style={{ color: "red" }} onClick={() => {
                            handleDelete(row.original.id)
                        }}></i>
                        <i className="ri-edit-2-line" style={{ color: "red" }} onClick={() => {
                            setMode("update")
                            setFiles(row.original.src);
                            setSelectedCarousel(row.original)
                            toggle();
                        }
                        }></i>
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
                    <h1>Plants App Carousel</h1>
                    <button className="btn btn-primary" onClick={()=>{
                        setMode("add")
                        toggle()
                    }}>
                        Add New Carousel
                    </button>
                    <CarouselModal
                        mode={mode}
                        modal={modal}
                        toggle={toggle}
                        onchange={handleChange}
                        selected={selectedCarousel}
                        returnFunction={(val: any) => returnFunction(val)}
                    />
                </div>
                <TableContainer
                    columns={(columns || [])}
                    data={(carousels || [])}
                    tableClass="table-centered align-middle table-nowrap mb-0"
                    theadClass="text-muted table-light"
                    SearchPlaceholder='Search Products...'
                />
            </div>
        </React.Fragment>
    );
}

export default PlantsCarousel