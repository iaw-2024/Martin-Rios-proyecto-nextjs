'use client';

import { useState, useEffect } from 'react';
import { Product } from '../lib/Entities/Product';
import Image from "next/image";



interface SearchBarProps {
    products: Product[];
    placeholder: string;
  }
  
  const SearchBar = ({ products, placeholder }: SearchBarProps) => {
    const [query, setQuery] = useState('');
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  
    useEffect(() => {
      if (query) {
        const results = products.filter(product =>
          product.productname.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredProducts(results);
      } else {
        setFilteredProducts([]);
      }
    }, [query, products]);
  
    return (
      <div className="relative">
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border p-2 w-full"
        />
        {filteredProducts.length > 0 && (
          <div className="absolute bg-white border mt-2 w-full max-h-60 overflow-y-auto z-10">
            {filteredProducts.map((product) => (
              <div key={product.id} className="p-2 border-b flex items-center">
                <Image src={product.imageurl} alt={product.productname} width={50} height={50} className='object-cover'/>
                <div className="ml-4">
                  <p className="font-bold">{product.productname}</p>
                  <p className="text-gray-700">${product.price}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };
  
  export default SearchBar;