import './login.css';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_URL from '../../config/config';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Register = () => {
    const [userName, setUserName] = useState('');
    const [passWord, setPassWord] = useState('');
    const [fullName, setFullName] = useState('');
    const [birthDay, setBirthDay] = useState('');
    const [address, setAddress] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/register`, {
                userName, passWord, fullName, birthDay, address, phoneNumber, email
            });
            toast.success('Đăng ký thành công')
            setTimeout(() => {
                navigate('/login'); // Chuyển hướng đến trang đăng nhập sau khi đăng ký thành công
            }, 1500);
        } catch (err) {

            alert(err.response.data.message);
        }
    };

    return (
        <div className='brg'>
            <ToastContainer />
            <div className="login-container">
                <div className="login-content">
                    <form className="login-form" onSubmit={handleRegister}>
                        <h2 className="text-center">ĐĂNG KÝ TÀI KHOẢN</h2>
                        <div className="form-group">
                            <label htmlFor="userName" className="mb-2">Tài khoản</label>
                            <input type="text" className="form-control" placeholder="Nhập tên tài khoản" value={userName} onChange={(e) => setUserName(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="passWord" className="mb-2">Mật khẩu</label>
                            <input type="password" className="form-control" placeholder="Nhập mật khẩu" value={passWord} onChange={(e) => setPassWord(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="fullName" className="mb-2">Họ và tên</label>
                            <input type="text" className="form-control" placeholder="Nhập họ và tên" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="birthDay" className="mb-2">Ngày sinh</label>
                            <input type="date" className="form-control" placeholder="Nhập ngày sinh" value={birthDay} onChange={(e) => setBirthDay(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="address" className="mb-2">Địa chỉ</label>
                            <input type="text" className="form-control" placeholder="Nhập địa chỉ" value={address} onChange={(e) => setAddress(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="phoneNumber" className="mb-2">Số điện thoại</label>
                            <input type="text" className="form-control" placeholder="Nhập số điện thoại" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                        </div>
                        <div className="form-group mb-4">
                            <label htmlFor="email" className="mb-2">Email</label>
                            <input type="email" className="form-control" placeholder="Nhập email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <button type="submit" className="btn btn-primary btn-block login-formBtn">Đăng ký</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Register;
