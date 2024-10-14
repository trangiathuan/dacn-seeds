import React, { useEffect, useState } from 'react';
import './sidebar.css';
import axios from 'axios';
import API_URL from '../../../config/config.js';
import { UnorderedListOutlined, HomeOutlined, UserOutlined, ProductOutlined } from '@ant-design/icons';
import { Menu } from 'antd';

const Sidebar = () => {
    const [totalPendingOrders, setTotalPendingOrders] = useState(0);


    useEffect(() => {
        const fetchTotalOrders = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${API_URL}/totalPendingOrders`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setTotalPendingOrders(response.data.totalPendingOrders);
            } catch (error) {
                console.error('Error fetching total orders:', error);
            }
        };
        fetchTotalOrders();
    }, []);

    const items = [
        {
            key: 'sub1',
            label: (<a href='/admin/dashboard'>Tổng hợp</a>),
            icon: <HomeOutlined />,
        },
        {
            key: 'sub2',
            label: 'Đơn hàng',
            icon: <UnorderedListOutlined />,
            children: [
                {
                    key: '1', // Key cho "Đơn hàng"
                    label: (
                        <a href='/admin/orders'>
                            Đơn hàng
                            <span className="badge bg-danger rounded-pill ms-4">{totalPendingOrders}</span>
                        </a>
                    ),
                },
                {
                    key: '2', // Key cho "Đã bán"
                    label: <a href='/admin/soldOrders'>
                        Đã bán
                    </a>
                },
                {
                    key: '3', // Key cho "Đã huỷ"
                    label: 'Đã huỷ',
                },
            ],
        },
        {
            key: 'sub3',
            label: 'Sản phẩm',
            icon: <ProductOutlined />,
            children: [
                {
                    key: '5', // Key cho "Quản lý sản phẩm"
                    label: (<a href='/admin/products'>Quản lý sản phẩm</a>),
                },
                {
                    key: '11', // Key cho "Quản lý danh mục"
                    label: (<a href='#'>Quản lý danh mục</a>),
                },
                {
                    key: '12', // Key cho "Option 12"
                    label: 'Option 12',
                },
            ],
        },
        {
            key: 'sub4',
            label: 'Tài khoản',
            icon: <UserOutlined />,
            children: [
                {
                    key: '11', // Key cho "Quản lý tài khoản"
                    label: (<a href='/admin/users'>Quản lý tài khoản</a>),
                },
                {
                    key: '12', // Key cho "Option 12"
                    label: 'Option 12',
                },
            ],
        },
    ];

    return (
        <div className="d-flex">
            <div className="sidebar flex-column p-3">
                <Menu
                    mode="inline"
                    items={items}
                />
            </div>
        </div>
    );
};

export default Sidebar;
