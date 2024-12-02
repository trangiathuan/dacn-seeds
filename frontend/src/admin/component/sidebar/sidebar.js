import React, { useEffect, useState } from 'react';
import './sidebar.css';
import axios from 'axios';
import API_URL from '../../../config/config.js';
import { UnorderedListOutlined, HomeOutlined, UserOutlined, ProductOutlined, FormOutlined } from '@ant-design/icons';
import { Menu } from 'antd';

const Sidebar = () => {
    const [totalPendingOrders, setTotalPendingOrders] = useState(0);
    const [totalResolvedOrders, setTotalResolvedOrders] = useState(0);
    const [totalShippingOrders, setTotalShippingOrders] = useState(0);
    const [totalCompletedOrders, setTotalCompletedOrders] = useState(0);
    const [totalCancelOrders, setTotalCancelOrders] = useState(0);




    useEffect(() => {
        fetchTotalOrders();
        fetchTotalResolveOrders();
        fetchTotalShippingOrders();
        fetchTotalCancelOrders();
        fetchTotalCompletedOrders();
    }, []);
    const fetchTotalOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/totalPendingOrders`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setTotalPendingOrders(response.data.total);
        } catch (error) {
            console.error('Error fetching total orders:', error);
        }
    };
    const fetchTotalResolveOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/totalResolveOrders`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setTotalResolvedOrders(response.data.total);
        } catch (error) {
            console.error('Error fetching total orders:', error);
        }
    };

    const fetchTotalShippingOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/totalShippingOrders`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setTotalShippingOrders(response.data.total);
        } catch (error) {
            console.error('Error fetching total orders:', error);
        }
    };

    const fetchTotalCompletedOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/totalCompletedOrders`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setTotalCompletedOrders(response.data.total);
        } catch (error) {
            console.error('Error fetching total orders:', error);
        }
    };

    const fetchTotalCancelOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/totalCancelOrders`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setTotalCancelOrders(response.data.total);
        } catch (error) {
            console.error('Error fetching total orders:', error);
        }
    };

    const items = [
        {
            key: 'sub1',
            label: (<a className='ms-2' href='/admin/dashboard'>Tổng hợp</a>),
            icon: <HomeOutlined />,
        },
        {
            key: 'sub2',
            label: (<div className='ms-2'> Đơn hàng {totalPendingOrders ? <span className="badge bg-danger rounded-pill ms-2"> {totalPendingOrders}</span> : <div></div>}</div>),
            icon: <UnorderedListOutlined />,
            children: [
                {
                    key: '1',
                    label: (
                        <a href='/admin/orders'>

                            <span className="badge bg-danger rounded-pill me-2">
                                {totalPendingOrders}
                            </span>

                            Đơn hàng
                        </a>
                    )
                },
                {
                    key: '2',
                    label: (<a href='/admin/resolvedOrders'>
                        <span className="badge bg-danger rounded-pill me-2">
                            {totalResolvedOrders}
                        </span>
                        Đã xác nhận
                    </a>
                    )
                },
                {
                    key: '3',
                    label: (<a href='/admin/shippingOrders'>

                        <span className="badge bg-danger rounded-pill me-2">
                            {totalShippingOrders}
                        </span>

                        Đang giao hàng
                    </a>
                    )
                },
                {
                    key: '4',
                    label: (<a href='/admin/soldOrders'>

                        <span className="badge bg-danger rounded-pill me-2">
                            {totalCompletedOrders}
                        </span>


                        Hoàn thành
                    </a>
                    )
                },
                {
                    key: '5',
                    label: (<a href='/admin/cancelOrders'>
                        <span className="badge bg-danger rounded-pill me-2">{totalCancelOrders}</span>
                        Đã huỷ
                    </a>)
                },
            ],
        },
        {
            key: 'sub3',
            label: (<div className='ms-2'>Sản phảm</div>),
            icon: <ProductOutlined />,
            children: [
                {
                    key: '5', // Key cho "Quản lý sản phẩm"
                    label: (<a href='/admin/products'>Quản lý sản phẩm</a>),
                },
                {
                    key: '11', // Key cho "Quản lý danh mục"
                    label: (<a href='/admin/categorys'>Quản lý danh mục</a>),
                },
                {
                    key: '12', // Key cho "Option 12"
                    label: 'Option 12',
                },
            ],
        },
        {
            key: 'sub4',
            label: (<div className='ms-2'>Tài khoản</div>),
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
        {
            key: 'sub5',
            label: (<div className='ms-2'>Bài viết</div>),
            icon: <FormOutlined />,
            children: [
                {
                    key: '11', // Key cho "Quản lý tài khoản"
                    label: (<a href='/admin/blogs'>Duyệt bài viết</a>),
                },
                {
                    key: '12', // Key cho "Option 12"
                    label: 'Option 12',
                },
            ],
        },
        {
            key: 'sub6',
            label: (<div className='ms-2'>Thống kê</div>),
            icon: <FormOutlined />,
            children: [
                {
                    key: '11', // Key cho "Quản lý tài khoản"
                    label: (<a href='/admin/sales-revenue'>Doanh thu bán hàng</a>),
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
