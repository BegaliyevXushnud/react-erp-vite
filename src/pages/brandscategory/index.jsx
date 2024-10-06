import React, { useEffect, useState, useCallback } from 'react';
import { Button, message, Input } from 'antd';
import brandCategoryService from '../../../service/brand_category';
import { useNavigate, useLocation } from 'react-router-dom';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import BrandCategoryDrawer from '../../component/modal/brandcategorymodal';
import GlobalPopconfirm from '../../component/globalpopconfirm';
import TableComponent from '../../component/global-table';

const BrandCategory = () => {
    const [data, setData] = useState([]);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [currentCategory, setCurrentCategory] = useState(null);
    const [totalCategories, setTotalCategories] = useState(0);
    const [paginationParams, setPaginationParams] = useState({
        search: '',
        page: 1,
        limit: 5,
    });

    const navigate = useNavigate();
    const { search } = useLocation();

    // Get pagination parameters from URL
    useEffect(() => {
        const urlParams = new URLSearchParams(search);
        const page = Number(urlParams.get('page')) || 1;
        const limit = Number(urlParams.get('limit')) || 5;
        const searchParam = urlParams.get("search") || "";
        setPaginationParams({ page, limit, search: searchParam });
    }, [search]);

    const fetchCategories = useCallback(async () => {
        try {
            const res = await brandCategoryService.get(paginationParams);
            setData(res?.data?.data?.brandCategories || []);
            setTotalCategories(res?.data?.data?.count || 0);
        } catch (error) {
            console.error(error);
            message.error("Error fetching categories. Please try again later.");
        }
    }, [paginationParams]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const handleDeleteCategory = async (id) => {
        try {
            await brandCategoryService.delete(id);
            message.success("Brand Category successfully deleted.");
            fetchCategories();
        } catch (error) {
            console.error(error);
            message.error("Error deleting Brand Category. Please try again.");
        }
    };

    const handleEditCategory = (item) => {
        setCurrentCategory(item);
        setOpenDrawer(true);
    };

    const handleSearchChange = (event) => {
        const newSearchValue = event.target.value;
        setPaginationParams((prev) => ({ ...prev, search: newSearchValue }));
        const searchParams = new URLSearchParams(search);
        searchParams.set("search", newSearchValue);
        navigate(`?${searchParams}`);
    };

    const handlePageChange = (pagination) => {
        const { current, pageSize } = pagination;
        setPaginationParams((prev) => ({ ...prev, page: current, limit: pageSize }));
        const currentParams = new URLSearchParams(search);
        currentParams.set('page', `${current}`);
        currentParams.set('limit', `${pageSize}`);
        navigate(`?${currentParams}`);
    };

    const handleCloseDrawer = () => {
        setOpenDrawer(false);
        setCurrentCategory(null);
    };

    const columns = [
        {
            title: '№',
            dataIndex: 'index',
            render: (text, item, index) => (paginationParams.page - 1) * paginationParams.limit + index + 1,
        },
        {
            title: 'Brand Category',
            dataIndex: 'name',
            render: (text, item) => <a onClick={() => handleEditCategory(item)}>{text}</a>,
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: (text, item) => (
                <div style={{ display: 'flex', gap: '10px' }}>
                    <Button type="link" icon={<EditOutlined />} onClick={() => handleEditCategory(item)} />
                    <GlobalPopconfirm
                        title="Are you sure you want to delete this brand?"
                        onConfirm={() => handleDeleteCategory(item.id)}
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
                    value={paginationParams.search}
                    className="search-input"
                    style={{ marginBottom: '16px' }}
                />
                <Button className="add-btn" type="primary" onClick={() => setOpenDrawer(true)}>Add New Category</Button>
            </div>
            <div className="table-container">
                <TableComponent
                    columns={columns}
                    data={data}
                    pagination={{
                        current: paginationParams.page,
                        pageSize: paginationParams.limit,
                        total: totalCategories,
                        showSizeChanger: true,
                        pageSizeOptions: ["3", "5", "7", "10", "12"],
                    }}
                    handleChange={handlePageChange}
                />
            </div>
            <BrandCategoryDrawer
                open={openDrawer}
                handleClose={handleCloseDrawer}
                brandCategory={currentCategory}
                refreshData={fetchCategories}
            />
        </div>
    );
};

export default BrandCategory;
