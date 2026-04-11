'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import AdminMenuManager from './AdminMenuManager';
import AdminImageManager from './AdminImageManager';
import AdminOffersManager from './AdminOffersManager';
import AdminAtmosphereManager from './AdminAtmosphereManager';
import AdminDeliveryManager from './AdminDeliveryManager';
import AdminAboutImagesManager from './AdminAboutImagesManager';
import AdminBannerManager from './AdminBannerManager';

type AdminTab =
  | 'menu'
  | 'images'
  | 'atmosphere'
  | 'about-images'
  | 'banner'
  | 'offers'
  | 'delivery';

type NavItem = {
  id: AdminTab;
  label: string;
  icon: string;
  description: string;
};

type NavGroup = {
  id: string;
  label: string;
  items: NavItem[];
};

const NAV: NavGroup[] = [
  {
    id: 'menus',
    label: 'Menus',
    items: [
      {
        id: 'menu',
        label: 'Food & Beverage',
        icon: 'DocumentTextIcon',
        description: 'Manage food and beverage categories and items',
      },
    ],
  },
  {
    id: 'media',
    label: 'Media',
    items: [
      {
        id: 'images',
        label: 'Gallery',
        icon: 'PhotoIcon',
        description: 'Restaurant gallery images shown on the site',
      },
      {
        id: 'atmosphere',
        label: 'Atmosphere',
        icon: 'CameraIcon',
        description: 'Atmosphere section images',
      },
      {
        id: 'about-images',
        label: 'About Page',
        icon: 'BookOpenIcon',
        description: 'Images shown on the About page',
      },
      {
        id: 'banner',
        label: 'Banner Video',
        icon: 'VideoCameraIcon',
        description: 'Hero banner video on the homepage',
      },
    ],
  },
  {
    id: 'marketing',
    label: 'Marketing',
    items: [
      {
        id: 'offers',
        label: 'Offers',
        icon: 'TagIcon',
        description: 'Promotional offers shown on the site',
      },
      {
        id: 'delivery',
        label: 'Delivery Partners',
        icon: 'TruckIcon',
        description: 'Talabat, Deliveroo, Careem and other partners',
      },
    ],
  },
];

type Stats = {
  foodCats: number;
  foodItems: number;
  bevCats: number;
  bevItems: number;
  galleryImages: number;
};

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<AdminTab>('menu');
  const [stats, setStats] = useState<Stats>({
    foodCats: 0,
    foodItems: 0,
    bevCats: 0,
    bevItems: 0,
    galleryImages: 0,
  });

  useEffect(() => {
    const load = async () => {
      try {
        const [catsRes, itemsRes, imgRes] = await Promise.all([
          fetch('/api/menu/categories').then((r) => (r.ok ? r.json() : [])),
          fetch('/api/menu/items').then((r) => (r.ok ? r.json() : [])),
          fetch('/api/images')
            .then((r) => (r.ok ? r.json() : []))
            .catch(() => []),
        ]);
        setStats({
          foodCats: catsRes.filter((c: any) => (c.menu_type || 'food') === 'food').length,
          foodItems: itemsRes.filter((i: any) => (i.menu_type || 'food') === 'food').length,
          bevCats: catsRes.filter((c: any) => c.menu_type === 'beverage').length,
          bevItems: itemsRes.filter((i: any) => i.menu_type === 'beverage').length,
          galleryImages: Array.isArray(imgRes) ? imgRes.length : 0,
        });
      } catch (err) {
        console.error('Failed to load stats', err);
      }
    };
    load();
  }, [activeTab]);

  const activeItem = NAV.flatMap((g) => g.items).find((i) => i.id === activeTab);

  const statCards = [
    { label: 'Food Categories', value: stats.foodCats, icon: 'TagIcon' },
    { label: 'Food Items', value: stats.foodItems, icon: 'DocumentTextIcon' },
    { label: 'Beverage Categories', value: stats.bevCats, icon: 'TagIcon' },
    { label: 'Beverage Items', value: stats.bevItems, icon: 'DocumentTextIcon' },
  ];

  return (
    <div className="pt-28 pb-20 px-6">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="mb-10">
          <span className="text-[10px] uppercase tracking-widest-3 text-white/30 mb-2 block">Management Console</span>
          <h1 className="font-display text-5xl text-white font-light">
            Admin <span className="italic text-primary">Panel</span>
          </h1>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {statCards.map((stat) => (
            <div key={stat.label} className="border border-white/5 bg-white/[0.02] p-5">
              <Icon
                name={stat.icon as Parameters<typeof Icon>[0]['name']}
                size={20}
                variant="outline"
                className="text-primary mb-3"
              />
              <p className="font-display text-3xl text-white font-light mb-1">{stat.value}</p>
              <p className="text-[10px] uppercase tracking-widest-2 text-white/30">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Layout: sidebar + content */}
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
          {/* Sidebar */}
          <aside className="lg:sticky lg:top-28 lg:self-start space-y-6">
            {NAV.map((group) => (
              <div key={group.id}>
                <p className="text-[10px] uppercase tracking-widest-3 text-white/30 mb-3 px-3">{group.label}</p>
                <nav className="space-y-1">
                  {group.items.map((item) => {
                    const active = item.id === activeTab;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 text-left text-xs transition-all border-l-2 ${
                          active
                            ? 'border-primary bg-primary/10 text-white'
                            : 'border-transparent text-white/50 hover:text-white hover:bg-white/[0.03]'
                        }`}
                      >
                        <Icon
                          name={item.icon as Parameters<typeof Icon>[0]['name']}
                          size={16}
                          variant="outline"
                          className={active ? 'text-primary' : 'text-white/40'}
                        />
                        <span className="uppercase tracking-widest-2 font-medium">{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            ))}
          </aside>

          {/* Content */}
          <main className="min-w-0">
            {activeItem && (
              <div className="mb-8 pb-6 border-b border-white/5">
                <h2 className="font-display text-3xl text-white font-light mb-1">{activeItem.label}</h2>
                <p className="text-xs text-white/40">{activeItem.description}</p>
              </div>
            )}

            <div>
              {activeTab === 'menu' && <AdminMenuManager />}
              {activeTab === 'images' && <AdminImageManager />}
              {activeTab === 'atmosphere' && <AdminAtmosphereManager />}
              {activeTab === 'about-images' && <AdminAboutImagesManager />}
              {activeTab === 'banner' && <AdminBannerManager />}
              {activeTab === 'offers' && <AdminOffersManager />}
              {activeTab === 'delivery' && <AdminDeliveryManager />}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
