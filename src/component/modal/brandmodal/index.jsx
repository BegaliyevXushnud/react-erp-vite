import { Button, Form, Input, Modal, message, Upload, Select } from "antd";
import { useEffect, useState } from "react";
import brandService from "../../../../service/brand"; 
import categoryService from "../../../../service/category"; 
import { UploadOutlined } from '@ant-design/icons';

const BrandModal = ({ open, handleCancel, brand, refreshData }) => {  
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [imageUrl, setImageUrl] = useState(null);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        // Fetch categories when modal is opened
        const fetchCategories = async () => {
            try {
                const res = await categoryService.get();
                setCategories(res?.data?.data?.categories || []);
            } catch (err) {
                console.error('Failed to fetch categories:', err);
            }
        };

        if (open) fetchCategories();

        if (brand) {
            form.setFieldsValue({
                name: brand.name, 
                description: brand.description,
                category_id: brand.category_id,
            });
            setImageUrl(brand.image); 
        } else {
            form.resetFields(); 
            setImageUrl(null); 
        }
    }, [brand, form, open]);

    const handleSubmit = async (values) => {
        setLoading(true);
        
        try {
            values.image = imageUrl;

            if (brand?.id) {
                await brandService.update(brand.id, values);
                message.success("Brand updated successfully");
            } else {
                await brandService.create(values);
                message.success("Brand created successfully");
            }
            refreshData(); 
            handleCancel();
        } catch (error) {
            console.error(error);
            message.error("Failed to save brand");
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (info) => {
        if (info.file.status === 'done') {
            const url = URL.createObjectURL(info.file.originFileObj); 
            setImageUrl(url);
            message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    };

    return (
        <Modal 
            open={open} 
            title={brand?.name ? "Edit Brand" : "Create Brand"} 
            footer={null}
            onCancel={handleCancel}
        >
            <Form
                form={form}
                name="brandForm"
                style={{ width: '100%', marginTop: '20px' }}
                onFinish={handleSubmit}
                layout="vertical"
            >
                <Form.Item
                    label="Brand Name"
                    name="name"
                    rules={[{ required: true, message: "Please enter the brand name" }]}
                >
                    <Input size="large" />
                </Form.Item>

                <Form.Item
                    label="Description"
                    name="description"
                    rules={[{ required: true, message: "Please enter a description" }]}
                >
                    <Input size="large" />
                </Form.Item>

                <Form.Item
                    label="Image"
                    name="image"
                    rules={[{ required: true, message: "Please upload an image" }]}
                >
                    <Upload
                        name="image"
                        listType="picture"
                        showUploadList={false}
                        onChange={handleImageChange}
                        beforeUpload={() => false} // Disable automatic upload
                    >
                        <Button icon={<UploadOutlined />}>Upload Image</Button>
                    </Upload>
                    {imageUrl && (
                        <img 
                            src={imageUrl} 
                            alt="Uploaded" 
                            style={{ marginTop: '10px', width: '100px', height: '100px' }} 
                            
                        />
                    )}
                </Form.Item>

                <Form.Item
                    label="Category"
                    name="category_id"
                    rules={[{ required: true, message: "Please select a category" }]}
                >
                    <Select
                        size="large"
                        placeholder="Select a category"
                        options={categories.map((category) => ({
                            label: category.name,
                            value: category.id
                        }))}
                    />
                </Form.Item>

                <Form.Item>
                    <Button
                        size="large"
                        style={{ width: "100%" }}
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                    >
                        {brand?.name ? "Update" : "Add"}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default BrandModal;
