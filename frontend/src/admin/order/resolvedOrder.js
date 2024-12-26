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
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchAllOrder(); // Fetch all orders when component mounts
    }, []);

    const fetchAllOrder = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }

            const response = await axios.get(`${API_URL}/getResolvedOrders`, {
                headers: {
                    Authorization: `Bearer ${token}` // Use Bearer token for authentication
                }
            });
            setOrders(response.data); // Set the fetched orders to state
        } catch (error) {
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                alert("Bạn không có quyền truy cập trang quản trị");
                window.location.href = '/login'; // Redirect to login if unauthorized
            }
        } finally {
            setLoading(false); // Turn off loading after data is fetched
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
            window.location.reload(); // Reload page after status update

        } catch (error) {
            console.error('Error updating order status:', error);
            if (error.response) {
                console.log(error.response); // Log error response
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
            }, 10000);

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
                            text-align: center; /* Center align quantity column */
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
                            <h2>SEEDS PLANT</h2>
                        </div>
    
                        <!-- Barcode -->
                        <div class="barcode">
                            <svg id="barcode"></svg> <!-- Barcode will be displayed here -->
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
                            <p>SEEDS PLAN - THẾ GIỚI HẠT GIỐNG</p>
                            <p>Địa chỉ: Tân Phước , Tiền Giang</p>
                            <p>Điện thoại: 0332204xxx</p>
                        </div>
                    </div>
                    <script>
                        JsBarcode("#barcode", "${order._id}", {
                            format: "CODE128", // Barcode type
                            displayValue: true, // Show barcode value
                            fontSize: 18, // Font size
                            height: 40, // Barcode height
                        });
                    </script>
                </body>
            </html>
        `;
        invoiceWindow.document.write(invoiceHTML);
        invoiceWindow.document.close();
        invoiceWindow.print();
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
                                    <td className='date-order text-center'>
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className='status text-center'>
                                        <select
                                            value={order.status}
                                            onChange={(e) => updateOrderStatus(order._id, Number(e.target.value))}
                                            className='form-select frm-order'
                                        >

                                            <option value="1">Đã xác nhận</option>
                                            <option value="2">Đang giao hàng</option>
                                        </select>
                                    </td>
                                    <td className='btn-action'>
                                        <button onClick={() => deleteOrder(order._id, order.items)} className='btn btn-success btn-product1'>Xóa</button>
                                        <button onClick={() => printInvoice(order)} className='btn btn-success btn-product2'>In </button>
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
