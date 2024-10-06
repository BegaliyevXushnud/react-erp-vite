import React, { useState, useEffect } from 'react';
import { Drawer, Form, Input, Button, Upload, message } from 'antd';
import adsService from '../../../../service/ads'; // To'g'ri yo'lni ko'rsatish
// Agar sizning fayl tuzilishingiz boshqacha bo'lsa, to'g'ri yo'lni ko'rsatish uchun katalog tuzilmasiga qarang.

const AdsDrawer = ({ open, handleClose, refreshData, adItem }) => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);

    // adItem o'zgarganda formni tozalash
    useEffect(() => {
        if (adItem) {
            form.setFieldsValue({
                position: adItem.position,
            });
        } else {
            form.resetFields();
        }
        setFileList([]);
    }, [adItem, form]);

    const handleSubmit = async (values) => {
        const formData = new FormData();
        formData.append('position', values.position);
        fileList.forEach(file => {
            formData.append('image', file.originFileObj); // Yuklangan faylni qo'shish
        });

        try {
            if (adItem) {
                await adsService.update(adItem.id, formData);
                message.success("Advertisement updated successfully");
            } else {
                await adsService.create(formData);
                message.success("Advertisement created successfully");
            }
            refreshData();
            handleClose();
        } catch (error) {
            console.error("Error in submission:", error); // Xatolikni konsolga chiqarish
            message.error("Error saving advertisement");
        }
    };

    const handleFileChange = (info) => {
        if (info.fileList.length > 0) {
            setFileList(info.fileList);
        } else {
            setFileList([]);
        }
    };

    return (
        <Drawer
            title={adItem ? "Edit Advertisement" : "Add Advertisement"}
            width={720}
            onClose={handleClose}
            open={open}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={adItem ? { position: adItem.position } : {}}
            >
                <Form.Item
                    name="position"
                    label="Position"
                    rules={[{ required: true, message: 'Please input the position!' }]}
                >
                    <Input placeholder="Position" />
                </Form.Item>

                <Form.Item
                    name="image"
                    label="Image"
                    rules={[{ required: true, message: 'Please upload an image!' }]}
                >
                    <Upload
                        onChange={handleFileChange}
                        beforeUpload={() => false} // Fayl yuklashni darhol boshlamaslik
                        fileList={fileList}
                        listType="picture" // Fayl turlari ko'rsatish
                    >
                        <Button>Click to upload</Button>
                    </Upload>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        {adItem ? "Update" : "Add"}
                    </Button>
                </Form.Item>
            </Form>
        </Drawer>
    );
};

export default AdsDrawer;
