import ProLayout from "@ant-design/pro-layout";
import gbhlIcon from "../public/bslogo.png";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { FiBriefcase, FiUsers } from "react-icons/fi";
import React, { useEffect, useState } from "react";
import axios from "../helpers/axios";
import {
    AiOutlineMerge, AiTwotoneCar, AiOutlineSwap,
    AiOutlineReconciliation, AiOutlineTeam, AiOutlineUserAdd,
    AiOutlineInsertRowLeft, AiOutlinePlusSquare, AiOutlineUser
} from "react-icons/ai";
import { Avatar, Dropdown, Menu } from "antd";

export default function MainLayout() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const [user, setUser] = useState(null);
    const avatarUrl = "https://avatars.dicebear.com/api/avataaars/1234.svg";


    // Manage the openKeys state for controlling which submenu is open
    const [openKeys, setOpenKeys] = useState([]);

    // Get current user information
    useEffect(() => {
        currentuser();
       setUser({
            first_name: "Admin",
            last_name: "User",
            user_type_id: 1,
        });
    }, []);

    const currentuser = async () => {
        try {
            const response = await axios.get("/api/currentuser/v1");
            console.log("user", response);
            setUser(response.data.data[0]);
        } catch (error) {
            console.log("error", error);
        }
    };

    // Control which menus are open, allowing only one to be open at a time
    const handleOpenChange = (keys) => {
        setOpenKeys(keys);
    };

    useEffect(() => {
        if (!token) {
            navigate("/login");
        }
    }, [token, navigate]);

    // Create dropdown menu for user actions (e.g., logout)
    const menu = (
        <Menu>
            <Menu.Item key="logout">
                <Link to="/login">Logout</Link>
            </Menu.Item>
        </Menu>
    );

    return (
        <ProLayout
            title="Application"
            layout="mix"
            openKeys={openKeys} // Add openKeys to control expanded menus
            onOpenChange={handleOpenChange} // Handle menu open/close state
            menuDataRender={() => [
                {
                    path: "/",
                    name: "Delivery orders",
                    icon: <AiOutlineSwap />,
                },
                {
                    path: "/wbactivity",
                    name: "Delivery Activities",
                    icon: <AiOutlineReconciliation />,
                },
                {
                    path: "/processed",
                    name: "Processed Orders",
                    icon: <AiOutlineTeam />,
                },
                user && user.user_type_id === 1 && {
                    name: "Masters",
                    path: "/masters",
                    icon: <FiBriefcase />,
                    children: [
                        {
                            path: "/masters/customers",
                            name: "Customers",
                            icon: <AiOutlineUserAdd />,
                        },
                        {
                            path: "/masters/customertype",
                            name: "Customer Type",
                            icon: <FiBriefcase />,
                        },
                        {
                            path: "/masters/products",
                            name: "Products",
                            icon: <AiOutlineInsertRowLeft />,
                        },
                        {
                            path: "/masters/producttype",
                            name: "Product Type",
                            icon: <AiOutlinePlusSquare />,
                        },
                        {
                            path: "/masters/packing",
                            name: "Packing",
                            icon: <AiOutlineMerge />,
                        },
                        {
                            path: "/masters/packingtype",
                            name: "Packing Type",
                            icon: <AiOutlineMerge />,
                        },
                        {
                            path: "/masters/vessel",
                            name: "Vessel",
                            icon: <AiOutlineMerge />,
                        },
                        {
                            path: "/masters/drivers",
                            name: "Drivers",
                            icon: <AiTwotoneCar />,
                        },
                        {
                            path: "/masters/home",  
                            name: "Users",
                            icon: <AiOutlineUser />,
                        }
                    ],
                },
                {
                    path: "/login",
                    name: "Logout",
                    icon: <FiUsers />,
                },
            ]}
            subMenuItemRender={(item, dom) => (
                item.children ? (
                    <span>{dom}</span>
                ) : (
                    <Link to={item.path}>{dom}</Link>
                )
            )}
            menuItemRender={(item, dom) => (
                item.children ? (
                    <span>{dom}</span>
                ) : (
                    <Link to={item.path} onClick={() => navigate(item.path)}>
                        {dom}
                    </Link>
                )
            )}
            rightContentRender={() => (
                <div style={{ display: "flex", alignItems: "center" }}>
                    {user && (
                        <>
                            <Avatar
                                style={{ backgroundColor: '#87d068', marginRight: 8 }}
                                src= {AiOutlineUser}  // Replace with user avatar if available
                            >
                                {user.first_name[0] + user.last_name[0].toUpperCase()}
                            </Avatar>
                            <Dropdown overlay={menu}>
                                <span style={{ cursor: 'pointer', color: '#000' }}>
                                    {user.name}
                                </span>
                            </Dropdown>
                        </>
                    )}
                </div>
            )}
        >
            <Outlet />
        </ProLayout>
    );
}
