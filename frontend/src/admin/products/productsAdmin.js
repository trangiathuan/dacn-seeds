import './productsAdmin.css';
import NavAdmin from "../component/nav-admin/nav-admin";
import Sidebar from "../component/sidebar/sidebar";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ProductsAdmin = () => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllProducts = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No token found');
                }

                const response = await axios.get('http://localhost:8000/api/getAllProduct', {
                    headers: {
                        Authorization: `Bearer ${token}` // Sử dụng Bearer token
                    }
                });
                setProducts(response.data); // Cập nhật state với dữ liệu sản phẩm
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

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!products.length) {
        return <div>No products found.</div>;
    }

    return (
        <div>
            <NavAdmin />
            <div className="row productsAdmin-body">
                <div className="col-3 sidebar-body">
                    <Sidebar />
                </div>
                <div className="col-9 content-body">
                    <div>
                        <button className='btn btn-success mt-3 mb-0'>
                            <a className=' btn-add' href='/admin/products-add'>Thêm sản phẩm</a>
                        </button>
                    </div>
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col"> </th>
                                <th className='text-center' scope="col">Sản phẩm</th>
                                <th className='text-center'>Loại sản phẩm</th>
                                <th className='text-center' scope="col">Chi tiết</th>
                                <th className='text-center' scope="col">Số lượng</th>
                                <th className='text-center' scope="col">Giá bán</th>
                                <th className='text-center' scope="col">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product._id}>
                                    <th>
                                        <img className='img-product-admin' src={require(`../../asset/images-product/${product.image}`)} alt={product.productName} />
                                    </th>
                                    <td className='name-product'>{product.productName}</td>
                                    <td className='categoryId-product'>
                                        {product.categoryID ? product.categoryID.categoryName : 'Không có danh mục'} {/* Kiểm tra nếu categoryID là null */}
                                    </td>
                                    <td className='description-product'>{product.description}</td>
                                    <td className='quantity-product'>{product.quantity}</td>
                                    <td className='price-product'>{product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
                                    <td>
                                        <Link to={`/admin/products-update/${product._id}`} className='btn btn-primary btn-product'>Cập nhật</Link>
                                        <Link to={`/admin/products-delete/${product._id}`} className='btn btn-danger btn-product'>Xóa</Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default ProductsAdmin;
