import pool from '../db/index.js';
export const getProducts = async (req, res) => {
  const result = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
  res.json(result.rows);
};
export const addProduct = async (req, res) => {
  const { name, price, category, description, images, discount, free_delivery } = req.body;
  const result = await pool.query(
    `INSERT INTO products (name, price, category, description, images, discount, free_delivery)
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [name, price, category, description, images || [], discount || 0, free_delivery || false]
  );
  res.status(201).json(result.rows[0]);
};
export const deleteProduct = async (req, res) => {
  await pool.query('DELETE FROM products WHERE id=$1', [req.params.id]);
  res.json({ message: 'Deleted' });
};
