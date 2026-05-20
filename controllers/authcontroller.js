import jwt from 'jsonwebtoken';
import { findUserByUsername, validatePassword, createUser } from '../models/User.js';
export const register = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Missing fields' });
    const existing = await findUserByUsername(username);
    if (existing) return res.status(400).json({ error: 'Username taken' });
    const user = await createUser(username, password);
    res.status(201).json({ id: user.id, username: user.username, isAdmin: user.is_admin });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await findUserByUsername(username);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const valid = await validatePassword(user, password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign(
      { id: user.id, username: user.username, isAdmin: user.is_admin },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'strict', maxAge: 7*24*60*60*1000 });
    res.json({ id: user.id, username: user.username, isAdmin: user.is_admin });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
export const logout = (req, res) => { res.clearCookie('token'); res.json({ message: 'Logged out' }); };
export const me = (req, res) => { if (!req.user) return res.status(401).json({ error: 'Not authenticated' }); res.json(req.user); };
