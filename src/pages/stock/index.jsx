import React, { useEffect, useState } from 'react';
import { Button, message, Input } from 'antd';
import stockService from '../../../service/stock';
import { useNavigate, useLocation } from 'react-router-dom';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import StockDrawer from '../../component/modal/stock-modal';
import { GlobalPopconfirm } from '../../component';
import TableComponent from '../../component/global-table';

const Stock = () => {
    const [data, setData] = useState([]);
    const [open, setOpen] = useState(false);
    const [editingStock, setEditingStock] = useState(null);
    const [total, setTotal] = useState(0);
    const [params, setParams] = useState({
        search: '',
        page: 1,
        limit: 5,
    });

    const navigate = useNavigate();
    const { search } = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(search);
        const page = Number(params.get('page')) || 1;
        const limit = Number(params.get('limit')) || 5;
        const searchParam = params.get("search") || "";
        setParams((prev) => ({
            ...prev,
            page: page,
            limit: limit,
            search: searchParam,
        }));
    }, [search]);

    const getData = async () => {
        try {
            const res = await stockService.getAll(params);
            setData(res?.data?.data?.stocks || []);
            setTotal(res?.data?.data?.count || 0);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        getData();
    }, [params]);

    const handleDelete = async (id) => {
        try {
            await stockService.delete(id);
            message.success("Stock muvaffaqiyatli o'chirildi");
            getData();
        } catch (error) {
            console.error(error);
            message.error("Stockni o'chirishda xatolik yuz berdi");
        }
    };

    const editItem = (item) => {
        setEditingStock(item);
        setOpen(true);
    };

    const handleSearchChange = (event) => {
        const value = event.target.value;
        setParams((prev) => ({
            ...prev,
            search: value,
        }));
        getData(); // Qidiruv natijalarini yangilash
    };

    const handlePageChange = (pagination) => {
        const { current, pageSize } = pagination;
        setParams((prev) => ({
            ...prev,
            page: current,
            limit: pageSize,
        }));
        const current_params = new URLSearchParams(search);
        current_params.set('page', `${current}`);
        current_params.set('limit', `${pageSize}`);
        navigate(`?${current_params}`);
    };

    const handleCancel = () => {
        setOpen(false);
        setEditingStock(null);
    };

    const columns = [
        {
            title: '№',
            dataIndex: 'index',
            render: (text, item, index) => (params.page - 1) * params.limit + index + 1,
        },
        {
            title: 'Stock name',
            dataIndex: 'name',
            render: (text, item) => <a onClick={() => editItem(item)}>{text}</a>,
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: (text, item) => (
                <div style={{ display: 'flex', gap: '10px' }}>
                    <Button type="link" icon={<EditOutlined />} onClick={() => editItem(item)} />
                    <GlobalPopconfirm
                        title="Stockni o'chirishni tasdiqlaysizmi?"
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
                <Button className="add-btn" type="primary" onClick={() => setOpen(true)}>Add New Stock</Button>
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
            <StockDrawer
                open={open}
                handleClose={handleCancel}
                stockItem={editingStock}
                refreshData={getData}
            />
        </div>
    );
};

export default Stock;
