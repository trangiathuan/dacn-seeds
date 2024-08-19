import './product_detail.css'
import Footer from "../../component/footer/footer";
import Nav from "../../component/navbar/navbar";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ProductDetail = () => {
    const [product, setProduct] = useState(null);  // Khởi tạo product là null để dễ kiểm tra
    const [comments, setComments] = useState([]); // State để lưu danh sách bình luận
    const [comment, setComment] = useState(''); // State để lưu comment mới
    const [loading, setLoading] = useState(true);  // Thêm trạng thái loading
    const { id } = useParams();

    useEffect(() => {
        const fetchProductAndComments = async () => {
            try {
                const resProduct = await axios.get(`https://dacn-seeds-1.onrender.com/product-detail/${id}`);
                setProduct(resProduct.data);

                const resComments = await axios.get(`https://dacn-seeds-1.onrender.com/api/${id}/comments`);
                setComments(resComments.data);

                setLoading(false);  // Đặt loading thành false khi dữ liệu được tải
            } catch (err) {
                console.log(err);
                setLoading(false);  // Đặt loading thành false ngay cả khi có lỗi
            }
        };

        fetchProductAndComments();
    }, [id]);

    const addToCart = () => {
        const isLoggedIn = !!localStorage.getItem('token');
        if (isLoggedIn) {
            addToCartDatabase(product);
        } else {
            alert("Đăng nhập để thêm sản phẩm vào giỏ hàng")
        }
    };

    const addToCartDatabase = async (product) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post('https://dacn-seeds-1.onrender.com/api/cart', {
                productName: product.productName,
                image: product.image,
                price: product.price,
                quantity: 1  // Giả sử số lượng mặc định là 1
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            alert("Sản phẩm đã được thêm vào giỏ hàng");
        } catch (err) {
            console.error(err);
            alert("Có lỗi xảy ra, vui lòng thử lại");
        }
    };

    const handleCommentChange = (e) => {
        setComment(e.target.value);
    };

    const handleCommentSubmit = async () => {
        const isLoggedIn = !!localStorage.getItem('token');
        if (isLoggedIn) {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.post(`https://dacn-seeds-1.onrender.com/api/${id}/comment`, { comment }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setComment(''); // Reset comment sau khi submit
                window.location.reload();
            } catch (err) {
                console.error(err);
                alert('Có lỗi xảy ra, vui lòng thử lại');
            }
        } else {
            alert("Đăng nhập để bình luận");
        }
    };

    if (loading) {
        return <div>Loading...</div>;  // Hiển thị loading trong khi đợi dữ liệu
    }

    if (!product) {
        return <div>Product not found</div>;  // Hiển thị thông báo khi không tìm thấy sản phẩm
    }

    return (
        <div>
            <Nav />
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
                <div className='comment-detail'>
                    <div className='content-comment'>
                        <h3 className='mb-4'>NỘI DUNG BÌNH LUẬN</h3>
                        {comments.length > 0 ? (
                            comments.map((comment, index) => (
                                <div className='row' key={index}>
                                    <div className='col-2 avt'>
                                        <img className='img-avt' src={require('../../asset/Images/account.png')} alt="avatar" />
                                    </div>
                                    <div className='commnet-text col-8'>
                                        <p className='name-user'>{comment.userID.fullName} <span className='date-comment'>{new Date(comment.createdAt).toLocaleDateString()}</span></p>
                                        <p>{comment.comment}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p></p>
                        )}
                        <div className='box-comment'>
                            <h3 className='mb-4'>BÌNH LUẬN</h3>
                            <textarea
                                className='input-comment'
                                value={comment}
                                onChange={handleCommentChange}
                                type='text'
                            />
                            <button className='btn btn-primary btn-commnet' onClick={handleCommentSubmit}>Bình luận</button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ProductDetail;
