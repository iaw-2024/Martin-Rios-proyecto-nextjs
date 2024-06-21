"use server";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import ProductsRepository from "../Repositories/ProductsRepository";
import { revalidatePath } from "next/cache";
import { Product } from "../Entities";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function updateProduct(formData: FormData) {
  try {
    const productsRepository = new ProductsRepository();
    const productId = String(formData.get("id"));

    const product = await productsRepository.getProductById(productId);

    if (!product) {
      return {
        success: false,
        msg: "Product not fount",
      };
    }
    let imageURL = product.imageurl;
    let imageKey = product.imageurl;
    if (formData.has("image")) {
      const arrayBuffer = await (formData.get("image") as File).arrayBuffer();
      const buffer = new Uint8Array(arrayBuffer);

      const result: UploadApiResponse | undefined = await new Promise(
        (resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              { folder: "proyecto_web" },
              function (error, result) {
                if (error) {
                  reject(error);
                  return;
                }
                resolve(result);
              }
            )
            .end(buffer);
        }
      );

      await new Promise((resolve, reject) => {
        cloudinary.uploader.destroy(imageURL, function (error:any, result:any) {
          if (error) {
            reject(error);
            return;
          }
          resolve(result);
        });
      });

      if (result) {
        imageURL = result.url;
        imageKey = result.public_id;
      }
    }

    const updatedProduct: Product = {
      id: product.id,
      productname: String(formData.get("productName")),
      description: String(formData.get("description")),
      price: Number(formData.get("price")),
      stock: Number(formData.get("stock")),
      imageurl: imageURL || String(formData.get("imageURL")),
      imagekey: imageKey || String(formData.get("imageKey")),
      publicationdate: product.publicationdate,
      active: product.active
    };

    await productsRepository.updateProduct(updatedProduct);

    revalidatePath("/");

    return {
      success: true,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      msg: "Error updating product",
    };
  }
}
