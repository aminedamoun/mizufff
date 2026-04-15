import { NextRequest, NextResponse } from 'next/server';
import { readDb, writeDb, generateId, nowISO } from '@/lib/local-db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const db = readDb();
  const { searchParams } = new URL(req.url);
  const activeOnly = searchParams.get('active') === 'true';
  let offers = [...db.offers].sort((a, b) => a.display_order - b.display_order);
  if (activeOnly) offers = offers.filter((o: any) => o.is_active);
  return NextResponse.json(offers);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const db = readDb();
  const now = nowISO();
  const newOffer = {
    id: generateId('offer'),
    title: body.title || '',
    description: body.description || '',
    image_url: body.image_url || '',
    image_alt: body.image_alt || body.title || '',
    is_active: body.is_active ?? true,
    display_order: body.display_order || db.offers.length + 1,
    rating: body.rating ?? 5.0,
    created_at: now,
    updated_at: now,
  };
  db.offers.push(newOffer);
  writeDb(db);
  return NextResponse.json(newOffer, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const db = readDb();
  const idx = db.offers.findIndex((o: any) => o.id === body.id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const offer = db.offers[idx];
  const fields = ['title', 'description', 'image_url', 'image_alt', 'is_active', 'display_order', 'rating'];
  for (const f of fields) {
    if (body[f] !== undefined) (offer as any)[f] = body[f];
  }
  offer.updated_at = nowISO();
  db.offers[idx] = offer;
  writeDb(db);
  return NextResponse.json(offer);
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const db = readDb();
  db.offers = db.offers.filter((o: any) => o.id !== id);
  writeDb(db);
  return NextResponse.json({ success: true });
}
