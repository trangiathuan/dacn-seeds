import React, { useEffect, useState } from 'react';
import './productsAdmin.css';
import NavAdmin from "../component/nav-admin/nav-admin";
import Sidebar from "../component/sidebar/sidebar";
import axios from 'axios';
import API_URL from '../../config/config';

const AddProduct = () => {
    const [productName, setProductName] = useState('');
    const [categoryID, setCategoryId] = useState('');
    const [category, setCategory] = useState([]); // Danh sách các loại sản phẩm
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [image, setImage] = useState(null); // Lưu file hình ảnh

    // Gọi API lấy danh mục khi component mount
    useEffect(() => {
        getCategory();
    }, []); // Thêm [] để gọi getCategory chỉ một lần khi component mount

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file); // Cập nhật state image với file người dùng chọn
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }

            const formData = new FormData();
            formData.append('productName', productName);
            formData.append('categoryID', categoryID);
            formData.append('description', description);
            formData.append('price', price);
            formData.append('quantity', quantity);
            if (image) formData.append('image', image); // Thêm hình ảnh vào formData

            const response = await axios.post(`${API_URL}/add-product`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data', // Đảm bảo gửi dữ liệu dưới dạng multipart
                }
            });

            if (response.status === 200) {
                alert("Sản phẩm đã được tạo thành công!");
                // Reset form
                setProductName('');
                setCategoryId('');
                setDescription('');
                setPrice('');
                setQuantity('');
                setImage(null);
            }
        } catch (error) {
            console.error("Có lỗi xảy ra:", error.response ? error.response.data : error.message);
            alert("Có lỗi xảy ra khi thêm sản phẩm!");
        }
    };

    const getCategory = async () => {
        try {
            const response = await axios.get(`${API_URL}/category`);
            setCategory(response.data); // Cập nhật danh sách category từ API
        } catch (error) {
            console.error('Có lỗi khi lấy danh mục sản phẩm!', error);
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
                    <h4 className='text-center mt-4'>THÊM SẢN PHẨM MỚI</h4>
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
                                    {/* Lặp qua danh sách category để hiển thị */}
                                    {category.map(cat => (
                                        <option key={cat._id} value={cat._id}>
                                            {cat.categoryName} {/* Giả sử danh mục có trường `name` */}
                                        </option>
                                    ))}
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
                                    onChange={handleImageChange} // Xử lý thay đổi file
                                />
                            </div>
                            <div>
                                <button type='submit' className='btn btn-primary btn-add-product'>Thêm sản phẩm</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddProduct;
