import React, { useEffect, useState } from 'react';
import Nav from '../../component/navbar/navbar.js';
import './profile.css';
import API_URL from '../../config/config.js';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { toast, ToastContainer } from 'react-toastify';
import { Tabs, List, Typography, Image, Divider, Card, Row, Col, Input, Button } from 'antd';

const { Title, Text } = Typography;

const Profile = () => {
    const [profileData, setProfileData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        birthDay: '',
        address: '',
        phoneNumber: '',
        email: '',
        role: 'user',
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });

    useEffect(() => {
        if (token) {
            try {
                const decoded = jwtDecode(token);
                const userId = decoded.userId;

                axios.get(`${API_URL}/users/${userId}`)
                    .then(response => {
                        setProfileData(response.data);
                        setFormData({
                            fullName: response.data.fullName,
                            birthDay: response.data.birthDay,
                            address: response.data.address,
                            phoneNumber: response.data.phoneNumber,
                            email: response.data.email,
                            role: response.data.role
                        });
                    })
                    .catch(error => {
                        console.error("Error fetching user data:", error);
                    });
            } catch (error) {
                console.error("Invalid token:", error);
            }
        }

    }, []);

    const token = localStorage.getItem('token');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleUpdateProfile = () => {
        const decoded = jwtDecode(token);
        const userId = decoded.userId;
        // Call API to update profile
        axios.put(`${API_URL}/update/${userId}`, formData)
            .then(response => {
                toast.success('Cập nhật thông tin thành công');
                setIsEditing(false);  // Dừng chế độ chỉnh sửa
                setProfileData(response.data.user);  // Cập nhật dữ liệu người dùng mới
            })
            .catch(error => {
                toast.error('Lỗi khi cập nhật thông tin');
                console.error('Error updating profile:', error);
            });
    };

    const handleInputChangePassword = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleChangePassword = () => {
        // Kiểm tra xem mật khẩu mới và xác nhận mật khẩu có khớp không
        if (formData.newPassword !== formData.confirmNewPassword) {
            toast.error('Mật khẩu mới và xác nhận mật khẩu không khớp');
            return;
        }

        // Lấy token từ localStorage
        const token = localStorage.getItem('token');

        if (!token) {
            toast.error('Token không tồn tại. Vui lòng đăng nhập lại!');
            return;
        }

        // Giải mã token để lấy userId
        const decoded = jwtDecode(token);
        const userId = decoded.userId;

        // Gửi yêu cầu API để đổi mật khẩu
        axios.put(`${API_URL}/change-password/${userId}`, {
            oldPassword: formData.oldPassword,
            newPassword: formData.newPassword,
            confirmNewPassword: formData.confirmNewPassword // Đảm bảo gửi trường này
        }, {
            headers: {
                'Authorization': `Bearer ${token}` // Đưa token vào header để xác thực
            }
        })
            .then(response => {
                toast.success('Đổi mật khẩu thành công');
                setFormData({
                    oldPassword: '',
                    newPassword: '',
                    confirmNewPassword: ''
                });
            })
            .catch(error => {
                toast.error('Lỗi khi đổi mật khẩu');
                console.error('Error changing password:', error.response?.data?.message || error.message);
            });
    };



    const profileTab = () => {
        if (!profileData) return <div>Loading...</div>;

        return (
            <div>
                <Card style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }} bordered={false}>
                    <Row gutter={[16, 16]} style={{ marginBottom: '10px' }}>
                        <Col span={12}>
                            <Title level={5}>Họ và Tên:</Title>
                            <Text>{profileData.fullName}</Text>
                        </Col>
                        <Col span={12}>
                            <Title level={5}>Ngày sinh:</Title>
                            <Text>{new Date(profileData.birthDay).toLocaleDateString()}</Text>
                        </Col>
                    </Row>

                    <Row gutter={[16, 16]} style={{ marginBottom: '10px' }}>
                        <Col span={12}>
                            <Title level={5}>Email:</Title>
                            <Text>{profileData.email}</Text>
                        </Col>
                        <Col span={12}>
                            <Title level={5}>Số điện thoại:</Title>
                            <Text>{profileData.phoneNumber}</Text>
                        </Col>
                    </Row>

                    <Row gutter={[16, 16]} style={{ marginBottom: '10px' }}>
                        <Col span={24}>
                            <Title level={5}>Địa chỉ:</Title>
                            <Text>{profileData.address}</Text>
                        </Col>
                    </Row>

                </Card>
            </div>
        );
    };


    const updateProfileTab = () => {
        return (
            <div style={{ maxWidth: '900px', margin: '20px auto' }}>
                <Card
                    bordered={false}
                    style={{ padding: '20px', backgroundColor: '#f9f9f9', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
                >


                    <div>
                        <Row gutter={16} style={{ marginBottom: '16px' }}>
                            <Col span={12}>
                                <Input
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    placeholder="Nhập họ và tên"
                                    style={{ borderRadius: '8px' }}
                                />
                            </Col>
                            <Col span={12}>
                                <Input
                                    name="birthDay"
                                    type="date"
                                    value={formData.birthDay}
                                    onChange={handleInputChange}
                                    placeholder="Chọn ngày sinh"
                                    style={{ borderRadius: '8px' }}
                                />
                            </Col>
                        </Row>
                        <Row gutter={16} style={{ marginBottom: '16px' }}>
                            <Col span={12}>
                                <Input
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="Nhập email"
                                    style={{ borderRadius: '8px' }}
                                />
                            </Col>
                            <Col span={12}>
                                <Input
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleInputChange}
                                    placeholder="Nhập số điện thoại"
                                    style={{ borderRadius: '8px' }}
                                />
                            </Col>
                        </Row>
                        <Row gutter={16} style={{ marginBottom: '16px' }}>
                            <Col span={24}>
                                <Input
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    placeholder="Nhập địa chỉ"
                                    style={{ borderRadius: '8px' }}
                                />
                            </Col>
                        </Row>

                        <Divider />

                        <Button
                            type="primary"
                            onClick={handleUpdateProfile}
                            style={{
                                width: '100%',
                                padding: '12px 0',
                                fontSize: '16px',
                                borderRadius: '8px',
                                backgroundColor: '#4A90E2',
                                borderColor: '#4A90E2',
                            }}
                        >
                            Cập nhật thông tin
                        </Button>
                    </div>
                </Card>
            </div>
        );
    };

    const changePasswordTab = () => {
        return (
            <div style={{ maxWidth: '900px', margin: '20px auto' }}>
                <Card
                    bordered={false}
                    style={{
                        padding: '20px',
                        backgroundColor: '#f9f9f9',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        display: 'flex',
                        justifyContent: 'center', // Căn giữa theo chiều ngang
                        alignItems: 'center',     // Căn giữa theo chiều dọc
                        height: '100%',            // Đảm bảo chiều cao của card phủ đầy không gian
                    }}
                >
                    <div style={{ width: '100%', maxWidth: '500px' }}>  {/* Giới hạn độ rộng của phần tử bên trong Card */}
                        {/* Các input nằm dọc và căn giữa */}
                        <Row gutter={16} style={{ marginBottom: '16px' }}>
                            <Col span={24}>
                                <Input
                                    type="password"
                                    name="oldPassword"
                                    value={formData.oldPassword}
                                    onChange={handleInputChangePassword}
                                    placeholder="Mật khẩu cũ"
                                    style={{
                                        borderRadius: '8px',
                                        width: '100%',    // Chiếm toàn bộ chiều rộng của cột
                                        margin: '0 auto'   // Căn giữa input
                                    }}
                                />
                            </Col>
                        </Row>
                        <Row gutter={16} style={{ marginBottom: '16px' }}>
                            <Col span={24}>
                                <Input
                                    type="password"
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleInputChangePassword}
                                    placeholder="Mật khẩu mới"
                                    style={{
                                        borderRadius: '8px',
                                        width: '100%',    // Chiếm toàn bộ chiều rộng của cột
                                        margin: '0 auto'   // Căn giữa input
                                    }}
                                />
                            </Col>
                        </Row>
                        <Row gutter={16} style={{ marginBottom: '16px' }}>
                            <Col span={24}>
                                <Input
                                    type="password"
                                    name="confirmNewPassword"
                                    value={formData.confirmNewPassword}
                                    onChange={handleInputChangePassword}
                                    placeholder="Xác nhận mật khẩu mới"
                                    style={{
                                        borderRadius: '8px',
                                        width: '100%',    // Chiếm toàn bộ chiều rộng của cột
                                        margin: '0 auto'   // Căn giữa input
                                    }}
                                />
                            </Col>
                        </Row>

                        {/* Divider */}
                        <Divider />

                        {/* Button đổi mật khẩu */}
                        <Button
                            type="primary"
                            onClick={handleChangePassword}
                            style={{
                                width: '100%',  // Chiếm toàn bộ chiều rộng
                                padding: '8px 16px',  // Thu nhỏ padding để nút gọn hơn
                                fontSize: '14px',  // Giảm kích thước font
                                borderRadius: '8px',
                                backgroundColor: '#4A90E2',
                                borderColor: '#4A90E2',
                                marginTop: '10px'  // Thêm khoảng cách phía trên cho nút
                            }}
                        >
                            Đổi mật khẩu
                        </Button>
                    </div>
                </Card>
            </div>
        );
    };






    const items = [
        { key: '0', label: 'Thông tin', children: profileTab() },
        { key: '2', label: 'Cập nhật thông tin', children: updateProfileTab() },
        { key: '3', label: 'Đổi mật khẩu', children: changePasswordTab() }

    ];

    return (
        <div>
            <Nav />
            <ToastContainer />
            <div className='tabs-body'>
                <div className='tabs btn-tabs'>
                    <Tabs className="custom-tabs" defaultActiveKey="0" items={items} centered />
                </div>
            </div>
        </div>
    );
};

export default Profile;
