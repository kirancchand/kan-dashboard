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