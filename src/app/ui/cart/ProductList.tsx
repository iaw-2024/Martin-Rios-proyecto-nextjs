"use client"

import React, { useState, Fragment, useEffect } from 'react';
import Link from 'next/link';
import CartWrapper from './CartCard';
import { Product } from '@/app/lib/Entities/Product';
import { OrderItem } from '@/app/lib/Entities/Order';
import { removeProduct, increaseQuantity, decreaseQuantity, clearCart } from './../../lib/actions/cartActions';

export function ProductList({ cartProducts }: { cartProducts: (OrderItem & Product)[] }) {

    const [products, setProducts] = useState<(OrderItem & Product)[]>(cartProducts || []);
    const [cartId, setCartId] = useState<string>('');

    useEffect(() => {
        if (cartProducts.length > 0) {
            setCartId(cartProducts[0].cartid);
        }
    }, [cartProducts]);

    const handleRemoveProduct = async (orderitemid: string) => {
        const handlerResult = await removeProduct(orderitemid, cartId);
        if (handlerResult.success) {
            const updatedProducts = products.filter(product => product.orderitemid !== orderitemid);
            setProducts(updatedProducts);
        }
    };

    const handleIncreaseQuantity = async (orderitemid: string) => {
        const handlerResult = await increaseQuantity(orderitemid, cartId);
        if (handlerResult.success) {
            const updatedProducts = products.map(product =>
                product.orderitemid === orderitemid ? { ...product, quantity: product.quantity + 1 } : product
            );
            setProducts(updatedProducts);
        }
    };

    const handleDecreaseQuantity = async (orderitemid: string) => {
        const handlerResult = await decreaseQuantity(orderitemid, cartId);
        if (handlerResult.success) {
            const updatedProducts = products.map(product =>
                product.orderitemid === orderitemid && product.quantity > 1 ? { ...product, quantity: product.quantity - 1 } : product
            );
            setProducts(updatedProducts);
        }
    };

    const handleClearCart = async () => {
        const handlerResult = await clearCart(cartId);
        if (handlerResult.success) {
            setProducts([]);
        }
    };

    return (
        <Fragment>
            <div className="flex-1 flex">
                <button
                    onClick={handleClearCart}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400 focus:outline-none">
                    Limpiar carrito
                </button>
            </div>
            <div className="container grid md:grid-cols-2 gap-1 px-4 md:px-6 mt-3">
                <div className="grid gap-0">
                    {
                        products.length > 0
                            ? (
                                products.map((product: (OrderItem & Product)) => (
                                    <CartWrapper
                                        key={product.id}
                                        product={product}
                                        onIncrease={() => handleIncreaseQuantity(product.orderitemid)}
                                        onDecrease={() => handleDecreaseQuantity(product.orderitemid)}
                                        onRemove={() => handleRemoveProduct(product.orderitemid)}
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
                <div className="w-full md:w-1/3 lg:w-3/4 bg-gray-100 dark:bg-gray-800 rounded-lg p-6 flex flex-col justify-between shadow-xl shadow-slate-300">
                    <h2 className="text-2xl font-bold">Resumen de compra</h2>
                    <div className="flex flex-col gap-2">
                        {products.map(product => (
                            <div key={product.id} className="flex justify-between">
                                <p>{product.productname}</p> X {product.quantity}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 border-t py pt-6">
                        <p className="text-xl font-bold">Total:</p>
                        <p className="text-4xl">${products.reduce((acc, product) => acc + product.productprice * product.quantity, 0)}</p>
                    </div>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400 text-center">
                        <Link href="/buyProduct">
                            Continuar compra
                        </Link>
                    </button>
                </div>
            </div>
        </Fragment>
    );
}
