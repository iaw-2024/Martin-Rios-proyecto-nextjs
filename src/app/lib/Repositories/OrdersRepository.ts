import { sql } from '@vercel/postgres';
import { OrderItem } from '../Entities/Order';
import { Product } from '../Entities/Product';


class OrderItemsRepository {
  async getOrderItemById(orderItemId: number): Promise<OrderItem | undefined> {
    try {
      const query = await sql<OrderItem>`SELECT * FROM orderItems WHERE id = ${orderItemId}`;
      return query.rows[0];
    } catch (error) {
      console.error(`Failed to fetch order item with ID ${orderItemId}:`, error);
      throw new Error(`Failed to fetch order item with ID ${orderItemId}.`);
    }
  }

  async createOrderItem(
    cartID: string,
    productID: string,
    quantity: number,
    productPrice: number
  ): Promise<number> {
    try {
      const query = await sql`
        INSERT INTO orderItems (cartID, productID, quantity, productPrice) 
        VALUES (${cartID}, ${productID}, ${quantity}, ${productPrice}) 
        RETURNING id
      `;
      return query.rows[0].id;
    } catch (error) {
      console.error('Failed to create order item:', error);
      throw new Error('Failed to create order item.');
    }
  }

  async updateOrderItem(
    orderItemId: number,
    quantity: number,
    productPrice: number
  ): Promise<void> {
    try {
      await sql`
        UPDATE orderItems 
        SET quantity = ${quantity}, productPrice = ${productPrice} 
        WHERE id = ${orderItemId}
      `;
    } catch (error) {
      console.error('Failed to update order item:', error);
      throw new Error('Failed to update order item.');
    }
  }

  async deleteOrderItem(orderItemId: number): Promise<void> {
    try {
      await sql`
        DELETE FROM orderItems 
        WHERE id = ${orderItemId}
      `;
    } catch (error) {
      console.error('Failed to delete order item:', error);
      throw new Error('Failed to delete order item.');
    }
  }

  async getAllOrderItems(): Promise<OrderItem[]> {
    try {
      const query = await sql<OrderItem>`SELECT * FROM orderItems`;
      return query.rows;
    } catch (error) {
      console.error('Failed to fetch order items:', error);
      throw new Error('Failed to fetch order items.');
    }
  }

  async getOrdersByCartId(cartId: string): Promise<(OrderItem & Product)[]> {
    try {
      const query = await sql<(OrderItem & Product) >`
        SELECT 
          orderItems.id AS orderItemId,
          orderItems.cartID,
          orderItems.productID,
          orderItems.dateAdded,
          orderItems.quantity,
          orderItems.productPrice,
          products.id AS productId,
          products.productName,
          products.description,
          products.imageURL,
          products.imageKey,
          products.price AS productPriceOriginal,
          products.publicationDate,
          products.stock
        FROM orderItems
        INNER JOIN products ON orderItems.productID = products.id
        WHERE orderItems.cartID = ${cartId}`;
      return query.rows;
    } catch (error) {
      console.error(`Failed to fetch products for cart with ID ${cartId}:`, error);
      throw new Error(`Failed to fetch products for cart with ID ${cartId}.`);
    }
  }
}

export default OrderItemsRepository;
