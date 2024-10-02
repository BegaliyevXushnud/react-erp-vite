import React from 'react';
import { Table } from 'antd';

const Index = ({ columns, data, pagination, handleChange }) => (
    <Table
    columns={columns}
    dataSource={data}  
    pagination={pagination}
    onChange={(pagination) => handleChange(pagination)}
    bordered
/>

);

export default Index;
