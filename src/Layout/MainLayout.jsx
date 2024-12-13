import ProLayout from "@ant-design/pro-layout";
import gbhlIcon from "../public/bslogo.png";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { FiBriefcase, FiUsers } from "react-icons/fi";
import React, { useEffect } from "react";
import axios from "../helpers/axios";
import { AiOutlineMerge, AiOutlineTeam, AiTwotoneCar, AiOutlineSwap ,
     AiOutlineReconciliation, AiOutlineInteraction,
     AiOutlineUserAdd, AiOutlineInsertRowLeft, AiOutlinePlusSquare } from "react-icons/ai";



export default function MainLayout() {


    const [user_id, setUser_id] = React.useState(null);

    // const getUser = () => {
    //    const request =  axios.get("/user/current");
    //     request.then((response) => {
    //         setUser_id(response.data.user_.blk_unittracker_users_status);
    //         //console.log("User", response);
    //         return response;
    //     }).catch((error) => {
    //         console.log(error);
    //     });
    
    // }
    // useEffect(() => {
    //     getUser();
    // }, []);

    

    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    useEffect(() => {
        if (!token) {
            navigate("/login");
        }
    }, [token, navigate]);




    return (
    <ProLayout
            //logo={gbhlIcon}
            title="Application"
            layout="mix"
            menuDataRender={() => [
                {
                    path: "/",
                    name: "Delivery orders",
                    icon: <AiOutlineSwap  />,
                },
                {
                    path: "/WBActivity",
                    name: "Delivery Activities",
                    icon: <AiOutlineReconciliation />,
                },
                {
                    path: "/Processed",
                    name: "Processed Orders",
                    icon: <AiOutlineTeam />,
                },
                {
                    path: "/Customers",
                    name: "Customers",
                    icon: <AiOutlineUserAdd  />,
                },
                {
                    path: "/CustomerType",
                    name: "Customer Type",
                    icon: <FiBriefcase />,
                },
                {
                    path: "/Products",
                    name: "Products",
                    icon: <AiOutlineInsertRowLeft />,
                },
                {
                    path: "/ProductType",
                    name: "Product Type",
                    icon: <AiOutlinePlusSquare />,
                },
                {
                    path: "/Drivers",
                    name: "Drivers",
                    icon: <AiTwotoneCar  />,
                },
             
                {
                    path: "/ActivityPoint",
                    name: "Activity Point",
                    icon: <AiOutlineMerge />,
                },
                {
                    path: "/ActivityType",
                    name: "Activity Type",
                    icon: <AiOutlineInteraction  />,
                },
                {
                    path: "/Home",
                    name: "Users",
                    icon: <FiBriefcase />,
                },
                {
                    path: "/login",
                    name: "Logout",
                    icon: <FiUsers />,
                }
        
        
        
        
        
                // Sample Role based views
                // user_id && user_id === 1 &&  {
                //     path: "/Units",
                //     name: "Container Units",
                //     icon: <FiUsers />,
                // },
                // user_id && user_id === 1 && {
                //     path: "/Stations",
                //     name: "Station Management",
                //     icon: <FiUsers />,
                // },
        
            ]}
            menuItemRender={(item, dom) => <Link to={item.path} onClick={()=>{
                navigate(item.path);
              }}>{dom}</Link>}
            >
            <Outlet />

        </ProLayout>

    )
}
