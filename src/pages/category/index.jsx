import React, { useState, useEffect } from 'react';
import { Button, message, Input } from 'antd';
import { category } from '../../../service';
import { useNavigate, useLocation } from 'react-router-dom';
import { EditOutlined, DeleteOutlined, UnorderedListOutlined } from '@ant-design/icons';
import CategoryModal from '@modals';
import { GlobalPopconfirm } from '../../component';
import TableComponent from '../../component/global-table'; // Use your TableComponent
import './index.css';

const Category = () => {
    const [data, setData] = useState([]);
    const [open, setOpen] = useState(false);
    const [update, setUpdate] = useState(null);
    const [total, setTotal] = useState(0);
    const [params, setParams] = useState({
        search: '',
        page: 3,
        limit: 3,
    });

    const navigate = useNavigate();
    const { search } = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(search);
        let page = Number(params.get("page")) || 3;
        let limit = Number(params.get("limit")) || 3;
        let search_val = params.get("search") || '';
        setParams((prev) => ({
            ...prev,
            page: page,
            limit: limit,
            search: search_val,
        }));
    }, [search]);

    const getData = async () => {
        try {
            const res = await category.get(params);
            setData(res?.data?.data?.categories || []);
            setTotal(res?.data?.data?.total || 0);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        getData();
    }, [params]);

    const handleDelete = async (id) => {
        try {
            await category.delete(id);
            message.success("Category muvaffaqiyatli o'chirildi");
            getData();
        } catch (error) {
            console.error(error);
            message.error("Categoryni o'chirishda xatolik yuz berdi");
        }
    };

    const editItem = (item) => {
        setUpdate(item);
        setOpen(true);
    };

    const navigateToSubCategory = (item) => {
        navigate(`/admin-layout/category/sub-category/${item.id}`);
    };

    const handleSearchChange = (event) => {
        setParams((prev) => ({
            ...prev,
            search: event.target.value,
        }));
        const search_params = new URLSearchParams(search);
        search_params.set("search", event.target.value);
        navigate(`?${search_params}`);
    };

    const columns = [
        {
            title: '№',
            dataIndex: 'index',
            render: (text, item, index) => (params.page - 1) * params.limit + index + 1,
        },
        {
            title: 'Category name',
            dataIndex: 'name',
            render: (text, item) => <a onClick={() => editItem(item)}>{text}</a>,
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: (text, item) => (
                <div style={{ display: 'flex', gap: '10px' }}>
                    <Button type="link" icon={<UnorderedListOutlined />} onClick={() => navigateToSubCategory(item)} />
                    <Button type="link" icon={<EditOutlined />} onClick={() => editItem(item)} />
                    <GlobalPopconfirm
                        title="Categoryni o'chirishni tasdiqlaysizmi?"
                        onConfirm={() => handleDelete(item.id)}
                    >
                        <Button type="link" danger icon={<DeleteOutlined />} />
                    </GlobalPopconfirm>
                </div>
            ),
        },
    ];

    const handleCancel = () => {
        setOpen(false);
        setUpdate(null);
    };

    const handlePageChange = (pagination) => {
        const { current =  3, pageSize = 10 } = pagination;

        setParams((prev) => ({
            ...prev,
            page: current,
            limit: pageSize,
        }));
        
        const search_params = new URLSearchParams(search);
        search_params.set("page", current);  // Sahifa raqamini yangilash
        search_params.set("limit", pageSize);  // Limitni yangilash
        navigate(`?${search_params}`);  // URL ni yangilab, sahifani qayta yuklash
    };

    const refreshData = () => {
        getData();
    };

    return (
        <div>
            <div className="header-container">
                <Input
                    placeholder="Search..."
                    onChange={handleSearchChange}
                    value={params.search}
                    className="search-input"  // Kenglik uchun class qo'shish
                    style={{ marginBottom: '16px' }} // Mobil qurilmalardagi margin
                />
                <Button className="add-btn" type="primary" onClick={() => setOpen(true)}>Add New Category</Button>
            </div>
            <div className="table-container">
                <TableComponent
                    columns={columns}
                    data={data}
                    pagination={{
                        current: params.page,
                        pageSize: params.limit,
                        total: total,
                        showSizeChanger: true,
                        pageSizeOptions: ["3", "5", "7", "10", "12"],
                    }}
                    handleChange={handlePageChange}
                />
            </div>
            <CategoryModal
                open={open}
                handleCancel={handleCancel}
                category={update}
                refreshData={refreshData}
            />
        </div>
    );
};

export default Category;
