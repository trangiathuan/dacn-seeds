import { useEffect, useState } from "react";
import NavAdmin from "../component/nav-admin/nav-admin";
import Sidebar from "../component/sidebar/sidebar";
import CategoryChart from "./CategoryChart";
import './dashboard.css'
import axios from "axios";


const Dashboard = () => {
    const [error, setError] = useState(null);

    useEffect(() => {

        axios.get('http://localhost:8000/api/dashboard', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(res => {
                console.log(res.data.message); // "Welcome to the admin dashboard"
                // Xử lý khi yêu cầu thành công, ví dụ: hiển thị dashboard
            })
            .catch(err => {
                console.error(err.response.data.msg); // Hiển thị lỗi từ backend
                if (err.response.status === 401 || err.response.status === 403) {
                    // Xử lý nếu người dùng không được xác thực hoặc không có quyền truy cập
                    alert("Yêu cầu đăng nhập tài khoản Admin"); // Hoặc điều hướng người dùng tới trang đăng nhập
                    window.location.href = '/login'; // Ví dụ điều hướng tới trang đăng nhập
                }
            });

    });

    const [totalOrders, setTotalOrders] = useState([])
    useEffect(() => {
        const fetchTotalOrders = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8000/api/totalOrders', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                // Bạn có thể lưu tổng số lượng vào state hoặc hiển thị trực tiếp trên giao diện
                setTotalOrders(response.data.totalOrders);
            } catch (error) {
                console.error('Error fetching total orders:', error);
            }
        };
        fetchTotalOrders();
    }, []);

    const [totalProducts, setTotalProducts] = useState([])

    useEffect(() => {
        const fetchTotalProducts = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8000/api/totalProducts', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                // Bạn có thể lưu tổng số lượng vào state hoặc hiển thị trực tiếp trên giao diện
                setTotalProducts(response.data.totalProducts);
            } catch (error) {
                console.error('Error fetching total orders:', error);
            }
        };
        fetchTotalProducts();
    }, []);

    const [totalUsers, setTotalUsers] = useState([])

    useEffect(() => {
        const fetchTotalUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8000/api/totalUsers', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                // Bạn có thể lưu tổng số lượng vào state hoặc hiển thị trực tiếp trên giao diện
                setTotalUsers(response.data.totalUsers);
            } catch (error) {
                console.error('Error fetching total orders:', error);
            }
        };
        fetchTotalUsers();
    }, []);

    if (error) {
        return <div>Error: {error}</div>;
    }
    return (
        <div>
            <NavAdmin />
            <div className="row">
                <div className="col-3 sidebar-body">
                    <Sidebar />
                </div>
                <div className="col-9 content-body">
                    <div className="row">
                        <div className="col-3 card-body-dashboard">
                            <div className="card-dashboard">
                                <h4 className="mt-2 text-center">ĐƠN HÀNG</h4>
                                <p className="mt-2 text-center sl-ds">{totalOrders}</p>
                            </div>
                        </div>
                        <div className="col-3 card-body-dashboard">
                            <div className="card-dashboard">
                                <h4 className="mt-2 text-center">SẢN PHẨM</h4>
                                <p className="mt-2 text-center sl-ds">{totalProducts}</p>
                            </div>
                        </div>
                        <div className="col-3 card-body-dashboard">
                            <div className="card-dashboard">
                                <h4 className="mt-2 text-center">TÀI KHOẢN</h4>
                                <p className="mt-2 text-center sl-ds">{totalUsers}</p>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="chart">
                            < CategoryChart />

                        </div>

                    </div>
                </div>

            </div>
        </div>
    )
}
export default Dashboard;