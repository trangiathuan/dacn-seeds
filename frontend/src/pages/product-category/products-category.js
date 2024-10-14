import Footer from "../../component/footer/footer";
import Nav from "../../component/navbar/navbar";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import '../products/products.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API_URL from "../../config/config";
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Dropdown, message, Space, Tooltip } from 'antd';

const items = [
    {
        label: 'Mới nhất',
        key: '1',
    },
    {
        label: 'Bán chạy',
        key: '2',
    },
    {
        label: 'Giá thấp đến cao',
        key: '3',
    },
    {
        label: 'Giá cao đến thấp',
        key: '4',
    },

];
const ProductsCategory = () => {
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState([]);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const [sortKey, setSortKey] = useState('1'); // Mặc định sắp xếp theo 'Mới nhất'

    useEffect(() => {
        fetchProducts();
    }, [id, sortKey]);

    const fetchProducts = async () => {
        try {
            const productResponse = await axios.get(`${API_URL}/products-category/${id}?sort=${sortKey}`);
            setProducts(productResponse.data);

            const categoryResponse = await axios.get(`${API_URL}/category`);
            setCategory(categoryResponse.data);

            setLoading(false); // Đặt loading thành false sau khi dữ liệu đã được tải
        } catch (error) {
            console.error('There was an error fetching the products!', error);
            setLoading(false); // Đặt loading thành false ngay cả khi có lỗi
        }
    };

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
            await axios.post(`${API_URL}/cart`, {
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
            toast.warn("Đăng nhập để thêm sản phẩm vào giỏ hàng");
        }
    };

    // Menu sắp xếp
    const handleMenuClick = (e) => {
        setSortKey(e.key); // Cập nhật sortKey khi người dùng chọn mục
    };

    const menuProps = {
        items: items.map(item => ({
            ...item,
            onClick: handleMenuClick, // Thêm hàm xử lý sự kiện vào mỗi mục
        })),
    };
    // Menu sắp xếp

    if (loading) {
        return <div><Nav /><div class="spinner-border" role="status">
            <span class="visually-hidden text-center">Loading...</span>
        </div></div> // Hiển thị loading trong khi đợi dữ liệu
    }

    return (
        <div className="products">
            <Nav />
            <ToastContainer />
            <div className="arrange">
                <Space wrap>
                    <Dropdown menu={menuProps}>
                        <Button className="btn-arrange">
                            <Space>
                                Sắp xếp
                                <DownOutlined />
                            </Space>
                        </Button>
                    </Dropdown>
                </Space>
            </div>
            <div className='row'>
                <div className='col-3 col-category'>
                    <div className='row row-category'>
                        {/* <p className="category-title">DANH MỤC SẢN PHẨM</p>
                        {category.map((item) => (
                            <Link to={`/products-category/${item._id}`} key={item._id} className='a-category mt-3'>
                                <img className='img-icon-product' src={require(`../../asset/Images/${item.categoryIcon}`)} alt={item.categoryName} />
                                {item.categoryName}
                            </Link>
                        ))} */}

                        <ul class="list-group">
                            <li class="list-group-item d-flex justify-content-between align-items-center list-item">
                                <Link to={`/products/`} className='a-category mt-0'>
                                    <img className='img-icon-product' src={require(`../../asset/Images/mark.png`)} />
                                    Tất cả sản phẩm
                                    <span className="badge text-bg-success rounded-pill ms-2"> 64</span>
                                </Link>
                            </li>
                            {category.map((item) => (
                                <li class="list-group-item d-flex justify-content-between align-items-center list-item">
                                    <Link to={`/products-category/${item._id}`} key={item._id} className='a-category mt-0'>
                                        <img className='img-icon-product' src={require(`../../asset/Images/${item.categoryIcon}`)} alt={item.categoryName} />
                                        {item.categoryName}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                    </div>
                </div>
                <div className='col-9 row-cardProduct'>
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
            {/* <Footer /> */}
        </div>
    );
}

export default ProductsCategory;
