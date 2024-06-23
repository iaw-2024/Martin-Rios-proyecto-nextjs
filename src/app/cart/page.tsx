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
import CartHeader from "../ui/cart/CartHeader"; // Importa el nuevo componente
import UsersRepository from "../lib/Repositories/Usersrepository";

export default async function CartPage() {
  noStore();
  const session: Session | null = await getServerSession(authOptions)

  const cartsRepository = new CartsRepository()

  const ordersRepository = new OrderItemsRepository()

  let isLogged = false

  let cartProducts: (OrderItem & Product)[] = []
  if (session != null) {
    isLogged = true
    let cart = await cartsRepository.getCartByUserId(session.user.id)
    if (!!cart)
      cartProducts = await ordersRepository.getOrdersByCartId(cart.id)
  }else{
    cartProducts = getCartProductsFromLocalStorage()
  }

  console.log("CARRITO:",cartProducts)

  return (
    <Fragment>
      <div className="pt-2 flex-1 flex">
        <button className="bg-gray-100 text-gray-500 font-semibold px-4 rounded hover:bg-gray-200 focus:outline-none">
          <Link href="/dashboard">
            {"<"} Volver al dashboard
          </Link>
        </button>
      </div>
      <CartHeader cartProducts={cartProducts} isLogged={isLogged}/>
      <section className="w-full mb-2">
        <ProductList cartProducts={cartProducts} isLogged={isLogged}></ProductList>
      </section>
    </Fragment>
  )
}
