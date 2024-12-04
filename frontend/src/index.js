import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// import pages
import Home from './pages/home/home';
import Login from './pages/login/login';
import Register from './pages/login/register';
import Products from './pages/products/products';
import ProductDetail from './pages/product-detail/product_detail';
import ProductsCategory from './pages/product-category/products-category';
import Cart from './pages/cart/cart';
import Checkout from './pages/checkout/checkout';
import Blog from './pages/blog/blog';
import UserAdmin from './admin/user/user';
import Profile from './pages/profile/profile';
import ForgotPass from './pages/login/forgotPassword';

// import admin pages
import Dashboard from './admin/dashboard/dashboard';
import ProductsAdmin from './admin/products/productsAdmin';
import AddProduct from './admin/products/add-product';
import UpdateProduct from './admin/products/update-product';
import DeleteProduct from './admin/products/delete-product';
import OrdersAdmin from './admin/order/order';
import SoldOrdersAdmin from './admin/order/soldOrders';
import UserOrder from './pages/order/order';
import ResolvedOrdersAdmin from './admin/order/resolvedOrder';
import CancelOrdersAdmin from './admin/order/cancelOrder';
import ShippingOrdersAdmin from './admin/order/shippingOrder';
import BlogAdmin from './admin/blog/blog';
import CategoryAdmin from './admin/products/category';
import AddCategory from './admin/products/add-category';
import UpdateCategory from './admin/products/update-category';
import RevenueChart from './admin/chart/RevenueChart';
import ProductByCategoryChart from './admin/chart/ProductByCategoryChart';
import ProductSalesChart from './admin/chart/ProductSalesChart';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/products' element={<Products />} />
        <Route path='/product-detail/:id' element={<ProductDetail />} />
        <Route path='/products-category/:id' element={<ProductsCategory />} />
        <Route path='/products-search/' element={<ProductsCategory />} />
        <Route path='/cart' element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order" element={<UserOrder />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/forgotPassword" element={<ForgotPass />} />


        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/products" element={<ProductsAdmin />} />
        <Route path="/admin/products-add" element={<AddProduct />} />
        <Route path="/admin/products-update/:id" element={<UpdateProduct />} />
        <Route path="/admin/products-delete/:id" element={<DeleteProduct />} />
        <Route path="/admin/users" element={<UserAdmin />} />
        <Route path="/admin/blogs" element={<BlogAdmin />} />

        <Route path="/admin/orders" element={<OrdersAdmin />} />
        <Route path="/admin/soldOrders" element={<SoldOrdersAdmin />} />
        <Route path="/admin/resolvedOrders" element={<ResolvedOrdersAdmin />} />
        <Route path="/admin/cancelOrders" element={<CancelOrdersAdmin />} />
        <Route path="/admin/shippingOrders" element={<ShippingOrdersAdmin />} />

        <Route path="/admin/categorys" element={<CategoryAdmin />} />
        <Route path="/admin/category-add" element={<AddCategory />} />
        <Route path="/admin/category-update/:id" element={<UpdateCategory />} />

        <Route path="/admin/sales-revenue" element={<RevenueChart />} />
        <Route path="/admin/ProductByCategoryChart" element={<ProductByCategoryChart />} />
        <Route path="/admin/ProductSalesByCategoryChart" element={<ProductSalesChart />} />












        {/* <ProtectedRoute path='/admin/dashboard' element={<Dashboard />} />
        <ProtectedRoute path='/admin/products' element={<ProductList />} /> */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
