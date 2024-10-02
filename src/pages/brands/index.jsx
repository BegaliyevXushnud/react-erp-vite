import React, { useState, useEffect } from 'react';
import { Button, message, Input } from 'antd';
import { brandService } from '../../../service'; 
import { useNavigate, useLocation } from 'react-router-dom';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import BrandModal from '../../component/modal/brandmodal';
import { GlobalPopconfirm } from '../../component';
import TableComponent from '../../component/global-table'; // Sizning TableComponent


const Brand = () => {
    const [data, setData] = useState([]);
    const [open, setOpen] = useState(false);
    const [update, setUpdate] = useState(null);
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
        let page = Number(params.get("page")) || 1;
        let limit = Number(params.get("limit")) || 5;
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
            const res = await brandService.get(params);  // Params o'rniga `params` ni uzating
            setData(res?.data?.data?.brands || []);
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
            await brandService.delete(id);
            message.success("Brand muvaffaqiyatli o'chirildi");
            getData();
        } catch (error) {
            console.error(error);
            message.error("Brandni o'chirishda xatolik yuz berdi");
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
                        title="Brandni o'chirishni tasdiqlaysizmi?"
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
        const { current = 1, pageSize = 5 } = pagination;

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
                <Button className="add-btn" type="primary" onClick={() => setOpen(true)}>Add New Brand</Button>
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
                        pageSizeOptions: ["5", "10", "15"],
                    }}
                    handleChange={handlePageChange}
                />
            </div>
            <BrandModal
                open={open}
                handleCancel={handleCancel}
                brand={update}
                refreshData={refreshData}
            />
        </div>
    );
};

export default Brand;
