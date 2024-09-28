import Nav from "../../component/navbar/navbar";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './products.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Products = () => {

    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState([]);
    const [loading, setLoading] = useState(true);  // Thêm trạng thái loading

    useEffect(() => {
        axios.get('https://dacn-seeds-1.onrender.com/product')
            .then(res => {
                console.log('Products data:', res.data);  // Log dữ liệu nhận được
                setProducts(res.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('There was an error fetching the products!', error);
            });
        console.log("products:", products)
        axios.get('https://dacn-seeds-1.onrender.com/category')
            .then(res => {
                setCategory(res.data);
            })
            .catch(error => {
                console.error('There was an error fetching the categories!', error);
            });
    }, []);

    const addToCart = (product) => {
        const isLoggedIn = !!localStorage.getItem('token');
        if (isLoggedIn) {
            addToCartDatabase(product);
        } else {
            toast.warn("Đăng nhập để thêm sản phẩm vào giỏ hàng");
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
            toast.success("Sản phẩm đã được thêm vào giỏ hàng");
        } catch (err) {
            console.error(err);
            toast.success("Đăng nhập để thêm sản phẩm vào giỏ hàng");
        }
    };
    if (loading) {
        return <div><Nav /><div class="spinner-border" role="status">
            <span class="visually-hidden text-center">Loading...</span>
        </div></div> // Hiển thị loading trong khi đợi dữ liệu
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
                <div className='col-9 row-cardProduct'>
                    <div className='row row-card-product'>
                        {products.map((item) => (
                            <div key={item._id} className='col-4 col-card-product'>
                                <div className="card">
                                    <img className="card-img card-img-top" src={require(`../../asset/images-product/${item.image}`)} alt="..." />
                                    <div className="card-body">
                                        <Link to={`/product-detail/${item._id}`}>
                                            <div className='card-name mb-2'>
                                                <p className="fw-bold">{item.productName}</p>
                                            </div>
                                            <p>Số lượng: <span className='mb-1 card-sl'>{item.quantity}</span></p>
                                            <h5>Giá: <span className='card-price'>{item.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
                                                <img className='img-sale' src={require('../../asset/Images/hot-deal.png')} alt="Sale" />
                                            </h5>
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
        </div>
    );
}

export default Products;
