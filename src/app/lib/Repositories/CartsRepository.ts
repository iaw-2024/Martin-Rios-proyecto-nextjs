import { sql } from '@vercel/postgres';
import { v4 as uuidv4 } from 'uuid';

interface Cart {
  id: number;
  userID: string;
  totalPrice: number;
  creationDate: Date;
  mercadoPagoID?: string;
}

class CartsRepository {
  async getCartById(cartId: number): Promise<Cart | undefined> {
    try {
      const query = await sql<Cart>`SELECT * FROM carts WHERE id = ${cartId}`;
      return query.rows[0];
    } catch (error) {
      console.error(`Failed to fetch cart with ID ${cartId}:`, error);
      throw new Error(`Failed to fetch cart with ID ${cartId}.`);
    }
  }

  async createCart(userID: string, totalPrice: number, mercadoPagoID?: string): Promise<number> {
    try {
      const query = await sql`
        INSERT INTO carts(userID, totalPrice, mercadoPagoID) 
        VALUES (${userID}, ${totalPrice}, ${mercadoPagoID}) 
        RETURNING id
      `;
      return query.rows[0].id;
    } catch (error) {
      console.error('Failed to create cart:', error);
      throw new Error('Failed to create cart.');
    }
  }

  async updateCart(cartId: number, totalPrice: number, mercadoPagoID?: string): Promise<void> {
    try {
      await sql`
        UPDATE carts 
        SET totalPrice = ${totalPrice}, mercadoPagoID = ${mercadoPagoID} 
        WHERE id = ${cartId}
      `;
    } catch (error) {
      console.error('Failed to update cart:', error);
      throw new Error('Failed to update cart.');
    }
  }

  async deleteCart(cartId: number): Promise<void> {
    try {
      await sql`
        DELETE FROM carts 
        WHERE id = ${cartId}
      `;
    } catch (error) {
      console.error('Failed to delete cart:', error);
      throw new Error('Failed to delete cart.');
    }
  }

  async getAllCarts(): Promise<Cart[]> {
    try {
      const query = await sql<Cart>`SELECT * FROM carts`;
      return query.rows;
    } catch (error) {
      console.error('Failed to fetch carts:', error);
      throw new Error('Failed to fetch carts.');
    }
  }

  async getCartByUserId(userId: string): Promise<Cart | undefined> {
    try {
      const query = await sql<Cart>`SELECT * FROM carts WHERE userID = ${userId} LIMIT 1`;
      return query.rows[0];
    } catch (error) {
      console.error(`Failed to fetch cart for user with ID ${userId}:`, error);
      throw new Error(`Failed to fetch cart for user with ID ${userId}.`);
    }
  }
}

export default CartsRepository;
