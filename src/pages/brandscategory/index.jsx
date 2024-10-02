import React, { useState, useEffect } from 'react';
import { Button, message, Input } from 'antd';
import  brand_category  from '../../../service/brand_category'; // Adjust the import path accordingly
import { useNavigate, useLocation } from 'react-router-dom';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import BrandCategoryModal from '../../component/modal/brandcategorymodal'; // Adjust the import path accordingly
import { GlobalPopconfirm } from '../../component';
import TableComponent from '../../component/global-table'; // Use your TableComponent


const BrandCategory = () => {
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
        const queryParams = new URLSearchParams(search);
        let page = Number(queryParams.get("page")) || 1;
        let limit = Number(queryParams.get("limit")) || 10;
        let search_val = queryParams.get("search") || '';
        setParams((prev) => ({
            ...prev,
            page: page,
            limit: limit,
            search: search_val,
        }));
    }, [search]);

    const getData = async () => {
        try {
            const res = await brand_category.get(params);
            setData(res?.data?.data?.brandCategories || []);
            setTotal(res?.data?.data?.total || 0);
        } catch (err) {
            console.error(err);
            message.error("Error fetching data");
        }
    };

    useEffect(() => {
        getData();
    }, [params]);

    const handleDelete = async (id) => {
        try {
            await brand_category.delete(id);
            message.success("Brand category deleted successfully");
            getData();
        } catch (error) {
            console.error(error);
            message.error("Error deleting brand category");
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
            title: 'Brand category name',
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
                        title="Are you sure to delete this brand category?"
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
                <Button className="add-btn" type="primary" onClick={() => setOpen(true)}>Add New Brand Category</Button>
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
                        pageSizeOptions: ["5", "10", "15", "20"],
                    }}
                    handleChange={handlePageChange}
                />
            </div>
            <BrandCategoryModal
                open={open}
                handleCancel={handleCancel}
                brandCategory={update}
                refreshData={refreshData}
            />
        </div>
    );
};

export default BrandCategory;
