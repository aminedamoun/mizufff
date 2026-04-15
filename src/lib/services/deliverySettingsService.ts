'use client';

export interface DeliveryPartner {
  id: string;
  partnerKey: string;
  partnerName: string;
  imageUrl: string;
  imageAlt: string;
  partnerUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

function mapRow(row: any): DeliveryPartner {
  return {
    id: row.id,
    partnerKey: row.partner_key,
    partnerName: row.partner_name,
    imageUrl: row.image_url,
    imageAlt: row.image_alt,
    partnerUrl: row.partner_url,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const deliverySettingsService = {
  async getAllPartners(): Promise<DeliveryPartner[]> {
    const res = await fetch('/api/delivery', { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return data.map(mapRow);
  },

  async updatePartner(
    id: string,
    updates: Partial<Pick<DeliveryPartner, 'imageUrl' | 'imageAlt' | 'partnerUrl' | 'partnerName'>>
  ): Promise<DeliveryPartner | null> {
    const body: any = { id };
    if (updates.imageUrl !== undefined) body.image_url = updates.imageUrl;
    if (updates.imageAlt !== undefined) body.image_alt = updates.imageAlt;
    if (updates.partnerUrl !== undefined) body.partner_url = updates.partnerUrl;
    if (updates.partnerName !== undefined) body.partner_name = updates.partnerName;

    const res = await fetch('/api/delivery', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error('Update failed');
    return mapRow(await res.json());
  },
};
