import { OrderItem } from '@/app/lib/Entities/Order';
import { Product } from '@/app/lib/Entities/Product';
import React from 'react';

interface CartHeaderProps {
  cartProducts: (OrderItem & Product)[];
  isLogged: boolean
}

const CartHeader: React.FC<CartHeaderProps> = ({ cartProducts, isLogged }) => {
  return (
    <div className="container pt-1 md:px-6 text-center">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">Tu carrito</h1>
      {cartProducts.length > 0 ? (
        <h1 className="text-2xl text-center">Productos</h1>
      ) : (
        <h1 className="text-2xl text-center">Tu carrito está vacío</h1>
      )}
    </div>
  );
};

export default CartHeader;
