import React from "react";
import { ModalForm, ProCard, ProTable, ProFormText, ProFormSelect, Search, ProFormList, ProForm } from '@ant-design/pro-components';
import { notification, Button, Row, Col } from "antd";
import axios from "../helpers/axios";
import { useState } from "react";

export default function App() {
    const [visible, setVisible] = React.useState(false);
    const [visible1, setVisible1] = React.useState(false);
    const [orderType, setOrderType] = useState(null);
    const [fields, setFields] = useState([]);
    const tableRef = React.useRef();

    const handleOrderTypeChange = (value) => {
        setOrderType(value);
    };

    const columns = [
        {
            title: "Order ID",
            dataIndex: "order_number",
            key: "order_number",
            search: false
        },
        {
            title: "Truck",
            dataIndex: "truck_no",
            key: "truck",
            search: false
        },
        {
            title: "Trailer",
            dataIndex: "trailler_no",
            key: "trailer",
            search: false,
        },
        {
            title: "Product",
            dataIndex: "producttype",
            key: "producttype",
            search: false
        },
        {
            title: "Packing Type",
            dataIndex: "packingtype",
            key: "packingtype",
            search: false
        },
        {
            title: "Client",
            dataIndex: "customer",
            key: "customer",
            search: false
        },
        {
            title: "Status",
            dataIndex: "isactive",
            key: "isactive",
            search: false,
            render: (text) => {
                //if 1 render active button
                return text === true ? <span style={{ color: "green", textShadow: "0 0 3px green" }} className="active">Active</span> : <span style={{ color: "red" }} className="inactive">Inactive</span>;
            },
        },
    ];

    return (
        <>
            <ProCard
                title="Delivery Orders"
            >
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button
                        type="primary"
                        style={{
                            marginBottom: 16,
                            //align right
                            marginRight: 6,

                            //align center
                            alignItems: "right",
                        }}
                        onClick={() => {
                            //navigate("/drivers/add");
                            setVisible1(true);
                        }}
                    >
                        New  Raw Order
                    </Button>
                    <Button
                        type="primary"
                        style={{
                            marginBottom: 16,
                            //align right

                            //align center
                            alignItems: "right",
                        }}
                        onClick={() => {
                            //navigate("/drivers/add");
                            setVisible(true);
                        }}
                    >
                        New Finished Order
                    </Button>
                </div>
                <ProTable
                    columns={columns}
                    toolBarRender={false}
                    search={false}
                    actionRef={tableRef}
                    request={async (params, sorter, filter) => {
                        try {
                            const res = await axios.get("/api/deliveryorders/list/v1");
                            //console.log(res.data);


                            return {

                                //CHECK RETURNED DATA
                                data: res.data.data,
                                success: true,
                                total: res.data.length
                            };
                        } catch (error) {
                            notification.error({
                                message: 'Error',
                                description: 'Failed to fetch Orders.'
                            });
                            return {
                                data: []
                            };
                        }
                    }}
                    rowKey="id"
                    pagination={{
                        defaultCurrent: 1,
                        defaultPageSize: 10,
                        showSizeChanger: true
                    }}
                />
            </ProCard>

            <ModalForm
                title="New Finished Order"
                visible={visible}
                onVisibleChange={setVisible}
                onFinish={async (values) => {
                    try {

                        //console.log("values", values);
                        values.isactive = true;
                        await axios.post("api/createfinisheddeliveryorders/v1", values);
                        notification.success({
                            message: "Success",
                            description: "Order created successfully."
                        });
                        setVisible(false);
                        tableRef.current.reload();
                    } catch (error) {
                        notification.error({
                            message: "Error",
                            description: error.message
                        });
                    }
                }}
            >
                {/* Customer */}
                <ProFormSelect
                    name="customer_id"
                    label="Client"
                    rules={[{ required: true, message: "Please select the customer." }]}
                    showSearch={true}
                    request={async () => {
                        try {
                            const res = await axios.get("/api/customer/list/v1");
                            return res.data.data.map((item) => ({
                                label: item.name,
                                value: item.id
                            }));
                        } catch (error) {
                            return [];
                        }
                    }}
                />

                {/* Truck and Trailer */}
                <ProForm.Group>
                    <ProFormText
                        name="truck_no"
                        label="Truck"
                        rules={[{ required: true, message: "Please enter the Truck plate." }]}
                    />
                    <ProFormText
                        name="trailer_no"
                        label="Trailer"
                        // /rules={[{ required: true, message: "Please enter the trailer plate." }]}
                    />
                </ProForm.Group>

                {/* Multiple rows entry for Order Items */}
                <ProFormList
                    name="order_items"
                    label="Order Items"
                    rules={[{ required: true, message: "Please add at least one order item." }]}
                    copyIconProps={false}
                    creatorButtonProps={{
                        position: 'bottom',
                        creatorButtonText: 'Add New Row',
                    }}
                >

                    <>

                        <Row gutter={16} >
                 
                            <Col span={6}>
                                <ProFormSelect
                                    name="product"
                                    label="Product"
                                    showSearch={true}
                                    rules={[{ required: true, message: "Please select the product." }]}
                                    request={async () => {
                                        try {
                                            const res = await axios.get("/api/product/list/v1");
                                            return res.data.data.map((item) => ({
                                                label: item.name,
                                                value: item.id
                                            }));
                                        } catch (error) {
                                            return [];
                                        }
                                    }}
                                />
                            </Col>
                            <Col span={6}>

                                <ProFormSelect
                                    name="packing_type"
                                    label="Packing Type"
                                    rules={[{ required: true, message: "Please select packing type." }]}
                                    request={async () => {
                                        try {
                                            const res = await axios.get("/api/packingtype/list/v1");
                                            return res.data.data.map((item) => ({
                                                label: item.name,
                                                value: item.id
                                            }));
                                        } catch (error) {
                                            return [];
                                        }
                                    }}
                                />
                            </Col>
                            <Col span={6}>
                                <ProFormText
                                    name="unit"
                                    label="Unit"
                                    rules={[{ required: true, message: "Please select the unit." }]}
                                    type="number"
                                    request={async () => {
                                        try {
                                            const res = await axios.get("api/packing/list/v1");
                                            return res.data.data.map((item) => ({
                                                label: item.name,
                                                value: item.id
                                            }));
                                        } catch (error) {
                                            return [];
                                        }
                                    }
                                    }

                                />
                            </Col>
                            <Col span={6}>
                                <ProFormText
                                    name="quantity"
                                    label="Quantity"
                                    rules={[{ required: true, message: "Please enter the quantity." }]}
                                    type="number"
                                />
                            </Col>


                        </Row>

                    </>

                </ProFormList>
            </ModalForm>

            <ModalForm
                title="New Raw Order"
                visible={visible1}
                onVisibleChange={setVisible1}
                onFinish={async (values) => {
                    try {
                        await axios.post("/api/createdeliveryorders/v1", values);
                        notification.success({
                            message: "Success",
                            description: "Order created successfully."
                        });
                        setVisible(false);
                        tableRef.current.reload();
                    } catch (error) {
                        notification.error({
                            message: "Error",
                            description: error.message
                        });
                    }
                }}
            >
                <ProFormSelect
                    name="customer"
                    label="Client"
                    rules={[{ required: true, message: "Please select the customer." }]}
                    showSearch={true}
                    request={async () => {
                        try {
                            const res = await axios.get("/api/customer/list/v1");
                            return res.data.data.map((item) => ({
                                label: item.name,
                                value: item.id
                            }));
                        } catch (error) {
                            return [];
                        }
                    }}
                />

                <ProFormText
                    name="truck_no"
                    label="Truck"
                    rules={[{ required: true, message: "Please enter the Truck plate." }]}
                />
                <ProFormText
                    name="trailer_no"
                    label="Trailer"
                    //rules={[{ required: true, message: "Please enter the trailer plate." }]}
                />



                <ProFormSelect
                    name="product_type"
                    label="Product Type"
                    showSearch={true}
                    rules={[{ required: true, message: "Please select the product type." }]}
                    request={async () => {
                        try {
                            const res = await axios.get("/api/producttype/list/v1");
                            return res.data.data.map((item) => ({
                                label: item.name,
                                value: item.id
                            }));
                        } catch (error) {
                            return [];
                        }
                    }}
                />

                <ProFormSelect
                    name="product"
                    label="Product"
                    showSearch={true}
                    rules={[{ required: true, message: "Please select the product." }]}
                    request={async () => {
                        try {
                            const res = await axios.get("/api/product/list/v1");
                            return res.data.data.map((item) => ({
                                label: item.name,
                                value: item.id
                            }));
                        } catch (error) {
                            return [];
                        }
                    }}
                />



                <ProFormSelect
                    name="packing_type"
                    label="Packing Type"
                    rules={[{ required: true, message: "Please select packing type." }]}
                    request={async () => {
                        try {
                            const res = await axios.get("/api/packingtype/list/v1");
                            return res.data.data.map((item) => ({
                                label: item.name,
                                value: item.id
                            }));
                        } catch (error) {
                            return [];
                        }
                    }}
                />
     <ProFormSelect
                    name="vessel"
                    label="Vessel"
                    rules={[{ required: true, message: "Please select vessel." }]}
                    request={async () => {
                        try {
                            const res = await axios.get("/api/vessel/list/v1");
                            return res.data.data.map((item) => ({
                                label: item.name,
                                value: item.id
                            }));
                        } catch (error) {
                            return [];
                        }
                    }}
                />

                <ProFormText
                    name="do_no"
                    label="Delivery Order No."
                    rules={[{ required: true, message: "Please enter the delivery order no." }]}
                />




            </ModalForm>
        </>

    );
}
