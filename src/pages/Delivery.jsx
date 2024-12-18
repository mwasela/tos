import React from "react";
import { ModalForm, ProCard, ProTable, ProFormText, ProFormSelect, Search } from '@ant-design/pro-components';
import { notification, Button } from "antd";
import axios from "../helpers/axios";

export default function App() {
    const [visible, setVisible] = React.useState(false);
    const tableRef = React.useRef();

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
            dataIndex: "product_id",
            key: "product_id",
            search: false
        },
        {
            title: "Packing Type",
            dataIndex: "packing_type_id",
            key: "packing_type_id",
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
                return text === true ? <span  style={{color: "green", textShadow: "0 0 3px green"}}  className="active">Active</span> : <span   style={{color: "red"}} className="inactive">Inactive</span>;
            },
        },
    ];

    return (
        <>
        <ProCard
            title="Delivery Orders"
        >
            <Button 
                type="primary"
                style={{ marginBottom: 16,
                    //align right
                    
                    //align center
                    alignItems: "right",
                 }}
                onClick={() => {
                    //navigate("/drivers/add");
                    setVisible(true);
                }}
            >
                New Order
            </Button>
            <ProTable
                columns={columns}
                //hide reset and query
                // dataSource={[
                //     { id: 1, truck: "KAQ453L", trailer: "ZC0978", driver: "Jason Murume", quantity: 100, status: 1 },
                //     { id: 2, truck: "KDD54RQ", trailer: "ZD5642", driver: "Livingstone High", quantity: 200, status: 1 },
                //     { id: 3, truck: "KAS472A", trailer: "ZD6651", driver: "Alan Mgenge", quantity: 300, status: 1 },
                //     { id: 4, truck: "KDR672J", trailer: "ZD7659", driver: "Mgeni Jijini", quantity: 300, status: 0 },

                // ]}
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
    title="New Order"
    visible={visible}
    onVisibleChange={setVisible}
    onFinish={async (values) => {
        try {
            //console.log("values", values);
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
                return res.data.data.map((item) => {
                    return {
                        label: item.name,
                        value: item.id
                    };
                });
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
        rules={[{ required: true, message: "Please enter the trailer plate." }]}
    />
    <ProFormSelect
        name="producttype"
        label="Product Type"
        showSearch={true}
        rules={[{ required: true, message: "Please enter the driver name." }]}
        request={async () => {
            try {
                const res = await axios.get("/api/producttype/list/v1");
                return res.data.data.map((item) => {
                    return {
                        label: item.name,
                        value: item.id
                    };
                });
            } catch (error) {
                return [];
            }
        }}
    />
    <ProFormSelect
        name="packing_type_id"
        label="Packing Type"
        rules={[{ required: true, message: "Please select packing type." }]}
        request={async () => {
            try {

                const res = await axios.get("/api/packingtype/list/v1");
                return res.data.data.map((item) => {
                    return {
                        label: item.name,
                        value: item.id
                    };
                });
            } catch (error) {
                return [];
            }
        }}
    />

</ModalForm>
</>
    
    );
}
