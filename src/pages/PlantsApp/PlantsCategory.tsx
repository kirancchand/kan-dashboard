import React, { useMemo, useEffect, useState } from "react";
import { TableContainer } from "../../Responsive Table/TableContainerReactTable";
import Swal from "sweetalert2";
import CategoryModal from "./CategoryModal";
import axios from "axios";

type Category = {
    id: number;
    name: string;
    subcategory: number | string;
};

const PlantsCategory = () => {
    const [plantsCategoryData, setPlantsCategoryData] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const fetchData = async () => {
        axios.get("http://localhost:5000/api/categories")
            .then((response: any) => {
                setPlantsCategoryData(response);
            })
            .catch((error) => console.log(error));
        setTotalCount(100);
    }
    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = (index: number) => {
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
                axios
                    .delete(`http://localhost:5000/api/categories/${index}`)
                    .then((response: any) => {
                        fetchData();
                        return response
                    })
                    .catch((error) => console.log(error));

                Swal.fire({
                    title: "Success!",
                    text: "The Selected Category has been deleted.",
                    icon: "success",
                });
            }
        });
    };

    const addPlantCategory = (values: any) => {
        axios
            .post("http://localhost:5000/api/categories", values)
            .then((response: any) => {
                fetchData();
                return response;
            })
            .catch((error) => console.log(error));
    };

    const updatePlantCategory = (values: any) => {
        axios
            .put(`http://localhost:5000/api/categories/${selectedCategory?.id}`, values)
            .then((response: any) => {
                fetchData();
                return response;
            })
            .catch((error) => console.log(error));
    };

    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);
    const [mode, setMode] = useState("");
    const [totalCount, setTotalCount] = useState(0);

    let initialRequest = {
        start: 0,
        sort: [],
        numberOfRows: 10,
        filters: [],
    };

    const parentCategoryMap = useMemo(() => {
        const parent: Record<number, string> = {};

        plantsCategoryData.forEach((item) => {
            parent[item.id] = item.name;
        });

        return parent;
    }, [plantsCategoryData]);

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
                id: "subcategory",
                header: "Parent Category",
                accessorFn: (row: Category) => {
                    const parentId = Number(row.subcategory);
                    return parentCategoryMap[parentId] ?? "-";
                },
                enableColumnFilter: false,
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
        [parentCategoryMap]
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
                        plantsCategoryData={plantsCategoryData}
                    />
                </div>

                <TableContainer
                    columns={columns || []}
                    data={plantsCategoryData || []}
                    tableClass="table-centered align-middle table-nowrap mb-0"
                    theadClass="text-muted table-light"
                    SearchPlaceholder="Search Category..."
                />
            </div>
        </React.Fragment>
    );
};

export default PlantsCategory;
