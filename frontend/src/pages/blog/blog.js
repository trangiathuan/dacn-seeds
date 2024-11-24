import React, { useEffect, useState } from 'react';
import Nav from "../../component/navbar/navbar";
import Footer from "../../component/footer/footer";
import './blog.css';
import axios from 'axios';
import API_URL from '../../config/config';
import { toast, ToastContainer } from 'react-toastify';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { DownOutlined } from '@ant-design/icons';
import { Button, Dropdown, Space } from 'antd';

const Blog = () => {
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
            const response = await axios.get(`${API_URL}/getAllBlog`);
            setBlog(response.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            toast.error('Không thể lấy dữ liệu blog.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isLoggedIn) {
            toast.warn('Yêu cầu đăng nhập');
            return;
        }
        if (!title || !content) {
            toast.error('Vui lòng nhập tiêu đề và nội dung.');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        if (image) {
            formData.append('image', image);
        }

        const token = localStorage.getItem('token');

        try {
            await axios.post(`${API_URL}/blog`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`,
                },

            });
            toast.success('Bài viết của bạn đã được đăng tải thành công, chờ người quản trị xét duyệt')
            setTimeout(() => {
                setTitle('');
                setContent('');
                setImage(null);
                getAllBlog();
            }, 1000);

        } catch (err) {
            console.error(err);
            toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
        }
    };

    const handleLike = async (blogId) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.post(`${API_URL}/like`, { blogId }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            const updatedBlogs = blog.map(b =>
                b._id === blogId ? { ...b, totalLike: response.data.totalLike } : b
            );
            setBlog(updatedBlogs);
        } catch (error) {
            console.error('Error:', error);
            toast.error('Có lỗi xảy ra khi thích bài viết.');
        }
    };

    const handleDelete = async (blogId) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.post(`${API_URL}/deleteBlog`, { blogId }, {
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

    if (loading) {
        return (
            <div>
                <Nav />
                <div className="spinner-border" role="status">
                    <span className="visually-hidden text-center">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Nav />
            <ToastContainer />
            <div className="main-blog">
                <div className="main-write">
                    <div className="input-write">
                        <p className="title-write">Đăng bài viết</p>
                        <input
                            className="form-control form-control-lg"
                            type="text"
                            placeholder="Tiêu đề"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                        <ReactQuill
                            value={content}
                            onChange={setContent}
                            className="mt-2"
                            theme="snow"
                        />
                    </div>
                    <div className="btn-write">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImage(e.target.files[0])}
                            style={{ display: 'none' }}
                            id="upload-image"
                        />
                        <label htmlFor="upload-image" className="btn btn-add-img1">
                            <img className="img1" src={require('../../asset/Images/image.png')} alt="Thêm ảnh" />
                            <span> Thêm ảnh</span>
                        </label>
                        <button type="button" className="btn btn-add-img2" onClick={handleSubmit}>
                            <img className="img2" src={require('../../asset/Images/edit.png')} alt="Đăng bài" />
                            <span> Đăng bài</span>
                        </button>
                    </div>
                </div>
                {blog.map((blogItem) => {
                    const menuProps = {
                        items: [
                            {
                                label: 'Xóa',
                                key: '1',
                                onClick: () => handleDelete(blogItem._id),
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
                            <div>
                                <span>{blogItem.totalLike} thích</span>
                                <span className="ms-3">15 Bình luận</span>
                                <div>
                                    <hr />
                                    <button
                                        type="button"
                                        className="btn btn-primary btn-like"
                                        onClick={() => handleLike(blogItem._id)}
                                    >
                                        <img src={require("../../asset/Images/like.png")} alt="Like" />
                                        <span>Thích</span>
                                    </button>
                                </div>
                            </div>
                            <div className="comment">
                                <hr />
                                <div className="info-user-cmt mt-3">
                                    <img className='' src={require('../../asset/Images/account.png')} />
                                    <div>
                                        <div className="content-comment-blog">
                                            <p className='name-info-user-cmt'>Tran Gia Thuận <span className='date-comment'>24/09/2024</span></p>
                                            <p>Nhớ không em lời hứa ngày xưa, mình bên nhau dưới ánh trăng đã nguyện thề, rằng đôi mình có nhau không bao giờ lìa xa</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="input-cmt">
                                    <hr />
                                    <input className="form-control form-control-lg mt-3" type="text" placeholder="Bình luận" aria-label=".form-control-lg example" />
                                    <button type="button" className="btn btn-primary mt-3 btn-comment">
                                        <img src={require("../../asset/Images/send.png")} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            <Footer />
        </div>
    );
}

export default Blog;
