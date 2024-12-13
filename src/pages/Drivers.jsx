import React from "react";
import { ModalForm, ProCard, ProTable, ProFormText, ProFormSelect, Search } from '@ant-design/pro-components';
import { notification, Button } from "antd";
import axios from "../helpers/axios";

export default function App() {
    const [visible, setVisible] = React.useState(false);
    const tableRef = React.useRef();

    const columns = [
        {
            title: "Driver ID",
            dataIndex: "id",
            key: "id",
            search: false
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            search: true
        },
        {
            title: "Id Number",
            dataIndex: "id_no",
            key: "id_no",
            search: true

        },
        {
            title: "License",
            dataIndex: "license_no",
            key: "license_no",
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
                    Add Driver
                </Button>
                <ProTable
                    columns={columns}
                    actionRef={tableRef}
                    //hide reset and query
                    // dataSource={[
                    //     {id: 1, name: "John Kinuthia", status: 1, license: "AQ12345"},
                    //     {id: 2, name: "Jane Kamau", status: 1, license: "AQ54321"},
                    //     {id: 3, name: "Jared Otieno", status: 1, license: "AQ67890"},
                    //     {id: 4, name: "Jack Oloo", status: 0, license: "AS09876"},
                    // ]
                    // }
                    toolBarRender={false}
                    //search={false}
                    request={async (params, sorter, filter) => {
                        try {
                            //console.log(params);
                            const res = await axios.get("/api/driver/list/v1", {
                                params: {
                                    ...params,
                                    sorter,
                                    filter
                                }
                            });

                            return {
                                data: res.data.data,
                                success: true,
                                total: res.data.total // Assuming the total count is in res.data.total
                            };
                        } catch (error) {
                            notification.error({
                                message: 'Error',
                                description: 'Failed to fetch Drivers.'
                            });
                            return {
                                data: [],
                                success: false
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
                title="Add Driver"
                visible={visible}
                onVisibleChange={setVisible}

                onFinish={async (values) => {
                    try {
                        //console.log(values);
                        await axios.post("/api/createdriver/v1", values);
                        notification.success({
                            message: "Success",
                            description: "Driver added successfully."
                        });
                        setVisible(false);
                        tableRef.current.reload();
                    } catch (error) {
                        notification.error({
                            message: "Error",
                            description: "Failed to add Drivers."
                        });
                    }
                }}
            >
                <ProFormText
                    name="name"
                    label="Name"
                    rules={[{ required: true, message: "Please enter the name." }]}
                />
                <ProFormText
                    name="license_no"
                    label="License"
                    rules={[{ required: true, message: "Please enter the license." }]}
                />
                <ProFormText
                    name="id_no"
                    label="ID Number"
                    rules={[
                        { required: true, message: "Please enter the status." },
                        { pattern: /^\d{9,10}$/, message: "Status should be 9 or 10 digits only." }
                    ]}
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
