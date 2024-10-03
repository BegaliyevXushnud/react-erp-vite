import React from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, notification } from 'antd';
import Erplogo from "../../assets/erplogo.jpg";
import { useNavigate } from 'react-router-dom';
import { auth } from '../../../service';

const SignIn = () => {
    const navigate = useNavigate();
    const initialValues = {
        phone_number: "",
        password: "",
    };

    const handleSubmit = async (values) => {
        console.log(values);  

        try {
            const response = await auth.sign_in(values)

            if (response.status === 200 || response.status === 201) {
                const access_token = response?.data?.data?.tokens?.access_token;
                console.log("Access token:", access_token);
                localStorage.setItem("access_token", access_token);
                notification.success({
                    message: 'Login Successful',
                    description: 'You have successfully logged in.',
                });
                navigate("/admin-layout");
            } else {
               notification.error({
                   message: 'Login Failed',
                   description: 'An error occurred during login.',
               });
            }
        } catch (err) {
            console.log(err.response?.data || err.message);
            notification.error({
                message: 'Login Failed',
                description: err.response?.data?.message || 'An unexpected error occurred.',
            });
        }
    };

    return (
        <>
            <div className='flex items-center justify-center min-h-screen'>
                <div className='flex w-full max-w-[2440px] h-[100vh] bg-white shadow-lg'>
                    <div className='hidden w-1/2 h-full lg:block '>
                        <img src={Erplogo} alt="erplogo" className='object-cover w-full h-full' />
                    </div>
                    <div className='flex flex-col items-center justify-center w-full px-4 lg:w-1/2 sm:px-6 lg:px-8'>
                        <div className='w-full max-w-[460px] flex flex-col gap-1'>
                            <h1 className='font-semibold text-[40px] mb-8'>Login</h1>
                            <Form
                                name="login"
                                initialValues={initialValues}
                                onFinish={handleSubmit}
                                className='flex flex-col gap-0'
                            >
                                <Form.Item
                                    name="phone_number"
                                    rules={[{ required: true, message: 'Please input your Phone number!' }]}
                                >
                                    <Input prefix={<UserOutlined className='text-[17px] text-[grey]' />} placeholder="+998 99 006 06 06" className='w-full h-[55px]' />
                                </Form.Item>
                                <Form.Item
                                    name="password"
                                    rules={[{ required: true, message: 'Please input your Password!' }]}
                                >
                                    <Input prefix={<LockOutlined className='text-[17px] text-[grey]' />} type="password" placeholder="Password" className='w-full h-[55px]' />
                                </Form.Item>
                                <Form.Item className='text-[#000000c4]'>
                                    <Button block type="success" htmlType="submit" className='bg-[#d45b07] text-white p-8 text-[20px]'>
                                        Log in
                                    </Button>
                                    <div className="mt-2 text-center">
                                        <a onClick={() => navigate("/sign-up")} className='text-[black]'>Register now!</a>
                                    </div>
                                </Form.Item>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SignIn;
