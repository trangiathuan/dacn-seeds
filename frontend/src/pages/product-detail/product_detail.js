import './product_detail.css';
import Footer from "../../component/footer/footer";
import Nav from "../../component/navbar/navbar";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API_URL from '../../config/config';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const ProductDetail = () => {
    const [product, setProduct] = useState(null);  // Khởi tạo product là null để dễ kiểm tra
    const [comments, setComments] = useState([]); // State để lưu danh sách bình luận
    const [comment, setComment] = useState(''); // State để lưu comment mới
    const [loading, setLoading] = useState(true);  // Thêm trạng thái loading
    const { id } = useParams();

    useEffect(() => {
        const fetchProductAndComments = async () => {
            try {
                const resProduct = await axios.get(`${API_URL}/product-detail/${id}`);
                setProduct(resProduct.data);

                const resComments = await axios.get(`${API_URL}/${id}/comments`);
                setComments(resComments.data);


                setLoading(false);
            } catch (err) {
                console.log(err);
                setLoading(false);
            }
        };
        console.log(comments)
        fetchProductAndComments();
    }, [id]);

    const addToCart = () => {
        const isLoggedIn = !!localStorage.getItem('token');
        if (isLoggedIn) {
            addToCartDatabase(product);
        } else {
            addToLocalStorageCart(product)
        }
    };
    const addToLocalStorageCart = (product) => {
        const cart = JSON.parse(localStorage.getItem('cartItems')) || {};
        console.log(product)
        if (cart[product._id]) {
            cart[product._id].quantity += 1; // Tăng số lượng
        } else {
            cart[product._id] = {
                productId: product._id,
                productName: product.productName,
                image: product.image,
                price: product.price,
                quantity: 1
            };
        }
        localStorage.setItem('cartItems', JSON.stringify(cart));
        toast.success("Sản phẩm đã được thêm vào giỏ hàng");
        console.log(cart)
    };

    const addToCartDatabase = async (product) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_URL}/cart`, {
                productId: product._id,
                productName: product.productName,
                image: product.image,
                price: product.price,
                quantity: 1  // Giả sử số lượng mặc định là 1
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            toast.success("Sản phẩm đã được thêm vào giỏ hàng");
        } catch (err) {
            console.error(err);
            toast.error("Có lỗi xảy ra, vui lòng thử lại");
        }
    };

    const handleCommentChange = (value) => {
        setComment(value);
    };

    const handleCommentSubmit = async () => {
        const isLoggedIn = !!localStorage.getItem('token');
        if (isLoggedIn) {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.post(`${API_URL}/${id}/comment`, { comment }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setComment(''); // Reset comment sau khi submit
                window.location.reload();
                toast.success('Bình luận thành công')
            } catch (err) {
                console.error(err);
                toast.error('Có lỗi xảy ra, vui lòng thử lại');
            }
        } else {
            toast.warn("Đăng nhập để bình luận");
        }
    };

    if (loading) {
        return <div class="spinner-border" role="status">
            <span class="visually-hidden text-center">Loading...</span>
        </div> // Hiển thị loading trong khi đợi dữ liệu
    }

    if (!product) {
        return <div>Product not found</div>;  // Hiển thị thông báo khi không tìm thấy sản phẩm
    }

    return (
        <div>
            <Nav />
            <ToastContainer />  {/* Thêm ToastContainer vào giao diện */}
            <div className='product-detail-body'>
                <div className='product-detail'>
                    <div className='row'>
                        <div className='col-6'>
                            {product.image ? (
                                <img className='img-product' src={require(`../../asset/images-product/${product.image}`)} alt={product.productName} />
                            ) : (
                                <div>No image available</div>
                            )}
                        </div>
                        <div className='col-6 content-detail'>
                            <h3>{product.productName}</h3>
                            <p className='text-1'>Giao hàng toàn quốc - thanh toán khi nhận hàng</p>
                            <p className='price'>Giá bán:<span className='text-2'> {product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span> </p>
                            <p className='quantity'>Số lượng trong kho:<span className='text-3'> {product.quantity}</span> </p>
                            <p className='description'>Chi tiết: <span className='text-4'> {product.description}</span> </p>
                            <button onClick={addToCart} className="btn btn-success btn-cart-detail">Thêm vào giỏ hàng</button>
                        </div>
                    </div>
                </div>
                <div className='comment-detail '>
                    <div className='content-comment'>
                        <h4 className='mb-4'>ĐÁNH GIÁ SẢN PHẨM</h4>
                        {comments.length > 0 ? (
                            comments.map((comment, index) => (
                                <div className='row' key={index}>
                                    <div className='col-2 avt'>
                                        <img className='img-avt' src={require('../../asset/Images/account.png')} alt="avatar" />
                                    </div>
                                    <div className='commnet-text col-8'>
                                        <p className='name-user'>{comment.userID.fullName} <span className='date-comment'>{new Date(comment.createdAt).toLocaleDateString()}</span></p>
                                        <div dangerouslySetInnerHTML={{ __html: comment.comment }} />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p></p>
                        )}
                        <div className='box-comment'>
                            {/* ReactQuill thay thế textarea */}
                            <ReactQuill
                                value={comment} // Gắn giá trị từ state vào ReactQuill
                                onChange={handleCommentChange} // Sự kiện thay đổi giá trị
                                className='' // Đảm bảo giữ được lớp CSS của bạn
                            />

                            {/* Button bình luận */}
                            <button className='btn btn-primary btn-commnet' onClick={handleCommentSubmit}>
                                Bình luận
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ProductDetail;
