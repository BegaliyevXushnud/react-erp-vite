import React, { useEffect, useState } from 'react';
import { Button, message, Input } from 'antd';
import { EditOutlined, DeleteOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { productService } from '../../../service'; // Adjust the import path if necessary
import { useNavigate, useLocation } from 'react-router-dom';
import ProductModal from '../../component/modal/productmodal'; // Adjust the import path if necessary
import { GlobalPopconfirm } from '../../component';
import GlobalTable from '../../component/global-table'; // Adjust the import path if necessary
import Noimg from '../../assets/no_foto.jpg';

const Product = () => {
    const [data, setData] = useState([]);
    const [open, setOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [total, setTotal] = useState(0);
    const [params, setParams] = useState({
        search: '',
        page: 1,
        limit: 5,
    });
    const handleClose = () => {
        setOpen(false)
    }
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
        setEditingProduct(item);
        setOpen(true);
    };

    const navigateToSubCategory = (item) => {
        navigate(`/admin-layout/product/sub-product/${item.id}`); // Adjusted for products
    };

    const handleSearchChange = (event) => {
        const searchValue = event.target.value;
        setParams((prev) => ({
            ...prev,
            search: searchValue,
        }));
        
        const search_params = new URLSearchParams(search);
        search_params.set("search", searchValue);
        navigate(`?${search_params}`); // Fixed the string interpolation
    };

    const handlePageChange = (pagination) => {
        const { current, pageSize } = pagination;
        setParams((prev) => ({
            ...prev,
            page: current,
            limit: pageSize,
        }));

        const current_params = new URLSearchParams(search);
        current_params.set('page', current); // Fixed the string interpolation
        current_params.set('limit', pageSize); // Fixed the string interpolation
        navigate(`?${current_params}`); // Fixed the string interpolation
    };

    // Updated handleCancel function
    const handleCancel = () => {
        setOpen(false);
        setEditingProduct(null); // Reset the editingProduct state when closing
    };

    const columns = [
        {
            title: '№',
            dataIndex: 'index',
            render: (text, item, index) => (params.page - 1) * params.limit + index + 1,
        },
        {
            title: 'Product name',
            dataIndex: 'name',
            render: (text, item) => <a onClick={() => editItem(item)}>{text}</a>,
        },
        {
            title: 'Price',
            dataIndex: 'price',
        },
        {
            title: 'Image',
            dataIndex: 'images',
            render: (images) => (
                <div>
                    {images && images.length > 0 ? (
                        images.map((image, index) => (
                            <img
                                key={index}
                                src={image.url || Noimg} // Agar image.url bo'lmasa, Noimg ga o'zgartiring
                                alt={`Image ${index + 1}`} 
                                style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '5px' }}
                            />
                        ))
                    ) : (
                        <img
                            src={Noimg} 
                            alt="Placeholder"
                            style={{ width: '60px', height: '50px', objectFit: 'cover' }} // Placeholder
                        />
                    )}
                </div>
            ),
        },
        
        {
            title: 'Action',
            dataIndex: 'action',
            render: (text, item) => (
                <div style={{ display: 'flex', gap: '10px' }}>
                    <Button type="link" icon={<UnorderedListOutlined />} onClick={() => navigateToSubCategory(item)} />
                    <Button type="link" icon={<EditOutlined />} onClick={() => editItem(item)} />
                    <GlobalPopconfirm
                        title="Mahsulotni o'chirishni tasdiqlaysizmi?"
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
                <Button className="add-btn" type="primary" onClick={() => setOpen(true)}>Add New Product</Button>
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
                handleClose={handleClose} // Pass the updated handleCancel function
                product={editingProduct}
                refreshData={getData} // Fetch new data after updates
            />
        </div>
    );
};

export default Product;
