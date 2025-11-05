import { connectToDatabase } from '../../../utils/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });

  const { db } = await connectToDatabase();
  const user = await db.collection('users').findOne({ email });
  if (!user) return res.status(401).json({ error: 'invalid credentials' });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ error: 'invalid credentials' });

  const token = jwt.sign({ sub: user._id.toString(), role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  const safe = { ...user, password: undefined };
  res.json({ user: safe, token });
}
