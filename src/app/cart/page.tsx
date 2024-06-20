import { getServerSession, Session } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/auth-config";
import CartsRepository from "../lib/Repositories/CartsRepository";
import { ProductList } from "../ui/cart/ProductList";
import { Product } from "../lib/Entities/Product";
import OrderItemsRepository from "../lib/Repositories/OrdersRepository";
import { OrderItem } from "../lib/Entities/Order";
import { unstable_noStore as noStore } from 'next/cache';

export default async function CartPage() {
  noStore();
  const session:Session|null = await getServerSession(authOptions)

  const cartsRepository = new CartsRepository()
  
  const ordersRepository = new OrderItemsRepository()

  let cartProducts: (OrderItem&Product)[] = []
  if(session != null){
    let cart = await cartsRepository.getCartByUserId(session.user.id)
    if (!!cart)
      cartProducts = await ordersRepository.getOrdersByCartId(cart.id)
  }
  

  console.log(cartProducts)

 return (
    <section className="w-full mb-4">
        <ProductList cartProducts={cartProducts}></ProductList>
    </section>
  )
}
