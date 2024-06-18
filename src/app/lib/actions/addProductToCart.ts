'use server';
import { v2 as cloudinary,UploadApiResponse } from 'cloudinary';
import ProductsRepository from '../Repositories/ProductsRepository';
import { Product } from '../Entities/Product';
import CartsRepository from '../Repositories/CartsRepository';
import OrderItemsRepository from '../Repositories/OrdersRepository';

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  })
  
 
export async function addProductToCart(
    product: Product,
    userID : string,

) {
    try{
        const productsRepository = new ProductsRepository()
        const ordersRepository = new OrderItemsRepository()
        const cartsRepository = new CartsRepository()

        if(product!=undefined){
            const cartProduct = {
                productName: String(product.productname),
                description: String(product.description),
                imageURL: String(product.imageurl),
                totalPrice: Number(product.price), 
                stock: Number(product.stock)
            }
            
            const cart = await cartsRepository.getCartByUserId(userID)
            let cartId = cart?.id

            if (!cart) {
                cartId = await cartsRepository.createCart(userID, product.price, "abc")
                await ordersRepository.createOrderItem(cartId, product.id, 1, product.price)
            }
            else {
                cartsRepository.updateCart(cart.id, product.price, "abc")
                await ordersRepository.createOrderItem(cart.id, product.id, 1, product.price)
            }   
        }

        return { 
            success: true, 
        };

    }catch(error){
        console.log(error)
        return {
            sucess: false,
            msg: "Error creating cart"
        }
    }
}