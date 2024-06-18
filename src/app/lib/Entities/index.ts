/*export * from './User'
import { sql } from '@vercel/postgres';
import { Product } from './Product';


export async function fetchProducts() {
  try {
    const data = await sql<Product>`
      SELECT products.productName, products.description, products.imageURL, products.price, products.stock
      FROM products
      ORDER BY products.price
      LIMIT 5`;

    const products = data.rows.map((product) => ({
      ...product,
    }));
    return products;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}*/
