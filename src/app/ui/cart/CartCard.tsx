"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Product } from '@/app/lib/Entities/Product';
import { OrderItem } from '@/app/lib/Entities/Order';
import { getCartProductsFromLocalStorage } from '@/app/lib/actions/getProductFromLocalStorage';

interface CartWrapperProps {
    product: (Product&OrderItem);
    isLogged: boolean;
    //onLocalStorage: (id: string) => void;
    onIncrease: (id: string) => void;
    onDecrease: (id: string) => void;
    onRemove: (id: string) => void;
}

const CartWrapper: React.FC<CartWrapperProps> = ({ product, isLogged, /*onLocalStorage,*/ onIncrease, onDecrease, onRemove }) => {

    return (
        <div className="max-w-sm rounded overflow-hidden shadow-lg bg-gray-200 m-4 flex hover:bg-gray-300">
            <Image src={product.imageurl} alt={product.productname} className="w-16 h-16 object-cover" width={64} height={64} />
            <div className="px-6 py-4 flex-1 flex flex-col justify-between">
                <div>
                    <div className="font-bold text-xl mb-2">{product.productname}</div>
                    <p className="text-gray-700 text-base mb-2">Precio unitario: ${product.productprice}</p>
                    <p className="text-gray-700 text-base mb-2">Total: ${(product.productprice * product.quantity).toFixed(2)}</p>
                </div>
                <div className="flex items-center">
                    <button 
                        className="bg-gray-300 text-gray-700 px-2 py-1 rounded hover:bg-gray-400"
                        onClick={() => onDecrease(product.id)}
                    >
                        -
                    </button>
                    <span className="mx-2">{product.quantity}</span>
                    <button 
                        className="bg-gray-300 text-gray-700 px-2 py-1 rounded hover:bg-gray-400"
                        onClick={() => onIncrease(product.id)}
                    >
                        +
                    </button>
                    <button 
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-400 ml-4"
                        onClick={() => onRemove(product.id)}
                    >
                        Quitar producto
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartWrapper;
