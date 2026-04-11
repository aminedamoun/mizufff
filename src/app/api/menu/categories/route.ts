import { NextRequest, NextResponse } from 'next/server';
import { readDb, writeDb, generateId, nowISO } from '@/lib/local-db';

export async function GET() {
  const db = readDb();
  const sorted = [...db.menu_categories].sort((a, b) => a.display_order - b.display_order);
  return NextResponse.json(sorted);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const db = readDb();
  const now = nowISO();
  const newCat = {
    id: generateId('cat'),
    name: body.name || '',
    description: body.description || '',
    display_order: body.display_order || db.menu_categories.length + 1,
    is_active: body.is_active ?? true,
    menu_type: body.menu_type || 'food',
    created_at: now,
    updated_at: now,
  };
  db.menu_categories.push(newCat);
  writeDb(db);
  return NextResponse.json(newCat, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const db = readDb();
  const idx = db.menu_categories.findIndex((c: any) => c.id === body.id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const cat = db.menu_categories[idx];
  if (body.name !== undefined) cat.name = body.name;
  if (body.description !== undefined) cat.description = body.description;
  if (body.display_order !== undefined) cat.display_order = body.display_order;
  if (body.is_active !== undefined) cat.is_active = body.is_active;
  if (body.menu_type !== undefined) cat.menu_type = body.menu_type;
  cat.updated_at = nowISO();
  db.menu_categories[idx] = cat;
  writeDb(db);
  return NextResponse.json(cat);
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const db = readDb();
  db.menu_categories = db.menu_categories.filter((c: any) => c.id !== id);
  db.menu_items = db.menu_items.filter((i: any) => i.category_id !== id);
  writeDb(db);
  return NextResponse.json({ success: true });
}
