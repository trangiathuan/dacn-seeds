import React, { useState, useEffect } from 'react';
import Footer from '../../component/footer/footer';
import Nav from '../../component/navbar/navbar';
import './cart.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const navigate = useNavigate();
    const isLoggedIn = !!localStorage.getItem('token');

    useEffect(() => {
        if (!isLoggedIn) {
            alert("Yêu cầu đăng nhập ")
            navigate('/login');
            return;
        } else {
            // Nếu người dùng đã đăng nhập, tải giỏ hàng từ cơ sở dữ liệu
            fetchCartItems();
        }
    }, [isLoggedIn, navigate]);

    const fetchCartItems = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('https://dacn-seeds-1.onrender.com/api/cart', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setCartItems(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const updateCartItem = (id, quantity) => {
        if (quantity <= 0) return;

        // Nếu người dùng đã đăng nhập, cập nhật giỏ hàng trong cơ sở dữ liệu
        updateCartItemInDatabase(id, quantity);
    };

    const updateCartItemInDatabase = async (id, quantity) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`https://dacn-seeds-1.onrender.com/api/cart/${id}`, { quantity }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setCartItems(cartItems.map(item =>
                item._id === id ? { ...item, quantity } : item
            ));
        } catch (err) {
            console.error(err);
        }
    };

    const deleteCartItem = (id) => {
        console.log("Deleting item with id:", id);

        const token = localStorage.getItem('token');
        axios.delete(`https://dacn-seeds-1.onrender.com/api/cart/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(() => {
            const newCartItems = cartItems.filter(item => item._id !== id);
            setCartItems(newCartItems);
            console.log("Cart items after delete:", newCartItems);
        }).catch((err) => {
            console.error(err);
        });
    };

    const calculateTotalPrice = () => {
        return cartItems.reduce((total, item) => {
            return total + item.price * item.quantity;
        }, 0);
    };

    const handleProceedToCheckout = () => {
        navigate('/checkout');
    };

    return (
        <div>
            <Nav />
            <div className='body-cart'>
                <div>
                    <table className="table">
                        <thead>
                            <tr>
                                <th className='text-center' scope="col"></th>
                                <th className='text-center' scope="col">Sản phẩm</th>
                                <th className='text-center' scope="col">Giá bán</th>
                                <th className='text-center' scope="col">Số lượng</th>
                                <th className='text-center' scope="col"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.map(item => (
                                <tr key={item._id}>
                                    <td className='img-cart-body'>
                                        <img className='img-cart' src={require(`../../asset/images-product/${item.image}`)} alt={item.productName} />
                                    </td>
                                    <td className='cart-name'>
                                        <p className='name-product'>{item.productName}</p>
                                    </td>
                                    <td className='cart-price'>{item.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
                                    <td className='cart-quantity'>
                                        <input
                                            className='form-control input-cart'
                                            type='number'
                                            value={item.quantity}
                                            onChange={(e) => updateCartItem(item._id, parseInt(e.target.value))}
                                        />
                                    </td>
                                    <td className='cart-delete'>
                                        <button className='btn btn-danger' onClick={() => deleteCartItem(item._id)}>Xóa</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="cart-total">
                        <h5>Tổng tiền: {calculateTotalPrice().toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</h5>
                    </div>
                    <button className='btn btn-success' onClick={handleProceedToCheckout}>Tiến hành thanh toán</button>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Cart;


