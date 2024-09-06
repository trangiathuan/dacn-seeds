import './login.css';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [userName, setUserName] = useState('');
    const [passWord, setPassWord] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('https://dacn-seeds-1.onrender.com/api/auth/login', { userName, passWord });
            const { token, role } = res.data;
            localStorage.setItem('token', token);
            console.log(role)
            if (role === 'admin') {

                navigate('/admin/dashboard'); // Chuyển hướng đến trang admin nếu người dùng là admin
            } else {
                navigate('/'); // Chuyển hướng đến trang chủ hoặc trang khác nếu không phải admin
            }
        } catch (err) {
            alert('Tên tài khoản hoặc mật khẩu không đúng');
        }
    };

    return (
        <div className='brg'>
            <div className="login-container">
                <div className="login-content">
                    <form className="login-form" onSubmit={handleLogin}>
                        <h2 className="text-center">ĐĂNG NHẬP</h2>
                        <div className="form-group">
                            <label htmlFor="userName" className="mb-2">Tên tài khoản</label>
                            <input type="text" className="form-control" placeholder="Nhập tên tài khoản" value={userName} onChange={(e) => setUserName(e.target.value)} />
                        </div>
                        <div className="form-group mb-5">
                            <label htmlFor="passWord" className="mb-2">Mật khẩu</label>
                            <input type="password" className="form-control" placeholder="Nhập mật khẩu" value={passWord} onChange={(e) => setPassWord(e.target.value)} />
                        </div>
                        <button type="submit" className="btn btn-primary btn-block">Đăng nhập</button>
                        <p className="text-center mt-3">Bạn chưa có tài khoản đăng nhập? <a href="/register">Đăng ký</a></p>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;
