// components/ClientCart.tsx
"use client"
import { OrderItem } from '@/app/lib/Entities/Order';
import { Product } from '@/app/lib/Entities/Product';
import { useEffect, useState } from 'react';
import ProductList  from './ProductList';


export function ClientCart() {
  const [cartProducts, setCartProducts] = useState<(OrderItem & Product)[]>([]);

  useEffect(() => {
    const cartFromLocalStorage = localStorage.getItem('cart');
    console.log("HAY ALGOOO2????", cartFromLocalStorage);
    if (cartFromLocalStorage) {
      setCartProducts(JSON.parse(cartFromLocalStorage));
    }
  }, []);
  
  console.log("HAY ALGOOO????", cartProducts);
  return (
    <section className="w-full mb-2">
      <ProductList cartProducts={cartProducts} userId={undefined}></ProductList>
    </section>
  );
}
