import React, { useState, useEffect } from 'react';
import Footer from '../../component/footer/footer';
import Nav from '../../component/navbar/navbar';
import './checkout.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
    const [cartItems, setCartItems] = useState([]);
    const [orderInfo, setOrderInfo] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        addDress: '',
        paymentMethod: 'Khi nhận hàng' // Mặc định là tiền mặt
    });
    const navigate = useNavigate();
    const isLoggedIn = !!localStorage.getItem('token');

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
            return;
        } else {
            fetchCartItems();

        }
    }, [isLoggedIn, navigate]);

    const fetchCartItems = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:8000/api/cart', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setCartItems(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setOrderInfo({
            ...orderInfo,
            [name]: value
        });
    };

    const calculateTotalPrice = () => {
        return cartItems.reduce((total, item) => {
            return total + item.price * item.quantity;
        }, 0);
    };

    const handleCheckout = async () => {
        try {
            const token = localStorage.getItem('token');

            const orderData = {
                ...orderInfo,
                items: cartItems,
                totalPrice: calculateTotalPrice()
            };
            console.log("Sending order data:", orderData); // Log dữ liệu order để kiểm tra

            const res = await axios.post('http://localhost:8000/api/checkout', orderData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            alert('Thanh toán thành công! Mã đơn hàng: ' + res.data.orderId);

        } catch (err) {
            console.error(err);
            alert('Đã xảy ra lỗi trong quá trình thanh toán.');
        }
    };

    return (
        <div>
            <Nav />
            <div className='body-checkout'>
                <table className="table">
                    <thead>
                        <tr>
                            <th></th>
                            <th className='text-center' scope="col">Sản phẩm</th>
                            <th className='text-center' scope="col">Giá bán</th>
                            <th className='text-center' scope="col">Số lượng</th>
                            <th className='text-center' scope="col">Thành tiền</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cartItems.map(item => (
                            <tr key={item._id}>
                                <td className='img-checkout-body'>
                                    <img className='img-checkout' src={require(`../../asset/images-product/${item.image}`)} alt={item.productName} />
                                </td>
                                <td className='checkout-name'>
                                    <p className='name-product'>{item.productName}</p>
                                </td>
                                <td className='checkout-price'>{item.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
                                <td className='checkout-quantity'>{item.quantity}</td>
                                <td className='checkout-total total-price'>
                                    {(item.price * item.quantity).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className='customer-infor'>

                    <h4>Thông tin mua hàng</h4>
                    <form>
                        <div className="form-group mb-2">
                            <label className='mb-1' htmlFor="fullName">Họ và tên:</label>
                            <input
                                type="text"
                                className="form-control"
                                id="fullName"
                                name="fullName"
                                value={orderInfo.fullName}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group mb-2">
                            <label className='mb-1' htmlFor="email">Email:</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                name="email"
                                value={orderInfo.email}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group mb-2">
                            <label className='mb-1' htmlFor="phoneNumber">Số điện thoại:</label>
                            <input
                                type="text"
                                className="form-control"
                                id="phoneNumber"
                                name="phoneNumber"
                                value={orderInfo.phoneNumber}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group mb-2">
                            <label className='mb-1' htmlFor="addDress">Địa chỉ:</label>
                            <input
                                type="text"
                                className="form-control"
                                id="addDress"
                                name="addDress"
                                value={orderInfo.addDress}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-group">
                            <label className='mb-1' htmlFor="paymentMethod">Phương thức thanh toán: </label>
                            <select
                                className="form-control mb-2"
                                name="paymentMethod"
                                value={orderInfo.paymentMethod}
                                onChange={handleInputChange}
                            >
                                <option value="Khi nhận hàng">Thanh toán tiền mặt khi nhận hàng</option>
                                <option value="Thẻ tín dụng">Thanh toán bằng thẻ tín dụng</option>
                                <option value="Momo">Thanh toán bằng ví điện tử Momo</option>
                                <option value="ZaloPay">Thanh toán bằng ví điện tử ZaloPay</option>

                            </select>
                        </div>
                        <div className="checkout-total">
                            <h4>Tổng tiền: {calculateTotalPrice().toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</h4>
                        </div>
                        <button className='btn btn-success' onClick={handleCheckout}>Thanh toán</button>
                    </form>
                </div>



            </div>
            <Footer />
        </div>
    );
};

export default Checkout;
