import React from "react";
import { ModalForm, ProCard, ProTable, ProFormText, ProFormSelect, Search } from '@ant-design/pro-components';
import { notification, Button } from "antd";
import axios from "../helpers/axios";

export default function App() {
    const [visible, setVisible] = React.useState(false);
    const tableRef = React.useRef();


    const columns = [
        {
            title: "Customer ID",
            dataIndex: "id",
            key: "id",
            search: false
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            search: false
        },
        {
            title: "Type",
            dataIndex: "packing_type",
            key: "packing_type",
            search: false,

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
            <ProCard>
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
                    Add Packing
                </Button>
                <ProTable
                    columns={columns}
                    actionRef={tableRef}
                    //hide reset and query
                    // dataSource={[
                    //     {id: 1, name: "Customer 1", type: "Regular", status: 1},
                    //     {id: 2, name: "Customer 2", type: "Silver", status: 1},
                    //     {id: 3, name: "Customer 3", type: "Gold", status: 1},
                    //     {id: 4, name: "Customer 4", type: "Platinum", status: 0},
                    // ]}
                    toolBarRender={false}
                    search={false}

                    request={async (params, sorter, filter) => {
                        try {
                            const res = await axios.get("api/packing/list/v1");
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
                                description: 'Failed to fetch Customers.'
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
                title="Add Packing"
                visible={visible}
                onVisibleChange={setVisible}
                onFinish={async (values) => {
                    try {
                        await axios.post("api/createpacking/v1", values);
                        notification.success({
                            message: "Success",
                            description: "Packing added successfully."
                        });
                        setVisible(false);
                        tableRef.current.reload();
                    } catch (error) {
                        //console.log("error--", error);
                        notification.error({
                            message: "Error",
                            description: "Failed to add packing."
                        });
                    }
                }}
            >
                <ProFormText
                    name="name"
                    label="Name"
                    rules={[{ required: true, message: "Please enter the name." }]}
                />
                <ProFormSelect
                    name="packing_type"
                    label="Packing Type"
                    request={async () => {
                        try {
                            const res = await axios.get("/api/packingtype/list/v1");
                            //console.log(res.data);

                            return res.data.data.map((option) => ({
                                label:
                                    option.name,
                                value: option.id,

                            }));

                            // return {
                            //     success: true,
                            //     data: res.data.data.map(item => ({ label: item.name, value: item.id })),
                            //     total: res.data.length
                            // };
                            return [];
                        } catch (error) {
                           
                            notification.error({
                                message: "Error",
                                description: "Failed to fetch packing types."
                            });
                            return {
                                success: false,
                                data: []
                            };
                        }
                    }}
                    rules={[{ required: true, message: "Please select the packing type." }]}
                />
                <ProFormSelect
                    name="isactive"
                    label="Status"
                    options={[
                        { label: "Active", value: true },
                        { label: "Inactive", value: false }
                    ]}
                    rules={[{ required: true, message: "Please select the status." }]}
                />
            </ModalForm>
        </>

    );
}
