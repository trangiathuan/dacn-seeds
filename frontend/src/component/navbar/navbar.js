import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import './navbar.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API_URL from '../../config/config';
import { UserOutlined } from '@ant-design/icons';
import { Dropdown, Space } from 'antd';

const Nav = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(false); // Biến để kiểm soát hiển thị kết quả
    const resultsRef = useRef(null); // Tham chiếu đến phần tử danh sách tìm kiếm
    const isLoggedIn = !!localStorage.getItem('token');
    const [cartItemsCount, setCartItemsCount] = useState(0);
    const [cartItemsCount1, setCartItemsCount1] = useState(0);



    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                const userId = decoded.userId;

                axios.get(`${API_URL}/users/${userId}`)
                    .then(response => {
                        setUser(response.data);
                    })
                    .catch(error => {
                        console.error("Error fetching user data:", error);
                    });
            } catch (error) {
                console.error("Invalid token:", error);
            }
        }
        if (isLoggedIn) {
            fetchCartQuantity();
        }
        else {
            countCartItems();
            const intervalId = setInterval(countCartItems, 500);
            return () => clearInterval(intervalId);
        }

    }, [cartItemsCount]);

    const fetchCartQuantity = async () => {
        try {
            const token = localStorage.getItem('token'); // Lấy token từ localStorage

            if (!token) {
                console.log('Vui lòng đăng nhập để xem giỏ hàng');
                return;
            }

            const response = await axios.get(`${API_URL}/quantityCart/`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            setCartItemsCount(response.data)
        } catch (error) {
            console.error('Lỗi khi gọi API:', error);
        }
    };

    const countCartItems = () => {
        try {
            const cart = JSON.parse(localStorage.getItem('cartItems')) || {};
            let count = 0;
            for (let key in cart) {
                if (cart.hasOwnProperty(key)) {
                    count += 1;
                }
            }
            setCartItemsCount1(count);
        } catch (error) {
            console.error("Lỗi khi đếm sản phẩm trong giỏ hàng:", error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
        toast.success("Đăng xuất thành công");
        window.location.reload()
    };

    const handleLogin = () => {
        navigate('/login');
    };

    const items = [
        {
            label: <a onClick={() => navigate('/profile')}>Thông tin cá nhân</a>,
            key: '0',
        },
        {
            label: <a onClick={() => navigate('/order')}>Đơn hàng</a>,
            key: '1',
        },
        {
            type: 'divider',
        },
        {
            label: isLoggedIn ? <a onClick={handleLogout}>Đăng xuất</a> : <a onClick={handleLogin}>Đăng nhập</a>,
            key: '3',
        },
    ];

    const checkLogin = async () => {
        navigate('/cart')

        // try {
        //     if (!isLoggedIn)
        //         toast.warn("Yêu cầu đăng nhập !")
        //     else
        // }
        // catch (error) {
        //     console.error('Lỗi check đăng nhập', error);
        // }
    }

    // Hàm xử lý tìm kiếm
    const handleSearch = async () => {
        try {
            const response = await axios.get(`${API_URL}/search?q=${searchTerm}`);
            setSearchResults(response.data);
            setShowResults(true); // Hiển thị kết quả khi có dữ liệu
        } catch (error) {
            console.error('Error during product search:', error);
        }
    };

    // Hàm xử lý khi người dùng chọn sản phẩm từ kết quả tìm kiếm
    const handleProductSelect = (productId) => {
        navigate(`/product-detail/${productId}`);
        setShowResults(false); // Ẩn kết quả sau khi chọn sản phẩm
    };

    const handleClickOutside = (event) => {
        if (resultsRef.current && !resultsRef.current.contains(event.target)) {
            setShowResults(false); // Ẩn kết quả khi nhấp chuột bên ngoài
        }
    };

    useEffect(() => {
        // Thêm sự kiện lắng nghe
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            // Dọn dẹp sự kiện khi component unmount
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className='nav-all'>
            <div className='row'>
                <div className='col-2'>
                    <img className='logo' src={require("../../asset/Images/Logo.png")} alt="Logo" />
                </div>
                <div className='col-4'>
                    <div className="input-group mt-3 mb-3 nav-search">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Nhập sản phẩm cần tìm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    handleSearch();
                                }
                            }}
                        />
                        <button
                            className="btn btn-outline-secondary btn-search"
                            type="button"
                            id="button-addon2"
                            onClick={handleSearch}
                        >
                            <img src={require("../../asset/Images/search-interface-symbol.png")} />
                        </button>
                    </div>

                    {showResults && searchResults.length > 0 && (
                        <ul className="list-group search" ref={resultsRef}>
                            {searchResults.map(product => (
                                <li
                                    key={product._id}
                                    className="list-group-item"
                                    onClick={() => handleProductSelect(product._id)}
                                >
                                    <div className='row'>
                                        <div className='col-3'>
                                            <img className='img-search' src={require(`../../asset/images-product/${product.image}`)} />
                                        </div>
                                        <div className='col-9'>
                                            <span className='fw-semibold'>{product.productName}</span><br />
                                            <span>{product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className='col-nav'></div>
                <div className='col-1 mb-1 a-cart'>
                    <a className='btn btn-nav' onClick={checkLogin}>
                        <img className='cart' src={require('../../asset/Images/cart.png')} alt="Cart" />
                        <span className="badge bg-danger cout-cart">
                            {isLoggedIn ? cartItemsCount.count : cartItemsCount1}
                        </span>
                        <span>  Giỏ hàng</span>
                    </a>
                </div>
                <div className='mt-4 mb-1 login-nav'>
                    <Dropdown
                        menu={{ items }}
                        trigger={['click']}
                    >
                        <a onClick={(e) => e.preventDefault()}>
                            <Space style={{ cursor: 'pointer' }} >
                                <UserOutlined style={{ color: "black", cursor: 'pointer' }} />
                                <span className="dropdown-text">{user ? user.fullName : 'Tài Khoản'}</span>
                            </Space>
                        </a>
                    </Dropdown>
                </div>
            </div>
            <div className='sticky-sm-top'>
                <nav className="navbar navbar-expand-lg nav-bg">
                    <div className="dropdown ps-5">
                        <a className="btn dropdown nav-a" href="#" role="button" id="dropdownMenuLink">
                            <img className='icon-menu' src={require('../../asset/Images/menu.png')} alt="Menu" /> DANH MỤC SẢN PHẨM
                        </a>
                        <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                            <div className='row'>
                                <div className='col-4'>
                                    <a className="dropdown-item" href="/products-category/66acff98b05c1a4960364fb9">
                                        <img className='img-icon' src={require('../../asset/Images/plant.png')} alt="Plant" />
                                        Hạt Giống Cây Ăn Trái
                                    </a>
                                    <a className="dropdown-item" href="/products-category/66acff98b05c1a4960364fba">
                                        <img className='img-icon' src={require('../../asset/Images/leaf.png')} alt="Leaf" />
                                        Hạt Giống Rau Mầm
                                    </a>
                                    <a className="dropdown-item" href="/products-category/66acff98b05c1a4960364fbb">
                                        <img className='img-icon' src={require('../../asset/Images/willow.png')} alt="Willow" />
                                        Hạt Giống Dược Liệu
                                    </a>
                                    <a className="dropdown-item" href="/products-category/66acff98b05c1a4960364fbc">
                                        <img className='img-icon' src={require('../../asset/Images/golden-pothos.png')} alt="Golden Pothos" />
                                        Hạt Giống Cây Cảnh
                                    </a>
                                </div>
                                <div className='col-4'>
                                    <a className="dropdown-item" href="/products-category/66acff98b05c1a4960364fbd">
                                        <img className='img-icon' src={require('../../asset/Images/tomato.png')} alt="Tomato" />
                                        Hạt Giống Rau, Củ, Quả
                                    </a>
                                    <a className="dropdown-item" href="/products-category/66acff98b05c1a4960364fbe">
                                        <img className='img-icon' src={require('../../asset/Images/leaf2.png')} alt="Leaf 2" />
                                        Hạt Giống Rau Gia Vị
                                    </a>
                                    <a className="dropdown-item" href="/products-category/66acff98b05c1a4960364fbf">
                                        <img className='img-icon' src={require('../../asset/Images/flower.png')} alt="Flower" />
                                        Hạt Giống Hoa
                                    </a>
                                    <a className="dropdown-item" href="/products-category/66acff98b05c1a4960364fc0">
                                        <img className='img-icon' src={require('../../asset/Images/spider.png')} alt="Spider" />
                                        Hạt Giống Cỏ
                                    </a>
                                </div>
                                <div className='col-4 mt-5'>
                                    <img className='logo' src={require("../../asset/Images/Logo.png")} alt="Logo" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <a className="nav-link nav-a" aria-current="page" href="/">TRANG CHỦ</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link nav-a" href="/products">SẢN PHẨM</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link nav-a" href="#">VỀ CHÚNG TÔI</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link nav-a" href="#">LIÊN HỆ</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link nav-a" href="#">TIN TỨC</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link nav-a" href="/blog">BLOG</a>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>
        </div>
    );
};

export default Nav;
