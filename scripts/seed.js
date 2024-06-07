
const { db } = require('@vercel/postgres');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const users = [
  { name: 'John Doe', email: 'john.doe@example.com', password: 'password123', role:"user"},
  { name: 'Jane Smith', email: 'jane.smith@example.com', password: 'password456', role: "user" },
  { name: 'Bob Johnson', email: 'bob.johnson@example.com', password: 'password789', role:"admin" }
];
const carts = [
  { username:'John Doe', totalPrice: 0.00, mercadoPagoID: 'MP123456' },
  { username: 'Jane Smith', totalPrice: 0.00, mercadoPagoID: 'MP654321' },
  { username: 'Bob Johnson', totalPrice: 0.00, mercadoPagoID: 'MP789012' }
];
const products = [
  { owner: 'Bob Johnson', productName: 'Laptop', description: 'A high-performance laptop.', imageURL: 'http://example.com/images/laptop.jpg', imageKey: 'laptop123', price: 999.99, publicationDate: new Date(), stock: 50 },
  { owner: 'Bob Johnson', productName: 'Smartphone', description: 'Latest model smartphone.', imageURL: 'http://example.com/images/smartphone.jpg', imageKey: 'smartphone123', price: 699.99, publicationDate: new Date(), stock: 100 },
  { owner: 'Bob Johnson', productName: 'Headphones', description: 'Noise-cancelling headphones.', imageURL: 'http://example.com/images/headphones.jpg', imageKey: 'headphones123', price: 199.99, publicationDate: new Date(), stock: 200 }
];
const orderItems = [
  { cartID: 1, productID: 1, quantity: 1, productPrice: 999.99 },
  { cartID: 2, productID: 3, quantity: 2, productPrice: 199.99 },
  { cartID: 3, productID: 2, quantity: 1, productPrice: 699.99 }
];

async function seedUsers(client) {
  try {
    await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(255) NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );
    `);

    console.log(`Tabla "users" creada`);

    const hashedPasswords = await Promise.all(users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return hashedPassword;
    }));

    const insertedUsers = await Promise.all(users.map(async (user, index) => {
      const hashedPassword = hashedPasswords[index];
      return client.query(`
        INSERT INTO users (name, email, password, role)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (email) DO NOTHING;
      `, [user.name, user.email, hashedPassword, user.role]);
    }));

    console.log(`Se han insertado ${insertedUsers.length} usuarios`);

    return insertedUsers;
  } catch (error) {
    console.error('Error al insertar usuarios:', error);
    throw error;
  }
}

async function seedCarts(client) {
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS carts (
          id SERIAL PRIMARY KEY,
          userID UUID NOT NULL,
          totalPrice DECIMAL(10, 2) NOT NULL,
          creationDate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          mercadoPagoID VARCHAR(50),
          FOREIGN KEY (userID) REFERENCES users(id) ON DELETE CASCADE
        );
      `);
  
      console.log(`Tabla "carts" creada`);
  
      const insertedCarts = await Promise.all(carts.map(async cart => {
        const user = await client.query('SELECT id FROM users WHERE name = $1', [cart.username]);
        const userID = user.rows[0].id;
        return client.query(`
          INSERT INTO carts (userID, totalPrice, mercadoPagoID)
          VALUES ($1, $2, $3)
          ON CONFLICT (id) DO NOTHING;
        `, [userID, cart.totalPrice, cart.mercadoPagoID]);
      }));
  
      console.log(`Se han insertado ${insertedCarts.length} carritos`);
  
      return insertedCarts;
    } catch (error) {
      console.error('Error al insertar carritos:', error);
      throw error;
    }
  }

async function seedProducts(client) {
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        ownerID UUID NOT NULL,
        productName VARCHAR(100) NOT NULL,
        description TEXT,
        imageURL VARCHAR(255),
        imageKey VARCHAR(100),
        price DECIMAL(10, 2) NOT NULL,
        publicationDate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        stock INT NOT NULL,
        FOREIGN KEY (ownerID) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    console.log(`Tabla "products" creada`);

    const insertedProducts = await Promise.all(products.map(async product => {
        const user = await client.query('SELECT id FROM users WHERE name = $1', [product.owner]);
        const userID = user.rows[0].id;
        return client.query(`
            INSERT INTO products (productName, description, imageURL, imageKey, price, stock, ownerID)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            ON CONFLICT (id) DO NOTHING;
        `, [product.productName, product.description, product.imageURL, product.imageKey, product.price, product.stock, userID]);
    }));

    console.log(`Se han insertado ${insertedProducts.length} productos`);

    return insertedProducts;
  } catch (error) {
    console.error('Error al insertar productos:', error);
    throw error;
  }
}

async function seedOrderItems(client) {
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS orderItems (
        id SERIAL PRIMARY KEY,
        cartID INT NOT NULL,
        productID INT NOT NULL,
        dateAdded TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        quantity INT NOT NULL,
        productPrice DECIMAL(10, 2) NOT NULL,
        FOREIGN KEY (cartID) REFERENCES carts(id) ON DELETE CASCADE,
        FOREIGN KEY (productID) REFERENCES products(id) ON DELETE CASCADE
      );
    `);

    console.log(`Tabla "orderItems" creada`);

    const insertedOrderItems = await Promise.all(orderItems.map(orderItem => {
      return client.query(`
        INSERT INTO orderItems (cartID, productID, quantity, productPrice)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (id) DO NOTHING;
      `, [orderItem.cartID, orderItem.productID, orderItem.quantity, orderItem.productPrice]);
    }));

    console.log(`Se han insertado ${insertedOrderItems.length} elementos de orden`);

    return insertedOrderItems;
  } catch (error)  {
    console.error('Error al insertar elementos de orden:', error);
throw error;
}
}

async function main() {
const client = await db.connect();

try {
    await seedUsers(client);
    await seedCarts(client);
    await seedProducts(client);
    await seedOrderItems(client);
} catch (error) {
    console.error('Error al seedear la base de datos:', error);
} finally {
    await client.end();
}
}

main().catch((err) => {
    console.error('Error:', err);
});