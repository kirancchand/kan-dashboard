import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Navdata = () => {
    const history = useNavigate();
    //state data
    const [isDashboard, setIsDashboard] = useState<boolean>(false);
    const [isApps, setIsApps] = useState<boolean>(false);
    const [isUsers,setIsUsers] = useState<boolean>(false);
    const [isCakes, setIsCakes] = useState<boolean>(false);
    const [isPlants, setIsPlants] = useState<boolean>(false);
    const [isBook, setIsBook] = useState<boolean>(false);
    const [isAuth, setIsAuth] = useState<boolean>(false);
    const [isPages, setIsPages] = useState<boolean>(false);

    // Apps
    const [isListcategories, setListcategories] = useState<boolean>(false);
    const [isBooklist, setIsBooklist] = useState<boolean>(false);
    const [iscurrentState, setIscurrentState] = useState('Dashboard');

    function updateIconSidebar(e: any) {
        if (e && e.target && e.target.getAttribute("sub-items")) {
            const ul: any = document.getElementById("two-column-menu");
            const iconItems: any = ul.querySelectorAll(".nav-icon.active");
            let activeIconItems = [...iconItems];
            activeIconItems.forEach((item) => {
                item.classList.remove("active");
                var id = item.getAttribute("sub-items");
                const getID = document.getElementById(id) as HTMLElement;
                if (getID)
                    getID.classList.remove("show");
            });
        }
    }

    useEffect(() => {
        document.body.classList.remove('twocolumn-panel');
        if (iscurrentState !== 'Dashboard') {
            setIsDashboard(false);
        }
        if (iscurrentState !== 'Apps') {
            setIsApps(false);
        }
        if (iscurrentState !== 'Cakes') {
            setIsCakes(false);
        }
        if (iscurrentState !== 'Plants') {
            setIsPlants(false);
        }
        if (iscurrentState !== 'Auth') {
            setIsAuth(false);
        }
        if (iscurrentState !== 'Pages') {
            setIsPages(false);
        }
    }, [
        history,
        iscurrentState,
        isDashboard,
        isApps,
        isAuth,
        isPages,
    ]);

    const menuItems: any = [
        {
            label: "Menu",
            isHeader: true,
        },
        {
            id: "dashboard",
            label: "Dashboards",
            icon: "ri-dashboard-2-line",
            link: "/#",
            stateVariables: isDashboard,
            click: function (e: any) {
                e.preventDefault();
                setIsDashboard(!isDashboard);
                setIscurrentState('Dashboard');
                updateIconSidebar(e);
            },
            subItems: [
                {
                    id: "analytics",
                    label: "Analytics",
                    link: "/dashboard-analytics",
                    parentId: "dashboard",
                },
                {
                    id: "crm",
                    label: "CRM",
                    link: "/dashboard-crm",
                    parentId: "dashboard",
                },
                {
                    id: "ecommerce",
                    label: "Ecommerce",
                    link: "/dashboard",
                    parentId: "dashboard",
                },
                {
                    id: "crypto",
                    label: "Crypto",
                    link: "/dashboard-crypto",
                    parentId: "dashboard",
                },
                {
                    id: "projects",
                    label: "Projects",
                    link: "/dashboard-projects",
                    parentId: "dashboard",
                },
                {
                    id: "nft",
                    label: "NFT",
                    link: "/dashboard-nft",
                    parentId: "dashboard",
                },
                {
                    id: "job",
                    label: "Job",
                    link: "/dashboard-job",
                    parentId: "dashboard",
                },
            ],
        },
        {
            id: "users",
            label: "Users",
            icon: "ri-team-line",
            link: "/#",
            click: function (e: any) {
                e.preventDefault();

                setIsUsers(!isUsers);
                setIscurrentState('Users');
                updateIconSidebar(e);
            },
            stateVariables: isUsers,
            subItems: [
                {
                    id:"users",
                    label:"Users Table",
                    link:"/all-app-users",
                    parentId:"list"
                }
            ]

        },
        {
            id: "booksapp",
            label: "Books App",
            icon: "ri-book-line",
            link: "/#",
            click: function (e: any) {
                e.preventDefault();

                setIsBook(!isBook);
                setIscurrentState('Cakes');
                updateIconSidebar(e);
            },
            stateVariables: isBook,
            subItems: [
                {
                    id: "user",
                    label: "User Mangement",
                    link: "/Users-list",
                    parentId: "list",

                },
                {
                    id: "bookmanagement",
                    label: "Book Management",

                    parentId: "bookmanagement",
                    isChildItem: true,
                    click: function (e: any) {
                        e.preventDefault();
                        setIsBooklist(!isBooklist);
                    },
                    stateVariables: isBooklist,
                    childItems: [
                        { id: 1, label: "Book List", link: "/book-list" },
                        { id: 2, label: "Sell Order", link: "/sell-order" },
                        { id: 3, label: "Buy Order", link: "/Buy-orders" },
                        { id: 4, label: "Rent Order", link: "/Rent-orders" },
                        { id: 5, label: "Book Category", link: "/book-category" },

                    ]
                },
            ]

        },
        {
            id: "cakesapp",
            label: "Cakes App",
            icon: "ri-cake-2-line",
            link: "/#",
            click: function (e: any) {
                e.preventDefault();

                setIsCakes(!isCakes);
                setIscurrentState('Cakes');
                updateIconSidebar(e);
            },
            stateVariables: isCakes,
            subItems: [
                {
                    id: "user",
                    label: "User Mangement",
                    link: "/cakeUsers-list",
                    parentId: "list",

                },
                {
                    id: "order",
                    label: "Orders",
                    link: "/order-table",
                    parentId: "list",
                    click: function (e: any) {
                        e.preventDefault();
                        setListcategories(!isListcategories);
                    }
                },

                {
                    id: "list",
                    label: "Categories",
                    link: "/list-categories",
                    parentId: "list",
                },

                {
                    id: "cakes",
                    label: "Cakes",
                    link: "/cake-table",
                    parentId: "cakes",

                },
                {
                    id: "splash",
                    label: "Splash Screen",
                    link: "/splash-table",
                    parentId: "splash",
                },
                {
                    id: "review",
                    label: "Review",
                    link: "/review",
                    parentId: "review",
                },
                {
                    id: "contact",
                    label: "Contact",
                    link: "/contact-table",
                    parentId: "list",
                }

            ]
        },

        {
            id: "plantsapp",
            label: "Plants App",
            icon: "ri-plant-line",
            link: "/#",
            click: function (e: any) {
                e.preventDefault();

                setIsPlants(!isPlants);
                setIscurrentState('Plants');
                updateIconSidebar(e);
            },
            stateVariables: isPlants,
            subItems: [
                {
                    id: "plants",
                    label: "Plants",
                    link: "/plants",
                    parentId: "plants",

                },
                {
                    id: "categories",
                    label: "Categories",
                    link: "/plants-category",
                    parentId: "list",
                    click: function (e: any) {
                        e.preventDefault();
                        setListcategories(!isListcategories);
                    }
                },

                {
                    id: "transactions",
                    label: "Transactions",
                    link: "/plants-transactions",
                    parentId: "list",
                },

                {
                    id: "orders",
                    label: "Orders",
                    link: "/plants-orders",
                    parentId: "list",
                },

                {
                    id: "carousel",
                    label: "Carousels",
                    link: "/plants-carousel",
                    parentId: "list",
                },
                {
                    id: "reviews",
                    label: "Reviews",
                    link: "/plants-reviews",
                    parentId: "list",
                },
            ]
        },
    ];
    return <React.Fragment>{menuItems}</React.Fragment>;
};
export default Navdata;