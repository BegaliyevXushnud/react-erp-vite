import React, { useEffect, useState, useCallback } from 'react';
import { Button, message, Input } from 'antd';
import { brandService } from '../../../service'; 
import { useNavigate, useLocation } from 'react-router-dom';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import BrandModal from '../../component/modal/brandmodal';
import { GlobalPopconfirm } from '../../component';
import TableComponent from '../../component/global-table';

const Brand= () => {
    const [data, setData] = useState([]);
    const [open, setOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [total, setTotal] = useState(0);
    const [params, setParams] = useState({
        search: '',
        page: 1,
        limit: 5,
    });

    const navigate = useNavigate();
    const { search } = useLocation();

    // URL dan paramsni olish
    useEffect(() => {
        const urlParams = new URLSearchParams(search);
        const page = Number(urlParams.get('page')) || 1;
        const limit = Number(urlParams.get('limit')) || 5;
        const searchParam = urlParams.get("search") || "";
        setParams((prev) => ({
            ...prev,
            page: page,
            limit: limit,
            search: searchParam,
        }));
    }, [search]);

    const getData = useCallback(async () => {
        try {
            const res = await brandService.get(params);
            setData(res?.data?.data?.brands || []);
            setTotal(res?.data?.data?.count || 0);
        } catch (err) {
            console.error(err);
        }
    }, [params]);

    useEffect(() => {
        getData();
    }, [getData]);

    const handleDelete = async (id) => {
        try {
            await brandService.delete(id);
            message.success("Brand muvaffaqiyatli o'chirildi");
            getData();
        } catch (error) {
            console.error(error);
            message.error("Brand o'chirishda xatolik yuz berdi");
        }
    };

    const editItem = (item) => {
        setEditingCategory(item);
        setOpen(true);
    };

    const handleSearchChange = (event) => {
        const newSearchValue = event.target.value;
        setParams((prev) => ({
            ...prev,
            search: newSearchValue,
        }));
        const searchParams = new URLSearchParams(search);
        searchParams.set("search", newSearchValue);
        navigate(`?${searchParams}`);
    };

    const handlePageChange = (pagination) => {
        const { current, pageSize } = pagination;
        setParams((prev) => ({
            ...prev,
            page: current,
            limit: pageSize,
        }));
        const currentParams = new URLSearchParams(search);
        currentParams.set('page', `${current}`);
        currentParams.set('limit', `${pageSize}`);
        navigate(`?${currentParams}`);
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
            title: 'Brand Name',
            dataIndex: 'name',
            render: (text, item) => <a onClick={() => editItem(item)}>{text}</a>,
        },
        {
            title: 'Image',
            dataIndex: 'image',
            render: (text) => (
                <img src={text} alt="Brand" style={{ width: '50px', height: '50px' }} />
            ),
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: (text, item) => (
                <div style={{ display: 'flex', gap: '10px' }}>
                    <Button type="link" icon={<EditOutlined />} onClick={() => editItem(item)} />
                    <GlobalPopconfirm
                        title="Brandi o'chirishni tasdiqlaysizmi?"
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
                    placeholder="Search..."
                    onChange={handleSearchChange}
                    value={params.search}
                    className="search-input"
                    style={{ marginBottom: '16px' }}
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
            <BrandModal
                open={open}
                handleCancel={handleCancel}
                category={editingCategory}
                refreshData={getData} 
            />
        </div>
    );
};

export default Brand;
