import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Navdata = () => {
    const history = useNavigate();
    //state data
    const [isDashboard, setIsDashboard] = useState<boolean>(false);
    const [isApps, setIsApps] = useState<boolean>(false);
    const [isCakes, setIsCakes] = useState<boolean>(false);
    const [isPlants, setIsPlants] = useState<boolean>(false);
    const [isBook, setIsBook] = useState<boolean>(false);
    const [isAuth, setIsAuth] = useState<boolean>(false);
    const [isPages, setIsPages] = useState<boolean>(false);
    const [isBaseUi, setIsBaseUi] = useState<boolean>(false);
    const [isAdvanceUi, setIsAdvanceUi] = useState<boolean>(false);
    const [isForms, setIsForms] = useState<boolean>(false);
    const [isTables, setIsTables] = useState<boolean>(false);
    const [isCharts, setIsCharts] = useState<boolean>(false);
    const [isIcons, setIsIcons] = useState<boolean>(false);
    const [isMaps, setIsMaps] = useState<boolean>(false);
    const [isMultiLevel, setIsMultiLevel] = useState<boolean>(false);

    // Apps
    const [isCalendar, setCalendar] = useState<boolean>(false);
    const [isListcategories, setListcategories] = useState<boolean>(false);
    const [isEmail, setEmail] = useState<boolean>(false);
    const [isSubEmail, setSubEmail] = useState<boolean>(false);
    const [isEcommerce, setIsEcommerce] = useState<boolean>(false);
    const [isProjects, setIsProjects] = useState<boolean>(false);
    const [isTasks, setIsTasks] = useState<boolean>(false);
    const [isCRM, setIsCRM] = useState<boolean>(false);
    const [isCrypto, setIsCrypto] = useState<boolean>(false);
    const [isInvoices, setIsInvoices] = useState<boolean>(false);
    const [isSupportTickets, setIsSupportTickets] = useState<boolean>(false);
    const [isNFTMarketplace, setIsNFTMarketplace] = useState<boolean>(false);
    const [isJobs, setIsJobs] = useState<boolean>(false);
    const [isJobList, setIsJobList] = useState<boolean>(false);
    const [isCandidateList, setIsCandidateList] = useState<boolean>(false);


    // Authentication
    const [isSignIn, setIsSignIn] = useState<boolean>(false);
    const [isBooklist, setIsBooklist] = useState<boolean>(false);
    const [isSignUp, setIsSignUp] = useState<boolean>(false);
    const [isPasswordReset, setIsPasswordReset] = useState<boolean>(false);
    const [isPasswordCreate, setIsPasswordCreate] = useState<boolean>(false);
    const [isLockScreen, setIsLockScreen] = useState<boolean>(false);
    const [isLogout, setIsLogout] = useState<boolean>(false);
    const [isSuccessMessage, setIsSuccessMessage] = useState<boolean>(false);
    const [isVerification, setIsVerification] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);

    // Pages
    const [isProfile, setIsProfile] = useState<boolean>(false);
    const [isLanding, setIsLanding] = useState<boolean>(false);


    // Charts
    const [isApex, setIsApex] = useState<boolean>(false);

    // Multi Level
    const [isLevel1, setIsLevel1] = useState<boolean>(false);
    const [isLevel2, setIsLevel2] = useState<boolean>(false);

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
        if(iscurrentState !== 'Plants'){
            setIsPlants(false);
        }
        if (iscurrentState !== 'Auth') {
            setIsAuth(false);
        }
        if (iscurrentState !== 'Pages') {
            setIsPages(false);
        }
       
        if (iscurrentState !== 'AdvanceUi') {
            setIsAdvanceUi(false);
        }
        if (iscurrentState !== 'Forms') {
            setIsForms(false);
        }
        if (iscurrentState !== 'Tables') {
            setIsTables(false);
        }
        if (iscurrentState !== 'Charts') {
            setIsCharts(false);
        }
        if (iscurrentState !== 'Icons') {
            setIsIcons(false);
        }
        if (iscurrentState !== 'Maps') {
            setIsMaps(false);
        }
        if (iscurrentState !== 'MuliLevel') {
            setIsMultiLevel(false);
        }
        if (iscurrentState === 'Widgets') {
            history("/widgets");
            document.body.classList.add('twocolumn-panel');
        }
        if (iscurrentState !== 'Landing') {
            setIsLanding(false);
        }
    }, [
        history,
        iscurrentState,
        isDashboard,
        isApps,
        isAuth,
        isPages,
        isBaseUi,
        isAdvanceUi,
        isForms,
        isTables,
        isCharts,
        isIcons,
        isMaps,
        isMultiLevel
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
                    // badgeColor: "success",
                    // badgeName: "New",
                },
            ],
        },
         {
            id: "booksapp",
            label: "Books App",
            icon: "ri-apps-2-line",
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
            icon: "ri-apps-2-line",
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
                    // isChildItem: true,
                    // click: function (e: any) {
                    //     e.preventDefault();
                    //     setListcategories(!isListcategories);
                    // }
        },
          
        {
                    id: "cakes",
                    label: "Cakes",
                    link: "/cake-table",
                    parentId: "cakes",
                    // isChildItem: true,
                    // click: function (e: any) {
                    //     e.preventDefault();
                    //     setListcategories(!isListcategories);
                    // }
        },
        {
                    id: "splash",
                    label: "Splash Screen",
                    link: "/splash-table",
                    parentId: "splash",
                    // isChildItem: true,
                    // click: function (e: any) {
                    //     e.preventDefault();
                    //     setListcategories(!isListcategories);
                    // }
        },
         {
                    id: "review",
                    label: "Review",
                    link: "/review",
                    parentId: "review",
                    // isChildItem: true,
                    // click: function (e: any) {
                    //     e.preventDefault();
                    //     setListcategories(!isListcategories);
                    // }
        },
         {
                    id: "contact",
                    label: "Contact",
                    link: "/contact-table",
                    parentId: "list",
                    // isChildItem: true,
                    // click: function (e: any) {
                    //     e.preventDefault();
                    //     setListcategories(!isListcategories);
                    // }
        }
       
    ]
},

{
            id: "plantsapp",
            label: "Plants App",
            icon: "ri-apps-2-line",
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
                    // isChildItem: true,
                    // click: function (e: any) {
                    //     e.preventDefault();
                    //     setListcategories(!isListcategories);
                    // }
        },
          
        {
                    id: "orders",
                    label: "Orders",
                    link: "/plants-orders",
                    parentId: "list",
                    // isChildItem: true,
                    // click: function (e: any) {
                    //     e.preventDefault();
                    //     setListcategories(!isListcategories);
                    // }
        },

         {
                    id: "carousel",
                    label: "Carousels",
                    link: "/plants-carousel",
                    parentId: "list",
                    // isChildItem: true,
                    // click: function (e: any) {
                    //     e.preventDefault();
                    //     setListcategories(!isListcategories);
                    // }
        },
        {
                    id: "reviews",
                    label: "Reviews",
                    link: "/plants-reviews",
                    parentId: "list",
                    // isChildItem: true,
                    // click: function (e: any) {
                    //     e.preventDefault();
                    //     setListcategories(!isListcategories);
                    // }
        },
    ]
},
       
        {
            label: "pages",
            isHeader: true,
        },
        {
            id: "authentication",
            label: "Authentication",
            icon: "ri-account-circle-line",
            link: "/#",
            click: function (e: any) {
                e.preventDefault();
                setIsAuth(!isAuth);
                setIscurrentState('Auth');
                updateIconSidebar(e);
            },
            stateVariables: isAuth,
            subItems: [
                {
                    id: "signIn",
                    label: "Sign In",
                    link: "/#",
                    isChildItem: true,
                    click: function (e: any) {
                        e.preventDefault();
                        setIsSignIn(!isSignIn);
                    },
                    parentId: "authentication",
                    stateVariables: isSignIn,
                    childItems: [
                        { id: 1, label: "Basic", link: "/auth-signin-basic" },
                        { id: 2, label: "Cover", link: "/auth-signin-cover" },
                    ]
                },
                {
                    id: "signUp",
                    label: "Sign Up",
                    link: "/#",
                    isChildItem: true,
                    click: function (e: any) {
                        e.preventDefault();
                        setIsSignUp(!isSignUp);
                    },
                    parentId: "authentication",
                    stateVariables: isSignUp,
                    childItems: [
                        { id: 1, label: "Basic", link: "/auth-signup-basic" },
                        { id: 2, label: "Cover", link: "/auth-signup-cover" },
                    ]
                },
                {
                    id: "passwordReset",
                    label: "Password Reset",
                    link: "/#",
                    isChildItem: true,
                    click: function (e: any) {
                        e.preventDefault();
                        setIsPasswordReset(!isPasswordReset);
                    },
                    parentId: "authentication",
                    stateVariables: isPasswordReset,
                    childItems: [
                        { id: 1, label: "Basic", link: "/auth-pass-reset-basic" },
                        { id: 2, label: "Cover", link: "/auth-pass-reset-cover" },
                    ]
                },
                {
                    id: "passwordCreate",
                    label: "Password Create",
                    link: "/#",
                    isChildItem: true,
                    click: function (e: any) {
                        e.preventDefault();
                        setIsPasswordCreate(!isPasswordCreate);
                    },
                    parentId: "authentication",
                    stateVariables: isPasswordCreate,
                    childItems: [
                        { id: 1, label: "Basic", link: "/auth-pass-change-basic" },
                        { id: 2, label: "Cover", link: "/auth-pass-change-cover" },
                    ]
                },
                {
                    id: "lockScreen",
                    label: "Lock Screen",
                    link: "/#",
                    isChildItem: true,
                    click: function (e: any) {
                        e.preventDefault();
                        setIsLockScreen(!isLockScreen);
                    },
                    parentId: "authentication",
                    stateVariables: isLockScreen,
                    childItems: [
                        { id: 1, label: "Basic", link: "/auth-lockscreen-basic" },
                        { id: 2, label: "Cover", link: "/auth-lockscreen-cover" },
                    ]
                },
                {
                    id: "logout",
                    label: "Logout",
                    link: "/#",
                    isChildItem: true,
                    click: function (e: any) {
                        e.preventDefault();
                        setIsLogout(!isLogout);
                    },
                    parentId: "authentication",
                    stateVariables: isLogout,
                    childItems: [
                        { id: 1, label: "Basic", link: "/auth-logout-basic" },
                        { id: 2, label: "Cover", link: "/auth-logout-cover" },
                    ]
                },
                {
                    id: "successMessage",
                    label: "Success Message",
                    link: "/#",
                    isChildItem: true,
                    click: function (e: any) {
                        e.preventDefault();
                        setIsSuccessMessage(!isSuccessMessage);
                    },
                    parentId: "authentication",
                    stateVariables: isSuccessMessage,
                    childItems: [
                        { id: 1, label: "Basic", link: "/auth-success-msg-basic" },
                        { id: 2, label: "Cover", link: "/auth-success-msg-cover" },
                    ]
                },
                {
                    id: "twoStepVerification",
                    label: "Two Step Verification",
                    link: "/#",
                    isChildItem: true,
                    click: function (e: any) {
                        e.preventDefault();
                        setIsVerification(!isVerification);
                    },
                    parentId: "authentication",
                    stateVariables: isVerification,
                    childItems: [
                        { id: 1, label: "Basic", link: "/auth-twostep-basic" },
                        { id: 2, label: "Cover", link: "/auth-twostep-cover" },
                    ]
                },
                {
                    id: "errors",
                    label: "Errors",
                    link: "/#",
                    isChildItem: true,
                    click: function (e: any) {
                        e.preventDefault();
                        setIsError(!isError);
                    },
                    parentId: "authentication",
                    stateVariables: isError,
                    childItems: [
                        { id: 1, label: "404 Basic", link: "/auth-404-basic" },
                        { id: 2, label: "404 Cover", link: "/auth-404-cover" },
                        { id: 3, label: "404 Alt", link: "/auth-404-alt" },
                        { id: 4, label: "500", link: "/auth-500" },
                        { id: 5, label: "Offline Page", link: "/auth-offline" },
                    ]
                },
            ],
        },
        {
            id: "pages",
            label: "Pages",
            icon: "ri-pages-line",
            link: "/#",
            click: function (e: any) {
                e.preventDefault();
                setIsPages(!isPages);
                setIscurrentState('Pages');
                updateIconSidebar(e);
            },
            stateVariables: isPages,
            subItems: [
                {
                    id: "starter",
                    label: "Starter",
                    link: "/pages-starter",
                    parentId: "pages",
                },
                {
                    id: "profile",
                    label: "Profile",
                    link: "/#",
                    isChildItem: true,
                    click: function (e: any) {
                        e.preventDefault();
                        setIsProfile(!isProfile);
                    },
                    parentId: "pages",
                    stateVariables: isProfile,
                    childItems: [
                        { id: 1, label: "Simple Page", link: "/pages-profile", parentId: "pages" },
                        { id: 2, label: "Settings", link: "/pages-profile-settings", parentId: "pages" },
                    ]
                },
                { id: "team", label: "Team", link: "/pages-team", parentId: "pages" },
                { id: "timeline", label: "Timeline", link: "/pages-timeline", parentId: "pages" },
                { id: "faqs", label: "FAQs", link: "/pages-faqs", parentId: "pages" },
                { id: "pricing", label: "Pricing", link: "/pages-pricing", parentId: "pages" },
                { id: "gallery", label: "Gallery", link: "/pages-gallery", parentId: "pages" },
                { id: "maintenance", label: "Maintenance", link: "/pages-maintenance", parentId: "pages" },
                { id: "comingSoon", label: "Coming Soon", link: "/pages-coming-soon", parentId: "pages" },
                { id: "sitemap", label: "Sitemap", link: "/pages-sitemap", parentId: "pages" },
                { id: "searchResults", label: "Search Results", link: "/pages-search-results", parentId: "pages" },
                {
                    id: "PrivecyPolicy", label: "Privacy Policy", link: "/pages-privacy-policy", parentId: "pages",
                    // badgeColor: "success", badgeName: "New", 
                },
                {
                    id: "TermsCondition", label: "Terms Condition", link: "/pages-terms-condition", parentId: "pages",
                    // badgeColor: "success", badgeName: "New", 
                },
            ],
        },
        {
            id: "landing",
            label: "Landing",
            icon: "ri-rocket-line",
            link: "/#",
            stateVariables: isLanding,
            click: function (e: any) {
                e.preventDefault();
                setIsLanding(!isLanding);
                setIscurrentState('Landing');
                updateIconSidebar(e);
            },
            subItems: [
                { id: "onePage", label: "One Page", link: "/landing", parentId: "landing" },
                { id: "nftLanding", label: "NFT Landing", link: "/nft-landing", parentId: "landing" },
                {
                    id: "jobLanding", label: "Job", link: "/job-landing", parentId: "landing",
                    // badgeColor: "success", badgeName: "New"
                },
            ],
        },
        {
            label: "Components",
            isHeader: true,
        },
        
        {
            id: "advanceUi",
            label: "Advance UI",
            icon: "ri-stack-line",
            link: "/#",
            click: function (e: any) {
                e.preventDefault();
                setIsAdvanceUi(!isAdvanceUi);
                setIscurrentState('AdvanceUi');
                updateIconSidebar(e);
            },
            stateVariables: isAdvanceUi,
            subItems: [
                { id: "scrollbar", label: "Scrollbar", link: "/advance-ui-scrollbar", parentId: "advanceUi" },
                { id: "animation", label: "Animation", link: "/advance-ui-animation", parentId: "advanceUi" },
                { id: "swiperslider", label: "Swiper Slider", link: "/advance-ui-swiper", parentId: "advanceUi" },
                { id: "ratings", label: "Ratings", link: "/advance-ui-ratings", parentId: "advanceUi" },
                { id: "highlight", label: "Highlight", link: "/advance-ui-highlight", parentId: "advanceUi" },
            ],
        },
        {
            id: "widgets",
            label: "Widgets",
            icon: "ri-honour-line",
            link: "/widgets",
            click: function (e: any) {
                e.preventDefault();
                setIscurrentState('Widgets');
            }
        },
        {
            id: "forms",
            label: "Forms",
            icon: "ri-file-list-3-line",
            link: "/#",
            click: function (e: any) {
                e.preventDefault();
                setIsForms(!isForms);
                setIscurrentState('Forms');
                updateIconSidebar(e);
            },
            stateVariables: isForms,
            subItems: [
                { id: "basicelements", label: "Basic Elements", link: "/forms-elements", parentId: "forms" },
                { id: "formselect", label: "Form Select", link: "/forms-select", parentId: "forms" },
                { id: "checkboxsradios", label: "Checkboxs & Radios", link: "/forms-checkboxes-radios", parentId: "forms" },
                { id: "pickers", label: "Pickers", link: "/forms-pickers", parentId: "forms" },
                { id: "inputmasks", label: "Input Masks", link: "/forms-masks", parentId: "forms" },
                { id: "advanced", label: "Advanced", link: "/forms-advanced", parentId: "forms" },
                { id: "rangeslider", label: "Range Slider", link: "/forms-range-sliders", parentId: "forms" },
                { id: "validation", label: "Validation", link: "/forms-validation", parentId: "forms" },
                { id: "wizard", label: "Wizard", link: "/forms-wizard", parentId: "forms" },
                { id: "editors", label: "Editors", link: "/forms-editors", parentId: "forms" },
                { id: "fileuploads", label: "File Uploads", link: "/forms-file-uploads", parentId: "forms" },
                { id: "formlayouts", label: "Form Layouts", link: "/forms-layouts", parentId: "forms" },
                { id: "select2", label: "Select2", link: "/forms-select2", parentId: "forms" },
            ],
        },
        {
            id: "tables",
            label: "Tables",
            icon: "ri-layout-grid-line",
            link: "/#",
            click: function (e: any) {
                e.preventDefault();
                setIsTables(!isTables);
                setIscurrentState('Tables');
                updateIconSidebar(e);
            },
            stateVariables: isTables,
            subItems: [
                { id: "basictables", label: "Basic Tables", link: "/tables-basic", parentId: "tables" },
                // { id: "listjs", label: "List Js", link: "/tables-listjs", parentId: "tables" },
                { id: "reactdatatables", label: "React Datatables", link: "/tables-react", parentId: "tables" },
            ],
        },
        {
            id: "charts",
            label: "Charts",
            icon: "ri-pie-chart-line",
            link: "/#",
            click: function (e: any) {
                e.preventDefault();
                setIsCharts(!isCharts);
                setIscurrentState('Charts');
                updateIconSidebar(e);
            },
            stateVariables: isCharts,
            subItems: [
                {
                    id: "apexcharts",
                    label: "Apexcharts",
                    link: "/#",
                    isChildItem: true,
                    click: function (e: any) {
                        e.preventDefault();
                        setIsApex(!isApex);
                    },
                    stateVariables: isApex,
                    childItems: [
                        { id: 1, label: "Line", link: "/charts-apex-line" },
                        { id: 2, label: "Area", link: "/charts-apex-area" },
                        { id: 3, label: "Column", link: "/charts-apex-column" },
                        { id: 4, label: "Bar", link: "/charts-apex-bar" },
                        { id: 5, label: "Mixed", link: "/charts-apex-mixed" },
                        { id: 6, label: "Timeline", link: "/charts-apex-timeline" },
                        { id: 7, label: "Range Area", link: "/charts-apex-range-area", parentId: "apexcharts", badgeColor: "success", badgeName: "New" },
                        { id: 8, label: "Funnel", link: "/charts-apex-funnel", parentId: "apexcharts", badgeColor: "success", badgeName: "New" },
                        { id: 9, label: "Candlstick", link: "/charts-apex-candlestick" },
                        { id: 10, label: "Boxplot", link: "/charts-apex-boxplot" },
                        { id: 11, label: "Bubble", link: "/charts-apex-bubble" },
                        { id: 12, label: "Scatter", link: "/charts-apex-scatter" },
                        { id: 13, label: "Heatmap", link: "/charts-apex-heatmap" },
                        { id: 14, label: "Treemap", link: "/charts-apex-treemap" },
                        { id: 15, label: "Pie", link: "/charts-apex-pie" },
                        { id: 16, label: "Radialbar", link: "/charts-apex-radialbar" },
                        { id: 17, label: "Radar", link: "/charts-apex-radar" },
                        { id: 18, label: "Polar Area", link: "/charts-apex-polar" },
                    ]
                },
                { id: "chartjs", label: "Chartjs", link: "/charts-chartjs", parentId: "charts" },
                { id: "echarts", label: "Echarts", link: "/charts-echarts", parentId: "charts" },

            ],
        },
        {
            id: "icons",
            label: "Icons",
            icon: "ri-compasses-2-line",
            link: "/#",
            click: function (e: any) {
                e.preventDefault();
                setIsIcons(!isIcons);
                setIscurrentState('Icons');
                updateIconSidebar(e);
            },
            stateVariables: isIcons,
            subItems: [
                { id: "remix", label: "Remix", link: "/icons-remix", parentId: "icons" },
                { id: "boxicons", label: "Boxicons", link: "/icons-boxicons", parentId: "icons" },
                { id: "materialdesign", label: "Material Design", link: "/icons-materialdesign", parentId: "icons" },
                { id: "lineawesome", label: "Line Awesome", link: "/icons-lineawesome", parentId: "icons" },
                { id: "feather", label: "Feather", link: "/icons-feather", parentId: "icons" },
                { id: "crypto", label: "Crypto SVG", link: "/icons-crypto", parentId: "icons" },
            ],
        },
        {
            id: "maps",
            label: "Maps",
            icon: "ri-map-pin-line",
            link: "/#",
            click: function (e: any) {
                e.preventDefault();
                setIsMaps(!isMaps);
                setIscurrentState('Maps');
                updateIconSidebar(e);
            },
            stateVariables: isMaps,
            subItems: [
                { id: "google", label: "Google", link: "/maps-google", parentId: "maps" },
            ],
        },
        {
            id: "multilevel",
            label: "Multi Level",
            icon: "ri-share-line",
            link: "/#",
            click: function (e: any) {
                e.preventDefault();
                setIsMultiLevel(!isMultiLevel);
                setIscurrentState('MuliLevel');
                updateIconSidebar(e);
            },
            stateVariables: isMultiLevel,
            subItems: [
                { id: "level1.1", label: "Level 1.1", link: "/#", parentId: "multilevel" },
                {
                    id: "level1.2",
                    label: "Level 1.2",
                    link: "/#",
                    isChildItem: true,
                    click: function (e: any) {
                        e.preventDefault();
                        setIsLevel1(!isLevel1);
                    },
                    stateVariables: isLevel1,
                    childItems: [
                        { id: 1, label: "Level 2.1", link: "/#" },
                        {
                            id: "level2.2",
                            label: "Level 2.2",
                            link: "/#",
                            isChildItem: true,
                            click: function (e: any) {
                                e.preventDefault();
                                setIsLevel2(!isLevel2);
                            },
                            stateVariables: isLevel2,
                            childItems: [
                                { id: 1, label: "Level 3.1", link: "/#" },
                                { id: 2, label: "Level 3.2", link: "/#" },
                            ]
                        },
                    ]
                },
            ],
        },
    ];
    return <React.Fragment>{menuItems}</React.Fragment>;
};
export default Navdata;