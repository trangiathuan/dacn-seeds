import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';  // Sử dụng axios để gửi yêu cầu tới backend
import { jwtDecode } from 'jwt-decode';
import './navbar.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Nav = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState(''); // Thêm state cho từ khóa tìm kiếm
    const [searchResults, setSearchResults] = useState([]); // Thêm state cho kết quả tìm kiếm
    const isLoggedIn = !!localStorage.getItem('token');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                const userId = decoded.userId;

                // Gửi yêu cầu để lấy thông tin người dùng dựa trên userId
                axios.get(`http://localhost:8000/api/auth/users/${userId}`)
                    .then(response => {
                        setUser(response.data);  // Giả sử backend trả về đối tượng user với các trường như userName
                    })
                    .catch(error => {
                        console.error("Error fetching user data:", error);
                    });
            } catch (error) {
                console.error("Invalid token:", error);
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    // Hàm xử lý tìm kiếm
    const handleSearch = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/search?q=${searchTerm}`);
            setSearchResults(response.data); // Lưu trữ kết quả tìm kiếm
        } catch (error) {
            console.error('Error during product search:', error);
        }
    };

    const checkLogin = async () => {
        try {
            if (!isLoggedIn)
                toast.warn("Yêu cầu đăng nhập !")
            else
                navigate('/cart')
        }
        catch (error) {
            console.error('Lỗi check đăng nhập', error);
        }

    }

    // Hàm xử lý khi người dùng chọn sản phẩm từ kết quả tìm kiếm
    const handleProductSelect = (productId) => {
        navigate(`/product-detail/${productId}`); // Chuyển hướng đến trang chi tiết sản phẩm

    };

    return (
        <div className='nav-all'>
            <div className='row'>
                <div className='col-2'>
                    <img className='logo' src={require("../../asset/Images/Logo.png")} alt="Logo" />
                </div>
                <div className='col-5'>
                    <div className="input-group mt-3 mb-3 nav-search">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Nhập sản phẩm cần tìm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)} // Cập nhật từ khóa tìm kiếm
                        />
                        <button
                            className="btn btn-outline-secondary btn-search"
                            type="button"
                            id="button-addon2"
                            onClick={handleSearch} // Gọi hàm tìm kiếm khi nhấn nút
                        >
                            <img src={require("../../asset/Images/search-interface-symbol.png")} />
                        </button>
                    </div>

                    {/* Phần hiển thị kết quả tìm kiếm */}
                    {searchResults.length > 0 && (
                        <ul className="list-group search">
                            {searchResults.map(product => (
                                <li
                                    key={product._id}
                                    className="list-group-item"
                                    onClick={() => handleProductSelect(product._id)} // Chuyển hướng khi người dùng chọn sản phẩm
                                >
                                    {product.productName}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className='col-nav'></div>
                <div className='col-1 mb-1 a-cart'>
                    <a className='btn btn-nav' onClick={checkLogin}>
                        <img className='cart' src={require('../../asset/Images/cart.png')} alt="Cart" />
                        <span>  Giỏ hàng</span>
                    </a>
                </div>
                <div className='mt-4 mb-1 login-nav'>
                    {user ? (
                        <>
                            <p className='username-nav'>{user.fullName}</p> {/* Hiển thị userName hoặc email */}
                            <button onClick={handleLogout} className='btn btn-login'>Đăng xuất</button>
                        </>
                    ) : (
                        <a href='/login'>
                            <button className='btn btn-login'>
                                Đăng nhập
                            </button>
                        </a>
                    )}
                </div>
            </div>
            <div className='sticky-sm-top'>
                <nav className="navbar navbar-expand-lg nav-bg">
                    {/* Menu dropdown */}
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
