'use client';

export type MenuType = 'food' | 'beverage';

export interface MenuCategory {
  id: string;
  name: string;
  description: string;
  displayOrder: number;
  isActive: boolean;
  menuType: MenuType;
  createdAt: string;
  updatedAt: string;
}

export interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  imageAlt: string;
  subcategory?: string | null;
  tag?: 'Signature' | 'Premium' | 'Unlimited' | 'Sharing' | 'Set Menu' | 'Lunch' | null;
  menuType: MenuType;
  isAvailable: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

function mapCategory(row: any): MenuCategory {
  return {
    id: row.id,
    name: row.name,
    description: row.description || '',
    displayOrder: row.display_order,
    isActive: row.is_active,
    menuType: (row.menu_type as MenuType) || 'food',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapItem(row: any): MenuItem {
  return {
    id: row.id,
    categoryId: row.category_id,
    name: row.name,
    description: row.description || '',
    price: parseFloat(row.price),
    imageUrl: row.image_url || '',
    imageAlt: row.image_alt || '',
    subcategory: row.subcategory || null,
    tag: row.tag,
    menuType: (row.menu_type as MenuType) || 'food',
    isAvailable: row.is_available,
    displayOrder: row.display_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const menuService = {
  async getAllCategories(): Promise<MenuCategory[]> {
    const res = await fetch('/api/menu/categories');
    if (!res.ok) return [];
    const data = await res.json();
    return data.map(mapCategory);
  },

  async createCategory(category: Partial<MenuCategory>): Promise<MenuCategory | null> {
    const res = await fetch('/api/menu/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: category.name,
        description: category.description || '',
        display_order: category.displayOrder || 1,
        is_active: category.isActive ?? true,
        menu_type: category.menuType || 'food',
      }),
    });
    if (!res.ok) return null;
    return mapCategory(await res.json());
  },

  async updateCategory(id: string, updates: Partial<MenuCategory>): Promise<MenuCategory | null> {
    const body: any = { id };
    if (updates.name !== undefined) body.name = updates.name;
    if (updates.description !== undefined) body.description = updates.description;
    if (updates.displayOrder !== undefined) body.display_order = updates.displayOrder;
    if (updates.isActive !== undefined) body.is_active = updates.isActive;
    if (updates.menuType !== undefined) body.menu_type = updates.menuType;

    const res = await fetch('/api/menu/categories', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) return null;
    return mapCategory(await res.json());
  },

  async deleteCategory(id: string): Promise<boolean> {
    const res = await fetch(`/api/menu/categories?id=${id}`, { method: 'DELETE' });
    return res.ok;
  },

  async getAllItems(): Promise<MenuItem[]> {
    const res = await fetch('/api/menu/items');
    if (!res.ok) return [];
    const data = await res.json();
    return data.map(mapItem);
  },

  async createItem(item: Partial<MenuItem>): Promise<MenuItem | null> {
    const res = await fetch('/api/menu/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category_id: item.categoryId,
        name: item.name,
        description: item.description || '',
        price: item.price,
        image_url: item.imageUrl || '',
        image_alt: item.imageAlt || item.name || '',
        subcategory: item.subcategory || null,
        tag: item.tag || null,
        menu_type: item.menuType || 'food',
        is_available: item.isAvailable ?? true,
        display_order: item.displayOrder || 1,
      }),
    });
    if (!res.ok) return null;
    return mapItem(await res.json());
  },

  async updateItem(id: string, updates: Partial<MenuItem>): Promise<MenuItem | null> {
    const body: any = { id };
    if (updates.categoryId !== undefined) body.category_id = updates.categoryId;
    if (updates.name !== undefined) body.name = updates.name;
    if (updates.description !== undefined) body.description = updates.description;
    if (updates.price !== undefined) body.price = updates.price;
    if (updates.imageUrl !== undefined) body.image_url = updates.imageUrl;
    if (updates.imageAlt !== undefined) body.image_alt = updates.imageAlt;
    if (updates.subcategory !== undefined) body.subcategory = updates.subcategory;
    if (updates.tag !== undefined) body.tag = updates.tag;
    if (updates.menuType !== undefined) body.menu_type = updates.menuType;
    if (updates.isAvailable !== undefined) body.is_available = updates.isAvailable;
    if (updates.displayOrder !== undefined) body.display_order = updates.displayOrder;

    const res = await fetch('/api/menu/items', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) return null;
    return mapItem(await res.json());
  },

  async deleteItem(id: string): Promise<boolean> {
    const res = await fetch(`/api/menu/items?id=${id}`, { method: 'DELETE' });
    return res.ok;
  },
};
