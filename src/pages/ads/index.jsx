import React, { useEffect, useState } from 'react';
import { Button, message, Input } from 'antd';
import adsService from '../../../service/ads'; // Ads service importi
import { useNavigate, useLocation } from 'react-router-dom';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import AdsDrawer from '../../component/modal/ads'; // Ads modal komponenti
import { GlobalPopconfirm } from '../../component';
import TableComponent from '../../component/global-table';
import noimage from '../../assets/no_foto.jpg'; // Zaxira rasmni import qilish

const Ads = () => {
    const [data, setData] = useState([]);
    const [open, setOpen] = useState(false);
    const [editingAd, setEditingAd] = useState(null);
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
            const res = await adsService.getAll(params); // Ads ro'yxatini olish
            setData(res?.data?.data || []); // Ma'lumotlar rasmda 'data' ichida kelgan
            setTotal(res?.data?.total || 0); // Umumiy sonini olish
        } catch (err) {
            console.error(err);
            message.error("Ma'lumotlarni yuklashda xatolik yuz berdi");
        }
    };

    useEffect(() => {
        getData();
    }, [params]);

    const handleDelete = async (id) => {
        try {
            await adsService.delete(id); // Ads o'chirish
            message.success("Advertisement muvaffaqiyatli o'chirildi");
            getData();
        } catch (error) {
            console.error(error);
            message.error("Advertisementni o'chirishda xatolik yuz berdi");
        }
    };

    const editItem = (item) => {
        setEditingAd(item); // Tahrirlash uchun tanlangan item
        setOpen(true);
    };

    const handleSearchChange = (event) => {
        const value = event.target.value;
        setParams((prev) => ({
            ...prev,
            search: value,
        }));
        // Qidiruv natijalarini yangilash
        getData();
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
        setEditingAd(null);
    };

    const columns = [
      {
          title: 'T/R',
          dataIndex: 'index',
          render: (text, item, index) => (params.page - 1) * params.limit + index + 1,
      },
      {
          title: 'Image', // Tasvir ustuni
          dataIndex: 'image', 
          render: (text, item) => (
              <img 
                  src={item.image ? item.image : noimage} // Agar tasvir bo'lmasa, zaxira rasm
                  alt="Advertisement" 
                  width={50} 
                  height={50} 
                  style={{ objectFit: 'cover' }} // Tasvir to'g'ri joylashishi uchun
                  onError={(e) => { e.target.onerror = null; e.target.src = noimage; }} // Yuklash xatosida zaxira rasm
              />
          ),
      },
      {
          title: 'Position',
          dataIndex: 'position',
          render: (text, item) => <a onClick={() => editItem(item)}>{item.position || 'N/A'}</a>, // Pozitsiyani tahrirlash
      },
      {
          title: 'Action',
          dataIndex: 'action',
          render: (text, item) => (
              <div style={{ display: 'flex', gap: '10px' }}>
                  <Button type="link" icon={<EditOutlined />} onClick={() => editItem(item)} />
                  <GlobalPopconfirm
                      title="Advertisementni o'chirishni tasdiqlaysizmi?"
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
                <Button className="add-btn" type="primary" onClick={() => setOpen(true)}>Add New Advertisement</Button>
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
            <AdsDrawer
                open={open}
                handleClose={handleCancel}
                adItem={editingAd}
                refreshData={getData}
            />
        </div>
    );
};

export default Ads;
