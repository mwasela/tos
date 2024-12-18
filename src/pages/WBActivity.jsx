import React from "react";
import { ModalForm, ProCard, ProTable, ProFormText, ProFormSelect, Search, ProForm } from '@ant-design/pro-components';
import { notification, Button, Tabs, Flex, Row } from "antd";
import axios from "../helpers/axios";



export default function App() {
    const [visible, setVisible] = React.useState(false);
    const [form] = ProForm.useForm();
    const { TabPane } = Tabs;
    const [initialValues, setInitialValues] = React.useState({});
    const tableRef = React.useRef();
    const [activitypoint, setActivityPoint] = React.useState(0);
    const [weight, setWeight] = React.useState(0);
    const [weight1, setWeight2] = React.useState(0);
   
    const readWeight = async (record) => {
        try {
            //const res = await axios.get(`/api/orders/read/v1/${record.id}`);
            setInitialValues(record);
            setVisible(true);
            // activityLevel(record.activitycheck);
            // setActivityCheck(record.activitycheck);
        } catch (error) {
            notification.error({
                message: "Error",
                description: error.message
            });
        }
    }




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
            title: "Driver",
            dataIndex: "driver",
            key: "driver",
            search: false
        },
        {
            title: "Quantity",
            dataIndex: "measurement",
            key: "measurement",
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
        {
            title: "Action",
            dataIndex: "weight",
            key: "weight",
            search: false,
            //button to read weight
            render: (text, record) => (
                <Button
                    type="primary"
                    disabled={record.status === 0}
                    onClick={() => {
                        //navigate(`/drivers/${record.id}`);
                        readWeight(record);
                    }}
                >
                    Read Weight
                </Button>
            )
        }
    ];

    const getWeight = async () => {
        try {
            const res = await axios.get(`/api/weight/v1`,
                {
                    params: {
                        activity_point: activitypoint
                    }
                }
            );
            //console.log("---", res.data);
            setWeight(res.data.weight);
            form.setFieldsValue({ weightwb1: res.data.data.weight });
        } catch (error) {
            notification.error({
                message: "Error",
                description: error.message
            });
        }
    }

    const getWeight2 = async () => {
        try {
            const res = await axios.get(`/api/weight/v1`,
                {
                    params: {
                        activity_point: activitypoint
                    }
                }
            );
            //console.log("---", res.data);
            setWeight2(res.data.weight);
            form.setFieldsValue({ weightwb2: res.data.data.weight });
        } catch (error) {
            notification.error({
                message: "Error",
                description: error.message
            });
        }
    }

    return (
        <>


            <ProCard
                title="Delivery Activities"
            >
                <ProTable
                    columns={columns}
                    rowKey="id"
                    actionRef={tableRef}
                    //hide reset and query2
                    // dataSource={[
                    //     //sample data
                    //     { id: 1, truck: "KAQ453L", trailer: "ZC0978", driver: "Jason Murume", quantity: 100, status: 1 },
                    //     { id: 2, truck: "KDD54RQ", trailer: "ZD5642", driver: "Livingstone High", quantity: 200, status: 0 },
                    //     { id: 3, truck: "KDR672J", trailer: "ZD7659", driver: "Mgeni Jijini", quantity: 300, status: 1 },
                    // ]}
                    request={async (params, sort, filter) => {
                        const res = await axios.get("/api/deliveryorders/list/v1",
                            {
                                params: {
                                     ...params,
                                    page: params.current,
                                    limit: params.pageSize
                                }
                            }
                        );
                        //console.log("orders",res.data);
                        return {
                            data: res.data.data,
                            success: res.data.success,
                            total: res.data.data.length
                        };

                    }}
                    toolBarRender={false}
                    //search={false}


                    pagination={{
                        defaultCurrent: 1,
                        defaultPageSize: 10,
                        showSizeChanger: true
                    }}
                />
            </ProCard>

            <ModalForm
                title="Append Weight"
                visible={visible}
                form={form}
                onVisibleChange={(visible) => {
                    setVisible(visible);
                    if (!visible) {
                        form.resetFields();
                        tableRef.current.reload();
                    }
                }}
                modalProps={{
                    //if no value in weight, disable submit button
                    footer: form.getFieldValue("weight") ? null : undefined
                }}

                destroyOnClose
                onFinish={async (values) => {
                    try {
                        
                        values.activitypoint = activitypoint;
                        //console.log("values", values);                       
                        await axios.post("/api/createdeliveryactivities/v1", values);
                        setVisible(false);
                        notification.success({
                            message: "Success",
                            description: "Weight Submission Successfull."
                        });
                        tableRef.current.reload();
                    } catch (error) {
                        //console.log("error", error);
                        notification.error({
                            message: "Error",
                            description: error.message
                        });
                    }
                }}
            >
                <ProFormText
                    name="order_no"
                    label="Order ID"
                    placeholder="Enter Order ID"
                    disabled
                    initialValue={initialValues.order_number}
                />

                <ProFormText
                    name="truck"
                    label="Truck"
                    placeholder="Enter Truck"
                    disabled
                    initialValue={initialValues.truck_no}
                />
                <ProFormText
                    name="trailer"
                    label="Trailer"
                    placeholder="Enter Trailer"
                    disabled
                    initialValue={initialValues.trailler_no}
                />

                <ProFormSelect
                    name="name"
                    label="Activity Point"
                    placeholder="Select Activity Point"
                    request={async () => {
                        const res = await axios.get("/api/activitypoints/list/v1");
                        //console.log(res.data);
                        return res.data.data.map((item) => {
                            return {
                                label: item.name,
                                value: item.id
                            };
                        });
                    }}
                    onChange={(value) => {
                        setActivityPoint(value);
                    }
                    }
                />
                <ProCard split="vertical">
                    <ProCard>
                        <ProFormText
                            name="weightwb1"
                            label="First Weight"
                            placeholder="Read Weight for WB1"
                            initialValue={weight}
                            disabled={initialValues?.activitycheck === 1}
                            style={{
                                display: "none"
                            }}
                        />
                        <Button
                            type="primary"
                            title="Read Weight"
                            disabled={initialValues?.activitycheck === 1}
                            onClick={() => {
                                getWeight(activitypoint);
                            }}
                        >
                            Read Weight
                        </Button>
                    </ProCard>
                    <ProCard>
                        <ProFormText
                            name="weightwb2"
                            label="Second Weight"
                            placeholder="Read Weight for WB2"
                            initialValue={weight}
                            disabled={initialValues?.activitycheck === 0}
                            style={{
                                display: "none"
                            }}
                        />
                        <Button
                            type="primary"
                            title="Read Weight"
                            disabled={initialValues?.activitycheck === 0}
                            onClick={() => {
                                getWeight2(activitypoint);
                            }}
                        >
                            Read Weight
                        </Button>
                    </ProCard>
                </ProCard>
            </ModalForm>
        </>

    );
}
