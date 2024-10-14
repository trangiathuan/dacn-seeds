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

// import admin pages
import Dashboard from './admin/dashboard/dashboard';
import ProductsAdmin from './admin/products/productsAdmin';
import AddProduct from './admin/products/add-product';
import UpdateProduct from './admin/products/update-product';
import DeleteProduct from './admin/products/delete-product';
import OrdersAdmin from './admin/order/order';
import SoldOrdersAdmin from './admin/order/soldOrders';
import UserAdmin from './admin/user/user';



// import ProductList from './pages/admin/productList';

// // import ProtectedRoute component
// import ProtectedRoute from './components/ProtectedRoute';

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
        <Route path="/blog" element={<Blog />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/products" element={<ProductsAdmin />} />
        <Route path="/admin/products-add" element={<AddProduct />} />
        <Route path="/admin/products-update/:id" element={<UpdateProduct />} />
        <Route path="/admin/products-delete/:id" element={<DeleteProduct />} />
        <Route path="/admin/users" element={<UserAdmin />} />


        <Route path="/admin/orders" element={<OrdersAdmin />} />
        <Route path="/admin/soldOrders" element={<SoldOrdersAdmin />} />






        {/* <ProtectedRoute path='/admin/dashboard' element={<Dashboard />} />
        <ProtectedRoute path='/admin/products' element={<ProductList />} /> */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
