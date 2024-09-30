import React, { useEffect, useState } from 'react';
import Nav from "../../component/navbar/navbar";
import Footer from "../../component/footer/footer";
import './blog.css';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

const Blog = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [blog, setBlog] = useState([]);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getAllBlog()
    }, []);

    const getAllBlog = async () => {
        try {
            const response = await axios.get('https://dacn-seeds-1.onrender.com/api/getAllBlog');
            setBlog(response.data);
            setLoading(false)

        } catch (error) {
            console.error(error);
            toast.error('Không thể lấy dữ liệu blog.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        if (image) {
            formData.append('image', image);
        }

        const token = localStorage.getItem('token');
        setLoading(true)
        try {
            const response = await axios.post('https://dacn-seeds-1.onrender.com/api/blog', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`,
                },
            });


            setTimeout(() => {
                setTitle('');
                setContent('');
                setImage(null); // Reset image after submitting
                setLoading(false)
                getAllBlog()
                toast.success('Đăng bài viết thành công');
            }, 500);


        } catch (err) {
            console.error(err);
            toast.error('Yêu cầu nhập nội dung và tiêu đề');
        }
    };

    const handleLike = async (blogId) => {

        const token = localStorage.getItem('token'); // Lấy token từ localStorage
        try {
            const response = await axios.post('https://dacn-seeds-1.onrender.com/api/like',
                { blogId },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            // Cập nhật số lượt thích trong state
            const updatedBlogs = blog.map(b =>
                b._id === blogId ? { ...b, totalLike: response.data.totalLike } : b
            );
            setBlog(updatedBlogs);

            toast.success(response.data.message); // Hiển thị thông báo
        } catch (error) {
            console.error('Error:', error);
            toast.error('Có lỗi xảy ra khi thích bài viết.');
        }
    };

    const handleDelete = async (blogId) => {
        const token = localStorage.getItem('token')
        try {
            const response = await axios.delete('https://dacn-seeds-1.onrender.com/api/deleteBlog',
                { blogId },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );
            toast.success('Xóa bài viết thành công.');
        } catch (error) {
            console.error('Error:', error);
            toast.error('Có lỗi xảy ra khi xoá bài viết.');
        }
    }
    if (loading) {
        return (<div>
            <Nav />
            <div class="spinner-border" role="status">
                <span class="visually-hidden text-center">Loading...</span>
            </div>
        </div>)
    }
    return (
        <div>
            <Nav />
            <ToastContainer />
            <div>
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
                            <textarea
                                className="form-control form-control-lg mt-2"
                                placeholder="Nội dung"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
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
                    {blog.map((blog) => (
                        <div key={blog._id} className="main-content">
                            <div className="info-user-cmt">
                                <img className='' src={require('../../asset/Images/account.png')} />
                                <p className='name-info-user-cmt'>{blog.userId.fullName} <span className='date-comment ms-2'>{new Date(blog.createdAt).toLocaleDateString()}</span></p>
                                <div className="option-menu">
                                    <div class="dropdown">
                                        <button class="btn btn-option" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            <img src={require('../../asset/Images/option.png')} />
                                        </button>
                                        <ul class="dropdown-menu">
                                            <li><a class="dropdown-item" href="#" onClick={() => handleDelete(blog._id)}>Xóa</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <hr />
                            <div className="content-write">
                                <h4>{blog.title}</h4>
                                <p>{blog.content}</p>
                            </div>
                            {blog.image && (
                                <div className="brg-img mt-2 mb-3">
                                    <img className="img-blog" src={require(`../../asset/blog/${blog.image}`)} alt="Blog" />
                                </div>
                            )}
                            <div>
                                <span>{blog.totalLike} thích</span>
                                <span className="ms-3">15 Bình luận</span>
                                <div>
                                    <hr />
                                    <button
                                        type="button"
                                        className="btn btn-primary btn-like"
                                        onClick={() => handleLike(blog._id)} // blogId là ID của blog
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
                                    <input class="form-control form-control-lg mt-3" type="text" placeholder="Bình luận" aria-label=".form-control-lg example" />
                                    <button type="button" class="btn btn-primary mt-3 btn-comment">
                                        <img src={require("../../asset/Images/send.png")} />
                                    </button>
                                </div>

                            </div>
                        </div>

                    ))}
                </div>
            </div>
            <Footer />
        </div >
    );
}

export default Blog;
