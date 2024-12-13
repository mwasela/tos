import React from "react";
import { ModalForm, ProCard, ProTable, ProFormText, ProFormSelect, Search } from '@ant-design/pro-components';
import { notification, Button } from "antd";
import axios from "../helpers/axios";
const API_URL = "http://localhost:3010";

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
            search: true
        },
        {
            title: "Trailer",
            dataIndex: "trailler_no",
            key: "trailer",
            search: false,
        },
        {
            title: "Tare",
            dataIndex: "tare_weight",
            key: "tare_weight",
            search: false
        },
        {
            title: "Gross",
            dataIndex: "gross_weight",
            key: "gross_weight",
            search: false
        },
        {
            title: "Net Weight",
            dataIndex: "net_weight",
            key: "net_weight",
            search: false
        },
        {
            title: "Status",
            dataIndex: "isactive",
            key: "isactive",
            search: false,
            render: (text) => {
                //completed in green
                return <span style={{ color: "green", textShadow: "0 0 3px green" }} className="active">Completed</span>
            },
        },

        {
            // print button pdf from backend using blob
            title: "Print",
            key: "print",
            valueType: "option",
            render: (text, record) => [
                <Button
                    key="print"
                    type="primary"
                    href={`${API_URL}/api/deliveryorders/print/v1?order_no=${record.order_number}`}
                    target="_blank"
                >
                    Print Gate-Pass
                </Button>
            ]
        }
    ];

    return (
        <>
            <ProCard
                title="Gate Pass"
            >

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
                    actionRef={tableRef}
                    request={async (params, sorter, filter) => {
                        try {
                            const res = await axios.get("/api/getdeliveryactivities/list/v1",
                                {
                                    params: {
                                        ...params,
                                        page: params.current,
                                        limit: params.pageSize
                                    }
                                }
                            );
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
                title="Gateout ACtivities"
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
                    label="Customer"
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
                    name="driver"
                    label="Driver"
                    showSearch={true}
                    rules={[{ required: true, message: "Please enter the driver name." }]}
                    request={async () => {
                        try {
                            const res = await axios.get("/api/driver/list/v1");
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
                    name="measurement"
                    label="Quantity"
                    rules={[{ required: true, message: "Please enter the quantity." }]}
                    type="number"
                />

            </ModalForm>
        </>

    );
}
