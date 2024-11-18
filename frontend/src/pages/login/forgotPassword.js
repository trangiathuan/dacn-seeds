import './login.css';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API_URL from '../../config/config';

const ForgotPass = () => {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API_URL}/forgot-password`, { email });
            toast.success('Mật khẩu mới đã được gửi vể email');
        } catch (err) {
            toast.error('Đã có lỗi xảy ra, vui lòng thử lại!');
        }
    };

    return (
        <div className='brg'>
            <ToastContainer />
            <div className="login-container">
                <div className="login-content">
                    <form className="login-form" onSubmit={handleForgotPassword}>
                        <h3 className="text-center">QUÊN MẬT KHẨU</h3>
                        <div className="form-group">
                            <label htmlFor="email" className="mb-2">Nhập email đăng ký tài khoản</label>
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Nhập email của bạn"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary btn-block mt-4">Lấy lại mật khẩu</button>
                        <p className="text-center mt-3">
                            Bạn đã nhớ mật khẩu? <a href="/login">Đăng nhập</a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ForgotPass;
