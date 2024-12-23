import React, { useState, useEffect } from 'react';
import Footer from '../../component/footer/footer';
import Nav from '../../component/navbar/navbar';
import './checkout.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { toast, ToastContainer } from 'react-toastify';
import API_URL from '../../config/config';

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
        fetchCartItems();
        getInfotUser();
    }, [isLoggedIn]);

    const fetchCartItems = async () => {
        try {
            if (isLoggedIn) {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${API_URL}/cart`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setCartItems(res.data);
            } else {
                const storedCartItems = JSON.parse(localStorage.getItem('cartItems')) || {};
                setCartItems(Object.values(storedCartItems));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const getInfotUser = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                const userId = decoded.userId;
                const response = await axios.get(`${API_URL}/users/${userId}`);
                const userData = response.data;

                // Cập nhật orderInfo với thông tin người dùng
                setOrderInfo(prevState => ({
                    ...prevState,
                    fullName: userData.fullName,
                    email: userData.email,
                    phoneNumber: userData.phoneNumber,
                    addDress: userData.address // Cập nhật địa chỉ
                }));
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
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

    const handleCheckout = async (event) => {
        event.preventDefault();
        try {
            const orderData = {
                ...orderInfo,
                items: cartItems,
                totalPrice: calculateTotalPrice()
            };

            // Nếu người dùng chưa đăng nhập, gửi yêu cầu đến một endpoint riêng để lưu đơn hàng
            if (!isLoggedIn) {
                const res = await axios.post(`${API_URL}/checkout-guest`, orderData);
                await toast.success('Đặt hàng thành công');
            } else {
                const token = localStorage.getItem('token');
                const res = await axios.post(`${API_URL}/checkout`, orderData, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

            }
            toast.success('Đặt hàng thành công');
            setTimeout(() => {
                navigate('/');
            }, 1500);
        } catch (err) {
            console.error(err);
            alert('Đã xảy ra lỗi trong quá trình thanh toán: ' + err.message);
        }
    };

    return (
        <div>
            <Nav />
            <ToastContainer />
            <div className='row body-checkout '>
                <div className='table-checkout'>
                    <table className="col-6 table ">
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
                            {Array.isArray(cartItems) && cartItems.map(item => (
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
                </div>
                <div className='col-6 customer-infor '>
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
                        <button className='btn btn-success' onClick={handleCheckout}>Đặt hàng</button>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Checkout;
