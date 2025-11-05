import { connectToDatabase } from '../../../utils/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { name, email, password, role } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });

  const { db } = await connectToDatabase();
  const existing = await db.collection('users').findOne({ email });
  if (existing) return res.status(409).json({ error: 'email already registered' });

  const hashed = await bcrypt.hash(password, 10);
  const user = { name: name||'', email, password: hashed, role: role||'user', createdAt: new Date() };
  const result = await db.collection('users').insertOne(user);
  const inserted = await db.collection('users').findOne({ _id: result.insertedId }, { projection: { password: 0 }});

  const token = jwt.sign({ sub: inserted._id.toString(), role: inserted.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  res.status(201).json({ user: inserted, token });
}
