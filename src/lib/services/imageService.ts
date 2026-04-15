'use client';

export interface RestaurantImage {
  id: string;
  imageUrl: string;
  title: string;
  imageAlt: string;
  spanClass: string;
  isActive: boolean;
  isIntro: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

function mapImage(row: any): RestaurantImage {
  return {
    id: row.id,
    imageUrl: row.image_url,
    title: row.title,
    imageAlt: row.image_alt,
    spanClass: row.span_class,
    isActive: row.is_active,
    isIntro: row.is_intro,
    displayOrder: row.display_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const imageService = {
  async getAllImages(): Promise<RestaurantImage[]> {
    const res = await fetch('/api/images', { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return data.map(mapImage);
  },

  async createImage(image: Partial<RestaurantImage>): Promise<RestaurantImage | null> {
    const res = await fetch('/api/images', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image_url: image.imageUrl,
        title: image.title,
        image_alt: image.imageAlt || image.title || '',
        span_class: image.spanClass || 'col-span-1',
        is_active: image.isActive ?? true,
        is_intro: image.isIntro ?? false,
        display_order: image.displayOrder || 1,
      }),
    });
    if (!res.ok) return null;
    return mapImage(await res.json());
  },

  async updateImage(id: string, updates: Partial<RestaurantImage>): Promise<RestaurantImage | null> {
    const body: any = { id };
    if (updates.imageUrl !== undefined) body.image_url = updates.imageUrl;
    if (updates.title !== undefined) body.title = updates.title;
    if (updates.imageAlt !== undefined) body.image_alt = updates.imageAlt;
    if (updates.spanClass !== undefined) body.span_class = updates.spanClass;
    if (updates.isActive !== undefined) body.is_active = updates.isActive;
    if (updates.isIntro !== undefined) body.is_intro = updates.isIntro;
    if (updates.displayOrder !== undefined) body.display_order = updates.displayOrder;

    const res = await fetch('/api/images', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) return null;
    return mapImage(await res.json());
  },

  async deleteImage(id: string): Promise<boolean> {
    const res = await fetch(`/api/images?id=${id}`, { method: 'DELETE' });
    return res.ok;
  },

  async getActiveImages(): Promise<RestaurantImage[]> {
    const res = await fetch('/api/images?active=true', { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return data.map(mapImage);
  },
};
