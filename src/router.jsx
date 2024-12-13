import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./Layout/MainLayout";
import Login from "./pages/auth/Login";
import { Layout } from "antd";
import Home from "./pages/Home";
import ActivityPoint from "./pages/ActivityPoint";
import Products from "./pages/Products";
import Customers from "./pages/Customers";
import WBActivity from "./pages/WBActivity";
import Drivers from "./pages/Drivers";
import CustomerType from "./pages/CustomerType";
import Delivery from "./pages/Delivery";
import ProductType from "./pages/ProductType";
import ActivityType from "./pages/ActivityType";
import Processed from "./pages/Processed";
import { FiBriefcase, FiUsers } from "react-icons/fi";



const router = createBrowserRouter([

    {
      path: "/",
    //loader: () => import("./Layout/MainLayout"),
      element: <MainLayout />,
      children: [
        
        {path: "/", element: <Delivery /> },
        {path: "/Customers", element: <Customers />},
        {path: "/Products", element: <Products />},
        {path: "/Drivers", element: <Drivers />},
        {path: "/CustomerType", element: <CustomerType />},
        {path: "/ActivityPoint", element: <ActivityPoint />},
        {path: "/Delivery", element: <Delivery />},
        {path: "/WBActivity", element: <WBActivity />},
        {path: "/ProductType", element: <ProductType />},
        {path: "/ActivityType", element: <ActivityType />},
        {path: "/Processed", element: <Processed />},
        {path: "/Home", element: <Home />},
       

   
      ],
    },

    {path: "/Login", element: <Layout><Login /></Layout>},

  ]);
  

  export default router;