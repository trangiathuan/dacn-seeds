import React, { useState } from 'react';
import Nav from "../../component/navbar/navbar";
import Footer from "../../component/footer/footer";
import './blog.css';
import axios from 'axios';

const Blog = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        if (image) {
            formData.append('image', image);
        }

        const token = localStorage.getItem('token');

        try {
            const response = await axios.post('/api/blogs', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`,
                },
            });
            setSuccess('Blog đã được tạo thành công!');
            setTitle('');
            setContent('');
            setImage(null);
        } catch (err) {
            setError('Có lỗi xảy ra khi tạo blog. Vui lòng thử lại.');
        }
    };

    return (
        <div>
            <Nav />
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
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        {success && <p style={{ color: 'green' }}>{success}</p>}
                    </div>
                    <div className="main-content">
                        <div className="info-user-cmt">
                            <img className='' src={require('../../asset/Images/account.png')} />
                            <p className='name-info-user-cmt'>Tran Gia Thuận <span className='date-comment ms-2'>24/09/2024</span></p>
                            <div className="option-menu">
                                <div class="dropdown">
                                    <button class="btn btn-option" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <img src={require('../../asset/Images/option.png')} />
                                    </button>
                                    <ul class="dropdown-menu">
                                        <li><a class="dropdown-item" href="#">Xóa</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <hr />
                        <div className="content-write">
                            <p>[THÔNG BÁO]
                                Triển khai chương trình học bổng quốc tế E-International tài trợ lên tới 70% học phí cho chương trình IELTS và tiếng Anh giao tiếp.
                            </p>
                        </div>
                        <div className="brg-img mt-2 mb-3">
                            <img className="img-blog" src={require('../../asset/images-product/h01.jpg')} />
                        </div>
                        <div>
                            <span>12 thích</span>
                            <span className="ms-3">15 Bình luận</span>
                        </div>
                        <div>
                            <hr />
                            <button type="button" class="btn btn-primary btn-like">
                                <img src={require("../../asset/Images/like.png")} />
                                <span>Thích</span>
                            </button>
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
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Blog;
