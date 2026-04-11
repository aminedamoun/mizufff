'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import MenuFilters from './MenuFilters';
import MenuItemCard from './MenuItemCard';
import { menuService, type MenuItem, type MenuCategory, type MenuType } from '@/lib/services/menuService';

export default function MenuGrid() {
  const [menuType, setMenuType] = useState<MenuType>('food');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeSubcategory, setActiveSubcategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [categoriesData, itemsData] = await Promise.all([
        menuService.getAllCategories(),
        menuService.getAllItems(),
      ]);
      setCategories(categoriesData);
      setMenuItems(itemsData);
    } catch (error) {
      console.error('Failed to load menu data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Reset subcategory when category changes
  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    setActiveSubcategory('all');
  };

  const handleMenuTypeChange = (type: MenuType) => {
    if (type === menuType) return;
    setMenuType(type);
    setActiveCategory('all');
    setActiveSubcategory('all');
    setSearchQuery('');
  };

  const scopedCategories = useMemo(
    () => categories.filter((c) => c.menuType === menuType && c.isActive),
    [categories, menuType]
  );
  const scopedItems = useMemo(
    () => menuItems.filter((i) => i.menuType === menuType),
    [menuItems, menuType]
  );

  useEffect(() => {
    if (loading) return;
    const root = sectionRef.current;
    if (!root) return;
    const reveals = Array.from(root.querySelectorAll<HTMLElement>('.reveal'));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = reveals.indexOf(entry.target as HTMLElement);
            setTimeout(() => entry.target.classList.add('revealed'), Math.max(idx, 0) * 40);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05 }
    );
    reveals.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [loading, menuType, activeCategory, activeSubcategory, searchQuery]);

  // Filter items by category, subcategory, and search
  const filteredItems = scopedItems?.filter((item) => {
    const matchCat = activeCategory === 'all' || item?.categoryId === activeCategory;
    const matchSubcat = activeSubcategory === 'all' || item?.subcategory === activeSubcategory;
    const matchSearch =
      !searchQuery ||
      item?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
      item?.description?.toLowerCase()?.includes(searchQuery?.toLowerCase());
    return matchCat && matchSubcat && matchSearch && item?.isAvailable;
  });

  const categoryData = scopedCategories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    count: scopedItems.filter((item) => item.categoryId === cat.id && item.isAvailable).length,
  }));

  // Get unique subcategories for the selected category
  const subcategoryData = React.useMemo(() => {
    if (activeCategory === 'all') return [];

    const categoryItems = scopedItems.filter(
      (item) => item.categoryId === activeCategory && item.isAvailable && item.subcategory
    );
    
    const subcategoryCounts = categoryItems.reduce((acc, item) => {
      const subcat = item.subcategory || '';
      if (subcat) {
        acc[subcat] = (acc[subcat] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(subcategoryCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [activeCategory, scopedItems]);

  // Group items by subcategory for display
  const groupedItems = filteredItems?.reduce((acc, item) => {
    const key = item.subcategory || 'No Subcategory';
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  const subcategoryOrder = Object.keys(groupedItems || {}).sort((a, b) => {
    if (a === 'No Subcategory') return 1;
    if (b === 'No Subcategory') return -1;
    return a.localeCompare(b);
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div ref={sectionRef}>
      {/* Food / Beverage switcher */}
      <div className="mb-10 flex justify-center">
        <div className="relative inline-flex items-center p-1 bg-white/[0.04] border border-white/10 rounded-full backdrop-blur-sm">
          <span
            aria-hidden
            className="absolute top-1 bottom-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-primary transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
            style={{ transform: menuType === 'beverage' ? 'translateX(100%)' : 'translateX(0%)' }}
          />
          {(['food', 'beverage'] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => handleMenuTypeChange(type)}
              className={`relative z-10 px-6 md:px-10 py-3 text-xs md:text-sm uppercase tracking-widest-2 font-medium transition-colors duration-300 ${
                menuType === type ? 'text-white' : 'text-white/50 hover:text-white/80'
              }`}
            >
              <span className="inline-flex items-center gap-2">
                {type === 'food' ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 11V3a1 1 0 0 1 2 0v8M13 11V3a1 1 0 0 0-2 0v8M9 11V3a1 1 0 0 0-2 0v8a4 4 0 0 0 4 4v6" />
                    <path d="M19 3c1.5 2 2 4 2 7a4 4 0 0 1-4 4v7" />
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2h12l-1 8a5 5 0 0 1-10 0L6 2Z" />
                    <path d="M9 22h6M12 17v5" />
                  </svg>
                )}
                {type === 'food' ? 'Food Menu' : 'Beverage Menu'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="mb-8">
        <input
          type="text"
          placeholder={`Search ${menuType === 'food' ? 'menu' : 'beverages'}...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e?.target?.value)}
          className="form-input max-w-md text-sm"
        />
      </div>
      
      <MenuFilters 
        categories={categoryData} 
        activeCategory={activeCategory} 
        onCategoryChange={handleCategoryChange}
        subcategories={subcategoryData}
        activeSubcategory={activeSubcategory}
        onSubcategoryChange={setActiveSubcategory}
      />

      {filteredItems?.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-display text-3xl text-white/20 italic">No items found</p>
        </div>
      ) : (
        <div className="space-y-12">
          {subcategoryOrder.map((subcategory) => (
            <div key={subcategory}>
              {subcategory !== 'No Subcategory' && (
                <h3 className="text-2xl font-display text-white mb-6 pb-2 border-b border-white/10">
                  {subcategory}
                </h3>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {groupedItems[subcategory]?.map((item) => (
                  <div key={item?.id} className="reveal">
                    <MenuItemCard
                      item={{
                        id: item.id,
                        category_id: item.categoryId,
                        name: item.name,
                        description: item.description,
                        price: item.price,
                        image_url: item.imageUrl,
                        image_alt: item.imageAlt,
                        tag: item.tag,
                        is_available: item.isAvailable,
                        display_order: item.displayOrder,
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}