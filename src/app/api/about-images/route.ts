import { NextRequest, NextResponse } from 'next/server';
import { readDb, writeDb, nowISO } from '@/lib/local-db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const db = readDb();
  const { searchParams } = new URL(req.url);
  const key = searchParams.get('key');

  if (key) {
    const image = db.about_page_images.find((i: any) => i.image_key === key);
    return image ? NextResponse.json(image) : NextResponse.json(null);
  }

  const sorted = [...db.about_page_images].sort((a, b) => a.display_order - b.display_order);
  return NextResponse.json(sorted);
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const db = readDb();
  const idx = db.about_page_images.findIndex((i: any) => i.id === body.id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const img = db.about_page_images[idx];
  if (body.image_url !== undefined) img.image_url = body.image_url;
  if (body.image_alt !== undefined) img.image_alt = body.image_alt;
  if (body.label !== undefined) img.label = body.label;
  img.updated_at = nowISO();
  db.about_page_images[idx] = img;
  writeDb(db);
  return NextResponse.json(img);
}
