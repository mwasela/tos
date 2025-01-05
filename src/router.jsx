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
import Packing from "./pages/Packing";
import PackingType from "./pages/PackingType";
import { FiBriefcase, FiUsers } from "react-icons/fi";
import Vessel from "./pages/Vessel";



const router = createBrowserRouter([

    {
      path: "/",
    //loader: () => import("./Layout/MainLayout"),
      element: <MainLayout />,
      children: [
        
        {path: "/", element: <Delivery /> },
        {path: "/masters/customers", element: <Customers />},
        {path: "/masters/products", element: <Products />},
        {path: "/masters/drivers", element: <Drivers />},
        {path: "/masters/customerType", element: <CustomerType />},
        {path: "/masters/activitypoint", element: <ActivityPoint />},
        {path: "/delivery", element: <Delivery />},
        {path: "/wbActivity", element: <WBActivity />},
        {path: "/masters/producttype", element: <ProductType />},
        {path: "/masters/activitytype", element: <ActivityType />},
        {path: "/processed", element: <Processed />},
        {path: "/masters/home", element: <Home />},
        {path: "/masters/packing", element: <Packing />},
        {path: "/masters/packingtype", element: <PackingType />},
        {path: "/masters/vessel", element: <Vessel />},
       

   
      ],
    },

    {path: "/Login", element: <Layout><Login /></Layout>},

  ]);
  

  export default router;