import { Button, Form, Input, Modal, message } from "antd";
import { useEffect, useState } from "react";
import brandCategoryService from "../../../../service/brand_category"; // Import pathni to'g'rilash

const BrandCategoryModal = ({ open, handleCancel, brandCategory, refreshData }) => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        if (brandCategory) {
            form.setFieldsValue({
                name: brandCategory.name,
            });
        } else {
            form.resetFields(); // Yangi brend kategoriya ochilsa maydonlarni tozalash
        }
    }, [brandCategory, form]);

    const handleSubmit = async (values) => {
        setLoading(true);
        
        try {
            if (brandCategory?.id) {
                // Brend kategoriyani yangilash
                await brandCategoryService.update(brandCategory.id, values);
                message.success("Brend kategoriya muvaffaqiyatli yangilandi");
            } else {
                // Brend kategoriya yaratish
                await brandCategoryService.create(values);
                message.success("Brend kategoriya muvaffaqiyatli yaratildi");
            }
            refreshData(); // Yaratish/yangi yangilashdan keyin ma'lumotni yangilash
            handleCancel();
        } catch (error) {
            console.error(error);
            message.error("Brend kategoriya saqlashda xatolik yuz berdi");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal 
            open={open} 
            title={brandCategory?.name ? "Brend Kategoriyani Yangilash" : "Brend Kategoriyani Yaratish"} 
            footer={null}
            onCancel={handleCancel}
        >
            <Form
                form={form}
                name="brandCategoryForm"
                style={{ width: '100%', marginTop: '20px' }}
                onFinish={handleSubmit}
                layout="vertical"
            >
                <Form.Item
                    label="Brend Kategoriya Nomi"
                    name="name"
                    rules={[{ required: true, message: "Brend kategoriya nomini kiriting" }]}
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
                        {brandCategory?.name ? "Yangilash" : "Qo'shish"}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default BrandCategoryModal;
