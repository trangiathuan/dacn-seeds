import Footer from "../../component/footer/footer";
import Nav from "../../component/navbar/navbar";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import '../products/products.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductSearch = () => {
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation(); // Sử dụng useLocation để lấy thông tin query từ URL

    useEffect(() => {
        const fetchProducts = async () => {
            const query = new URLSearchParams(location.search).get('query'); // Lấy từ khóa tìm kiếm từ URL
            try {
                // Gửi yêu cầu tìm kiếm sản phẩm dựa trên từ khóa
                const productResponse = await axios.get(`http://localhost:8000/search?q=${query}`);
                setProducts(productResponse.data);

                // Gửi yêu cầu lấy danh mục sản phẩm
                const categoryResponse = await axios.get('http://localhost:8000/category');
                setCategory(categoryResponse.data);

                setLoading(false); // Dừng loading khi đã tải xong dữ liệu
            } catch (error) {
                console.error('There was an error fetching the products!', error);
                setLoading(false); // Dừng loading nếu có lỗi
            }
        };

        fetchProducts();
    }, [location.search]);

    const addToCart = (product) => {
        const isLoggedIn = !!localStorage.getItem('token');
        if (isLoggedIn) {
            addToCartDatabase(product);
        } else {
            toast.success("Đăng nhập để thêm sản phẩm vào giỏ hàng");
        }
    };

    const addToCartDatabase = async (product) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:8000/api/cart', {
                productName: product.productName,
                image: product.image,
                price: product.price,
                quantity: 1  // Số lượng mặc định là 1
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            toast.success("Sản phẩm đã được thêm vào giỏ hàng");
        } catch (err) {
            console.error(err);
            toast.warn("Đăng nhập để thêm sản phẩm vào giỏ hàng");
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
        ); // Hiển thị loading trong khi đợi dữ liệu
    }

    return (
        <div className="products">
            <Nav />
            <ToastContainer />
            <div className='row'>
                <div className='col-3 col-category'>
                    <div className='row row-category'>
                        <p className="category-title">DANH MỤC SẢN PHẨM</p>
                        {category.map((item) => (
                            <Link to={`/products-category/${item._id}`} key={item._id} className='a-category mt-3'>
                                <img className='img-icon-product' src={require(`../../asset/Images/${item.categoryIcon}`)} alt={item.categoryName} />
                                {item.categoryName}
                            </Link>
                        ))}
                    </div>
                </div>
                <div className='col-9'>
                    <div className='row row-card-product'>
                        {products.map((item) => (
                            <div key={item._id} className='col-4 col-card-product'>
                                <div className="card">
                                    <img className='card-img' src={require(`../../asset/images-product/${item.image}`)} alt={item.productName} />
                                    <div className="card-body">
                                        <Link to={`/product-detail/${item._id}`}>
                                            <div className='card-name mb-2'>
                                                <p className="fw-bold">{item.productName}</p>
                                            </div>
                                            <p>Số lượng: <span className='mb-1 card-sl'> {item.quantity}</span></p>
                                            <h5>Giá: <span className='card-price'> {item.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
                                                <img className='img-sale' src={require('../../asset/Images/hot-deal.png')} alt="Hot Deal" /></h5>
                                            <div className='card-title'>
                                                <h6 className='mb-2'>Giao hàng siêu nhanh</h6>
                                            </div>
                                        </Link>

                                        <button onClick={() => addToCart(item)} className="btn btn-success btn-cart">Thêm vào giỏ hàng</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default ProductSearch;
