import { Button, Form, Input, Drawer, message, Select } from "antd";
import { useEffect, useState } from "react";
import brandCategoryService from "../../../../service/brand_category"; 
import brandService from "../../../../service/brand";

const { Option } = Select;

const BrandCategoryDrawer = ({ open, handleClose, brandCategory, refreshData }) => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [brands, setBrands] = useState([]);

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const res = await brandService.get();
                setBrands(res?.data?.data?.brands || []);
            } catch (err) {
                console.error('Failed to fetch brands:', err);
            }
        };
        

        fetchBrands();
    }, [open]);

    useEffect(() => {
        if (brandCategory) {
            form.setFieldsValue({
                name: brandCategory.name,
                brandId: brandCategory.brandId,
            });
        } else {
            form.resetFields();
        }
    }, [brandCategory, form, open]);

    const handleSubmit = async (values) => {
        setLoading(true);

        try {
            if (brandCategory?.id) {
                await brandCategoryService.update(brandCategory.id, values);
                message.success("Brend kategoriya muvaffaqiyatli yangilandi");
            } else {
                await brandCategoryService.create(values);
                message.success("Brend kategoriya muvaffaqiyatli yaratildi");
            }
            refreshData();
            handleClose();
        } catch (error) {
            console.error(error);
            message.error("Brend kategoriya saqlashda xatolik yuz berdi");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Drawer
            title={brandCategory?.name ? "Brend Kategoriyani Yangilash" : "Brend Kategoriyani Yaratish"}
            width={720}
            onClose={handleClose}
            open={open}
            maskClosable={true}
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

                <Form.Item
                    label="Brendni tanlang"
                    name="brandId"
                    rules={[{ required: true, message: "Brendni tanlang" }]}
                >
                    <Select size="large" placeholder="Brendni tanlang">
    {brands.length > 0 ? (
        brands.map((brand) => (
            <Option key={brand.id} value={brand.id}>
                {brand.name}
            </Option>
        ))
    ) : (
        <Option disabled>No brands available</Option>
    )}
</Select>

                </Form.Item>

                <Form.Item>
                    <Button loading={loading} type="primary" htmlType="submit" size="large">
                        Saqlash
                    </Button>
                </Form.Item>
            </Form>
        </Drawer>
    );
};

export default BrandCategoryDrawer;
