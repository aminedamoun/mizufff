import { NextRequest, NextResponse } from 'next/server';
import { readDb, writeDb, nowISO } from '@/lib/local-db';

export async function GET() {
  const db = readDb();
  return NextResponse.json(db.site_settings || { banner_video_url: '/images/hero/banner-video.mp4' });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const db = readDb();
  if (!db.site_settings) {
    db.site_settings = { banner_video_url: '/images/hero/banner-video.mp4', updated_at: nowISO() };
  }
  if (body.banner_video_url !== undefined) db.site_settings.banner_video_url = body.banner_video_url;
  db.site_settings.updated_at = nowISO();
  writeDb(db);
  return NextResponse.json(db.site_settings);
}
