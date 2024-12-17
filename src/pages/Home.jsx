import React from 'react'
import { ProForm, ProFormText, LoginForm, ProFormSelect, ModalForm } from '@ant-design/pro-form';
import axios from '../helpers/axios';
import { notification, Button } from 'antd';
import ProTable from '@ant-design/pro-table';



export default function Register() {

    const [visible, setVisible] = React.useState(false);
    const tableRef = React.useRef();
    const [visible2, setVisible2] = React.useState(false);

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
            title: "last_name",
            dataIndex: "last_name",
            key: "surname",
            search: false
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            search: true,
            //render as green text
            render: (text) => <span style={{ color: "green" }}>{text}</span>

        },
        {
            title: "Role",
            dataIndex: "user_type_id",
            key: "user_type_id",
            search: false,
            render: (text) => {
                //if 1 render active button
                return text === 1 ? <span style={{ color: "green", textShadow: "0 0 3px green" }} className="active">Admin</span> : <span style={{ color: "red" }} className="inactive">User</span>;
            }

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
            //action to edit users, load the user data to the form
            title: "Action",
            valueType: 'option',
            render: (text, record) => [
                <Button
                    key="edit"
                    type="primary"
                    onClick={() => {
                        setVisible2(true);
                    }}
                >
                    Edit User
                </Button>,

                <ModalForm
                    title="Edit User"
                    
                    visible={visible2}
                    onFinish={async (values) => {
                        //console.log("userv", values);
                        try {
                            const response = await axios.put('api/updateusers/v1', values);
                            //console.log("res", response);
                            notification.success({
                                message: "Update Successful",
                                description: response.data.message,
                            });
                            setVisible2(false);
                            tableRef.current.reload();
                            // navigation("/login", { replace: true });
                        } catch (error) {
                            //console.log(error);
                            notification.error({
                                message: "Update Failed",
                                description: error.response?.data?.message || "An error occurred",
                            });
                        }
                    }}
                    submitter={{
                        searchConfig: {
                            submitText: 'Update',
                        },
                    }}
                    //destroyOnClose
                    onVisibleChange={setVisible2}
                >
                    <ProForm.Group>
                        <ProFormText
                            name="id"
                            label="ID"
                            placeholder="Enter your ID"
                            initialValue={record.id}
                            hidden
                        />
                        <ProFormText
                            name="first_name"
                            label="First Name"
                            placeholder="Enter your name"
                            initialValue={record.first_name}
                        />
                        <ProFormText
                            name="last_name"
                            label="Surname"
                            placeholder="Enter your surname"
                            initialValue={record.last_name}
                        />
                        <ProFormText
                            name="email"
                            label="Email"
                            disabled
                            placeholder="Enter your email"
                            initialValue={record.email}
                        />
                        <ProFormSelect
                            name="user_type"
                            label="Role"
                            placeholder="Select your role"
                            options={[
                                {
                                    value: '1',
                                    label: 'Admin',
                                },
                                {
                                    value: '2',
                                    label: 'User',
                                },
                            ]}
                            initialValue={record.user_type_id ? '1' : '2'}
                        />
                        <ProFormSelect
                            name="isactive"
                            label="Status"
                            placeholder="Select your role"
                            options={[
                                {
                                    value: true,
                                    label: 'Active',
                                },
                                {
                                    value: false,
                                    label: 'Inactive',
                                },
                            ]}
                            initialValue={record.isactive ? true : false}
                        />
                        <ProFormText.Password

                            name="password"
                            label="Password"
                            type="password"
                            placeholder="Enter your password"

                        />
                    </ProForm.Group>
                </ModalForm>,
            ]

        }
    ];

    return (
        <div>
            <Button
                type="primary"
                style={{
                    marginBottom: 16,
                    //align right
                }}
                onClick={() => {
                    setVisible(true);
                }}
            >
                Add User
            </Button>

            <ModalForm
                visible={visible}
                onVisibleChange={setVisible}
                submitter={false}
                width={500}
            // onFinish={async (values) => {
            //     try {
            //         const response = await axios.post("/users", values);
            //         notification.success({
            //             message: "User Created",
            //             description: response.data.message
            //         });
            //         tableRef.current.reload();
            //     } catch (error) {
            //         console.log(error);
            //         notification.error({
            //             message: "Failed to create user",
            //             description: error.response?.data?.message || "An error occurred"
            //         });
            //     }
            // }}
            >

                <LoginForm

                    onFinish={async (values) => {
                        //console.log("userv", values);
                        try {
                            const response = await axios.post('api/createusers/v1', values);
                           // console.log("res", response);
                            notification.success({
                                message: "Registration Successful",
                                description: response.data.message,
                            });
                            setVisible(false);
                            // navigation("/login", { replace: true });
                            tableRef.current.reload();
                        } catch (error) {
                            //console.log(error);
                            notification.error({
                                message: "Registration Failed",
                                description: error.response?.data?.message || "An error occurred",
                            });
                        }
                    }}

                    submitter={{
                        searchConfig: {
                            submitText: 'Register',
                        },
                    }}
                >

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
                        rules={[{ required: true, message: 'Please enter your email' }]}

                    />
                    <ProFormSelect
                        name="user_type"
                        label="Role"
                        placeholder="Select your role"
                        options={[
                            {
                                value: '1',
                                label: 'Admin',
                            },
                            {
                                value: '2',
                                label: 'User',
                            },
                        ]}
                        rules={[{ required: true, message: 'Please select your role' }]}

                    />

                    <ProFormSelect
                        name="isactive"
                        label="Status"
                        placeholder="Select your role"
                        options={[
                            {
                                value: true,
                                label: 'Active',
                            },
                            {
                                value: false,
                                label: 'User',
                            },
                        ]}
                        rules={[{ required: true, message: 'Please select your role' }]}

                    />


                    <ProFormText.Password
                        name="password"
                        label="Password"
                        type="password"

                        placeholder="Enter your password"
                        rules={[{ required: true, message: 'Please enter your password' }]}
                    />
                    {/* 
        <ProFormText.Password
          name="confirm"
          label="Confirm Password"
          type="password"
          placeholder="Confirm your password"
          rules={[{ required: true, message: 'Please confirm your password' }]}
        /> */}


                </LoginForm>
            </ModalForm>
            <ProTable
                actionRef={tableRef}
                columns={columns}
                request={async (params) => {
                    try {
                        const response = await axios.get("/api/users/list/v1", { params });
                        return {
                            data: response.data.data,
                            success: true,
                            total: response.data.total
                        };
                    } catch (error) {
                        //console.log(error);
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
                search={{
                    labelWidth: 'auto',
                }}
                dateFormatter="string"
                headerTitle="User List"

            />
        </div>
    )
}
