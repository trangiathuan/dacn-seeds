import React from 'react';
import { useEffect, useState } from 'react';
import './sidebar.css';
import axios from 'axios';

const Sidebar = () => {
    const [totalPendingOrders, setTotalPendingOrders] = useState([])
    useEffect(() => {
        const fetchTotalOrders = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8000/api/totalPendingOrders', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                // Bạn có thể lưu tổng số lượng vào state hoặc hiển thị trực tiếp trên giao diện
                setTotalPendingOrders(response.data.totalPendingOrders);
            } catch (error) {
                console.error('Error fetching total orders:', error);
            }
        };
        fetchTotalOrders();
    }, [])

    return (
        <div className="d-flex">
            <div className="sidebar flex-column p-3">
                <a href="/admin/dashboard" className="nav-link active">
                    <img className='logo-sidebar' src={require('../../../asset/Images/home.png')} />
                    <span className="ms-2">Dashboard</span>
                </a>
                <a href="/admin/orders" className="nav-link">
                    <img className='logo-sidebar' src={require('../../../asset/Images/clipboard.png')} />
                    <span className="ms-2">Đơn hàng</span>
                    <span className="badge bg-danger rounded-pill ms-4">{totalPendingOrders}</span>
                </a>
                <a href="/admin/products" className="nav-link">
                    <img className='logo-sidebar' src={require('../../../asset/Images/list.png')} />
                    <span className="ms-2">Sản phẩm</span>
                </a>
                <a href="/admin/users" className="nav-link">
                    <img className='logo-sidebar' src={require('../../../asset/Images/user.png')} />
                    <span className="ms-2">Tài khoản</span>
                </a>

            </div>
        </div>
    );
};

export default Sidebar;
