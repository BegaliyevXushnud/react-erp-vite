
import React, { useState, useEffect } from 'react';
import { Button, message, Table, Input } from 'antd';
import { category } from '../../../service';
import { useNavigate, useLocation } from 'react-router-dom';
import { EditOutlined, DeleteOutlined, UnorderedListOutlined } from '@ant-design/icons'; // Import new icon
import CategoryModal from '@modals';
import { GlobalPopconfirm } from '../../component'; // Adjust the import path as necessary
import './index.css';

const Category = () => {
    const [data, setData] = useState([]);
    const [open, setOpen] = useState(false);
    const [update, setUpdate] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [searchTerm, setSearchTerm] = useState(''); // New state for search term

    const navigate = useNavigate();
    const { search } = useLocation();

    const getQueryParams = () => {
        const params = new URLSearchParams(search);
        const page = params.get('page') ? parseInt(params.get('page')) : 1;
        const limit = params.get('limit') ? parseInt(params.get('limit')) : 5;
        return { page, limit };
    };

    const getData = async (page = 1, limit = 10, search = '') => {
        try {
            const res = await category.get({
                params: { 
                    page, 
                    limit,
                    search, // Include the search term in the request
                },
            });
            setData(res?.data?.data?.categories || []);
            setTotalItems(res?.data?.data?.total || 0);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        const access_token = localStorage.getItem('access_token');
        if (!access_token) {
            console.error("Access token topilmadi! Bosh sahifaga yo'naltirilmoqda...");
            navigate("/");
        } else {
            const { page, limit } = getQueryParams();
            setCurrentPage(page);
            setPageSize(limit);
            getData(page, limit, searchTerm); // Fetch data with search term
        }
    }, [navigate, search, searchTerm]); // Added searchTerm to dependency array

    const handleDelete = async (id) => {
        try {
            await category.delete(id);
            message.success("Category muvaffaqiyatli o'chirildi");
            getData(currentPage, pageSize, searchTerm); // Refresh data with search term
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
        // Navigate to the sub-category page with the category ID
        navigate(`/admin-layout/category/sub-category/${item.id}`); // Updated route to include item.id
    };
    
    
    
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to first page on search
        const current_params = new URLSearchParams(search);
        current_params.set('search', e.target.value);
        navigate(`?${current_params}`);
        getData(1, pageSize, e.target.value); // Fetch data with new search term
    };

    const columns = [
        {
            title: '№',
            dataIndex: 'index',
            render: (text, item, index) => (currentPage - 1) * pageSize + index + 1,
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

    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
        const current_params = new URLSearchParams(search);
        current_params.set('page', `${page}`);
        current_params.set('limit', `${pageSize}`);
        navigate(`?${current_params}`);
        getData(page, pageSize, searchTerm); // Fetch data with search term
    };

    const refreshData = () => {
        getData(currentPage, pageSize, searchTerm); // Fetch data with search term
    };

    return (
        <div>
            <div className="header-container">
                <Input
                    placeholder="Search..."
                    onChange={handleSearchChange}
                    style={{ marginBottom: '16px', width: '300px' }} // Adjust width as necessary
                />
                <Button className="add-btn" type="primary" onClick={() => setOpen(true)}>Add New Category</Button>
            </div>
            <Table
                columns={columns}
                dataSource={data}
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: totalItems,
                    onChange: handlePageChange,
                    showSizeChanger: true,
                    pageSizeOptions: [2, 5, 7, 10],
                }}
                rowKey={(item) => item.id}
            />
            
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