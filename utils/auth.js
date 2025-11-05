import jwt from 'jsonwebtoken';
import { connectToDatabase } from './db';
const JWT_SECRET = process.env.JWT_SECRET;

export async function requireAuth(req, res) {
  const auth = req.headers.authorization;
  if (!auth) {
    res.status(401).json({ error: 'missing authorization header' });
    return null;
  }
  const parts = auth.split(' ');
  if (parts.length !== 2) {
    res.status(401).json({ error: 'malformed authorization header' });
    return null;
  }
  const token = parts[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    return { sub: payload.sub, role: payload.role };
  } catch (e) {
    res.status(401).json({ error: 'invalid token' });
    return null;
  }
}
