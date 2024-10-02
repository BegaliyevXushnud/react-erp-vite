import { Button, Form, Input, Modal, message } from "antd";
import { useEffect, useState } from "react";
import productService from "../../../../service/product"; // Adjust the import path if necessary

const ProductModal = ({ open, handleCancel, product, refreshData }) => {  
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
 
    useEffect(() => {
        if (product) {
            form.setFieldsValue({
                name: product.name,
                price: product.price, // Add other fields as necessary
            });
        } else {
            form.resetFields(); // Reset fields when opening for a new product
        }
    }, [product, form]);

    const handleSubmit = async (values) => {
        setLoading(true);
        
        try {
            if (product?.id) {
                await productService.update(product.id, values);
                message.success("Mahsulot muvaffaqiyatli yangilandi");
            } else {
                await productService.create(values);
                message.success("Mahsulot muvaffaqiyatli yaratildi");
            }
            refreshData(); 
            handleCancel();
        } catch (error) {
            console.error(error);
            message.error("Mahsulotni saqlashda xatolik yuz berdi");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal 
            open={open} 
            title={product?.name ? "Mahsulotni Yangilash" : "Yangi Mahsulot Qo'shish"} 
            footer={null}
            onCancel={handleCancel}
        >
            <Form
                form={form}
                name="productForm"
                style={{ width: '100%', marginTop: '20px' }}
                onFinish={handleSubmit}
                layout="vertical"
            >
                <Form.Item
                    label="Mahsulot Nomi"
                    name="name"
                    rules={[{ required: true, message: "Iltimos, mahsulot nomini kiriting" }]}
                >
                    <Input size="large" />
                </Form.Item>
                <Form.Item
                    label="Narx"
                    name="price"
                    rules={[{ required: true, message: "Iltimos, narxni kiriting" }]}
                >
                    <Input size="large" type="number" />
                </Form.Item>
                <Form.Item>
                    <Button
                        size="large"
                        style={{ width: "100%" }}
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                    >
                        {product?.name ? "Yangilash" : "Qo'shish"}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ProductModal;
