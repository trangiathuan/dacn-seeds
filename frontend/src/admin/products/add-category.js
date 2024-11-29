import React, { useEffect, useState } from 'react';
import './productsAdmin.css';
import NavAdmin from "../component/nav-admin/nav-admin";
import Sidebar from "../component/sidebar/sidebar";
import axios from 'axios';
import API_URL from '../../config/config';

const AddCategory = () => {
    const [categoryName, setCategoryName] = useState('');
    const [categoryIcon, setIcon] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setIcon(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }
            console.log("icon nè", categoryIcon)
            const formData = new FormData();
            formData.append('categoryName', categoryName);
            formData.append('categoryIcon', categoryIcon);



            const response = await axios.post(`${API_URL}/addCategoryAdmin`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                }
            });

            if (response.status === 200) {
                alert("Sản phẩm đã được tạo thành công!");
                // Reset form
                setCategoryName('');
                setIcon(null);

            }
        } catch (error) {
            console.error("Có lỗi xảy ra:", error.response ? error.response.data : error.message);
            alert("Có lỗi xảy ra khi thêm sản phẩm!");
        }
    };

    return (
        <div>
            <NavAdmin />
            <div className="row productsAdmin-body-cat">
                <div className="col-3 sidebar-body">
                    <Sidebar />
                </div>
                <div className="col-9 content-body">
                    <h4 className='text-center mt-4'>THÊM DANH MỤC</h4>
                    <div className='add-cat-body'>
                        <form className='form-add-product' onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="mb-2">Tên danh mục</label>
                                <input
                                    type="text"
                                    className="form-control mb-2"
                                    placeholder="Nhập tên danh mục"
                                    value={categoryName}
                                    onChange={(e) => setCategoryName(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label className="mb-2">Icon</label>
                                <input
                                    type="file"
                                    className="form-control mb-2"
                                    onChange={handleImageChange} // Xử lý thay đổi file
                                />
                            </div>
                            <div>
                                <button type='submit' className='btn btn-primary btn-add-product'>Thêm danh mục</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddCategory;
