'use server';
import { v2 as cloudinary,UploadApiResponse } from 'cloudinary';
import ProductsRepository from '../Repositories/ProductsRepository';
import { revalidatePath } from 'next/cache';

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  })
  
 
export async function createProduct(formData: FormData) {
    try{
        const productsRepository = new ProductsRepository()
        const arrayBuffer = await (formData.get('image') as File).arrayBuffer()
        const buffer = new Uint8Array(arrayBuffer)

        const result:UploadApiResponse|undefined= await new Promise((resolve, reject)=>{
            cloudinary.uploader.upload_stream({folder:"proyecto_web"}, function(error, result ){
                if(error){
                    console.log(error)
                    reject(error)
                    return 
                }
                resolve(result)
            }).end(buffer)
        })
        if(result!=undefined){
            const product = {
                productName: String(formData.get('productName')),
                description: String(formData.get('description')),
                imageURL: result.url,
                imageKey: result.public_id, 
                price: Number(formData.get('price')), 
                stock: Number(formData.get('stock'))
            }

            await productsRepository.createProduct(product)
        }
        revalidatePath("/")
        return { 
            success: true, 
        };

    }catch(error){
        console.log(error)
        return {
            sucess: false,
            msg: "Error creating product"
        }
    }
}