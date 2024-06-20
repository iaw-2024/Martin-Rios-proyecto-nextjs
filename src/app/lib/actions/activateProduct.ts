'use server';
import { v2 as cloudinary,UploadApiResponse } from 'cloudinary';
import ProductsRepository from '../Repositories/ProductsRepository';
import { revalidatePath } from 'next/cache';

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  })
  

export async function activateProduct(formData: FormData) {
    const id = String(formData.get('id'))
    const productsRepository = new ProductsRepository()
    try{
        productsRepository.changeProductActiveStatus(id,true)
        revalidatePath('/')
        return{
            success:true
        }
    }
    catch(error){
        return{
            mgs: "Error activating product",
            success:false
        }
    }

}