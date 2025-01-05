import React from 'react'
import { ProForm, ProFormText, ProFormSelect, ModalForm } from '@ant-design/pro-form';
import axios from '../helpers/axios';
import { notification, Button } from 'antd';
import ProTable from '@ant-design/pro-table';

export default function Register() {
    const [visible, setVisible] = React.useState(false);
    const [visible2, setVisible2] = React.useState(false);
    const [record, setRecord] = React.useState({});
    const tableRef = React.useRef();

    const openModal = (record) => {
        setRecord(record);
        setVisible2(true);
    };

    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
            search: false
        },
        {
            title: "First Name",
            dataIndex: "first_name",
            key: "fname",
            search: false
        },
        {
            title: "Last Name",
            dataIndex: "last_name",
            key: "surname",
            search: false
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            search: true,
            render: (text) => <span style={{ color: "green" }}>{text}</span>
        },
        {
            title: "Role",
            dataIndex: "user_type_id",
            key: "user_type_id",
            search: false,
            render: (text) => text === 1 ? 
                <span style={{ color: "green", textShadow: "0 0 3px green" }} className="active">Admin</span> 
                : <span style={{ color: "red" }} className="inactive">User</span>
        },
        {
            title: "Status",
            dataIndex: "isactive",
            key: "isactive",
            search: false,
            render: (text) => text === true ? 
                <span style={{ color: "green", textShadow: "0 0 3px green" }} className="active">Active</span> 
                : <span style={{ color: "red" }} className="inactive">Inactive</span>
        },
        {
            title: "Action",
            valueType: 'option',
            render: (text, record) => [
                <Button key="edit" type="primary" onClick={() => openModal(record)}>Edit User</Button>
            ]
        }
    ];

    return (
        <div>
            <Button
                type="primary"
                style={{
                    marginBottom: 16,
                }}
                onClick={() => setVisible(true)}
            >
                Add User
            </Button>

            <ProTable
                actionRef={tableRef}
                columns={columns}
                request={async (params) => {
                    try {
                        const response = await axios.get("/api/users/list/v1", { params });
                        //console.log(response.data);
                        return {
                            data: response.data.data,
                            success: true,
                            total: response.data.total
                        };
                    } catch (error) {
                        return { data: [], success: false };
                    }
                }}
                rowKey="id"
                pagination={{
                    defaultCurrent: 1,
                    defaultPageSize: 10,
                    showSizeChanger: true
                }}
                search={{
                    labelWidth: 'auto',
                }}
                dateFormatter="string"
                headerTitle="User List"
            />

            {/* Modal Form for Edit User */}
            <ModalForm
                key={record?.id}  // Add a key prop to force re-rendering
                title="Edit User"
                visible={visible2}
                onFinish={async (values) => {
                    try {
                        const response = await axios.put('api/updateusers/v1', values);
                        notification.success({
                            message: "Update Successful",
                            description: response.data.message,
                        });
                        setVisible2(false);
                        tableRef.current.reload();
                    } catch (error) {
                        notification.error({
                            message: "Update Failed",
                            description: error.response?.data?.message || "An error occurred",
                        });
                    }
                }}
                onVisibleChange={setVisible2}
                initialValues={{
                    id: record?.id,
                    first_name: record?.first_name,
                    last_name: record?.last_name,
                    email: record?.email,
                    user_type: record?.user_type_id ? '1' : '2',
                    isactive: record?.isactive
                }}
                submitter={{
                    searchConfig: {
                        submitText: 'Update',
                    },
                }}
            >
                <ProForm.Group>
                    <ProFormText
                        name="id"
                        label="ID"
                        hidden
                    />
                    <ProFormText
                        name="first_name"
                        label="First Name"
                        placeholder="Enter your name"
                        rules={[{ required: true, message: 'Please enter your name' }]}
                    />
                    <ProFormText
                        name="last_name"
                        label="Surname"
                        placeholder="Enter your surname"
                        rules={[{ required: true, message: 'Please enter your surname' }]}
                    />
                    <ProFormText
                        name="email"
                        label="Email"
                        placeholder="Enter your email"
                        disabled
                    />
                    <ProFormSelect
                        name="user_type"
                        label="Role"
                        placeholder="Select your role"
                        options={[
                            { value: '1', label: 'Admin' },
                            { value: '2', label: 'User' }
                        ]}
                    />
                    <ProFormSelect
                        name="isactive"
                        label="Status"
                        placeholder="Select status"
                        options={[
                            { value: true, label: 'Active' },
                            { value: false, label: 'Inactive' }
                        ]}
                    />
                    <ProFormText.Password
                        name="password"
                        label="Password"
                        placeholder="Enter your password"
                    />
                </ProForm.Group>
            </ModalForm>
        </div>
    );
}
