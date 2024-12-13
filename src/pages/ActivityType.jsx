import React from "react";
import { ModalForm, ProCard, ProTable, ProFormText, ProFormSelect, Search } from '@ant-design/pro-components';
import { notification, Button } from "antd";
import axios from "../helpers/axios";

export default function App() {
    const [visible, setVisible] = React.useState(false);
    const tableRef = React.useRef();

    const columns = [
        { 
            title: "ID",
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
            title: "type",
            dataIndex: "type",
            key: "type",
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
        <ProCard>
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
                New Activity Point
            </Button>
            <ProTable
                columns={columns}
                actionRef={tableRef}
                //hide reset and query
                // dataSource={[

                //     {id: 1, name: "WB IN", status: 1},
                //     {id: 2, name: "WB OUT", status: 1},
                //     {id: 3, name: "WB VERIFY", status: 0},
                // ]}

                toolBarRender={false}
                search={false}
                
                request={async (params, sorter, filter) => {
                    try {
                        const res = await axios.get("/api/activitytype/list/v1");
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
                            description: 'Failed to fetch activity points.'
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
    title="Add Activity Type"
    visible={visible}
    onVisibleChange={setVisible}
    onFinish={async (values) => {
        try {
            //console.log("values", values);
            await axios.post("/api/createactivitytype/v1", values);
            notification.success({
                message: "Success",
                description: "Activity point added successfully."
            });
            setVisible(false);
            tableRef.current.reload();
        } catch (error) {
            //console.log("error--", error);
            notification.error({
                message: "Error",
                description: "Failed to add activity point."
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
        name="type"
        label="Activity type"
        rules={[{ required: true, message: "Please enter the address." }]}
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
