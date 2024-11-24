import './order.css';
import NavAdmin from "../component/nav-admin/nav-admin";
import Sidebar from "../component/sidebar/sidebar";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import API_URL from '../../config/config';

const ResolvedOrdersAdmin = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAllOrder(); // Gọi hàm fetch khi component được mount
    }, []);

    const fetchAllOrder = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }

            const response = await axios.get(`${API_URL}/getResolvedOrders`, {
                headers: {
                    Authorization: `Bearer ${token}` // Sử dụng Bearer token
                }
            });
            setOrders(response.data); // Cập nhật state với dữ liệu sản phẩm
        } catch (error) {
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                alert("Bạn không có quyền truy cập trang quản trị");
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

    const deleteOrder = async (orderId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(`${API_URL}/deleteOrder/${orderId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
            toast.success('Đã xóa đơn hàng thành công');
            setTimeout(() => {
                window.location.reload();
            }, 1500); // Reload sau 1 giây

        } catch (error) {
            console.error('Error deleting order:', error);

            if (error.response) {
                alert(`Đã xảy ra lỗi: ${error.response.data.message}`);
            } else {
                alert('Đã xảy ra lỗi khi xóa đơn hàng');
            }
        }
    };

    const printInvoice = (order) => {
        const invoiceWindow = window.open('', '', 'width=800,height=600');
        const invoiceHTML = `
            <html>
                <head>
                    <title>MÃ ĐƠN HÀNG: ${order._id}</title>
                    <style>
                        body { font-family: 'Arial', sans-serif; margin: 0; padding: 0; background-color: #f4f4f9; color: #000; }
                        .container { width: 80%; margin: 20px auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); }
                        .invoice-header { text-align: center; margin-bottom: 30px; }
                        .invoice-header h2 { margin: 0; font-size: 28px; }
                        .invoice-header p { font-size: 16px; margin-top: 5px; }
                        .invoice-details { margin-top: 20px; }
                        .invoice-details h3 { font-size: 22px; border-bottom: 2px solid #ecf0f1; padding-bottom: 10px; margin-bottom: 20px; }
                        .invoice-details table { width: 100%; border-collapse: collapse; }
                        .invoice-details th, .invoice-details td { padding: 12px; text-align: left; border-bottom: 1px solid #ecf0f1; font-size: 16px; }
                        .invoice-details th { background-color: #f7f7f7; }
                        .invoice-details td { background-color: #fafafa; }
                        .invoice-details table th:nth-child(2),
                        .invoice-details table td:nth-child(2) {
                            text-align: center; /* Căn giữa cho cột Số lượng */
                        }
                        .total { font-size: 18px; font-weight: bold; margin-top: 20px; }
                        .customer-info p { font-size: 16px; }
                        .footer { text-align: center; margin-top: 40px; font-size: 14px; }
                        .footer p { margin: 5px 0; }
                        .barcode { text-align: center; margin-top: 20px; }
                    </style>
                    <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.0/dist/JsBarcode.all.min.js"></script>
                </head>
                <body>
                    <div class="container">
                        <div class="invoice-header">
                            <h2>HÓA ĐƠN MUA HÀNG</h2>
                        </div>
    
                        <!-- Mã vạch -->
                        <div class="barcode">
                            <svg id="barcode"></svg> <!-- Mã vạch sẽ được hiển thị tại đây -->
                        </div>
    
                        <div class="invoice-details">
                            <h3>Chi tiết đơn hàng</h3>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Sản phẩm</th>
                                        <th>Số lượng</th>
                                        <th>Giá</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${order.items.map(item => `
                                        <tr>
                                            <td>${item.productName}</td>
                                            <td>${item.quantity}</td>
                                            <td>${(item.price * item.quantity).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
    
                            <p class="total">Tổng cộng: ${order.totalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
    
                            <div class="customer-info">
                                <p><strong>Khách hàng:</strong> ${order.fullName}</p>
                                <p><strong>Số điện thoại:</strong> ${order.phoneNumber}</p>
                                <p><strong>Địa chỉ:</strong> ${order.addDress}</p>
                                <p><strong>Phương thức thanh toán:</strong> ${order.paymentMethod}</p>
                                <p><strong>Ngày đặt hàng:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
    
                        <div class="footer">
                            <p>SEED PLAN - THẾ GIỚI HẠT GIỐNG</p>
                            <p>Địa chỉ: Tân Phước , Tiền Giang</p>
                            <p>Điện thoại: 0332204xxx</p>
                        </div>
                    </div>
                    <script>
                        JsBarcode("#barcode", "${order._id}", {
                            format: "CODE128", // Chọn loại mã vạch
                            displayValue: true, // Hiển thị giá trị mã vạch
                            fontSize: 18, // Kích thước chữ
                            height: 40, // Chiều cao mã vạch
                        });
                    </script>
                </body>
            </html>
        `;
        invoiceWindow.document.write(invoiceHTML);
        invoiceWindow.document.close();
        invoiceWindow.print();
    };




    return (
        <div>
            <NavAdmin />
            <ToastContainer />
            <div className="row productsAdmin-body">
                <div className="col-4 sidebar-body">
                    <Sidebar />
                </div>
                <div className="col-9 content-body">
                    <table className="table">
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
                            {orders.map((order) => (
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
                                        <div><span>Tên khách hàng: {order.fullName}</span></div>
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
                                            <option value="0">Chờ duyệt</option>
                                            <option value="1">Đã xác nhận</option>
                                            <option value="2">Đang giao hàng</option>
                                            <option value="3">Đã giao hàng</option>
                                        </select>
                                    </td>
                                    <td className='btn-action'>
                                        <button onClick={() => deleteOrder(order._id)} className='btn btn-success btn-product1'>Xóa</button>
                                        <button onClick={() => printInvoice(order)} className='btn btn-success btn-product2'>In</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default ResolvedOrdersAdmin;
