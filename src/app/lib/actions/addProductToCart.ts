'use server';
import { v2 as cloudinary } from 'cloudinary';
import ProductsRepository from '../Repositories/ProductsRepository';
import { Product } from '../Entities/Product';
import CartsRepository from '../Repositories/CartsRepository';
import OrderItemsRepository from '../Repositories/OrdersRepository';
import { revalidatePath } from 'next/cache';

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function addProductToCart(product: Product, userID: string) {
    try {
        const productsRepository = new ProductsRepository();
        const ordersRepository = new OrderItemsRepository();
        const cartsRepository = new CartsRepository();

        if (product != undefined) {
            let cart = await cartsRepository.getCartByUserId(userID);
            let cartId = cart?.id

            if (!cart) {
                cartId = await cartsRepository.createCart(userID, product.price, "abc");
                await ordersRepository.createOrderItem(cartId, product.id, 1, product.price);
            } else {
                await ordersRepository.createOrderItem(cart.id, product.id, 1, product.price);
                const updatedCartTotal = cart.totalPrice + product.price; // Actualizar el precio total del carrito
                await cartsRepository.updateCart(cart.id, updatedCartTotal, "abc");
                
            }
        }

        revalidatePath('/cart');
        return {
            success: true
        };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            msg: "Error creating cart"
        };
    }
}
