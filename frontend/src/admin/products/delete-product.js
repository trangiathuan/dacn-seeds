import React, { useState, useEffect } from 'react';
import './productsAdmin.css';
import NavAdmin from "../component/nav-admin/nav-admin";
import Sidebar from "../component/sidebar/sidebar";
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';

const DeleteProduct = () => {
    const { id } = useParams(); // Lấy ID sản phẩm từ URL
    const [productName, setProductName] = useState('');
    const [categoryID, setCategoryId] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [image, setImage] = useState('');
    const navigate = useNavigate(); // Sử dụng useNavigate để điều hướng
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No token found');
                }

                const response = await axios.get(`http://localhost:8000/api/products/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}` // Thêm token vào header
                    }
                });

                const product = response.data;
                setProductName(product.productName);
                setCategoryId(product.categoryID);
                setDescription(product.description);
                setPrice(product.price);
                setQuantity(product.quantity);
                setImage(product.image);
            } catch (error) {
                alert('Không thể lấy dữ liệu sản phẩm');
                console.error(error.message);
            } finally {
                setLoading(false); // Tắt trạng thái loading
            }
        };

        fetchProduct();
    }, [id]);

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }

            await axios.delete(`http://localhost:8000/api/products/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}` // Thêm token vào header
                }
            });

            alert('Sản phẩm đã được xóa thành công');
            navigate('/admin/products'); // Điều hướng về trang danh sách sản phẩm sau khi xóa thành công
        } catch (error) {
            alert('Có lỗi xảy ra khi xóa sản phẩm');
            console.error(error.message);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <NavAdmin />
            <div className="row productsAdmin-body">
                <div className="col-3 sidebar-body">
                    <Sidebar />
                </div>
                <div className="col-9 content-body">
                    <h4 className='text-center mt-4'>Bạn có muốn xóa sản phẩm: <span className='name-delete'>{productName}</span></h4>
                    <div className='delete-product-body'>
                        <div className='row'>
                            <div className='image-product-delete col-5'>
                                <img className='image-product' src={require(`../../asset/images-product/${image}`)} alt={productName} />
                            </div>
                            <div className='product-detail-delete col-5'>
                                <h4>{productName}</h4>
                                <p className='price'>Giá bán:<span className='text-2'> {price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span> </p>
                                <p className='quantity'>Số lượng trong kho:<span className='text-3'> {quantity}</span> </p>
                                <p className='description'>Chi tiết: <span className='text-4'> {description} </span> </p>
                                <Link to='/admin/products' className='btn btn-primary btn-delete-product-back'>Trở về</Link>
                                <button className='btn btn-danger btn-delete-product' onClick={handleDelete}>Xóa</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default DeleteProduct;
