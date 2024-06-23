'use server';

import { OrderItem } from '../Entities/Order';
import { Product } from '../Entities/Product';
import CartsRepository from '../Repositories/CartsRepository';
import OrderItemsRepository from '../Repositories/OrdersRepository';
import ProductsRepository from '../Repositories/ProductsRepository';
import SalesRepository from '../Repositories/SalesRepository';
import SalesOrdersRepository from '../Repositories/SalesOrdersRepository';
import { revalidatePath } from 'next/cache';

const productsRepository = new ProductsRepository();
const cartsRepository = new CartsRepository();
const orderItemsRepository = new OrderItemsRepository();
const salesRepository = new SalesRepository()
const salesOrdersRepository = new SalesOrdersRepository()

export async function buyProducts(userID: string): Promise<{ success: boolean, error?: string }> {

    try {
        // Retrieve the cart and its items
        const cart = await cartsRepository.getCartByUserId(userID);

        if (cart == (null || undefined)) {
            throw new Error(`Cart with not found.`);
        }
        else {


            const orderItems = await orderItemsRepository.getOrdersByCartId(cart.id);

            if (orderItems.length === 0) {
                throw new Error(`No order items found for cart ID ${cart.id}.`);
            }

            // Calculate the total price
            const totalPrice = orderItems.reduce((sum, item) => sum + (item.productprice * item.quantity), 0);

            // Assuming we have a payment integration (like Mercado Pago)
            const paymentResult = await processPayment(totalPrice); // This function would handle the payment process
            if (!paymentResult.success) {
                throw new Error('Payment failed.');
            }

            // Update the cart with payment details
            await cartsRepository.updateCart(cart.id, totalPrice, paymentResult.mercadoPagoID);
            orderItems.map(async (order: (OrderItem & Product)) => {
                const saleId = await salesRepository.createSale(userID, totalPrice, order.quantity, paymentResult.mercadoPagoID);
                await salesOrdersRepository.createOrder(saleId, order.productid, order.quantity, totalPrice);
                //const product: Product = productsRepository.getProductById(order.productid);
                //product.stock--;
                //productsRepository.updateProduct(product);
                await orderItemsRepository.deleteOrderItem(order.id);
                await cartsRepository.deleteCart(cart.id);
            })
            // Return success
            revalidatePath('/');
            return {
                success: true
            };

        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Failed to complete purchase:', error);
            return { success: false, error: error.message };
        } else {
            console.error('Failed to complete purchase:', error);
            return { success: false, error: 'Unknown error occurred' };
        }
    }
}

// Mock function for processing payment
async function processPayment(totalPrice: number): Promise<{ success: boolean, mercadoPagoID?: string }> {
    // Implement your payment processing logic here
    // For demonstration, we assume the payment is always successful and return a mock ID
    return { success: true, mercadoPagoID: 'MercadoPagoID' };
}
