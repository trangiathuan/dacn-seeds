import Nav from "../../component/navbar/navbar";
import Footer from "../../component/footer/footer";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './products.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DownOutlined } from '@ant-design/icons';
import { Button, Dropdown, Space, Pagination } from 'antd';
import API_URL from "../../config/config";

const items = [
    { label: 'Mới nhất', key: '1' },
    { label: 'Bán chạy', key: '2' },
    { label: 'Giá thấp đến cao', key: '3' },
    { label: 'Giá cao đến thấp', key: '4' },
];

const Products = () => {
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortKey, setSortKey] = useState('1');
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalProducts, setTotalProducts] = useState(0);

    useEffect(() => {
        getAllProducts();
        getCategory();
    }, [sortKey, currentPage]);

    const getAllProducts = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/product?sort=${sortKey}&page=${currentPage}&limit=${limit}`);
            setProducts(res.data.products);
            setTotalProducts(res.data.pagination.totalProducts);
        } catch (error) {
            console.error('There was an error fetching the products!', error);
        } finally {
            setLoading(false);
        }
    };

    const getCategory = () => {
        axios.get(`${API_URL}/category`)
            .then(res => {
                setCategory(res.data);
            })
            .catch(error => {
                console.error('There was an error fetching the categories!', error);
            });
    };

    const addToCart = (product) => {
        const isLoggedIn = !!localStorage.getItem('token');
        if (isLoggedIn) {
            addToCartDatabase(product);
        } else {
            addToLocalStorageCart(product);
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
                quantity: 1
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            toast.success("Thêm sản phẩm vào giỏ hàng");
        } catch (err) {
            console.error(err);
            toast.error("Có lỗi xảy ra khi thêm vào giỏ hàng");
        }
    };

    const handleMenuClick = (e) => {
        setSortKey(e.key);
        setCurrentPage(1); // Reset trang khi thay đổi sắp xếp
    };

    const menuProps = {
        items: items.map(item => ({
            ...item,
            onClick: handleMenuClick,
        })),
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
                        <ul className="list-group">
                            <li className="list-group-item d-flex justify-content-between align-items-center list-item">
                                <Link to={`/products/`} className='a-category mt-0'>
                                    <img className='img-icon-product' src={require(`../../asset/Images/mark.png`)} />
                                    Tất cả sản phẩm
                                    <span className="badge text-bg-success rounded-pill ms-2">{totalProducts}</span>
                                </Link>
                            </li>
                            {category.map((item) => (
                                <li className="list-group-item d-flex justify-content-between align-items-center list-item" key={item._id}>
                                    <Link to={`/products-category/${item._id}`} className='a-category mt-0'>
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
                                    <img className="card-img-top" src={require(`../../asset/images-product/${item.image}`)} alt="..." />
                                    <div className="card-body">
                                        <Link to={`/product-detail/${item._id}`}>
                                            <div className='card-name mb-2'>
                                                <p className="fw-bold">{item.productName}</p>
                                            </div>
                                            <p className="mb-0">Số lượng: <span className='mb-1 card-sl'>{item.quantity}</span></p>
                                            <h5>Giá: <span className='card-price'>{item.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
                                                <img className='img-sale' src={require('../../asset/Images/hot-deal.png')} alt="Sale" />
                                            </h5>
                                            <div className='card-title'>
                                                <h6 className='mb-2'>Giao hàng nhanh</h6>
                                            </div>
                                        </Link>
                                        <button onClick={() => addToCart(item)} className="btn btn-success btn-cart">Thêm vào giỏ hàng</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="pagination mt-3">
                    <Pagination
                        current={currentPage}
                        pageSize='8'
                        total={totalProducts}
                        onChange={(page) => {
                            setCurrentPage(page);
                        }}
                    />
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Products;
