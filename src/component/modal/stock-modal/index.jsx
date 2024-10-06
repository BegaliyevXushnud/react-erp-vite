import { Button, Form, Input, Drawer, message, Select } from "antd";
import { useEffect, useState } from "react";
import stockService from "../../../../service/stock"; // Stock service
import categoryService from "../../../../service/category";
import brandService from "../../../../service/brand";
import productService from "../../../../service/product";

const StockDrawer = ({ open, handleClose, stock, refreshData }) => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await categoryService.get();
                setCategories(res?.data?.data?.categories || []);
            } catch (err) {
                console.error('Failed to fetch categories:', err);
            }
        };

        const fetchBrands = async () => {
            try {
                const res = await brandService.get();
                setBrands(res?.data?.data?.brands || []);
            } catch (err) {
                console.error('Failed to fetch brands:', err);
            }
        };

        const fetchProducts = async () => {
            try {
                const res = await productService.get();
                setProducts(res?.data?.data?.products || []);
            } catch (err) {
                console.error('Failed to fetch products:', err);
            }
        };

        if (open) {
            fetchCategories();
            fetchBrands();
            fetchProducts();

            // Only set fields if stock exists
            if (stock) {
                form.setFieldsValue({
                    product_id: stock.product_id.id,
                    category_id: stock.category_id.id,
                    brand_id: stock.brand_id,
                    quantity: stock.quantity,
                });
            } else {
                form.resetFields();
            }
        }
    }, [stock, form, open]);

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("product_id", values.product_id);
            formData.append("category_id", values.category_id);
            formData.append("brand_id", values.brand_id);
            formData.append("quantity", values.quantity);

            if (stock?.id) {
                await stockService.update(stock.id, formData); // Update existing stock
                message.success("Stock updated successfully");
            } else {
                await stockService.create(formData); // Create new stock
                message.success("Stock created successfully");
            }
            refreshData();
            handleClose(); // Close drawer
        } catch (error) {
            console.error(error);
            message.error("Failed to save stock");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Drawer 
            title={stock?.id ? "Update Stock" : "Add Stock"} 
            width={720} 
            onClose={handleClose} 
            open={open}
            maskClosable={true} 
        >
            <Form
                form={form}
                name="stockForm"
                layout="vertical"
                onFinish={handleSubmit}
            >
                <Form.Item
                    label="Product"
                    name="product_id"
                    rules={[{ required: true, message: "Please select a product" }]}
                >
                    <Select
                        size="large"
                        placeholder="Select a product"
                        options={products.map(product => ({
                            label: product.name,
                            value: product.id
                        }))}
                    />
                </Form.Item>

                <Form.Item
                    label="Category"
                    name="category_id"
                    rules={[{ required: true, message: "Please select a category" }]}
                >
                    <Select
                        size="large"
                        placeholder="Select a category"
                        options={categories.map(category => ({
                            label: category.name,
                            value: category.id
                        }))}
                    />
                </Form.Item>

                <Form.Item
                    label="Brand"
                    name="brand_id"
                    rules={[{ required: true, message: "Please select a brand" }]}
                >
                    <Select
                        size="large"
                        placeholder="Select a brand"
                        options={brands.map(brand => ({
                            label: brand.name,
                            value: brand.id
                        }))}
                    />
                </Form.Item>

                <Form.Item
                    label="Quantity"
                    name="quantity"
                    rules={[{ required: true, message: "Please enter the stock quantity" }]}
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
                        {stock?.id ? "Update" : "Add"}
                    </Button>
                </Form.Item>
            </Form>
        </Drawer>
    );
};

export default StockDrawer;
