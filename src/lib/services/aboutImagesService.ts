'use client';

export interface AboutPageImage {
  id: string;
  imageKey: string;
  section: string;
  label: string;
  imageUrl: string;
  imageAlt: string;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

function mapRow(row: any): AboutPageImage {
  return {
    id: row.id,
    imageKey: row.image_key,
    section: row.section,
    label: row.label,
    imageUrl: row.image_url ?? '',
    imageAlt: row.image_alt ?? '',
    displayOrder: row.display_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const aboutImagesService = {
  async getAllImages(): Promise<AboutPageImage[]> {
    const res = await fetch('/api/about-images');
    if (!res.ok) return [];
    const data = await res.json();
    return data.map(mapRow);
  },

  async getImageByKey(key: string): Promise<AboutPageImage | null> {
    const res = await fetch(`/api/about-images?key=${encodeURIComponent(key)}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data ? mapRow(data) : null;
  },

  async updateImage(
    id: string,
    updates: Partial<Pick<AboutPageImage, 'imageUrl' | 'imageAlt' | 'label'>>
  ): Promise<AboutPageImage | null> {
    const body: any = { id };
    if (updates.imageUrl !== undefined) body.image_url = updates.imageUrl;
    if (updates.imageAlt !== undefined) body.image_alt = updates.imageAlt;
    if (updates.label !== undefined) body.label = updates.label;

    const res = await fetch('/api/about-images', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error('Update failed');
    return mapRow(await res.json());
  },
};
