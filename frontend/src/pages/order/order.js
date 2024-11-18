import React, { useEffect, useState } from 'react';
import Nav from '../../component/navbar/navbar.js';
import './userOrders.css';
import API_URL from '../../config/config';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { Tabs, List, Typography, Image, Divider, Card, Row, Col } from 'antd';

const { Text } = Typography;

const UserOrder = () => {
    const [orders, setOrders] = useState([]); // Khởi tạo là mảng
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const isLoggedIn = !!localStorage.getItem('token');
    const [expandedOrders, setExpandedOrders] = useState([]); // Trạng thái mở rộng các đơn hàng

    useEffect(() => {
        if (isLoggedIn) {
            fetchOrders();
        }
        else {
            toast.warn('Đăng nhập để theo dõi đơn hàng')
        }
    }, []);

    const fetchOrders = async () => {
        const token = localStorage.getItem('token');

        try {
            const response = await axios.get(`${API_URL}/userOrder`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setOrders(response.data);
        } catch (error) {
            console.error('Có lỗi xảy ra:', error);
            setError('Không thể lấy dữ liệu đơn hàng.');
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId, status) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `${API_URL}/finish/${orderId}`,
                { status: status },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            toast.success('Cập nhật trạng thái thành công');
            fetchOrders(); // Tải lại đơn hàng sau khi cập nhật

        } catch (error) {
            console.error('Error updating order status:', error);
            alert('Đã xảy ra lỗi khi cập nhật trạng thái');
        }
    };

    const cancelOrder = async (orderId, items) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                `${API_URL}/cancel`,
                { orderId, items },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            toast.success('Cập nhật trạng thái thành công');
            fetchOrders(); // Tải lại đơn hàng sau khi cập nhật

        } catch (error) {
            console.error('Error updating order status:', error);
            alert('Đã xảy ra lỗi khi cập nhật trạng thái');
        }
    };


    const toggleOrder = (orderId) => {
        setExpandedOrders(prev =>
            prev.includes(orderId) ? prev.filter(id => id !== orderId) : [...prev, orderId]
        );
    };

    const renderOrderDetails = (status) => {
        if (loading) {
            return <p className='text-center'>Dữ liệu không tồn tại</p>;
        }

        const filteredOrders = orders.filter(order => Array.isArray(status) ? status.includes(order.status) : order.status === status);

        if (filteredOrders.length === 0) {
            return <p className='text-center'>Không có đơn hàng nào </p>;
        }

        return filteredOrders.map(order => (
            <div key={order._id}>
                <p className='bgtt fw-bold mt-3 mb-4' orientation="left" onClick={() => toggleOrder(order._id)} style={{ cursor: 'pointer' }}>
                    Thông tin đơn hàng: {order._id}
                    <span className='detail-order'> Xem chi tiết</span>
                </p>

                <Card style={{ marginBottom: 20 }}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Text strong>Người nhận:</Text>
                            <Text>{` ${order.fullName}`}</Text>
                        </Col>
                        <Col span={12}>
                            <Text strong>Ngày đặt hàng:</Text>
                            <Text>{` ${(order.createdAt)}`}</Text>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Text strong>Điện thoại:</Text>
                            <Text>{` ${order.phoneNumber}`}</Text>
                        </Col>
                        <Col span={12}>
                            <Text strong>Địa chỉ nhận hàng:</Text>
                            <Text>{` ${order.addDress}`}</Text>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Text strong>Phương thức thanh toán:</Text>
                            <Text>{` ${order.paymentMethod}`}</Text>
                        </Col>
                        <Col span={12}>
                            <Text strong>Tổng tiền:</Text>
                            <Text>{` ${order.totalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}`}</Text>
                        </Col>
                    </Row>
                </Card>

                {expandedOrders.includes(order._id) && (
                    <>
                        <Divider orientation="left">Sản phẩm</Divider>
                        <List
                            bordered
                            dataSource={order.items}
                            renderItem={item => (
                                <List.Item>
                                    <Image
                                        width={50}
                                        height={50}
                                        src={require(`../../asset/images-product/${item.image}`)}
                                        alt={item.productName}
                                        style={{ marginRight: 10 }}
                                    />
                                    <div className='ms-3' style={{ flexGrow: 1 }}>
                                        <a href={`/product-detail/${item.productId}`}><Text strong>{item.productName}</Text><br /></a>
                                        <Text>{`Giá: ${item.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })} x ${item.quantity}`}</Text>
                                    </div>
                                    <hr />
                                </List.Item>

                            )}
                        />
                    </>
                )}
                <hr />
                {(order.status === 0) && (
                    <div className='btn-cancel'>
                        <button onClick={() => cancelOrder(order._id, order.items)} className='btn btn-danger'>
                            Hủy đơn hàng
                        </button>
                    </div>
                )}
                {(order.status === 2 || order.status === 3) && (
                    <div>
                        <button onClick={() => updateOrderStatus(order._id, 4)} disabled={order.status !== 3} className='btn btn-success'>
                            Đã nhận được hàng
                        </button>
                    </div>
                )}
            </div>
        ));
    };

    const items = [
        { key: '0', label: 'Chờ xác nhận', children: renderOrderDetails(0) },
        { key: '1', label: 'Đã xác nhận', children: renderOrderDetails(1) },
        { key: '2', label: 'Đang giao hàng', children: renderOrderDetails([2, 3]) },
        { key: '3', label: 'Hoàn thành', children: renderOrderDetails(4) },
        { key: '-1', label: 'Đã hủy', children: renderOrderDetails(-1) },
    ];

    return (
        <div>
            <Nav />
            <ToastContainer />
            <div className='tabs-body'>
                <div className='tabs btn-tabs'>
                    <Tabs className="custom-tabs" defaultActiveKey="0" items={items} centered />
                </div>
            </div>

        </div>
    );
}

export default UserOrder;
