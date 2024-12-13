import React from "react";
import { ModalForm, ProCard, ProTable, ProFormText, ProFormSelect, Search } from '@ant-design/pro-components';
import { notification, Button } from "antd";
import axios from "../helpers/axios";

export default function App() {
    const [visible, setVisible] = React.useState(false);
    const tableRef = React.useRef();

    const columns = [
        { 
            title: "Product ID",
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
                    //navigate("/drivers/add");
                    setVisible(true);
                }}
            >
                Add Product Type
            </Button>
            <ProTable
                columns={columns}
                actionRef={tableRef}
                //hide reset and query
                // dataSource={[
                //     {id: 1, name: "Product 1", status: 1},
                //     {id: 2, name: "Product 2", status: 1},
                //     {id: 3, name: "Product 3", status: 1},
                //     {id: 4, name: "Product 4", status: 0},
                // ]}
                toolBarRender={false}
                search={false}
                
                request={async (params, sorter, filter) => {
                    try {
                        const res = await axios.get("/api/producttype/list/v1");
                        //console.log("ptypes", res.data);


                        return {

                            //CHECK RETURNED DATA
                            data: res.data.data, 
                            success: true,
                            total: res.data.length
                        };
                    } catch (error) {
                        notification.error({
                            message: 'Error',
                            description: 'Failed to fetch Products.'
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
    title="Add Product Type"
    visible={visible}
    onVisibleChange={setVisible}
    onFinish={async (values) => {
        try {
            await axios.post("/api/createproducttype/v1", values);
            notification.success({
                message: "Success",
                description: "Product added successfully."
            });
            setVisible(false);
            //CLEAR MODAL FORM
            tableRef.current.reload();

        } catch (error) {
            //console.log("error--", error);
            notification.error({
                message: "Error",
                description: "Failed to add product."
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
