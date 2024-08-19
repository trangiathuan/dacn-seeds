import Footer from "../../component/footer/footer";
import Nav from "../../component/navbar/navbar";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import '../products/products.css';

const ProductsCategory = () => {
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState([]);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const productResponse = await axios.get(`https://dacn-seeds-1.onrender.com/products-category/${id}`);
                setProducts(productResponse.data);

                const categoryResponse = await axios.get('https://dacn-seeds-1.onrender.com/category');
                setCategory(categoryResponse.data);

                setLoading(false); // Đặt loading thành false sau khi dữ liệu đã được tải
            } catch (error) {
                console.error('There was an error fetching the products!', error);
                setLoading(false); // Đặt loading thành false ngay cả khi có lỗi
            }
        };

        fetchProducts();
    }, [id]);

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

    if (loading) {
        return <div>Loading...</div>; // Hiển thị thông báo chờ khi dữ liệu đang được tải
    }

    return (
        <div className="products">
            <Nav />
            <div className='row'>
                <div className='col-3 col-category'>
                    <div className='row row-category'>
                        <h4 className=''>DANH MỤC SẢN PHẨM</h4>
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
                                    <img className='card-img' src={require(`../../asset/images-product/${item.image}`)} class="card-img-top" alt={item.productName} />
                                    <div className="card-body">
                                        <Link to={`/product-detail/${item._id}`}>
                                            <div className='card-name mb-2'>
                                                <p className="fw-bold">{item.productName}</p>
                                            </div>
                                            <h7>Số lượng:<span className='mb-1 card-sl'> {item.quantity}</span></h7>
                                            <h5>Giá:<span className='card-price'> {item.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
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

export default ProductsCategory;
