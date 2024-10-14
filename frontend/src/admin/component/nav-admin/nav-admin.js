import './nav-admin.css'
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';  // Sử dụng axios để gửi yêu cầu tới backend
import API_URL from '../../../config/config.js';

const NavAdmin = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                const userId = decoded.userId;

                // Gửi yêu cầu để lấy thông tin người dùng dựa trên userId
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
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };
    return (
        <div>
            <nav class="navbar navbar-body navbar-expand-lg bg-body-tertiary">
                <div class="container-fluid">
                    <img className='logo-nav-admin' src={require("../../../asset/Images/Logo.png")} alt="Logo" />
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul class="navbar-nav me-auto mb-2 mb-lg-0">

                        </ul>
                        <div class="d-flex mt-2" role="search">
                            <img className='notification' src={require('../../../asset/Images/bell.png')} />
                            {user ? (
                                <>
                                    <p className='username-nav'>{user.fullName}</p> {/* Hiển thị userName hoặc email */}
                                    <button onClick={handleLogout} className='btn btn-login'>Đăng xuất</button>
                                </>
                            ) : (
                                <div></div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    )
}
export default NavAdmin;