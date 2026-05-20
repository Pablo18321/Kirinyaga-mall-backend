import pool from '../db/index.js';
import bcrypt from 'bcrypt';
export const createUser = async (username, password, isAdmin = false) => {
  const hash = await bcrypt.hash(password, 10);
  const result = await pool.query(
    'INSERT INTO users (username, password_hash, is_admin) VALUES ($1,$2,$3) RETURNING id, username, is_admin',
    [username, hash, isAdmin]
  );
  return result.rows[0];
};
export const findUserByUsername = async (username) => {
  const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
  return result.rows[0];
};
export const validatePassword = async (user, password) => bcrypt.compare(password, user.password_hash);
