
1.paginationda kamchilik bor 
2.toolpit qo'shish kere
3.img brandsda img chiqarish kere
<!-- 4.logout qo'shish kere -->
<!-- 5.modalda brand bo'lish kere -->
6.setting bo'lishi kere
<!-- 7.sign-in va sign-upda nofication ker -->
<!-- 8.ads, stock qilish kerak -->
<!-- 9.product modal to'g'rilash  -->
 7. search global qilish kerak 
 8.token bilan ishlash kere


 import React, { useEffect, useState } from 'react';
import { Button, message, Input } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import brandCategoryService from '../../../service/brand_category';
import { useNavigate, useLocation } from 'react-router-dom';
import BrandCategoryDrawer from '../../component/modal/brandcategorymodal';
import GlobalPopconfirm from '../../component/GlobalPopconfirm';
import GlobalTable from '../../component/global-table';

const BrandCategory = () => {
    const [data, setData] = useState([]);
    const [open, setOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [total, setTotal] = useState(0);
    const [params, setParams] = useState({
        search: '',
        page: 1,
        limit: 10,
    });

    const navigate = useNavigate();
    const { search } = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(search);
        const page = Number(queryParams.get("page")) || 1;
        const limit = Number(queryParams.get("limit")) || 10;
        const searchValue = queryParams.get("search") || '';
        setParams((prev) => ({
            ...prev,
            page,
            limit,
            search: searchValue,
        }));
    }, [search]);

    const fetchCategories = async () => {
        try {
            const res = await brandCategoryService.get(params);
            setData(res?.data?.data?.brandCategories || []);
            setTotal(res?.data?.data?.total || 0);
        } catch (err) {
            console.error(err);
            message.error("Data olishda xatolik yuz berdi");
        }
    };

    useEffect(() => {
        fetchCategories();
    }, [params]);

    const handleDelete = async (id) => {
        try {
            await brandCategoryService.delete(id);
            message.success("Brend kategoriya muvaffaqiyatli o'chirildi");
            fetchCategories();
        } catch (error) {
            console.error(error);
            message.error("Brend kategoriya o'chirishda xatolik yuz berdi");
        }
    };

    const editItem = (item) => {
        setEditingCategory(item);
        setOpen(true);
    };

    const handleSearchChange = (event) => {
        const searchValue = event.target.value;
        setParams((prev) => ({
            ...prev,
            search: searchValue,
        }));

        const search_params = new URLSearchParams(search);
        search_params.set("search", searchValue);
        navigate(`?${search_params}`);
    };

    const handlePageChange = (pagination) => {
        const { current, pageSize } = pagination;
        setParams((prev) => ({
            ...prev,
            page: current,
            limit: pageSize,
        }));

        const current_params = new URLSearchParams(search);
        current_params.set('page', current);
        current_params.set('limit', pageSize);
        navigate(`?${current_params}`);
    };

    const handleCancel = () => {
        setOpen(false);
        setEditingCategory(null);
    };

    const columns = [
        {
            title: '№',
            dataIndex: 'index',
            render: (text, item, index) => (params.page - 1) * params.limit + index + 1,
        },
        {
            title: 'Brend Kategoriya Nomi',
            dataIndex: 'name',
            render: (text, item) => <a onClick={() => editItem(item)}>{text}</a>,
        },
        {
            title: 'Harakat',
            dataIndex: 'action',
            render: (text, item) => (
                <div style={{ display: 'flex', gap: '10px' }}>
                    <Button type="link" icon={<EditOutlined />} onClick={() => editItem(item)} />
                    <GlobalPopconfirm
                        title="Brend kategoriya o'chirishni xohlaysizmi?"
                        onConfirm={() => handleDelete(item.id)}
                    >
                        <Button type="link" danger icon={<DeleteOutlined />} />
                    </GlobalPopconfirm>
                </div>
            ),
        },
    ];

    return (
        <div>
            <div className="header-container">
                <Input
                    placeholder="Qidirish..."
                    onChange={handleSearchChange}
                    value={params.search}
                    className="search-input"
                    style={{ marginBottom: '16px' }}
                />
                <Button className="add-btn" type="primary" onClick={() => setOpen(true)}>Yangi Brend Kategoriyasini Qo'shish</Button>
            </div>
            <div className="table-container">
                <GlobalTable
                    columns={columns}
                    data={data}
                    pagination={{
                        current: params.page,
                        pageSize: params.limit,
                        total,
                        showSizeChanger: true,
                        pageSizeOptions: ["5", "10", "15", "20"],
                    }}
                    handleChange={handlePageChange}
                />
            </div>
            <BrandCategoryDrawer
                open={open}
                handleClose={handleCancel}
                brandCategory={editingCategory}
                refreshData={fetchCategories}
            />
        </div>
    );
};

export default BrandCategory;
