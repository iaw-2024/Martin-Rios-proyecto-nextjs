import { sql } from '@vercel/postgres';
import { Product } from '../Entities/Product';


class ProductsRepository {
  async getProductById(productId: number): Promise<Product | undefined> {
    try {
      const query = await sql<Product>`SELECT * FROM products WHERE id = ${productId}`;
      return query.rows[0];
    } catch (error) {
      console.error(`Failed to fetch product with ID ${productId}:`, error);
      throw new Error(`Failed to fetch product with ID ${productId}.`);
    }
  }

  async createProduct(
    ownerID: string, 
    productName: string, 
    description: string, 
    imageURL: string, 
    imageKey: string, 
    price: number, 
    stock: number
  ): Promise<number> {
    try {
      const query = await sql`
        INSERT INTO products (ownerID, productName, description, imageURL, imageKey, price, stock) 
        VALUES (${ownerID}, ${productName}, ${description}, ${imageURL}, ${imageKey}, ${price}, ${stock}) 
        RETURNING id
      `;
      return query.rows[0].id;
    } catch (error) {
      console.error('Failed to create product:', error);
      throw new Error('Failed to create product.');
    }
  }

  async updateProduct(
    productId: number, 
    productName: string, 
    description: string, 
    imageURL: string, 
    imageKey: string, 
    price: number, 
    stock: number
  ): Promise<void> {
    try {
      await sql`
        UPDATE products 
        SET productName = ${productName}, description = ${description}, imageURL = ${imageURL}, imageKey = ${imageKey}, price = ${price}, stock = ${stock} 
        WHERE id = ${productId}
      `;
    } catch (error) {
      console.error('Failed to update product:', error);
      throw new Error('Failed to update product.');
    }
  }

  async deleteProduct(productId: number): Promise<void> {
    try {
      await sql`
        DELETE FROM products 
        WHERE id = ${productId}
      `;
    } catch (error) {
      console.error('Failed to delete product:', error);
      throw new Error('Failed to delete product.');
    }
  }

  async getAllProducts(): Promise<Product[]> {
    try {
      const query = await sql<Product>`SELECT * FROM products`;
      return query.rows;
    } catch (error) {
      console.error('Failed to fetch products:', error);
      throw new Error('Failed to fetch products.');
    }
  }

  async getProductsByOwnerId(ownerId: string): Promise<Product[]> {
    try {
      const query = await sql<Product>`SELECT * FROM products WHERE ownerID = ${ownerId}`;
      return query.rows;
    } catch (error) {
      console.error(`Failed to fetch products for owner with ID ${ownerId}:`, error);
      throw new Error(`Failed to fetch products for owner with ID ${ownerId}.`);
    }
  }
}

export default ProductsRepository;
