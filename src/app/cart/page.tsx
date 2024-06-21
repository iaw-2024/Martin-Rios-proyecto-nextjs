'use client'

import { getServerSession, Session } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/auth-config";
import CartsRepository from "../lib/Repositories/CartsRepository";
import { ProductList } from "../ui/cart/ProductList";
import { Product } from "../lib/Entities/Product";
import OrderItemsRepository from "../lib/Repositories/OrdersRepository";
import { OrderItem } from "../lib/Entities/Order";
import { unstable_noStore as noStore } from 'next/cache';
import { Fragment } from "react";
import Link from "next/link";
import { getCartProductsFromLocalStorage } from "../lib/actions/getProductFromLocalStorage";

export default async function CartPage() {
  noStore();
  const session: Session | null = await getServerSession(authOptions)

  const cartsRepository = new CartsRepository()

  const ordersRepository = new OrderItemsRepository()

  let cartProducts: (OrderItem & Product)[] = []
  if (session != null) {
    let cart = await cartsRepository.getCartByUserId(session.user.id)
    if (!!cart)
      cartProducts = await ordersRepository.getOrdersByCartId(cart.id)
  }else{
    cartProducts = getCartProductsFromLocalStorage();
  }


  console.log(cartProducts)

  return (
    <Fragment>
      <div className="pt-2 flex-1 flex">
        <button className="bg-gray-100 text-gray-500 font-semibold px-4 rounded hover:bg-gray-200 focus:outline-none">
          <Link href="/dashboard">
           {"<"} Volver al dashboard
          </Link>
        </button>
      </div>
      <div className="container pt-1 md:px-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">Tu carrito</h1>
        {cartProducts.length > 0 ? <h1 className="text-2xl text-center">Products</h1> : <h1 className="text-2xl text-center">Tu carrito está vacío</h1>}
      </div>
      <section className="w-full mb-2">
        <ProductList cartProducts={cartProducts}></ProductList>
      </section>
    </Fragment>
  )
}
