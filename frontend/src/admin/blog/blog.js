import './blog.css';
import NavAdmin from "../component/nav-admin/nav-admin";
import Sidebar from "../component/sidebar/sidebar";
import { toast, ToastContainer } from 'react-toastify';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from '../../config/config';
import { Button, Dropdown, Space } from 'antd';
import { DownOutlined } from '@ant-design/icons';


const BlogAdmin = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [blog, setBlog] = useState([]);
    const [loading, setLoading] = useState(true);
    const isLoggedIn = !!localStorage.getItem('token');

    useEffect(() => {
        getAllBlog();
    }, []);

    const getAllBlog = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/getAllBlogAdmin`,
                {
                    headers: {
                        Authorization: `Bearer ${token}` // Sử dụng Bearer token
                    }
                });
            setBlog(response.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            toast.error('Không thể lấy dữ liệu blog.');
        }
    };

    const handleDelete = async (blogId) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.post(`${API_URL}/deleteBlogAdmin`, { blogId }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.status === 200) {
                const updatedBlogs = blog.filter(b => b._id !== blogId);
                setBlog(updatedBlogs);
                toast.success('Xóa bài viết thành công.');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Bạn không được phép xoá bài viết của người khác');
        }
    };

    const handleUpdateStatus = async (blogId) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.put(`${API_URL}/updateStatusBlogAdmin`, { blogId }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.status === 200) {
                const updatedBlogs = blog.filter(b => b._id !== blogId);
                setBlog(updatedBlogs);
                toast.success('Cập nhật bài viết thành công.');
            }
        } catch (error) {
            console.error('Error:', error);

        }
    };

    return (
        <div>
            <NavAdmin />
            <ToastContainer />
            <div className="row productsAdmin-body">
                <div className="col-4 sidebar-body">
                    <Sidebar />
                </div>
                <div className="col-9 content-body">
                    {blog.map((blogItem) => {
                        const menuProps = {
                            items: [
                                {
                                    label: 'Xóa',
                                    key: '1',
                                    onClick: () => handleDelete(blogItem._id),
                                },
                                {
                                    label: 'Duyệt',
                                    key: '2',
                                    onClick: () => handleUpdateStatus(blogItem._id),
                                },
                            ],
                        };

                        return (
                            <div key={blogItem._id} className="main-content">
                                <div className="info-user-cmt">
                                    <img className='' src={require('../../asset/Images/account.png')} />
                                    <p className='name-info-user-cmt'>{blogItem.userId.fullName} <span className='date-comment ms-2'>{new Date(blogItem.createdAt).toLocaleDateString()}</span></p>
                                    <div className="option-menu">
                                        <Space wrap>
                                            <Dropdown menu={menuProps}>
                                                <Button className="btn-arrange">
                                                    <Space>
                                                        Tùy chọn
                                                        <DownOutlined />
                                                    </Space>
                                                </Button>
                                            </Dropdown>
                                        </Space>
                                    </div>
                                </div>
                                <hr />
                                <div className="content-write">
                                    <h4>{blogItem.title}</h4>
                                    <div dangerouslySetInnerHTML={{ __html: blogItem.content }} />
                                </div>
                                {blogItem.image && (
                                    <div className="brg-img mt-2 mb-3">
                                        <img className="img-blog" src={require(`../../asset/blog/${blogItem.image}`)} alt="Blog" />
                                    </div>
                                )}


                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    )
}
export default BlogAdmin