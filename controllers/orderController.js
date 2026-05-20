import pool from '../db/index.js';
export const createOrder = async (req, res) => {
  const { id, customer_name, phone, address, items, subtotal, delivery_fee, total } = req.body;
  const user_id = req.user?.id || null;
  await pool.query(
    `INSERT INTO orders (id, user_id, customer_name, phone, address, items, subtotal, delivery_fee, total, status)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'pending')`,
    [id, user_id, customer_name, phone, address, JSON.stringify(items), subtotal, delivery_fee, total]
  );
  res.json({ message: 'Order created', orderId: id });
};
export const trackOrder = async (req, res) => {
  const result = await pool.query('SELECT id, customer_name, address, total, status FROM orders WHERE id=$1', [req.params.id]);
  if (!result.rows[0]) return res.status(404).json({ error: 'Not found' });
  res.json(result.rows[0]);
};
export const getAllOrders = async (req, res) => {
  const result = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
  res.json(result.rows);
};
