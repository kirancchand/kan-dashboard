import React, { useMemo, useEffect, useState } from "react";
import { TableContainer } from "../../Responsive Table/TableContainerReactTable";
import Swal from "sweetalert2";
import CategoryModal from "./CategoryModal";



let dummyPlantsCategory = [
    { id: 1, category: "Indoor Plants", parent_id: 0 },
    { id: 2, category: "Outdoor Plants", parent_id: 0 },
    { id: 3, category: "Succulents", parent_id: 1 },
    { id: 4, category: "Flowering Plants", parent_id: 2 },
    { id: 5, category: "Herbal Plants", parent_id: 2 },
];

const PlantsCategory = () => {
    const [plantsCategoryData, setPlantsCategoryData] = useState(dummyPlantsCategory);
    const [selectedCategory, setSelectedCategory] = useState<any | null>(null);

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
                setPlantsCategoryData((prev) =>
                    prev.filter((item) => item.id !== index),
                );
                Swal.fire({
                    title: "Success!",
                    text: "The Selected Category has been deleted.",
                    icon: "success",
                });
            }
        });
    };

    const addPlantCategory = (values: any) => {
        const newId = dummyPlantsCategory.length + 1;
        const newData = {
            id: newId,
            ...values,
        };
        const allPlantCategories = [...plantsCategoryData];
        allPlantCategories.push(newData);
        setPlantsCategoryData(allPlantCategories)
    };

    const updatePlantCategory = (values:any) =>{
        setPlantsCategoryData(prev =>
            prev.map(item => item.id === selectedCategory.id ? { ...item, ...values} : item)
        );
    }

    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);
    const [mode, setMode] = useState("")
    const [totalCount, setTotalCount] = useState(0);

    let initialRequest = {
        start: 0,
        sort: [],
        numberOfRows: 10,
        filters: [],
    };

    const parentCategoryMap = useMemo(() => {
        const parent: Record<number, string> = {};
        dummyPlantsCategory.forEach((item) => {
            parent[item.id] = item.category;
        });
        return parent;
    }, [dummyPlantsCategory]);

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
                accessorKey: "category",
                enableColumnFilter: false,
            },
            {
                id: "parent_id",
                header: "Parent Category",
                accessorFn: (row: any) => {
                    return parentCategoryMap[row.parent_id] ?? "-";
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
                                setSelectedCategory(row.original)
                                toggle();
                            }}></i>
                        </div>
                    );
                },
                enableColumnFilter: false,
            },
        ],
        [parentCategoryMap],
    );

    const fetchData = async (reqData: any) => {
        setTotalCount(100);
    };

    useEffect(() => {
        fetchData(initialRequest);
    });

    const returnFunction = (val: any) => {
        console.log(val)
        mode === "add" ? addPlantCategory(val) : updatePlantCategory(val);
    }

    return (
        <React.Fragment>
            <div style={{ padding: "50px", marginTop: "50px" }}>
                <div className="plants-header">
                    <h1>Plant App Categories</h1>
                    <button className="btn btn-primary" onClick={()=>{
                        setMode("add")
                        toggle()
                    }}>
                        Add New Category
                    </button>
                    <CategoryModal
                        mode={mode}
                        modal={modal}
                        toggle={toggle}
                        selected={selectedCategory}
                        returnFunction={(val: any) => returnFunction(val)}
                        plantsCategoryData ={plantsCategoryData}
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
