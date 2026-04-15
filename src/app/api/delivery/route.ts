import { NextRequest, NextResponse } from 'next/server';
import { readDb, writeDb, nowISO } from '@/lib/local-db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const db = readDb();
  const sorted = [...db.delivery_settings].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );
  return NextResponse.json(sorted);
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const db = readDb();
  const idx = db.delivery_settings.findIndex((d: any) => d.id === body.id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const partner = db.delivery_settings[idx];
  if (body.image_url !== undefined) partner.image_url = body.image_url;
  if (body.image_alt !== undefined) partner.image_alt = body.image_alt;
  if (body.partner_url !== undefined) partner.partner_url = body.partner_url;
  if (body.partner_name !== undefined) partner.partner_name = body.partner_name;
  partner.updated_at = nowISO();
  db.delivery_settings[idx] = partner;
  writeDb(db);
  return NextResponse.json(partner);
}
