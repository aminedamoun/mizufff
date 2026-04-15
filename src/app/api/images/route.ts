import { NextRequest, NextResponse } from 'next/server';
import { readDb, writeDb, generateId, nowISO } from '@/lib/local-db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const db = readDb();
  const { searchParams } = new URL(req.url);
  const activeOnly = searchParams.get('active') === 'true';
  let images = [...db.restaurant_images].sort((a, b) => a.display_order - b.display_order);
  if (activeOnly) images = images.filter((i: any) => i.is_active);
  return NextResponse.json(images);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const db = readDb();
  const now = nowISO();
  const newImg = {
    id: generateId('img'),
    image_url: body.image_url || '',
    title: body.title || '',
    image_alt: body.image_alt || body.title || '',
    span_class: body.span_class || 'col-span-1',
    is_active: body.is_active ?? true,
    is_intro: body.is_intro ?? false,
    display_order: body.display_order || db.restaurant_images.length + 1,
    created_at: now,
    updated_at: now,
  };
  db.restaurant_images.push(newImg);
  writeDb(db);
  return NextResponse.json(newImg, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const db = readDb();
  const idx = db.restaurant_images.findIndex((i: any) => i.id === body.id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const img = db.restaurant_images[idx];
  const fields = ['image_url', 'title', 'image_alt', 'span_class', 'is_active', 'is_intro', 'display_order'];
  for (const f of fields) {
    if (body[f] !== undefined) (img as any)[f] = body[f];
  }
  img.updated_at = nowISO();
  db.restaurant_images[idx] = img;
  writeDb(db);
  return NextResponse.json(img);
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const db = readDb();
  db.restaurant_images = db.restaurant_images.filter((i: any) => i.id !== id);
  writeDb(db);
  return NextResponse.json({ success: true });
}
