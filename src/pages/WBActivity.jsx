import React from "react";
import { ModalForm, ProCard, ProTable, ProFormText, ProFormSelect, Search, ProForm } from '@ant-design/pro-components';
import { notification, Button, Tabs, Flex, Row } from "antd";
import axios from "../helpers/axios";
import axios2 from "axios";


export default function App() {
    const [visible, setVisible] = React.useState(false);
    const [form] = ProForm.useForm();
    const { TabPane } = Tabs;
    const [initialValues, setInitialValues] = React.useState({});
    const tableRef = React.useRef();
    const [activitypoint, setActivityPoint] = React.useState(0);
    const [weight, setWeight] = React.useState(0);
    const [weight1, setWeight2] = React.useState(0);
    const [address, setAddress] = React.useState(null);
    const [activitycheck, setActivityCheck] = React.useState(0);
    const [error, setError] = React.useState(null);



    React.useEffect(() => {
        // WebSocket connection URL
        if (!address) return;
        const socket = new WebSocket(`ws://192.168.195.56:3020`);
        // Event listener for when the connection is established
        socket.onopen = () => {
            console.log("WebSocket connection established.");
        };
        // Event listener for when a message is received
        socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data); // Parse the received data
                //console.log("Received data:", data);
                // Update the state with the parsed data (weight)
                if (data.weight ) {
                    setWeight(data.weight);
                    //console.log("Activity Check", activitycheck);
                    if (activitycheck === 0) {
                        form.setFieldsValue({ weightwb1: data.weight });
                        form.setFieldsValue({ weightwb2: null });
                    } else {
                        form.setFieldsValue({ weightwb2: data.weight });
                        form.setFieldsValue({ weightwb1: null });
                    }
                } else {
                    setWeight("No weight data available");
                }
            } catch (e) {
                setError("Error parsing data");
               // console.error("Error parsing data:", e);
            }
        };
        // Event listener for WebSocket errors
        socket.onerror = (error) => {
            setError("WebSocket error occurred");
            //console.error("WebSocket error:", error);
        };
        // Event listener for when the connection is closed
        socket.onclose = () => {
            //console.log("WebSocket connection closed.");
        };
        // Clean up WebSocket connection when the component unmounts
        return () => {
            socket.close();
        };
    }, [address]);

    // React.useEffect(() => {
    //     //if (weight) return;
    //     //if (!address) return;
    //   getWeight(address);
    // }, []);

    // React.useEffect(() => {
    //     // Create a new EventSource connection to the /api/data endpoint
    //     //if (!address) return;   
    //     const eventSource = new EventSource(`http://192.168.195.56:3010/api/weight/v1?host=?${address}`);

    //     // Listen for messages from the server
    //     eventSource.onmessage = function(event) {
    //       const parsedData = JSON.parse(event.data);
    //       // Update the state with the received data
    //       console.log("parsedData", parsedData);    
    //       setWeight(parsedData);
    //     };
    //     eventSource.onerror = function() {
    //         console.error('Error with EventSource.');
    //         eventSource.close();
    //       };

    //       // Cleanup function to close the EventSource when the component unmounts
    //       return () => {
    //         eventSource.close();
    //       };
    //     }, []);


    const readWeight = async (record) => {
        try {
            //const res = await axios.get(`/api/orders/read/v1/${record.id}`);
            //console.log("record", record);
            const res = await axios.get(`/api/getwbactivity/list/v1?truck=${record.truck_no}`);

            //console.log("res", res.data);
            record.activitypoint = res.data.data[0].activitypoint;
            setAddress(res.data.data[0].address);
            setInitialValues(record);
            setVisible(true);
            //activityLevel(record.activitycheck);
            setActivityCheck(record.activitycheck);
            //console.log("activitypoint", record.activitypoint);
            streamdata(res.data.data[0].address);


            //const ret = await axios.get(`http://192.168.195.56:3010/api/weight/v1?host=${res.data.data[0].address}`);
            //console.log("ret", ret);
            //setWeight(ret.data.weight);


        } catch (error) {
            console.log("error", error);
            notification.error({
                message: "Error",
                description: error.message
            });
        }
    }

    const streamdata = async (address) => {
        try {
            //const res = await axios.get(`/api/start?host=${address}`);
            const res = await axios2.get('http://192.168.195.56:3020/startClient?host=192.168.195.56');
            //console.log("res", res);
            //startWS(address);
            setWeight(res.data.weight);
        } catch (error) {
            console.log("error", error);
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
            title: "Delivery Order No",
            dataIndex: "do_no",
            key: "do_no",
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
        // {
        //     title: "Driver",
        //     dataIndex: "driver",
        //     key: "driver",
        //     search: false
        // },
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
            render: (text, record) => {
                //if 1 render active button
                //return text === true ? <span style={{ color: "green", textShadow: "0 0 3px green" }} className="active">Active</span> : <span style={{ color: "red" }} className="inactive">Inactive</span>;
                //if 0, status  pending wb1 read if 1 pending wb2 read
                return record.activitycheck === 0 ? <span style={{ color: "blue" }} className="inactive">Pending First Weight</span> : <span style={{ color: "green" }} className="active">Pending Second Weight</span>;
            },
        },
        {
            title: "Created at",
            dataIndex: "created_at",
            key: "created_at",
            search: false,
            render: (text) => {
                return new Date(text).toLocaleString();
            }
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
                        //streamdata(record.address);
                    }}
                >
                    Read Weight
                </Button>
            )
        }
    ];

//  const getWeight = async () => {

//     try {
//         const res = await axios.post(`/api/start?host=${address}`);
//         //console.log("---", res);
//         setWeight(res.data.weight);
//         form.setFieldsValue({ weightwb1: res.data.weight });
//     } catch (error) {
//         //console.log("error", error);
//         notification.error({
//             message: "Error",
//             description: error.message
//         });
//     }
    // }

    //    const getWeight2 = async () => {
    //     try {
    //         const res = await axios.post(`/api/start?host=${address}`);
    //         //console.log("---", res);
    //         setWeight(res.data.weight);
    //         form.setFieldsValue({ weightwb2: res.data.weight });
    //     } catch (error) {
    //         //console.log("error", error);
    //         notification.error({
    //             message: "Error",
    //             description: error.message
    //         });
    //     }
    // }


    const getWeight = async () => {

            form.setFieldsValue({ weightwb1: weight });
    }

    const getWeight2 = async () => {
            form.setFieldsValue({ weightwb2: weight });
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
                    footer: form.getFieldValue("weight") ? null : undefined,
                    onCancel:  async () => {
                        //call stop api
                        const stop = await axios2.get('http://192.168.195.56:3020/stopClient?host=192.168.195.56');
                        //console.log("stop", stop);
                        setVisible(false);
                    }}
                        
                }
                onAbort={async () => {
                    //call stop api
                    const stop = await axios2.get('http://192.168.195.56:3020/stopClient?host=192.168.195.56');
                    //console.log("stop", stop);
                   // setVisible(false);
                }}

                
                destroyOnClose
                onFinish={async (values) => {
                    try {
                        setAddress(null);
                        const stop = await axios2.get('http://192.168.195.56:3020/stopClient?host=192.168.195.56');
                        
                        values.activitypoint = activitypoint;
                        //console.log("values", values);                       
                        const datas = await axios.post("/api/createdeliveryactivities/v1", values);

                        //console.log("datas", datas.data);
                        //const stop = await axios.get(`/api/start?host=${address}`);
                    
                        // if (stop.data.success === true) {
                        //     notification.success({
                        //         message: "Success",
                        //         description: "Weight Stream stopped."
                        //     });
                        // }
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

                <ProFormText
                    name="activitypoint"
                    label="Activity Point"
                    placeholder="Activity Point"
                    initialValue={initialValues.activitypoint}
                    disabled
                // request={async () => {
                //     const res = await axios.get("/api/activitypoints/list/v1");
                //     //console.log(res.data);
                //     return res.data.data.map((item) => {
                //         return {
                //             label: item.name,
                //             value: item.id
                //         };
                //     });
                // }}
                // onChange={(value) => {
                //     setActivityPoint(value);
                // }
                // }
                />
                <ProCard split="vertical">
                    <ProCard>
                        <ProFormText
                            name="weightwb1"
                            label="First Weight"
                            placeholder="Read Weight for WB1"
                            initialValue={weight}
                            disabled
                            //disabled={initialValues?.activitycheck === 1}
                            style={{
                                display: "none"
                            }}
                        />
                        <Button
                            type="primary"
                            title="Read Weight"
                            //disabled
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
                            //disabled={initialValues?.activitycheck === 0}
                            disabled
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
