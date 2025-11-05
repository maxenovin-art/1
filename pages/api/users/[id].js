import { connectToDatabase } from '../../../utils/db';
import { requireAuth } from '../../../utils/auth';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  const { db } = await connectToDatabase();
  const { id } = req.query;
  const auth = await requireAuth(req, res);
  if (!auth) return;

  // allow user to access their own profile or admin
  if (auth.sub !== id && auth.role !== 'admin') return res.status(403).json({ error: 'forbidden' });

  if (req.method === 'GET') {
    const user = await db.collection('users').findOne({ _id: new ObjectId(id) }, { projection: { password: 0 }});
    if (!user) return res.status(404).json({ error: 'not found' });
    return res.json({ user });
  }

  if (req.method === 'PUT') {
    const update = {...req.body};
    if (update.password) update.password = await bcrypt.hash(update.password, 10);
    await db.collection('users').updateOne({ _id: new ObjectId(id) }, { $set: update });
    const user = await db.collection('users').findOne({ _id: new ObjectId(id) }, { projection: { password: 0 }});
    return res.json({ user });
  }

  if (req.method === 'DELETE') {
    await db.collection('users').deleteOne({ _id: new ObjectId(id) });
    // optionally record activity log
    return res.json({ deleted: true });
  }

  res.status(405).end();
}
