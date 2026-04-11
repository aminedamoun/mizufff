'use client';

import React from 'react';

interface Category {
  id: string;
  name: string;
  count: number;
}

interface Subcategory {
  name: string;
  count: number;
}

interface MenuFiltersProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (id: string) => void;
  subcategories: Subcategory[];
  activeSubcategory: string;
  onSubcategoryChange: (name: string) => void;
}

export default function MenuFilters({ 
  categories, 
  activeCategory, 
  onCategoryChange,
  subcategories,
  activeSubcategory,
  onSubcategoryChange 
}: MenuFiltersProps) {
  return (
    <div className="space-y-6 mb-12">
      {/* Category Filters */}
      <div>
        <h3 className="text-sm font-medium text-white/60 mb-3 uppercase tracking-wider">Categories</h3>
        <div className="flex flex-wrap gap-3">
          <button
            className={`category-pill ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => onCategoryChange('all')}
          >
            All Items
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`category-pill ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => onCategoryChange(cat.id)}
            >
              {cat.name}
              <span className="ml-2 text-white/30">({cat.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Subcategory Filters - Only show when a specific category is selected */}
      {activeCategory !== 'all' && subcategories.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-white/60 mb-3 uppercase tracking-wider">Subcategories</h3>
          <div className="flex flex-wrap gap-3">
            <button
              className={`category-pill ${activeSubcategory === 'all' ? 'active' : ''}`}
              onClick={() => onSubcategoryChange('all')}
            >
              All
            </button>
            {subcategories.map((subcat) => (
              <button
                key={subcat.name}
                className={`category-pill ${activeSubcategory === subcat.name ? 'active' : ''}`}
                onClick={() => onSubcategoryChange(subcat.name)}
              >
                {subcat.name}
                <span className="ml-2 text-white/30">({subcat.count})</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}