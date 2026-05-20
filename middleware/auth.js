import jwt from 'jsonwebtoken';
export const auth = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch { res.status(401).json({ error: 'Invalid token' }); }
};
export const admin = (req, res, next) => {
  if (!req.user?.isAdmin) return res.status(403).json({ error: 'Admin only' });
  next();
};
