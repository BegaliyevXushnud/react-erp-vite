// SubCategoryModal.js
import { Button, Form, Input, Modal, message } from "antd";
import { useEffect, useState } from "react";
import subCategoryService from "../../../../service/sub_category"; // Adjust your import path accordingly

const SubCategoryModal = ({ open, handleCancel, subCategory, refreshData }) => {  
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        if (subCategory) {
            form.setFieldsValue({
                name: subCategory.name,
            });
        } else {
            form.resetFields(); // Reset fields when opening for a new sub-category
        }
    }, [subCategory, form]);

    const handleSubmit = async (values) => {
        setLoading(true);
        
        try {
            if (subCategory?.id) {
                // Update sub-category
                await subCategoryService.update(subCategory.id, values);
                message.success("Sub-category updated successfully");
            } else {
                // Create sub-category
                await subCategoryService.create(values);
                message.success("Sub-category created successfully");
            }
            refreshData(); // Refresh data after create/update
            handleCancel();
        } catch (error) {
            console.error(error);
            message.error("Failed to save sub-category");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal 
            open={open} 
            title={subCategory?.name ? "Edit Sub-category" : "Create Sub-category"} 
            footer={null}
            onCancel={handleCancel}
        >
            <Form
                form={form}
                name="subCategoryForm"
                style={{ width: '100%', marginTop: '20px' }}
                onFinish={handleSubmit}
                layout="vertical"
            >
                <Form.Item
                    label="Sub-category Name"
                    name="name"
                    rules={[{ required: true, message: "Please enter the sub-category name" }]}
                >
                    <Input size="large" />
                </Form.Item>

                <Form.Item>
                    <Button
                        size="large"
                        style={{ width: "100%" }}
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                    >
                        {subCategory?.name ? "Update" : "Add"}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default SubCategoryModal;
