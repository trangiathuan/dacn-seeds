import './order.css';
import NavAdmin from "../component/nav-admin/nav-admin";
import Sidebar from "../component/sidebar/sidebar";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import API_URL from '../../config/config';

const ShippingOrdersAdmin = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchAllOrder(); // Gọi hàm fetch khi component được mount
    }, []);

    const fetchAllOrder = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }

            const response = await axios.get(`${API_URL}/getShipOrders`, {
                headers: {
                    Authorization: `Bearer ${token}` // Sử dụng Bearer token
                }
            });
            setOrders(response.data); // Cập nhật state với dữ liệu sản phẩm
        } catch (error) {
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                // Xử lý nếu người dùng không được xác thực hoặc không có quyền truy cập
                alert("Bạn không có quyền truy cập trang quản trị"); // Hoặc điều hướng người dùng tới trang đăng nhập
                window.location.href = '/login'; // Ví dụ điều hướng tới trang đăng nhập
            }
        } finally {
            setLoading(false); // Tắt trạng thái loading
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                `${API_URL}/updateOrderStatus/${orderId}`,
                { status: newStatus },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            toast.success('Cập nhật trạng thái thành công');
            window.location.reload();

        } catch (error) {
            console.error('Error updating order status:', error);

            if (error.response) {
                console.log(error.response); // In ra toàn bộ thông tin phản hồi
            } else {
                alert('Đã xảy ra lỗi khi cập nhật trạng thái');
            }
        }
    };

    const deleteOrder = async (orderId, items) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${API_URL}/deleteOrder`,
                { orderId, items },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            // Loại bỏ đơn hàng đã xóa khỏi danh sách đơn hàng
            setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));

            toast.success('Đã xóa đơn hàng thành công');

            setTimeout(() => {
                window.location.reload();
            }, 10000); // Reload sau 1 giây

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

    const filteredOrders = orders.filter(order =>
        order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.phoneNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.addDress.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.paymentMethod.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.totalPrice.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
        new Date(order.createdAt).toLocaleDateString().includes(searchQuery.toLowerCase())
    );


    return (
        <div>
            <NavAdmin />
            <ToastContainer />
            <div className="row productsAdmin-body">
                <div className="col-4 sidebar-body">
                    <Sidebar />
                </div>
                <div className="col-9 content-body">
                    <div className=" search-bar mt-3">

                        <input
                            type="text"
                            placeholder="Tìm kiếm đơn hàng"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)} // Update search query
                            className="form-control search-input"
                        />

                    </div>
                    <table className="table ">
                        <thead>
                            <tr>
                                <th className='text-center' scope="col">Đơn hàng đã xác nhận</th>
                                <th className='text-center'>Thông tin liên hệ</th>
                                <th className='text-center' scope="col">Thanh toán</th>
                                <th className='text-center' scope="col">Tổng cộng</th>
                                <th className='text-center' scope="col">Ngày đặt hàng</th>
                                <th className='text-center' scope="col">Trạng thái</th>
                                <th className='text-center' scope="col">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map((order) => (
                                <tr key={order._id}>
                                    <td className='items-order'>
                                        {order.items.map((item, index) => (
                                            <div key={index}>
                                                <div>
                                                    <span>{item.productName} x{item.quantity}</span>
                                                </div>

                                            </div>
                                        ))}
                                    </td>
                                    <td className='info-user'>
                                        <div> <span>Người đặt hàng: {order.fullName}  </span></div>
                                        <div><span>Số điện thoại: {order.phoneNumber}</span></div>
                                        <div><span>Địa chỉ: {order.addDress}</span></div>
                                    </td>
                                    <td className='paymentMethod'>
                                        {order.paymentMethod}
                                    </td>
                                    <td className='totalPrice-order'>
                                        {order.totalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                    </td>
                                    <td className='date-order'>
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className='status'>
                                        <select
                                            value={order.status}
                                            onChange={(e) => updateOrderStatus(order._id, Number(e.target.value))}
                                            className='form-select'
                                        >
                                            <option value="0" >Chờ duyệt</option>
                                            <option value="1">Đã xác nhận</option>
                                            <option value="2">Đang giao hàng</option>
                                            <option value="3">Đã giao hàng</option>
                                        </select>
                                    </td>
                                    <td>
                                        <button onClick={() => deleteOrder(order._id, order.items)} className='btn btn-danger btn-product'>Xóa</button>
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

export default ShippingOrdersAdmin;
