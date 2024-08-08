// src/context/CartContext.js
import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    const addToCart = (product) => {
        setCart((prevCart) => [...prevCart, product]);
    };

    const removeFromCart = (productId) => {
        setCart((prevCart) => prevCart.filter(product => product.id !== productId));
    };

    const updateCartQuantity = (productId, quantity) => {
        setCart((prevCart) =>
            prevCart.map(product =>
                product.id === productId ? { ...product, quantity } : product
            )
        );
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateCartQuantity }}>
            {children}
        </CartContext.Provider>
    );
};
