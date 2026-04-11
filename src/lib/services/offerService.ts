'use client';

export interface Offer {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  isActive: boolean;
  displayOrder: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

function mapOffer(row: any): Offer {
  return {
    id: row.id,
    title: row.title,
    description: row.description || '',
    imageUrl: row.image_url || '',
    imageAlt: row.image_alt || '',
    isActive: row.is_active,
    displayOrder: row.display_order,
    rating: row.rating ?? 5.0,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const offerService = {
  async getAllOffers(): Promise<Offer[]> {
    const res = await fetch('/api/offers');
    if (!res.ok) return [];
    const data = await res.json();
    return data.map(mapOffer);
  },

  async getActiveOffers(): Promise<Offer[]> {
    const res = await fetch('/api/offers?active=true');
    if (!res.ok) return [];
    const data = await res.json();
    return data.map(mapOffer);
  },

  async createOffer(offer: Partial<Offer>): Promise<Offer | null> {
    const res = await fetch('/api/offers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: offer.title,
        description: offer.description || '',
        image_url: offer.imageUrl || '',
        image_alt: offer.imageAlt || offer.title || '',
        is_active: offer.isActive ?? true,
        display_order: offer.displayOrder || 1,
        rating: offer.rating ?? 5.0,
      }),
    });
    if (!res.ok) return null;
    return mapOffer(await res.json());
  },

  async updateOffer(id: string, updates: Partial<Offer>): Promise<Offer | null> {
    const body: any = { id };
    if (updates.title !== undefined) body.title = updates.title;
    if (updates.description !== undefined) body.description = updates.description;
    if (updates.imageUrl !== undefined) body.image_url = updates.imageUrl;
    if (updates.imageAlt !== undefined) body.image_alt = updates.imageAlt;
    if (updates.isActive !== undefined) body.is_active = updates.isActive;
    if (updates.displayOrder !== undefined) body.display_order = updates.displayOrder;
    if (updates.rating !== undefined) body.rating = updates.rating;

    const res = await fetch('/api/offers', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) return null;
    return mapOffer(await res.json());
  },

  async deleteOffer(id: string): Promise<boolean> {
    const res = await fetch(`/api/offers?id=${id}`, { method: 'DELETE' });
    return res.ok;
  },
};
