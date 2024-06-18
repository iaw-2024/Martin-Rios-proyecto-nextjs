"use client"

import React, { useState, Fragment } from 'react';
import Link from 'next/link';
import CartWrapper from './CartCard';
import { Product } from '@/app/lib/Entities/Product';
import { OrderItem } from '@/app/lib/Entities/Order';


export function ProductList({ cartProducts }: { cartProducts: (OrderItem&Product)[] }) {

    if (cartProducts == null) {
        //Traer de local storage
    }

    const [products, setProducts] = useState<(OrderItem&Product)[]>(cartProducts || []);

    const removeProduct = (id: string) =>{
        setProducts(products.filter(product => product.id !== id));
    };

    const increaseQuantity = (id: string) => {
        setProducts(products.map(product => 
           product.id === id ? { ...product, quantity: product.quantity + 1 } : product
          ));
    };

    const decreaseQuantity = (id: string) => {
            setProducts(products.map(product => 
               product.id === id && product.quantity > 0 ? { ...product, quantity: product.quantity - 1 } : product
           ));
    };

    const clearCart = () => {
        setProducts([]);
    };

    return (
        <Fragment>
            <div className="container px-4 md:px-6 text-center">
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">Your Cart</h1>
                {products.length > 0 ? <h1 className="text-2xl text-center">Cart products</h1> : <h1 className="text-2xl text-center">Cart is empty</h1>}
            </div>
            <button
                 onClick={() => clearCart()}
                className="bg-blue-500 text-white px-1 rounded hover:bg-blue-400 focus:outline-none">
                Clear cart
            </button>
            <div className="container grid md:grid-cols-2 gap-8 px-4 md:px-6 mt-12">
                <div className="grid gap-6">
                    {
                        products.length > 0
                            ? (
                                products.map((product: (OrderItem&Product)) => (
                                    <CartWrapper
                                        key={product.id}
                                        product={product}
                                        onIncrease={increaseQuantity}
                                        onDecrease={decreaseQuantity}
                                        onRemove={removeProduct}
                                    />
                                ))
                            ) : (
                                <div className="text-center border-2 border-dashed p-6 grid grid-rows-2 border-gray-200 rounded-lg">
                                    <p className="text-2xl"></p>
                                    <Link href="/dashboard">
                                    </Link>
                                </div>
                            )
                    }
                </div>
                <div className="w-full md:w-1/3 lg:w-1/4 bg-gray-100 dark:bg-gray-800 rounded-lg p-6 flex flex-col justify-between">
                    <h2 className="text-2xl font-bold">Resumen de compra</h2>
                    <div className="flex flex-col gap-2">
                        {products.map(product => (
                            <div key={product.id} className="flex justify-between">
                                <p>{product.productname}</p>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 border-t pt-4">
                        <p className="text-xl font-bold">Total:</p>
                        <p className="text-4xl">${products.reduce((acc, product) => acc + product.price * product.quantity, 0)}</p>
                    </div>
                    <Link href="/buyProduct">
                        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400 text-center">
                            Continuar compra
                        </button>
                    </Link>
                </div>
            </div>
        </Fragment>
    );
}
 