import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DB_URL,
  ssl: { rejectUnauthorized: false },
  family: 4   // force IPv4 – fixes ENETUNREACH error
});

const initDB = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        is_admin BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        category VARCHAR(100),
        description TEXT,
        images TEXT[],
        discount INT DEFAULT 0,
        free_delivery BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(20) PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE SET NULL,
        customer_name VARCHAR(100),
        phone VARCHAR(15),
        address VARCHAR(255),
        items JSONB,
        subtotal DECIMAL(10,2),
        delivery_fee DECIMAL(10,2),
        total DECIMAL(10,2),
        status VARCHAR(20) DEFAULT 'pending',
        mpesa_receipt VARCHAR(50),
        checkout_request_id VARCHAR(100),
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('Database tables ready');
  } finally { client.release(); }
};

initDB();
export default pool;
