/*"use client"

import {createContext, useState, useContext, useEffect} from 'react'
import { Product } from '../lib/Entities/Product';
import ProductsRepository from '../lib/Repositories/ProductsRepository';
import CartsRepository from '../lib/Repositories/CartsRepository';

interface CartItem {
    price: number;
    id: number;
    quantity: number;
}

export const CartContext = createContext<any>(undefined);

export function CartProvider({children} : {
    children: React.ReactNode;
} ) {
    const [cartItems, setCartItems] = useState<CartItem[]>(() => {

        }
    });

    const addToCart = (item: Product) => {
        const isItemInCart = cartItems.find((cartItem:CartItem) => cartItem.id === item.id);

        if (isItemInCart){
            setCartItems(cartItems.map((cartItem:CartItem) => 
                        cartItem.id === item.id ? {...cartItem, quantity: cartItem.quantity + 1} : cartItem))
        }
        else {
            setCartItems([...cartItems, {...item, id: item.id, quantity: 1}])
        }
    }

    const removeFromCart = (item: any) => {
        const isItemInCart = cartItems.find((cartItem:CartItem) => cartItem.id === item.id);
        if (isItemInCart?.quantity === 1){
            setCartItems(cartItems.filter((cartItem:CartItem) => cartItem.id !== item.id));
        } else{
            setCartItems(cartItems.map((cartItem:CartItem) => 
                        cartItem.id === item.id ? {...cartItem, quantity: cartItem.quantity - 1} : cartItem));
        }
    }

    const clearCart = () => {
        setCartItems([]);
    }

    const getCartTotal = () => {
        return cartItems.reduce((total: number, cartItem:CartItem) => total+ cartItem.price * cartItem.quantity, 0).toFixed(2)
    }

    const getCartQuantity = () => { return cartItems.reduce((total: number, cartItem:CartItem) => total + cartItem.quantity, 0)}

    useEffect( () => {
       
    }, [cartItems]);

    useEffect(() => {
        const cartItems = localStorage.getItem("cartItems");
        if (cartItems) {
        setCartItems();
        }
    }, []);

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            clearCart,
            getCartTotal,
            }}>
            {children}
        </CartContext.Provider>
    )

}

export function useAppContext() {
     return useContext(CartContext);
}*/