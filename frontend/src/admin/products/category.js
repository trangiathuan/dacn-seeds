import './productsAdmin.css';
import NavAdmin from "../component/nav-admin/nav-admin";
import Sidebar from "../component/sidebar/sidebar";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import API_URL from '../../config/config';

const CategoryAdmin = () => {
    const [categorys, setCategorys] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryToDelete, setCategoryToDelete] = useState(null); // State lưu danh mục cần xóa

    useEffect(() => {
        const fetchAllProducts = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No token found');
                }

                const response = await axios.get(`${API_URL}/getAllCategoryAdmin`, {
                    headers: {
                        Authorization: `Bearer ${token}` // Sử dụng Bearer token
                    }
                });
                setCategorys(response.data); // Cập nhật state với dữ liệu sản phẩm
            } catch (error) {
                setError(error.response ? error.response.data.msg : error.message); // Xử lý lỗi
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    // Xử lý nếu người dùng không được xác thực hoặc không có quyền truy cập
                    alert("Yêu cầu đăng nhập tài khoản Admin"); // Hoặc điều hướng người dùng tới trang đăng nhập
                    window.location.href = '/login'; // Ví dụ điều hướng tới trang đăng nhập
                }
            } finally {
                setLoading(false); // Tắt trạng thái loading
            }
        };

        fetchAllProducts(); // Gọi hàm fetch khi component được mount
    }, []);

    // Filter categories based on search query
    const filteredCategorys = categorys.filter(category =>
        category._id.toLowerCase().includes(searchQuery.toLowerCase()) ||  // Tìm theo mã sản phẩm
        category.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return <div class="spinner-border" role="status">
            <span class="visually-hidden text-center">Loading...</span>
        </div> // Hiển thị loading trong khi đợi dữ liệu
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!categorys.length) {
        return <div>No products found.</div>;
    }

    // Function to handle delete button click
    const handleDeleteClick = (category) => {
        setCategoryToDelete(category); // Lưu danh mục vào state khi nhấn nút xóa
    };

    // Function to handle category deletion
    const handleDeleteCategory = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token || !categoryToDelete) return; // Kiểm tra token và categoryToDelete

            // Gọi API để xóa danh mục
            const response = await axios.delete(`${API_URL}/deleteCategoryAdmin/${categoryToDelete._id}`, {
                headers: {
                    Authorization: `Bearer ${token}` // Đảm bảo gửi token trong header
                }
            });
            setCategorys(categorys.filter((category) => category._id !== categoryToDelete._id)); // Cập nhật danh sách sau khi xóa
            setCategoryToDelete(null); // Reset categoryToDelete

            window.location.reload()
        } catch (error) {
            console.error('Error deleting category:', error);
            alert('Không thể xóa danh mục');
        }
    };

    return (
        <div>
            <NavAdmin />
            <div className="row productsAdmin-body">
                <div className="col-3 sidebar-body">
                    <Sidebar />
                </div>
                <div className="col-9 content-body">
                    <div className='row'>
                        <div className='col-6'>
                        </div>
                        <div className="col-2 search-bar-pro mt-3">
                            {/* Input for search query */}
                            <input
                                type="text"
                                placeholder="Tìm kiếm theo danh mục"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)} // Update search query
                                className="form-control search-input"
                            />
                        </div>
                        <div className='col-2 btn-addd'>
                            <button className='btn btn-success mt-3 mb-0'>
                                <a className=' btn-add' href='/admin/category-add'>Thêm danh mục</a>
                            </button>
                        </div>
                    </div>
                    <table className="table table-category">
                        <thead>
                            <tr>
                                <th scope="col cat-col-icon"> Icon</th>
                                <th className='text-center cat-col-sp' scope="col">Tên loại sản phẩm</th>
                                <th className='text-center cat-col' scope="col">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCategorys.map((category) => (
                                <tr key={category._id}>
                                    <th>
                                        <img className='img-product-admin' src={require(`../../asset/Images/${category.categoryIcon}`)} alt={category.categoryIcon} />
                                    </th>
                                    <td className='name-product'>{category.categoryName}</td>
                                    <td>
                                        <Link to={`/admin/category-update/${category._id}`} className='btn btn-primary btn-product btn-cat'>Cập nhật</Link>
                                        <button type='button' className='btn btn-danger btn-product'
                                            data-bs-toggle="modal"
                                            data-bs-target="#delete"
                                            onClick={() => handleDeleteClick(category)}>Xóa</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Delete Confirmation */}
            <div className="modal fade" id="delete" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Xác nhận xoá danh mục</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            Bạn có muốn xoá danh mục: <strong>
                                {categoryToDelete && categoryToDelete.categoryName}</strong>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                            <button type="button" className="btn btn-danger" onClick={handleDeleteCategory}>Xoá</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryAdmin;
