'use client'
import React from 'react';
import { Product } from '@/app/lib/Entities/Product';
import DeleteButton from './deleteButton';
import { PHASE_PRODUCTION_BUILD } from 'next/dist/shared/lib/constants';

const ProductCard = ({ product }:{product:Product}) => {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white m-4 flex flex-col">
      <img src={product.imageurl} alt={product.productname} className="w-full h-48 sm:h-64 object-cover" />
      <div className="px-6 py-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="font-bold text-xl mb-2">{product.productname}</div>
          <div className="flex justify-between items-center mb-2">
            <p className="text-gray-700 text-base">${product.price}</p>
            <p className="text-gray-700 text-base">Stock: {product.stock}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full">
            Modificar
          </button>
          
          <DeleteButton data={{id:product.id, imageId:product.imagekey}}></DeleteButton>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
