import { connectToDatabase } from '../../../utils/db';
import { requireAuth } from '../../../utils/auth';

export default async function handler(req, res) {
  const { db } = await connectToDatabase();

  if (req.method === 'GET') {
    // list users (admin only)
    const auth = await requireAuth(req, res);
    if (!auth) return;
    if (auth.role !== 'admin') return res.status(403).json({ error: 'forbidden' });
    const users = await db.collection('users').find({}, { projection: { password: 0 } }).toArray();
    return res.json({ users });
  }

  if (req.method === 'POST') {
    // create user (admin)
    const auth = await requireAuth(req, res);
    if (!auth) return;
    if (auth.role !== 'admin') return res.status(403).json({ error: 'forbidden' });

    const { name, email, password, role } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email and password required' });
    const hashed = await bcrypt.hash(password, 10);
    const result = await db.collection('users').insertOne({ name, email, password: hashed, role: role||'user', createdAt: new Date() });
    const user = await db.collection('users').findOne({ _id: result.insertedId }, { projection: { password: 0 }});
    return res.status(201).json({ user });
  }

  res.status(405).end();
}
