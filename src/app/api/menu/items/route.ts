import { NextRequest, NextResponse } from 'next/server';
import { readDb, writeDb, generateId, nowISO } from '@/lib/local-db';

export async function GET() {
  const db = readDb();
  const sorted = [...db.menu_items].sort((a, b) => a.display_order - b.display_order);
  return NextResponse.json(sorted);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const db = readDb();
  const now = nowISO();
  const newItem = {
    id: generateId('item'),
    category_id: body.category_id || '',
    name: body.name || '',
    description: body.description || '',
    price: body.price || 0,
    image_url: body.image_url || '',
    image_alt: body.image_alt || body.name || '',
    subcategory: body.subcategory || null,
    tag: body.tag || null,
    menu_type: body.menu_type || 'food',
    is_available: body.is_available ?? true,
    display_order: body.display_order || 1,
    created_at: now,
    updated_at: now,
  };
  db.menu_items.push(newItem);
  writeDb(db);
  return NextResponse.json(newItem, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const db = readDb();
  const idx = db.menu_items.findIndex((i: any) => i.id === body.id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const item = db.menu_items[idx];
  const fields = ['category_id', 'name', 'description', 'price', 'image_url', 'image_alt', 'subcategory', 'tag', 'menu_type', 'is_available', 'display_order'];
  for (const f of fields) {
    if (body[f] !== undefined) (item as any)[f] = body[f];
  }
  item.updated_at = nowISO();
  db.menu_items[idx] = item;
  writeDb(db);
  return NextResponse.json(item);
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const db = readDb();
  db.menu_items = db.menu_items.filter((i: any) => i.id !== id);
  writeDb(db);
  return NextResponse.json({ success: true });
}
