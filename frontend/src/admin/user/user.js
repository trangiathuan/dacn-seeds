import './user.css';
import NavAdmin from "../component/nav-admin/nav-admin";
import Sidebar from "../component/sidebar/sidebar";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const UserAdmin = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No token found');
                }

                const response = await axios.get('https://dacn-seeds-1.onrender.com/api/getAllUsers', {
                    headers: {
                        Authorization: `Bearer ${token}` // Sử dụng Bearer token
                    }
                });
                setUsers(response.data); // Cập nhật state với dữ liệu sản phẩm
            } catch (error) {
                setError(error.response ? error.response.data.msg : error.message); // Xử lý lỗi
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    alert("Yêu cầu đăng nhập tài khoản Admin");
                    window.location.href = '/login'; // Điều hướng tới trang đăng nhập
                }
            } finally {
                setLoading(false); // Tắt trạng thái loading
            }
        };

        fetchAllUsers();
    }, []);

    const handleRoleChange = async (userId, newRole) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put('https://dacn-seeds-1.onrender.com/api/updateUserRole',
                { userId, role: newRole },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

            alert('Chức vụ đã được cập nhật thành công');
            // Cập nhật lại danh sách users sau khi thay đổi role
            setUsers(users.map(user =>
                user._id === userId ? { ...user, role: newRole } : user
            ));
        } catch (error) {
            console.error('Error updating user role:', error);
            alert('Đã xảy ra lỗi khi cập nhật chức vụ');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!users.length) {
        return <div>No users found.</div>;
    }

    return (
        <div>
            <NavAdmin />
            <div className="row productsAdmin-body">
                <div className="col-3 sidebar-body">
                    <Sidebar />
                </div>
                <div className="col-9 content-body">
                    <table className="table">
                        <thead>
                            <tr>
                                <th className='text-center' scope="col">Tài khoản</th>
                                <th className='text-center' scope="col">Họ và tên</th>
                                <th className='text-center' scope="col">Địa chỉ</th>
                                <th className='text-center' scope="col">Số điện thoại</th>
                                <th className='text-center' scope="col">Email</th>
                                <th className='text-center' scope="col">Chức vụ</th>
                                <th className='text-center' scope="col">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id}>
                                    <td className='text-center'>{user.userName}</td>
                                    <td className='text-center'>{user.fullName}</td>
                                    <td className='text-center'>{user.address}</td>
                                    <td className='text-center'>{user.phoneNumber}</td>
                                    <td className='text-center'>{user.email}</td>
                                    <td>
                                        <select
                                            value={user.role}
                                            onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                            className="form-select"
                                        >
                                            <option value="user">User</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </td>
                                    <td className='text-center'>
                                        <Link to={`/admin/products-delete/`} className='btn btn-danger btn-product'>Xóa</Link>
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

export default UserAdmin;
