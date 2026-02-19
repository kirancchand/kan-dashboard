import React, { useMemo, useEffect, useState } from "react";
import { TableContainer } from "../../Responsive Table/TableContainerReactTable";
import Swal from "sweetalert2";
import CategoryModal from "./CategoryModal";
import axios from "axios";
import { SortInterface } from '../../Typecomponents/ComponentsType';

type Category = {
    id: number;
    name: string;
    subcategory: number | string;
};

const PlantsCategory = () => {

    let sort: SortInterface[] = [];
    const [plantsCategoryData, setPlantsCategoryData] = useState<Category[]>([]);
    const [allCategories, setAllCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [sorting, setSorting] = useState<[]>([]);
    const [loading, setLoading] = useState(false);
    const [sizePerPage, setSizePerPage] = useState(10);
    const [page, setPage] = useState(1);
    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);
    const [mode, setMode] = useState("");
    const [totalCount, setTotalCount] = useState(0);

    const fetchData = async (requestData: any) => {
        axios.get("http://localhost:5000/api/categories")
            .then((response: any) => {
                const paginatedData = response.slice(start, start + numberOfRows)
                setAllCategories(response)
                setPlantsCategoryData(paginatedData);
                setTotalCount(response.length)
            })
            .catch((error) => console.log(error));

        const { start, numberOfRows } = requestData
    }

    let initialRequest = {
        "start": 0,
        "sort": [],
        "numberOfRows": 10,
        "filters": []
    }

    useEffect(() => {
        fetchData(initialRequest);
    }, []);

    const handleTableChange = ({ pages, sizePerPages, sortField, sortOrder }: any) => {
        console.log("pages", pages)
        console.log("sizePerPages", sizePerPages)

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

    const addPlantCategory = async (values: any) => {
        try {
            await axios.post("http://localhost:5000/api/categories", values)
            await fetchData({
                start: (page - 1) * sizePerPage,
                sort,
                numberOfRows: sizePerPage,
                filters: []
            });

        } catch (error) {
            console.log(error)
        }
    };

    const updatePlantCategory = async (values: any) => {
        try {
            await axios.put(`http://localhost:5000/api/categories/${selectedCategory?.id}`, values)
            await fetchData({
                start: (page - 1) * sizePerPage,
                sort,
                numberOfRows: sizePerPage,
                filters: []
            });
        } catch (error) {
            console.log(error)
        }
    };

    const handleDelete = async (index: number) => {
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
            await axios.delete(`http://localhost:5000/api/categories/${index}`);
            await fetchData({
                start: (page - 1) * sizePerPage,
                sort,
                numberOfRows: sizePerPage,
                filters: []
            });

            await Swal.fire({
                title: "Success!",
                text: "The selected category has been deleted.",
                icon: "success",
            });

        } catch (error) {
            console.error(error);
        }
    };

    const columns = useMemo(
        () => [
            {
                id: "id",
                header: "Id",
                accessorKey: "id",
                enableColumnFilter: false,
            },
            {
                id: "name",
                header: "Category Name",
                accessorKey: "name",
                enableColumnFilter: false,
            },
            {
                id: "parent_category",
                header: "Parent Category",
                enableColumnFilter: false,
                accessorKey: "parent_category",
            },
            {
                id: "actions",
                header: "Actions",
                cell: ({ row }: { row: any }) => {
                    return (
                        <div>
                            <i
                                className="ri-delete-bin-line"
                                style={{ color: "red" }}
                                onClick={() => handleDelete(row.original.id)}
                            ></i>

                            <i
                                className="ri-edit-2-line"
                                style={{ color: "red" }}
                                onClick={() => {
                                    setMode("update");
                                    setSelectedCategory(row.original);
                                    toggle();
                                }}
                            ></i>
                        </div>
                    );
                },
                enableColumnFilter: false,
            },
        ],
        []
    );

    const returnFunction = (val: any) => {
        mode === "add"
            ? addPlantCategory(val)
            : updatePlantCategory(val);
    };

    return (
        <React.Fragment>
            <div style={{ padding: "50px", marginTop: "50px" }}>
                <div className="plants-header">
                    <h1>Plant App Categories</h1>

                    <button
                        className="btn btn-primary"
                        onClick={() => {
                            setMode("add");
                            toggle();
                        }}
                    >
                        Add New Category
                    </button>

                    <CategoryModal
                        mode={mode}
                        modal={modal}
                        toggle={toggle}
                        selected={selectedCategory}
                        returnFunction={(val: any) => returnFunction(val)}
                        plantsCategoryData={allCategories}
                    />
                </div>

                <TableContainer
                    columns={columns || []}
                    data={plantsCategoryData || []}
                    tableClass="table-centered align-middle table-nowrap mb-0"
                    theadClass="text-muted table-light"
                    SearchPlaceholder="Search Category..."
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
};

export default PlantsCategory;
