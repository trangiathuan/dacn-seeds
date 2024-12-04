import { Line } from 'react-chartjs-2';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import API_URL from '../../config/config';
import NavAdmin from "../component/nav-admin/nav-admin";
import Sidebar from "../component/sidebar/sidebar";
import ProductIsSoldByCategory from '../chartComponent/ProductIsSoldByCategory'


const ProductSalesChart = () => {

    return (
        <div>
            <NavAdmin />
            <div className="row productsAdmin-body">
                <div className="col-3 sidebar-body">
                    <Sidebar />
                </div>
                <div className="col-9 content-body">
                    <ProductIsSoldByCategory />
                </div>
            </div>
        </div>
    );
};

export default ProductSalesChart;
