import { OrderItem } from '@/app/lib/Entities/Order';
import { Product } from '@/app/lib/Entities/Product';
import Image from 'next/image';
import React from 'react';


interface CartWrapperProps {
    product: (OrderItem&Product);
    onIncrease: (id: string) => void;
    onDecrease: (id: string) => void;
    onRemove: (id: string) => void;
}

const CartWrapper: React.FC<CartWrapperProps> = ({ product, onIncrease, onDecrease, onRemove }) => {
    return (
        <div className="flex items-center justify-between border-b border-gray-200 py-4">
            <Image src={product.imageurl} alt={product.productname} className="w-16 h-16 object-cover" width={100} height={100}/>
            <div className="flex-1 ml-4">
                <p className="text-lg font-medium">{product.productname}</p>
                <button className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-400 mt-2"
                    onClick={() => onRemove(product.id)}
                >
                    Remove item
                </button>
            </div>
            <div className="flex items-center ml-4">
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
            </div>
            <p className="ml-4 text-lg">${product.price * product.quantity}</p>
        </div>
    );
};

export default CartWrapper;
