import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import API_URL from '../../config/config';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ProductQuantityByCategoryChart = () => {
    const [categories, setCategories] = useState([]); // Lưu trữ danh sách các Category
    const [categoryId, setCategoryId] = useState(''); // Lưu trữ ID của category người dùng chọn
    const [chartData, setChartData] = useState(null); // Dữ liệu cho biểu đồ
    const [error, setError] = useState(''); // Lỗi nếu có
    const token = localStorage.getItem('token');

    // Lấy tất cả các danh mục khi component mount và chọn mặc định category đầu tiên
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${API_URL}/getAllCategoryAdmin`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }); // Lấy tất cả các Category
                setCategories(response.data); // Lưu trữ danh sách categories vào state

                // Nếu có danh mục, chọn category đầu tiên mặc định
                if (response.data.length > 0) {
                    setCategoryId(response.data[0]._id); // Chọn category đầu tiên làm mặc định
                    fetchProductQuantity(response.data[0]._id); // Tự động lấy thống kê của category đầu tiên
                }
            } catch (error) {
                console.error('Lỗi khi lấy danh mục:', error);
                setError('Không thể lấy danh mục.');
            }
        };

        fetchCategories();
    }, []);

    const handleCategoryIdChange = (event) => {
        const selectedCategoryId = event.target.value;
        setCategoryId(selectedCategoryId); // Cập nhật categoryId khi người dùng chọn category
        fetchProductQuantity(selectedCategoryId); // Gọi API để lấy thống kê ngay khi người dùng chọn
    };

    const fetchProductQuantity = async (selectedCategoryId) => {
        if (!selectedCategoryId) {
            setError('Vui lòng chọn danh mục.');
            return;
        }

        try {
            const response = await axios.get(`${API_URL}/quantity-by-category/${selectedCategoryId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log('Dữ liệu API:', response.data); // Kiểm tra dữ liệu API

            const data = response.data;

            if (!data.products || data.products.length === 0) {
                setError('Không có dữ liệu cho danh mục này.');
                return;
            }

            setChartData({
                labels: data.products.map(product => product.label), // Tên sản phẩm
                datasets: [
                    {
                        label: 'Số lượng sản phẩm',
                        data: data.products.map(product => product.value), // Số lượng sản phẩm theo category
                        backgroundColor: 'rgba(75, 192, 192, 0.7)', // Đậm hơn (alpha = 0.7)
                        borderColor: 'rgba(75, 192, 192, 1)', // Đậm hơn (alpha = 1)
                        borderWidth: 1,
                    },
                ],
            });
            setError(''); // Reset lỗi nếu có
        } catch (error) {
            setError('Không thể lấy dữ liệu cho danh mục này.');
            console.error(error);
        }
    };

    return (
        <div>
            <h2 className='text-center mt-3'>THỐNG KÊ SỐ LƯỢNG SẢN PHẨM THEO DANH MỤC</h2>

            {/* Dropdown để chọn category */}
            <div>
                <select
                    className='btn dropdown-toggle slcat'
                    id="categoryId"
                    value={categoryId}
                    onChange={handleCategoryIdChange}
                    style={{ marginRight: '10px' }}
                >
                    <option value="">Chọn danh mục</option>
                    {categories.map((category) => (
                        <option key={category._id} value={category._id}>
                            {category.categoryName}
                        </option>
                    ))}
                </select>
            </div>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* Biểu đồ cột nếu có dữ liệu */}
            <div className='bar-sl'>
                {chartData ? (
                    <Bar
                        data={chartData}
                        options={{
                            responsive: true,
                            plugins: {
                                title: {
                                    display: true,
                                    text: 'Số lượng sản phẩm',
                                },
                            },
                        }}
                    />
                ) : (
                    <p>Chưa có dữ liệu để hiển thị.</p>
                )}
            </div>
        </div>
    );
};

export default ProductQuantityByCategoryChart;
