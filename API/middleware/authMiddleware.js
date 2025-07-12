// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import { getJWTSecret } from '../config/config.js';



export const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied' });

  jwt.verify(token, getJWTSecret(), (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    
    req.user = user;
    next();
  });
}
