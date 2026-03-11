import React, { useMemo, useState, useEffect } from 'react'
import { TableContainer } from "../../Responsive Table/TableContainerReactTable";
import Swal from 'sweetalert2';
import CarouselModal from './CarouselModal';
import axios from 'axios';
import { SortInterface } from 'Typecomponents/ComponentsType';

type Carousel = {
    id: number;
    name: string;
    category: string;
    images: string[];
};

const PlantsCarousel = () => {

    const [files, setFiles] = useState([]);
    const [mode, setMode] = useState("")
    const [carousels, setCarousels] = useState<Carousel[]>([]);
    const [selectedCarousel, setSelectedCarousel] = useState<any | null>(null);
    const [sorting, setSorting] = useState<[]>([]);
    const [loading, setLoading] = useState(false);
    const [sizePerPage, setSizePerPage] = useState(10);
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);

    let sort: SortInterface[] = [];

    let initialRequest = {
        "start": 0,
        "sort": [],
        "numberOfRows": 10,
        "filters": []
    }

    const successNotification = () => {
        Swal.fire({
            title: "Success!",
            text: mode == "update" ? "Selected Carousel Updated." : "New Carousel Added",
            icon: "success"
        })
    }

    const fetchData = async (requestData: any) => {
        const { start, numberOfRows } = requestData
        axios.get("http://localhost:5000/api/carousels")
            .then((response: any) => {
                const paginatedData = response.slice(start, start + numberOfRows)
                setCarousels(paginatedData);
                setTotalCount(response.length)
            })
            .catch((error) => console.log(error));
    }

    useEffect(() => {
        fetchData(initialRequest);
    }, []);

    const addCarousel = async (values: any) => {
        try {
            await axios.post("http://localhost:5000/api/carousels", values, {
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

    const updateCarousel = async (values: any) => {
        try {
            await axios.put(`http://localhost:5000/api/carousels/${selectedCarousel?.id}`, values)
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

    const deleteCarousel = async (index: number) => {
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
            await axios.delete(`http://localhost:5000/api/carousels/${index}`);
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

    const returnFunction = (values: any) => {
        console.log(values)
        mode === "add" ? addCarousel(values) : updateCarousel(values);
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
            id: "images",
            header: "Carousel Images",
            accessorKey: "images",
            cell: ({ getValue }: any) => {
                const images = (getValue() as string[] | null) ?? [];
                return (
                    <div style={{ display: "flex", gap: "5px" }}>
                        {images.map((image, index) => (
                            <img alt="carouselimg" key={index} src={`${image}`} height={60} width={60}></img>
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
                            deleteCarousel(row.original.id)
                        }}></i>
                        <i className="ri-edit-2-line" style={{ color: "red" }} onClick={() => {
                            setMode("update")
                            setFiles(row.original.images);
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
                    <button className="btn btn-primary" onClick={() => {
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

export default PlantsCarousel