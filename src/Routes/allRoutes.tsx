import { Navigate } from "react-router-dom";

//Dashboard
import DashboardEcommerce from "../pages/DashboardEcommerce";

//Calendar
import Calendar from "../pages/Calendar";
import MonthGrid from "../pages/Calendar/monthGrid";


//Chat
import Chat from "../pages/Chat";

// Project
import ProjectList from "../pages/Projects/ProjectList";
import ProjectOverview from "../pages/Projects/ProjectOverview";
import CreateProject from "../pages/Projects/CreateProject";

//Transactions
import Transactions from '../pages/Crypto/Transactions';
import BuySell from '../pages/Crypto/BuySell';
import MyWallet from '../pages/Crypto/MyWallet';
import ICOList from '../pages/Crypto/ICOList';
import KYCVerification from '../pages/Crypto/KYCVerification';


// //Ecommerce Pages

import EcommerceProductDetail from "../pages/Ecommerce/EcommerceProducts/EcommerceProductDetail";
import EcommerceOrderDetail from "../pages/Ecommerce/EcommerceOrders/EcommerceOrderDetail";

import EcommerceCart from "../pages/Ecommerce/EcommerceCart";
import EcommerceCheckout from "../pages/Ecommerce/EcommerceCheckout";
import EcommerceSellerDetail from "../pages/Ecommerce/EcommerceSellers/EcommerceSellerDetail";



//APi Key
import APIKey from "../pages/APIKey/index";

//login
import Login from "../pages/Authentication/Login";
import ForgetPasswordPage from "../pages/Authentication/ForgetPassword";
import Logout from "../pages/Authentication/Logout";
import Register from "../pages/Authentication/Register";




import FileManager from "../pages/FileManager";
import Kanbanboard from "pages/Tasks/KanbanBoard";
import AddCakes from "pages/Cakelist/AddCakes";

import Splash from "pages/Cakelist/Splash";
import Splashtable from "pages/Cakelist/Splashtable";
import AddCatageories from "pages/Cakelist/AddCatageories";
import CatageoriesTable from "pages/Cakelist/CatageoriesTable";
import CakeTable from "pages/Cakelist/CakeTable";
import ContactTable from "pages/Cakelist/ContactTable";
import OrderTable from "pages/Cakelist/OrderTable";
import AllReviewTable from "pages/Cakelist/AllReviewTable";
import Booklist from "pages/Books/Booklist";
import Sellorder from "pages/Books/Sellorder";
import Buyorders from "pages/Books/Buyorders";
import Rentorder from "pages/Books/Rentorder";
import Addbooks from "pages/Books/Addbooks";
import Userlist from "pages/Books/Userlist";
import Addusers from "pages/Books/Addusers";
import Addnewpurchase from "pages/Books/Addnewpurchase";
import Bookcategory from "pages/Books/Bookcategory";
import Addcategory from "pages/Books/Addcategory";
import Userslistcake from "pages/Cakelist/Userslistcake";
import Plants from "pages/PlantsApp/Plants";
import PlantsCarousel from "pages/PlantsApp/PlantsCarousel";
import PlantsCategory from "pages/PlantsApp/PlantsCategory";
import PlantsReviews from "pages/PlantsApp/PlantsReviews";
import PlantsOrders from "pages/PlantsApp/PlantsOrders";
import PlantsTransactions from "pages/PlantsApp/PlantsTransactions";
import AllUsers from "pages/Users/AllUsers";


import DeliveryPerson from "pages/Delivery/DeliveryPerson";
import MyOrders from "pages/Delivery/MyOrders";
import Map from "pages/Delivery/Map";

import KanDashboard from "pages/KanDashboard";
import KanVillageDashboard from "pages/KanVillageDashboard";
import UserAnalytics from "pages/UserAnalytics";

import State from "pages/Admin/Division/State";
import District from "pages/Admin/Division/District";
import Region from "pages/Admin/Division/Region";
import Area from "pages/Admin/Division/Area";
import Branch from "pages/Admin/Division/Branch";
import Sector from "pages/Admin/Division/Sector";
import Unit from "pages/Admin/Division/Unit";

import Menu from "pages/Admin/Menu/Management/Menu";
import Role from "pages/Admin/Menu/Management/Role";
import RoleMenu from "pages/Admin/Menu/Management/RoleMenu";
import MenuRole from "pages/Admin/Menu/Management/MenuRole";
import UserType from "pages/Admin/UserType/UserType";
import UserTypeRole from "pages/Admin/UserType/UserTypeRole";

import OrganisationType from "pages/Admin/Organisation/OrganisationType";
import Organisation from "pages/Admin/Organisation/Organisation";
import OrganisationMember from "pages/Admin/Organisation/OrganisationMemberIndex";


//village
import VillageApp from "../pages/VillageApp/VillageApp";
import AppnameForm from "../pages/VillageApp/AppName/AppnameForm";
import CarousalTable from "../pages/VillageApp/CarousalTable/CarousalTable";
import EmergencyServices from "pages/VillageApp/EmergencyServices/EmergencyServices";
import Users from "../pages/VillageApp/Users/Users";
import Category from "../pages/VillageApp/Category/Category";
import Organizations from "pages/VillageApp/Organizations/Organizations";
import OrganizationMember from "pages/VillageApp/OrganizationMember/OrganizationMember";

import Advertisement from "../pages/VillageApp/Advertisement/Advertisement";
import VillageState from "../pages/VillageApp/State/State";
import VillageDistrict from "../pages/VillageApp/District/District";
import VillageArea from "../pages/VillageApp/Area/Area";
import VillageBranch from "../pages/VillageApp/Branch/Branch";
import { Component } from "gridjs";



const authProtectedRoutes = [
  //Users Routes
  { path: "/all-app-users", component: <AllUsers /> },

  // Plant App Routes
  { path: "/plants", component: <Plants /> },
  { path: "/plants-carousel", component: <PlantsCarousel /> },
  { path: "/plants-reviews", component: <PlantsReviews /> },
  { path: "/plants-category", component: <PlantsCategory /> },
  { path: "/plants-orders", component: <PlantsOrders /> },
  { path: "/plants-transactions", component: <PlantsTransactions /> },

  { path: "/dashboard", component: <DashboardEcommerce /> },
  { path: "/index", component: <DashboardEcommerce /> },

  { path: "/list-categories", component: <CatageoriesTable /> },
  { path: "/add-books", component: <Addbooks /> },
  { path: "/new-purchase", component: <Addnewpurchase /> },
  { path: "/book-list", component: <Booklist /> },
  { path: "/sell-order", component: <Sellorder /> },
  { path: "/Buy-orders", component: <Buyorders /> },
  { path: "/Rent-orders", component: <Rentorder /> },
  { path: "/book-category", component: <Bookcategory /> },
  { path: "/add-category", component: <Addcategory /> },
  { path: "/Users-list", component: <Userlist /> },

  { path: "/cakeUsers-list", component: <Userslistcake /> },
  { path: "/Add-users", component: <Addusers /> },
  { path: "/cake-table", component: <CakeTable /> },
  { path: "/add-catageories", component: <AddCatageories /> },
  { path: "/add-cake", component: <AddCakes /> },
  { path: "/review", component: <AllReviewTable /> },
  { path: "/order-table", component: <OrderTable /> },
  { path: "/contact-table", component: <ContactTable /> },
  { path: "/splash-table", component: <Splashtable /> },
  { path: "/splash", component: <Splash /> },

  //Delivery
  { path: "/deliveryperson", component: <DeliveryPerson /> },
  { path: "/myorders", component: <MyOrders /> },
  { path: "/delivery-map", component: <Map /> },

  //Elastic Search
  { path: "/dashboard-user", component: <KanDashboard /> },
  { path: "/dashboard-useranalytics", component: <UserAnalytics /> },
  { path: "/dashboard-uservillage", component: <KanVillageDashboard /> },

  //Admin
  { path: "/state", component: <State /> },
  { path: "/district", component: <District /> },
  { path: "/region", component: <Region /> },
  { path: "/Area", component: <Area /> },
  { path: "/Branch", component: <Branch /> },
  { path: "/Sector", component: <Sector /> },
  { path: "/Unit", component: <Unit /> },
   
  { path: "/Menu", component: <Menu /> },
  { path: "/Role", component: <Role /> },
  { path: "/RoleMenu", component: <RoleMenu /> },
  { path:"/MenuRole",component:<MenuRole />},

  { path: "/OrganisationType", component: <OrganisationType /> },
  { path: "/Organisation", component: <Organisation /> },
  { path: "/OrganisationMember", component: <OrganisationMember /> },
  { path: "/UserType", component: <UserType /> },
  {path:"/UserTypeRole",component:<UserTypeRole />},

  { path: "/vappname", component: <AppnameForm /> },
  { path: "/vappcarousal", component: <CarousalTable /> },
  { path: "/vappemergencyservices", component: <EmergencyServices /> },
  { path: "/vappusers",component:<Users />},
  { path: "/vappcategory",component:<Category />},
  { path: "/vapporganizations", component:<Organizations />},
  { path: "/vappadvertisement",component:<Advertisement />},
  { path: "/vappstate",component:<VillageState />},
  { path: "/vappdistrict",component:<VillageDistrict />},
  { path: "/vapparea",component:<VillageArea/>},
  { path: "/vappbranch",component:<VillageBranch />},
  { path: "/vapporganizationmember",component:<OrganizationMember />},


  { path: "/apps-calendar", component: <Calendar /> },
  { path: "/apps-calendar-month-grid", component: <MonthGrid /> },
  { path: "/apps-ecommerce-product-details/:_id", component: <EcommerceProductDetail /> },
  { path: "/apps-ecommerce-product-details", component: <EcommerceProductDetail /> },
  { path: "/apps-ecommerce-order-details", component: <EcommerceOrderDetail /> },
  { path: "/apps-ecommerce-cart", component: <EcommerceCart /> },
  { path: "/apps-ecommerce-checkout", component: <EcommerceCheckout /> },
  { path: "/apps-ecommerce-seller-details", component: <EcommerceSellerDetail /> },
  { path: "/apps-file-manager", component: <FileManager /> },
  //Chat
  { path: "/apps-chat", component: <Chat /> },

  //Projects
  { path: "/apps-projects-list", component: <ProjectList /> },
  { path: "/apps-projects-overview", component: <ProjectOverview /> },
  { path: "/apps-projects-create", component: <CreateProject /> },

  //Task
  { path: "/apps-tasks-kanban", component: <Kanbanboard /> },


  //Api Key
  { path: "/apps-api-key", component: <APIKey /> },


  //transactions
  { path: "/apps-crypto-transactions", component: <Transactions /> },
  { path: "/apps-crypto-buy-sell", component: <BuySell /> },
  { path: "/apps-crypto-wallet", component: <MyWallet /> },
  { path: "/apps-crypto-ico", component: <ICOList /> },
  { path: "/apps-crypto-kyc", component: <KYCVerification /> },

  {
    path: "/",
    exact: true,
    component: <Navigate to="/dashboard" />,
  },
  { path: "*", component: <Navigate to="/dashboard" /> },
];

const publicRoutes: any = [
  // Authentication Page
  { path: "/logout", component: <Logout /> },
  { path: "/login", component: <Login /> },
  { path: "/forgot-password", component: <ForgetPasswordPage /> },
  { path: "/register", component: <Register /> },
];

export { authProtectedRoutes, publicRoutes };