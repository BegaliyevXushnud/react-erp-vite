import React from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, notification } from 'antd';
import Erplogo from "../../assets/erplogo.jpg";
import { useNavigate } from 'react-router-dom';
import { auth } from '../../../service';

const SignUp = () => {
    const navigate = useNavigate();

    const initialValues = {
        first_name: "",
        last_name: "",
        phone_number: "",
        email: "",
        password: "",
    };

    const handleSubmit = async (values) => {
        console.log(values); 
        try {
            const response = await auth.sign_up(values);
            if (response.status === 201) {
                notification.success({
                    message: 'Registration Successful',
                    description: 'You have successfully registered.',
                });
                navigate("/");
            }
        } catch (error) {
            console.log(error.response); 
            notification.error({
                message: 'Registration Failed',
                description: error.response?.data?.message || 'An unexpected error occurred.',
            });
        }
    };
    
    const onFinish = (values) => {
        console.log('Received values of form: ', values);
        handleSubmit(values); 
    };

    return (
        <>
            <div className='flex items-center justify-center min-h-screen'>
                <div className='flex w-full max-w-[2440px] h-[100vh] bg-white shadow-lg'>
                    <div className='hidden w-1/2 h-full lg:block'>
                        <img src={Erplogo} alt="erplogo" className='object-cover w-full h-full' />
                    </div>
                    <div className='flex flex-col items-center justify-center w-full px-4 lg:w-1/2 sm:px-6 lg:px-8'>
                        <div className='w-full max-w-[460px]'>
                            <h1 className='font-semibold text-[40px] mb-8'>Register</h1>
                            <Form
                                name="register"
                                initialValues={initialValues}
                                onFinish={onFinish} 
                            >
                                <Form.Item
                                    name="first_name"
                                    className='font-[28px]'
                                    rules={[{ required: true, message: 'Please input your first name!' }]}
                                >
                                    <Input
                                        prefix={<UserOutlined className='text-[17px] text-[grey]' />}
                                        placeholder="First Name"
                                        className='w-full h-[50px]'
                                        type="text"
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="last_name"
                                    className='font-[28px]'
                                    rules={[{ required: true, message: 'Please input your last name!' }]}
                                >
                                    <Input
                                        prefix={<UserOutlined className='text-[17px] text-[grey]' />}
                                        placeholder="Last Name"
                                        className='w-full h-[50px]'
                                        type="text"
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="phone_number"
                                    className='font-[28px]'
                                    rules={[{ required: true, message: 'Please input your phone number!' }]}
                                >
                                    <Input
                                        prefix={<UserOutlined className='text-[17px] text-[grey]' />}
                                        placeholder="+998 90 021 06 06"
                                        className='w-full h-[50px]'
                                        type="tel"
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="email"
                                    className='font-[28px]'
                                    rules={[{ required: true, message: 'Please input your email!' }]}
                                >
                                    <Input
                                        prefix={<UserOutlined className='text-[17px] text-[grey]' />}
                                        placeholder="admin07@gmail.com"
                                        className='w-full h-[50px]'
                                        type="email"
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="password"
                                    className='font-[28px]'
                                    rules={[{ required: true, message: 'Please input your password!' }]}
                                >
                                    <Input
                                        prefix={<LockOutlined className='text-[17px] text-[grey]' />}
                                        placeholder="Password"
                                        className='w-full h-[50px]'
                                        type="password"
                                    />
                                </Form.Item>

                                <Form.Item className='text-[#000000c4]'>
                                    <Button block type="success" htmlType="submit" className='bg-[#d45b07] text-white p-8 text-[17px]'>
                                        Register
                                    </Button>
                                    <div className="p-2 mt-2 text-center">
                                        Do you have an account 
                                        <a onClick={() => navigate("/")} className='text-[black]'>Login</a>
                                    </div>
                                </Form.Item>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SignUp;
