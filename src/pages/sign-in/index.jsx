import React from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input } from 'antd';
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
               
                navigate("/admin-layout");
            } else {
               console.log("xato bor");
               
            }
        } catch (err) {
            console.log(err.response?.data || err.message);
           
        }
    };

    return (
        <>
            <div className='min-h-screen flex items-center justify-center'>
                <div className='flex w-full max-w-[2440px] h-[100vh] bg-white shadow-lg'>
                    <div className='hidden lg:block w-1/2 h-full '>
                        <img src={Erplogo} alt="erplogo" className='w-full h-full object-cover' />
                    </div>
                    <div className='w-full lg:w-1/2 flex flex-col justify-center  items-center px-4 sm:px-6 lg:px-8'>
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
                                <Form.Item>
                                    <div style={{ display: 'flex', justifyContent: 'space-evently', alignItems: 'center' }}>
                                       
                                    </div>
                                </Form.Item>
                                <Form.Item className='text-[#000000c4]'>
                                    <Button block type="success" htmlType="submit" className='bg-[#d45b07] text-white p-8 text-[20px]'>
                                        Log in
                                    </Button>
                                    <div className="text-center mt-2">
                                     
                                        <a onClick={() => navigate("/sign-up")} className='text-[black] ' >Register now!</a>
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
