// GlobalPopconfirm.js
import React from 'react';
import { Popconfirm } from 'antd';

const GlobalPopconfirm = ({ title, onConfirm, children }) => {
    return (
        <Popconfirm
            title={title}
            onConfirm={onConfirm}
            okText="Yes"
            cancelText="No"
        >
            {children}
        </Popconfirm>
    );
};

export default GlobalPopconfirm;
