import React from "react";
import { ModalForm, ProCard, ProTable, ProFormText, ProFormSelect, Search } from '@ant-design/pro-components';
import { notification, Button } from "antd";
import axios from "../helpers/axios";
//const URL = 'http://192.168.100.41:3010/';

export default function App() {
    const [visible, setVisible] = React.useState(false);
    const tableRef = React.useRef();

    const columns = [
        { 
            title: "Type ID",
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
                    setVisible(true);
                }}
            >
                Add Customer Type
            </Button>
            <ProTable
                columns={columns}
                actionRef={tableRef}
                //hide reset and query
                // dataSource={[
                //     {id: 1, name: "Regular", status: 1},
                //     {id: 2, name: "Silver", status: 1},
                //     {id: 3, name: "Gold", status: 1},
                //     {id: 4, name: "Platinum", status: 0},
                // ]}
                toolBarRender={false}
                search={false}
                
                request={async (params, sorter, filter) => {
                    try {
                        const res = await axios.get("api/customertype/list/v1");
                        //console.log(res.data.data);


                        return {

                            //CHECK RETURNED DATA
                            data: res.data.data, 
                            success: true,
                            total: res.data.length
                        };
                    } catch (error) {
                        notification.error({
                            message: 'Error',
                            description: 'Failed to Load Customer Types.'
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
    title="Add Customer Type"
    visible={visible}
    onVisibleChange={setVisible}
    onFinish={async (values) => {
        try {
            await axios.post("api/createcustomertype/v1", values);
            notification.success({
                message: "Success",
                description: "Customer type added successfully."
            });
            setVisible(false);
            tableRef.current.reload();
        } catch (error) {
            notification.error({
                message: "Error",
                description: "Failed to add Customer Type."
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
