'use server';

import CartsRepository from '../Repositories/CartsRepository';
import OrderItemsRepository from '../Repositories/OrdersRepository';
import UsersRepository from '../Repositories/Usersrepository';
import { revalidatePath } from 'next/cache';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { z } from 'zod';

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN || "" });
const orderItemsRepository = new OrderItemsRepository();

export async function buyProductsLocal(formData: FormData): Promise<{ success: boolean, redirectUrl: string | undefined }> {

    try {
        const orderId = formData.get('orderId');
        const cartId = formData.get('cartId');
        const dateString = formData.get('date') as string;
        const date = new Date(dateString);
        const quantity = formData.get('quantity');
        const orderItemPrice = formData.get('orderItemPrice');
        //Campos Product
        const productId = formData.get('productId');
        const productPrice = formData.get('productPrice');
        const productStock = formData.get('productStock');
        const productActiveString = formData.get('productActive');

        const usersRepository = new UsersRepository();
        const user = await usersRepository.getUsersByName('Guest User');

        const orderItem = {
            orderitemid: String(orderId),
            cartid: String(cartId),
            productid: String(productId),
            dateadded: (date),
            quantity: Number(quantity),
            productprice: Number(orderItemPrice),
        }

        const entries = Array.from(formData.entries());
        let totalprice = 0;
        const products = [];      
        for (const [key, value] of entries) {
            if (key === 'orderItemPrice') {
                totalprice += parseFloat(value as string);
            }
            products.push({ [key]: value });
        }

        const cart = {
            id: String(cartId),
            userid: String(user.id),
            totalprice: String(totalprice),
            creationdate: date,
            mercadopagoid: String('abc'),
        }

        if (cart == (null || undefined)) {
            throw new Error(`Cart with ID ${cartId} not found.`);
        } else {
            const orderItems = await orderItemsRepository.getOrdersByCartId(orderItem.cartid)

            if (orderItems.length === 0) {
                throw new Error(`No order items found for cart ID ${cart.id}.`);
            }

            const items = orderItems.map((orderItem) => {
                return {
                    id: orderItem.productid,
                    title: orderItem.productname,
                    quantity: orderItem.quantity,
                    unit_price: parseFloat(orderItem.productprice + "")
                }
            })

            const preference = await (new Preference(client)).create(
                {
                    body: {
                        items,
                        back_urls: {
                            success: "https://proyecto-web-vercel.vercel.app/",
                            pending: "https://proyecto-web-vercel.vercel.app/",
                            failure: "https://proyecto-web-vercel.vercel.app/"
                        },
                        auto_return: 'approved',
                        metadata: {
                            cartid: cart.id,
                        }
                    },
                })

            return {
                success: true,
                redirectUrl: preference.sandbox_init_point
            };
        }

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Failed to complete purchase:', error);
            return { success: false, redirectUrl: undefined };
        } else {
            console.error('Failed to complete purchase:', error);
            return { success: false, redirectUrl: undefined };
        }
    }
}
