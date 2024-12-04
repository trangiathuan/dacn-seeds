import { Line } from 'react-chartjs-2';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import API_URL from '../../config/config';
import './RevenueChart.css';

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
const SalesRevenueChart = () => {
    const [revenueData, setRevenueData] = useState(null);
    const [error, setError] = useState(null);
    const [revenueType, setRevenueType] = useState('monthly');
    const [year, setYear] = useState(new Date().getFullYear());
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');



    const handleRevenueTypeChange = (type) => {
        setRevenueType(type);
        if (type === 'daily') {
            setStartDate('');
            setEndDate('');
        }
        getRevenueData(type);
    };

    const handleDateChange = () => {
        // Gửi yêu cầu với ngày bắt đầu và kết thúc
        if (startDate && endDate) {
            getRevenueData('daily', startDate, endDate);
        } else {
            alert("Vui lòng chọn ngày bắt đầu và ngày kết thúc!");
        }
    };

    const getRevenueData = async (type, startDate = '', endDate = '') => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }

            let url = `${API_URL}/${type}-revenue`;
            if (type === 'monthly') {
                url = `${API_URL}/monthly-revenue?year=${year}`;
            } else if (type === 'yearly') {
                url = `${API_URL}/yearly-revenue`;
            } else if (type === 'daily') {
                url = `${API_URL}/daily-revenue?startDate=${startDate}&endDate=${endDate}`;
            }

            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setRevenueData(response.data);
            setError(null);
        } catch (error) {
            setError(error.response ? error.response.data.msg : error.message);
            setRevenueData(null);
        }
    };

    // Hàm xuất dữ liệu doanh thu ra file Excel
    const exportRevenueToExcel = async () => {
        // Kiểm tra nếu là loại "daily", thì truyền vào startDate và endDate
        if (!startDate || !endDate) {
            alert("Vui lòng chọn ngày bắt đầu và ngày kết thúc!");
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }

            const url = `${API_URL}/export-revenue-excel?startDate=${startDate}&endDate=${endDate}`;

            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                responseType: 'arraybuffer', // Nhận dữ liệu nhị phân
            });

            // Kiểm tra xem dữ liệu trả về có hợp lệ không
            if (response.data && response.data.byteLength > 0) {
                // Tạo Blob từ dữ liệu trả về và tải xuống
                const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `Doanh_Thu_${startDate}_${endDate}.xlsx`; // Đặt tên file
                link.click();
            } else {
                console.error("File không hợp lệ.");
            }
        } catch (error) {
            console.error('Error exporting Excel:', error);
        }
    };

    useEffect(() => {
        getRevenueData(revenueType);
    }, [revenueType, year]);

    return (
        <div>
            <h2 className=" text-center mt-3 mb-3">THỐNG KÊ DOANH THU</h2>
            {
                revenueType === 'monthly' && (
                    <div className="revenue-type-buttons row">
                        <div className='col-7'></div>
                        <div className='col-1'>
                            <div className="year-selector">
                                <select
                                    id="yearSelect"
                                    className="form-control"
                                    value={year}
                                    onChange={(e) => setYear(e.target.value)}
                                >
                                    {[...Array(10).keys()].map(i => (
                                        <option key={i} value={2020 + i}>{2020 + i}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className='col'>
                            <button className="btn btn-primary btn-daily" onClick={() => handleRevenueTypeChange('daily')}>Ngày</button>
                            <button className="btn btn-secondary" onClick={() => handleRevenueTypeChange('monthly')}>Tháng</button>
                            <button className="btn btn-primary" onClick={() => handleRevenueTypeChange('yearly')}>Năm</button>
                        </div>
                    </div>
                )
            }

            {
                revenueType === 'yearly' && (
                    <div className="revenue-type-buttons row">
                        <div className='col-7'></div>
                        <div className='col-1'></div>
                        <div className='col'>
                            <button className="btn btn-primary btn-daily" onClick={() => handleRevenueTypeChange('daily')}>Ngày</button>
                            <button className="btn btn-secondary" onClick={() => handleRevenueTypeChange('monthly')}>Tháng</button>
                            <button className="btn btn-primary" onClick={() => handleRevenueTypeChange('yearly')}>Năm</button>
                        </div>
                    </div>
                )
            }

            {
                revenueType === 'daily' && (
                    <div className="revenue-type-buttons row">
                        <div className='col-3'></div>
                        <div className='col-5'>
                            <div className="year-selector yearsl">
                                <div className="date-selector row">
                                    <input
                                        className='form-control for-select'
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        placeholder="Chọn ngày bắt đầu"
                                    />
                                    <input
                                        className='form-control for-select'
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        placeholder="Chọn ngày kết thúc"
                                    />
                                    <button className="btn btn-info" onClick={handleDateChange}>Thống kê</button>
                                </div>
                            </div>
                        </div>
                        <div className='col'>
                            <button className="btn btn-primary btn-daily" onClick={() => handleRevenueTypeChange('daily')}>Ngày</button>
                            <button className="btn btn-secondary" onClick={() => handleRevenueTypeChange('monthly')}>Tháng</button>
                            <button className="btn btn-primary" onClick={() => handleRevenueTypeChange('yearly')}>Năm</button>
                            <button className="btn btn-info btn-export" onClick={exportRevenueToExcel}>
                                Export File
                            </button>
                        </div>
                    </div>
                )
            }

            {/* Nút xuất Excel */}
            <div className="export-excel">

            </div>

            {
                revenueData && revenueData.labels && revenueData.values ? (
                    <div className="chart-container">
                        <Line
                            data={{
                                labels: revenueData.labels,
                                datasets: [{
                                    label: 'Doanh thu',
                                    data: revenueData.values,
                                    borderColor: 'rgb(75, 192, 192)',
                                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                    fill: true
                                }]
                            }}
                        />
                    </div>
                ) : (
                    <div className="no-data-message">Không có dữ liệu doanh thu</div>
                )
            }

            {error && <div className="error-message">{error}</div>}
        </div>
    );
};

export default SalesRevenueChart;