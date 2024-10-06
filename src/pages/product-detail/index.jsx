import React from 'react';
import { Button } from 'antd';
import { useLocation } from 'react-router-dom';

const ProductDetail = () => {
    const location = useLocation();
    const { name, price } = location.state || {}; // Getting name and price from the state

    return (
        <div className='flex flex-col gap-6'>
            <h1>Product Name: {name || 'No name provided'}</h1>
            <h1>Product Price: {price || 'No price provided'}</h1>
            <div className='flex items-center gap-7'>
                <h1>Product Detail:</h1>
                <Button type="primary">Add Detail</Button>
            </div>
        </div>
    );
};

export default ProductDetail;
