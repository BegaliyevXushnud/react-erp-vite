// SubCategory.js
import React, { useState, useEffect } from 'react';
import { Button, message, Table, Input } from 'antd';
import { sub_category } from '../../../../service'; // Adjust your import path accordingly
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'; 
import SubCategoryModal from '../../../component/modal/sub_category'; // Adjust the import path as necessary
import { GlobalPopconfirm } from '../../../component'; 

const SubCategory = () => {
    const {id} = useParams()
    const [data, setData] = useState([]);
    const [open, setOpen] = useState(false);
    const [update, setUpdate] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [searchTerm, setSearchTerm] = useState(''); 
    
    const navigate = useNavigate();
    const { search } = useLocation();

    const getQueryParams = () => {
        const params = new URLSearchParams(search);
        const page = params.get('page') ? parseInt(params.get('page')) : 1;
        const limit = params.get('limit') ? parseInt(params.get('limit')) : 10; // Change default limit to 10
        return { page, limit };
    };

    const getData = async (page = 1, limit = 10, search = '') => {
        try {
            const res = await sub_category.get(id);
            setData(res?.data?.data?.subCategories || []);
            setTotalItems(res?.data?.data?.total || 0);
        } catch (err) {
            console.error(err);
            message.error("Data fetching error occurred");
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
            getData(page, limit, searchTerm);
        }
    }, [navigate, search, searchTerm]);

    const handleDelete = async (id) => {
        try {
            await sub_category.delete(id);
            message.success("Sub-category muvaffaqiyatli o'chirildi");
            getData(currentPage, pageSize, searchTerm);
        } catch (error) {
            console.error(error);
            message.error("Sub-categoryni o'chirishda xatolik yuz berdi");
        }
    };

    const editItem = (item) => {
        setUpdate(item);
        setOpen(true);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
        const current_params = new URLSearchParams(search);
        current_params.set('search', e.target.value);
        navigate(`?${current_params}`);
        getData(1, pageSize, e.target.value);
    };

    const columns = [
        {
            title: '№',
            dataIndex: 'index',
            render: (text, item, index) => (currentPage - 1) * pageSize + index + 1,
        },
        {
            title: 'Sub-category name',
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
                        title="Sub-categoryni o'chirishni tasdiqlaysizmi?"
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
        getData(page, pageSize, searchTerm);
    };

    const refreshData = () => {
        getData(currentPage, pageSize, searchTerm);
    };

    return (
        <div>
            <div className="header-container">
                <Input
                    placeholder="Search..."
                    onChange={handleSearchChange}
                    style={{ marginBottom: '16px', width: '300px' }} 
                />
                <Button className="add-btn" type="primary" onClick={() => setOpen(true)}>Add New Sub-category</Button>
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
            
            <SubCategoryModal
                open={open}
                handleCancel={handleCancel}
                subCategory={update}
                refreshData={refreshData}
            />
        </div>
    );
};

export default SubCategory;
