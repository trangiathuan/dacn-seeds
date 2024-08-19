import { Link } from "react-router-dom";
import Footer from "../../component/footer/footer";
import Nav from "../../component/navbar/navbar";
import React, { useState, useEffect } from 'react';
import axios from 'axios';


import './home.css';
const Home = () => {
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState([]);

    useEffect(() => {
        axios.get('https://dacn-seeds-1.onrender.com/product')
            .then(res => {
                setProducts(res.data);
            })
            .catch(error => {
                console.error('There was an error fetching the products!', error);
            });

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
            alert("Đăng nhập để thêm sản phẩm vào giỏ hàng");
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
            alert("Đăng nhập để thêm sản phẩm vào giỏ hàng");
        }
    };
    return (
        <div>

            <Nav />

            <div>
                <img className="home-banner" src={require('../../asset/Images/banner01.png')} />
            </div>


            <div>
                <div className="text-center mt-5">
                    <img className='icon-img' src={require('../../asset/Images/plant.png')} />
                    <span className='fs-4 fw-bold title-1'>Hạt giống chất lượng hàng đầu Việt Nam</span>
                    <img className='icon-img' src={require('../../asset/Images/plant.png')} />
                </div>
                <div className='title-2'>DANH MỤC SẢN PHẨM</div>
            </div>


            <div className='row mt-5'>
                <div className='col-2'></div>
                <div className='col-2'>
                    <a href='/products-category/66acff98b05c1a4960364fb9'>
                        <img className='img-category' src={require('../../asset/Images/category-traicay.jpg')} />
                        <p className='text-center title-category'>Hạt giống cây ăn trái</p>
                    </a>
                </div>
                <div className='col-2'>
                    <a href='/products-category/66acff98b05c1a4960364fba'>
                        <img className='img-category' src={require('../../asset/Images/category-raumamm.jpg')} />
                        <p className='text-center title-category'>Hạt giống rau mầm</p>
                    </a>
                </div>
                <div className='col-2'>
                    <a href='/products-category/66acff98b05c1a4960364fbb'>
                        <img className='img-category' src={require('../../asset/Images/category-thaoduoc.jpg')} />
                        <p className='text-center title-category'>Hạt giống thảo dược</p>
                    </a>
                </div>
                <div className='col-2'>
                    <a href='/products-category/66acff98b05c1a4960364fbc'>
                        <img className='img-category' src={require('../../asset/Images/category-caycanh.webp')} />
                        <p className='text-center title-category'>Hạt giống cây cảnh</p>
                    </a>
                </div>
                <div className='col-2'></div>
            </div>


            <div className='row'>
                <div className='col-2'></div>
                <div className='col-2'>
                    <a href='/products-category/66acff98b05c1a4960364fbd'>
                        <img className='img-category' src={require('../../asset/Images/category-raucu.jpg')} />
                        <p className='text-center title-category'>Hạt giống rau, củ, quả</p>
                    </a>
                </div>
                <div className='col-2'>
                    <a href='/products-category/66acff98b05c1a4960364fbe'>
                        <img className='img-category' src={require('../../asset/Images/category-giavi.jpg')} />
                        <p className='text-center title-category'>Hạt giống cây gia vị</p>
                    </a>
                </div>
                <div className='col-2'>
                    <a href='/products-category/66acff98b05c1a4960364fbf'>
                        <img className='img-category' src={require('../../asset/Images/category-hoa.jpg')} />
                        <p className='text-center title-category'>Hạt giống cây hoa</p>
                    </a>
                </div>
                <div className='col-2'>
                    <a href='/products-category/66acff98b05c1a4960364fc0'>
                        <img className='img-category' src={require('../../asset/Images/category-co.jpg')} />
                        <p className='text-center title-category'>Hạt giống cây cỏ</p>
                    </a>
                </div>
                <div className='col-2'></div>
            </div>


            <div>
                <div className="text-center mt-5">
                    <img className='icon-img' src={require('../../asset/Images/plant.png')} />
                    <span className='fs-4 fw-bold title-1'>Hạt giống chất lượng hàng đầu Việt Nam</span>
                    <img className='icon-img' src={require('../../asset/Images/plant.png')} />
                </div>
                <div className='title-2'>SẢN PHẨM NỔI BẬT</div>
            </div>


            <div className='row row-card'>
                {products.map((item) => (
                    <div className='col-3 col-card'>
                        <div class="card">
                            <img className='card-img' src={require(`../../asset/images-product/${item.image}`)} class="card-img-top" alt="..." />
                            <div class="card-body">
                                <Link to={`/product-detail/${item._id}`}>
                                    <div className='card-name mb-2' >
                                        <p class=" fw-bold ">{item.productName}</p>
                                    </div>
                                    <h7>Số lượng:<h7 className='mb-1 card-sl'>{item.quantity}</h7></h7>
                                    <h5>Giá:<h5 className='card-price'> {item.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</h5>
                                        <img className='img-sale' src={require('../../asset/Images/hot-deal.png')} /> </h5>
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
            <Footer />
        </div >
    );
}
export default Home;