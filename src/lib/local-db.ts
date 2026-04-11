import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

export interface DbData {
  menu_categories: any[];
  menu_items: any[];
  restaurant_images: any[];
  offers: any[];
  delivery_settings: any[];
  about_page_images: any[];
  auth: { admin_email: string; admin_password: string };
  site_settings?: { banner_video_url: string; updated_at: string };
}

export function readDb(): DbData {
  const raw = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(raw);
}

export function writeDb(data: DbData): void {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

export function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
}

export function nowISO(): string {
  return new Date().toISOString();
}
