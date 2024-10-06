import { Button, Form, Input, Modal, message, Upload, Select } from "antd";
import { useEffect, useState } from "react";
import brandService from "../../../../service/brand"; 
import categoryService from "../../../../service/category"; 
import { UploadOutlined } from '@ant-design/icons';

const BrandModal = ({ open, handleCancel, brand, refreshData }) => {  
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [imageFile, setImageFile] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await categoryService.get();
                setCategories(res?.data?.data?.categories || []);
            } catch (err) {
                console.error('Failed to fetch categories:', err);
            }
        };

        if (open) {
            fetchCategories();
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
        }
    }, [brand, form, open]);

    const handleSubmit = async (values) => {
        setLoading(true);
        
        try {
            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("description", values.description);
            formData.append("category_id", values.category_id);

            // Handle image upload
            if (imageFile) {
                formData.append("file", imageFile);
            }

            if (brand?.id) {
                await brandService.update(brand.id, formData);
                message.success("Brand updated successfully");
            } else {
                await brandService.create(formData);
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
            setImageFile(info.file.originFileObj);
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
                layout="vertical"
                onFinish={handleSubmit}
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
                    rules={[{ required: true, message: "Please upload an image" }]}
                >
                    <Upload
                        name="file"
                        listType="picture"
                        showUploadList={false}
                        onChange={handleImageChange}
                        beforeUpload={() => false}
                    >
                        <Button icon={<UploadOutlined />}>Upload Image</Button>
                    </Upload>
                    {imageUrl && <img src={imageUrl} alt="Brand" style={{ width: "100px", marginTop: "10px" }} />}
                </Form.Item>

                <Form.Item
                    label="Category"
                    name="category_id"
                    rules={[{ required: true, message: "Please select a category" }]}
                >
                    <Select placeholder="Select category" size="large">
                        {categories.map((category) => (
                            <Select.Option key={category.id} value={category.id}>
                                {category.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        {brand?.id ? "Update" : "Create"}
                    </Button>
                    <Button style={{ marginLeft: 8 }} onClick={handleCancel}>
                        Cancel
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default BrandModal;
