import React, { useState, useEffect } from 'react';
import './productsAdmin.css';
import NavAdmin from "../component/nav-admin/nav-admin";
import Sidebar from "../component/sidebar/sidebar";
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import API_URL from '../../config/config';
import { toast, ToastContainer } from 'react-toastify';

const UpdateProduct = () => {
    const { id } = useParams(); // Lấy ID sản phẩm từ URL
    const [productName, setProductName] = useState('');
    const [categoryID, setCategoryId] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [image, setImage] = useState(''); // Lưu đường dẫn ảnh cũ
    const [imageFile, setImageFile] = useState(null); // Để lưu trữ tệp hình ảnh mới
    const navigate = useNavigate(); // Sử dụng navigate để điều hướng sau khi cập nhật thành công

    // Lấy dữ liệu sản phẩm từ API khi component mount
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No token found');
                }

                const response = await axios.get(`${API_URL}/products/${id}`, {
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
                setImage(product.image); // Lưu đường dẫn hình ảnh cũ
            } catch (error) {
                alert('Không thể lấy dữ liệu sản phẩm');
                console.error(error.message);
            }
        };

        fetchProduct();
    }, [id]);

    // Xử lý form submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(); // Tạo FormData để gửi tệp hình ảnh cùng dữ liệu khác

        // Append các thông tin khác vào formData
        formData.append('productName', productName);
        formData.append('categoryID', categoryID);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('quantity', quantity);

        // Nếu có hình ảnh mới, append vào FormData
        if (imageFile) {
            formData.append('image', imageFile);
        } else {
            formData.append('image', image || '');
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }

            // Gửi yêu cầu PUT để cập nhật sản phẩm
            const response = await axios.put(`${API_URL}/update-product/${id}`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`, // Thêm token vào header
                    'Content-Type': 'multipart/form-data', // Thông báo rằng đang gửi form-data
                }
            });

            if (response.status === 200) {
                toast.success('Sản phẩm đã được cập nhật thành công!');
                setTimeout(() => {
                    navigate('/admin/products'); // Điều hướng về trang danh sách sản phẩm
                }, 1500);
            } else {
                alert('Có lỗi xảy ra khi cập nhật sản phẩm!');
            }
        } catch (error) {
            alert('Có lỗi xảy ra khi gửi yêu cầu cập nhật!');
            console.error(error);
        }
    };

    // Xử lý thay đổi tệp hình ảnh
    const handleImageChange = (e) => {
        const file = e.target.files[0]; // Lấy tệp đầu tiên từ mảng file
        if (file) {
            setImageFile(file); // Lưu tệp vào state
            setImage(URL.createObjectURL(file)); // Hiển thị ảnh xem trước (nếu cần)
        }
    };

    return (
        <div>
            <NavAdmin />
            <ToastContainer />
            <div className="row productsAdmin-body">
                <div className="col-3 sidebar-body">
                    <Sidebar />
                </div>
                <div className="col-9 content-body">
                    <h4 className='text-center mt-4'>CẬP NHẬT SẢN PHẨM</h4>
                    <div className='add-product-body'>
                        <form className='form-add-product' onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="mb-2">Tên sản phẩm</label>
                                <input
                                    type="text"
                                    className="form-control mb-2"
                                    placeholder="Nhập tên sản phẩm"
                                    value={productName}
                                    onChange={(e) => setProductName(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label className='mb-2'>Loại sản phẩm</label>
                                <select
                                    className="form-control mb-2"
                                    value={categoryID}
                                    onChange={(e) => setCategoryId(e.target.value)}
                                >
                                    <option value="">Chọn loại sản phẩm</option>
                                    <option value="66acff98b05c1a4960364fb9">Hạt giống cây ăn trái</option>
                                    <option value="66acff98b05c1a4960364fba">Hạt giống rau mầm</option>
                                    <option value="66acff98b05c1a4960364fbb">Hạt giống thảo dược</option>
                                    <option value="66acff98b05c1a4960364fbc">Hạt giống cây cảnh</option>
                                    <option value="66acff98b05c1a4960364fbd">Hạt giống rau, củ, quả</option>
                                    <option value="66acff98b05c1a4960364fbe">Hạt giống cây gia vị</option>
                                    <option value="66acff98b05c1a4960364fbf">Hạt giống cây hoa</option>
                                    <option value="66acff98b05c1a4960364fc0">Hạt giống cây cỏ</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="mb-2">Mô tả</label>
                                <textarea
                                    className="form-control mb-2"
                                    placeholder="Nhập Mô tả"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label className="mb-2">Giá bán</label>
                                <input
                                    type="text"
                                    className="form-control mb-2"
                                    placeholder="Nhập Giá bán"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label className="mb-2">Số lượng</label>
                                <input
                                    type="text"
                                    className="form-control mb-2"
                                    placeholder="Nhập Số lượng"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label className="mb-2">Hình ảnh</label>
                                <input
                                    type="file"
                                    className="form-control mb-2"
                                    onChange={handleImageChange} // Xử lý thay đổi tệp
                                />
                            </div>
                            <div>
                                <button type='submit' className='btn btn-primary btn-add-product'>Cập nhật sản phẩm</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateProduct;
