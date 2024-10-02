import React, { useState, useEffect } from 'react';
import { Button, message, Input } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { productService } from '../../../service'; // Adjust the import path if necessary
import { GlobalTable } from '@component';
import ProductModal from '../../component/modal'; // Adjust the import path if necessary
import { useNavigate, useLocation } from 'react-router-dom';
import { GlobalPopconfirm } from '../../component';

const Product = () => {
    const [data, setData] = useState([]);
    const [open, setOpen] = useState(false);
    const [update, setUpdate] = useState(null);
    const [total, setTotal] = useState(0);
    const [params, setParams] = useState({
        search: '',
        page: 1,
        limit: 10,
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
            const res = await productService.get(params);
            setData(res?.data?.data?.products || []);
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
            await productService.delete(id);
            message.success("Mahsulot muvaffaqiyatli o'chirildi");
            getData();
        } catch (error) {
            console.error(error);
            message.error("Mahsulotni o'chirishda xatolik yuz berdi");
        }
    };

    const editItem = (item) => {
        setUpdate(item);
        setOpen(true);
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
            title: 'Mahsulot nomi',
            dataIndex: 'name',
            render: (text, item) => <a onClick={() => editItem(item)}>{text}</a>,
        },
        {
            title: 'Narx',
            dataIndex: 'price',
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: (text, item) => (
                <div style={{ display: 'flex', gap: '10px' }}>
                    <GlobalPopconfirm
                        title="Mahsulotni o'chirishni tasdiqlaysizmi?"
                        onConfirm={() => handleDelete(item.id)}
                    >
                        <Button type="link" danger icon={<DeleteOutlined />} />
                    </GlobalPopconfirm>
                    <Button type="link" icon={<EditOutlined />} onClick={() => editItem(item)} />
                </div>
            ),
        },
    ];

    const handleCancel = () => {
        setOpen(false);
        setUpdate(null);
    };

    const handlePageChange = (pagination) => {
        const { current = 1, pageSize = 10 } = pagination;
        setParams((prev) => ({
            ...prev,
            page: current,
            limit: pageSize,
        }));
        
        const search_params = new URLSearchParams(search);
        search_params.set("page", current);  
        search_params.set("limit", pageSize);  
        navigate(`?${search_params}`);  
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
                    className="search-input"  
                    style={{ marginBottom: '16px' }} 
                />
                <Button className="add-btn" type="primary" onClick={() => setOpen(true)}>Yangi Mahsulot Qo'shish</Button>
            </div>
            <div className="table-container">
                <GlobalTable
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
            <ProductModal
                open={open}
                handleCancel={handleCancel}
                product={update}
                refreshData={refreshData}
            />
        </div>
    );
};

export default Product;
