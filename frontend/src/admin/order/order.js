import './order.css';
import NavAdmin from "../component/nav-admin/nav-admin";
import Sidebar from "../component/sidebar/sidebar";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const OrdersAdmin = () => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllOrder = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No token found');
                }

                const response = await axios.get('https://dacn-seeds-1.onrender.com/api/getAllOrder', {
                    headers: {
                        Authorization: `Bearer ${token}` // Sử dụng Bearer token
                    }
                });
                setOrders(response.data); // Cập nhật state với dữ liệu sản phẩm
            } catch (error) {
                setError(error.response ? error.response.data.msg : error.message); // Xử lý lỗi
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    // Xử lý nếu người dùng không được xác thực hoặc không có quyền truy cập
                    alert("Yêu cầu đăng nhập tài khoản Admin"); // Hoặc điều hướng người dùng tới trang đăng nhập
                    window.location.href = '/login'; // Ví dụ điều hướng tới trang đăng nhập
                }
            } finally {
                setLoading(false); // Tắt trạng thái loading
            }
        };

        fetchAllOrder(); // Gọi hàm fetch khi component được mount
    }, []);

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                `https://dacn-seeds-1.onrender.com/api/updateOrderStatus/${orderId}`,
                { status: newStatus },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert('Cập nhật trạng thái thành công');
            window.location.reload();


        } catch (error) {
            console.error('Error updating order status:', error);

            // Nếu có response từ server, hiển thị thông báo cụ thể
            if (error.response) {
                alert(`Đã xảy ra lỗi: ${error.response.data.msg || error.response.data}`);
            } else {
                alert('Đã xảy ra lỗi khi cập nhật trạng thái');
            }
        }
    };

    const deleteOrder = async (orderId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(`https://dacn-seeds-1.onrender.com/api/deleteOrder/${orderId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            alert('Đã xóa đơn hàng thành công');
            // Loại bỏ đơn hàng đã xóa khỏi danh sách đơn hàng
            setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
            window.location.reload();
        } catch (error) {
            console.error('Error deleting order:', error);

            // Nếu có response từ server, hiển thị thông báo cụ thể
            if (error.response) {
                alert(`Đã xảy ra lỗi: ${error.response.data.message}`);
            } else {
                alert('Đã xảy ra lỗi khi xóa đơn hàng');
            }
        }
    };


    return (
        <div>
            <NavAdmin />
            <div className="row productsAdmin-body">
                <div className="col-3 sidebar-body">
                    <Sidebar />
                </div>
                <div className="col-9 content-body">
                    <div>
                    </div>
                    <table className="table">
                        <thead>
                            <tr>
                                <th className='text-center' scope="col">Đơn hàng</th>
                                <th className='text-center'>Thông tin liên hệ</th>
                                <th className='text-center' scope="col">Thanh toán</th>
                                <th className='text-center' scope="col">Tổng cộng</th>
                                <th className='text-center' scope="col">Ngày đặt hàng</th>
                                <th className='text-center' scope="col">Trạng thái</th>
                                <th className='text-center' scope="col">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order._id}>
                                    <td className='items-order'>
                                        {order.items.map((item, index) => (
                                            <div key={index}>
                                                <div>
                                                    <span>{item.productName}</span>
                                                </div>
                                                <div>
                                                    <span>Giá: {item.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
                                                </div>
                                                <div>
                                                    <span>Số lượng: {item.quantity}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </td>
                                    <td className='info-user'>
                                        <div> <span>Người đặt hàng: {order.fullName}  </span></div>
                                        <div><span>Số điện thoại: {order.phoneNumber}</span></div>
                                        <div><span>Email: {order.email}</span></div>
                                        <div><span>Địa chỉ: {order.addDress}</span></div>
                                    </td>
                                    <td className='paymentMethod'>
                                        {order.paymentMethod}
                                    </td>
                                    <td className='totalPrice-order'>
                                        {order.totalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                    </td>
                                    <td className='date-order'>
                                        {order.createdAt}
                                    </td>
                                    <td className='status'>
                                        <select
                                            value={order.status}
                                            onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                            className='form-select'
                                        >
                                            <option value="Đang chờ duyệt">Đang chờ duyệt</option>
                                            <option value="Đã duyệt">Đã duyệt</option>
                                            <option value="Đã giao">Đã giao</option>
                                            <option value="Đã hủy">Đã hủy</option>
                                        </select>
                                    </td>
                                    <td>
                                        <button onClick={() => deleteOrder(order._id)} className='btn btn-danger btn-product'>Xóa</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default OrdersAdmin;
