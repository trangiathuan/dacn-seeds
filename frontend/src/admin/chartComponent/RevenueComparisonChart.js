import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import API_URL from '../../config/config';
//import './RevenueComparisonChart.css';

// Đăng ký các phần tử của chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const RevenueComparisonChart = () => {
    const [revenueData, setRevenueData] = useState(null);
    const [error, setError] = useState(null);
    const [month1, setMonth1] = useState(9); // Tháng đầu tiên
    const [year1, setYear1] = useState(2024); // Năm đầu tiên
    const [month2, setMonth2] = useState(10); // Tháng thứ hai
    const [year2, setYear2] = useState(2024); // Năm thứ hai

    // Gửi yêu cầu lấy dữ liệu doanh thu khi người dùng chọn tháng và năm
    useEffect(() => {
        const getRevenueData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No token found');
                }
                const response = await axios.get(`${API_URL}/revenue-comparison`, {
                    params: {
                        month1,
                        year1,
                        month2,
                        year2
                    },
                    headers: {
                        Authorization: `Bearer ${token}`

                    }
                });
                setRevenueData(response.data);
                console.log('Revenue Data:', response.data);
            } catch (error) {
                setError('Lỗi khi lấy dữ liệu doanh thu');
                console.error(error);
            }
        };

        getRevenueData();
    }, [month1, year1, month2, year2]);

    // Thay đổi tháng và năm để so sánh
    const handleChange = () => {
        // Triggers re-fetching data based on the selected month and year
    };

    return (
        <div className="chart-container">
            <h2>So Sánh Doanh Thu</h2>

            {/* Chọn tháng và năm */}
            <div>
                <label>Chọn tháng 1: </label>
                <select value={month1} onChange={(e) => setMonth1(Number(e.target.value))}>
                    {[...Array(12)].map((_, index) => (
                        <option key={index} value={index + 1}>
                            Tháng {index + 1}
                        </option>
                    ))}
                </select>

                <label>Chọn năm 1: </label>
                <input
                    type="number"
                    value={year1}
                    onChange={(e) => setYear1(Number(e.target.value))}
                />
            </div>

            <div>
                <label>Chọn tháng 2: </label>
                <select value={month2} onChange={(e) => setMonth2(Number(e.target.value))}>
                    {[...Array(12)].map((_, index) => (
                        <option key={index} value={index + 1}>
                            Tháng {index + 1}
                        </option>
                    ))}
                </select>

                <label>Chọn năm 2: </label>
                <input
                    type="number"
                    value={year2}
                    onChange={(e) => setYear2(Number(e.target.value))}
                />
            </div>

            {/* Hiển thị lỗi nếu có */}
            {error && <div className="error-message">{error}</div>}

            {/* Hiển thị biểu đồ nếu có dữ liệu */}
            {revenueData && (
                <Line
                    data={{
                        labels: revenueData.labels,
                        datasets: [
                            {
                                label: `Doanh thu Tháng ${month1}`,
                                data: revenueData.revenueMonth1,
                                borderColor: 'rgb(75, 192, 192)',
                                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                fill: true
                            },
                            {
                                label: `Doanh thu Tháng ${month2}`,
                                data: revenueData.revenueMonth2,
                                borderColor: 'rgb(255, 99, 132)',
                                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                                fill: true
                            }
                        ]
                    }}
                    options={{
                        responsive: true,
                        plugins: {
                            title: {
                                display: true,
                                text: `So Sánh Doanh Thu Tháng ${month1} và Tháng ${month2}`
                            },
                            tooltip: {
                                mode: 'index',
                                intersect: false,
                            },
                        },
                        scales: {
                            x: {
                                title: {
                                    display: true,
                                    text: 'Ngày trong tháng'
                                }
                            },
                            y: {
                                title: {
                                    display: true,
                                    text: 'Doanh thu (VNĐ)'
                                }
                            }
                        }
                    }}
                />
            )}
        </div>
    );
};

export default RevenueComparisonChart;
