import React, { useState, useEffect } from 'react';
import './productsAdmin.css';
import NavAdmin from "../component/nav-admin/nav-admin";
import Sidebar from "../component/sidebar/sidebar";
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';


const UpdateProduct = () => {
    const { id } = useParams(); // Lấy ID sản phẩm từ URL
    const [productName, setProductName] = useState('');
    const [categoryID, setCategoryId] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [image, setImage] = useState('');
    const navigation = useNavigate('');

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
            }
        };

        fetchProduct();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }
            const response = await axios.put(`http://localhost:8000/api/update-product/${id}`, {
                productName: productName,
                categoryID: categoryID,
                description: description,
                price: price,
                quantity: quantity,
                image: image,
            }, {
                headers: {
                    Authorization: `Bearer ${token}` // Thêm token vào header
                }
            });

            if (response.status === 200) {
                alert('Sản phẩm đã được cập nhật thành công!');
                navigation('/admin/products')
            } else {
                alert('Có lỗi xảy ra khi cập nhật sản phẩm!');
            }
        } catch (error) {
            alert('Có lỗi xảy ra khi gửi yêu cầu cập nhật!');
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
                                <label className="mb-2">Hình</label>
                                <input
                                    type="text"
                                    className="form-control mb-2"
                                    placeholder="Nhập Hình"
                                    value={image}
                                    onChange={(e) => setImage(e.target.value)}
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
}

export default UpdateProduct;
