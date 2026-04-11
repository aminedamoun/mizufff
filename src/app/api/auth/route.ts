import { NextRequest, NextResponse } from 'next/server';
import { readDb } from '@/lib/local-db';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, password } = body;
  const db = readDb();

  if (email === db.auth.admin_email && password === db.auth.admin_password) {
    const token = Buffer.from(`${email}:${Date.now()}`).toString('base64');
    return NextResponse.json({
      user: { id: 'admin-001', email, role: 'admin' },
      token,
    });
  }

  return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
}
