import { Button, Form, Input, Drawer, message, Upload, Select, Image } from "antd";
import { useEffect, useState } from "react";
import productService from "../../../../service/product";
import categoryService from "../../../../service/category";
import brandService from "../../../../service/brand";
import brandCategoryService from "../../../../service/brand_category";
import { UploadOutlined, PlusOutlined } from '@ant-design/icons';

const getBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
});

const ProductDrawer = ({ open, handleClose, product, refreshData }) => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [imageFile, setImageFile] = useState(null)
    const [imageUrl, setImageUrl] = useState(null);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [brandCategories, setBrandCategories] = useState([]);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState([]);

    // Fetch data on component mount and when the drawer is opened
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

        const fetchBrandCategories = async () => {
            try {
                const res = await brandCategoryService.get();
                setBrandCategories(res?.data?.data?.brandCategories || []);
            } catch (err) {
                console.error('Failed to fetch brand categories:', err);
            }
        };

        if (open) {
            fetchCategories();
            fetchBrands();
            fetchBrandCategories();

            if (product) {
                form.setFieldsValue({
                    name: product.name,
                    price: product.price,
                    category_id: product.category_id,
                    brand_id: product.brand_id,
                    brandcategory_id: product.brandcategory_id,
                });
                setImageUrl(product.image);
                setFileList([{
                    uid: '-1',
                    name: product.name,
                    status: 'done',
                    url: product.image,
                }]);
            } else {
                form.resetFields();
                setImageUrl(null);
                setFileList([]);
            }
        }
    }, [product, form, open]);

    
    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("price", values.price);
            formData.append("category_id", values.category_id);
            formData.append("brand_id", values.brand_id);
            formData.append("brandcategory_id", values.brandcategory_id);
            
            if (imageFile) {
                formData.append("file", values.file.file);
            }

            if (product?.id) {
                await productService.update(product.id, formData);
                message.success("Product updated successfully");
            } else {
                await productService.create(formData);
                message.success("Product created successfully");
            }
            refreshData();
            handleClose(); // Close the drawer
        } catch (error) {
            console.error(error);
            message.error("Failed to save product");
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = async ({ fileList: newFileList }) => {
        setFileList(newFileList);
        if (newFileList.length > 0 && newFileList[0].originFileObj) {
            const base64 = await getBase64(newFileList[0].originFileObj);
            setImageFile(newFileList[0].originFileObj);
            setImageUrl(base64);
        }
    };

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
    };

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    return (
        <Drawer 
            title={product?.name ? "Update Product" : "Add Product"} 
            width={720} 
            onClose={handleClose} 
            open={open}
            maskClosable={true} // Allow closing the drawer by clicking outside
        >
            <Form
                form={form}
                name="productForm"
                layout="vertical"
                onFinish={handleSubmit}
            >
                <Form.Item
                    label="Product Name"
                    name="name"
                    rules={[{ required: true, message: "Please enter the product name" }]}
                >
                    <Input size="large" />
                </Form.Item>

                <Form.Item
                    label="Price"
                    name="price"
                    rules={[{ required: true, message: "Please enter the price" }]}
                >
                    <Input size="large" type="number" />
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
                    label="Brand Category"
                    name="brandcategory_id"
                    rules={[{ required: true, message: "Please select a brand category" }]}
                >
                    <Select
                        size="large"
                        placeholder="Select a brand category"
                        options={brandCategories.map(brandCategory => ({
                            label: brandCategory.name,
                            value: brandCategory.id
                        }))}
                    />
                </Form.Item>

                <Form.Item label="Image">
                <Upload
                    beforeUpload={()=>false}
                    action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                    listType="picture"
                >
                    <Button type="primary" icon={<UploadOutlined />}>
                        Upload
                    </Button>
                </Upload>
                </Form.Item>

                <Form.Item>
                    <Button
                        size="large"
                        style={{ width: "100%" }}
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                    >
                        {product?.name ? "Update" : "Add"}
                    </Button>
                </Form.Item>
            </Form>
        </Drawer>
    );
};

export default ProductDrawer;
