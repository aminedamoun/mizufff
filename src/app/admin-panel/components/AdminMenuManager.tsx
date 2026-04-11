'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';
import { menuService, type MenuCategory, type MenuItem, type MenuType } from '@/lib/services/menuService';
import { storageService } from '@/lib/services/storageService';

type AdminMenuView = 'items' | 'categories';

const TAGS = ['Signature', 'Premium', 'Unlimited', 'Sharing', 'Set Menu', 'Lunch'] as const;

const blankItem = (menuType: MenuType): Partial<MenuItem> => ({
  name: '',
  description: '',
  price: 0,
  imageUrl: '',
  imageAlt: '',
  categoryId: '',
  subcategory: '',
  tag: null,
  menuType,
  isAvailable: true,
  displayOrder: 1,
});

const blankCategory = (menuType: MenuType): Partial<MenuCategory> => ({
  name: '',
  description: '',
  displayOrder: 1,
  isActive: true,
  menuType,
});

export default function AdminMenuManager() {
  const [menuType, setMenuType] = useState<MenuType>('food');
  const [view, setView] = useState<AdminMenuView>('items');
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [filterCat, setFilterCat] = useState('all');
  const [search, setSearch] = useState('');
  const [showAddItem, setShowAddItem] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'item' | 'category'; id: string } | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [newItem, setNewItem] = useState<Partial<MenuItem>>(blankItem('food'));
  const [newCategory, setNewCategory] = useState<Partial<MenuCategory>>(blankCategory('food'));

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [c, i] = await Promise.all([menuService.getAllCategories(), menuService.getAllItems()]);
      setCategories(c);
      setItems(i);
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // ── scope by menu type ───────────────────────────────────────────
  const scopedCategories = useMemo(
    () => categories.filter((c) => c.menuType === menuType).sort((a, b) => a.displayOrder - b.displayOrder),
    [categories, menuType]
  );
  const scopedItems = useMemo(() => items.filter((i) => i.menuType === menuType), [items, menuType]);
  const filteredItems = useMemo(() => {
    let list = filterCat === 'all' ? scopedItems : scopedItems.filter((it) => it.categoryId === filterCat);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((it) => it.name.toLowerCase().includes(q) || it.description.toLowerCase().includes(q));
    }
    return list;
  }, [scopedItems, filterCat, search]);

  const switchMenuType = (t: MenuType) => {
    if (t === menuType) return;
    setMenuType(t);
    setFilterCat('all');
    setSearch('');
    setShowAddItem(false);
    setShowAddCategory(false);
    setNewItem(blankItem(t));
    setNewCategory(blankCategory(t));
  };

  // ── handlers ─────────────────────────────────────────────────────
  const toggleItemAvailability = async (id: string) => {
    const item = items.find((it) => it.id === id);
    if (!item) return;
    try {
      await menuService.updateItem(id, { isAvailable: !item.isAvailable });
      setItems((prev) => prev.map((it) => (it.id === id ? { ...it, isAvailable: !it.isAvailable } : it)));
    } catch (err: any) {
      setError(err.message || 'Failed to update item');
    }
  };

  const toggleCategoryActive = async (id: string) => {
    const category = categories.find((c) => c.id === id);
    if (!category) return;
    try {
      await menuService.updateCategory(id, { isActive: !category.isActive });
      setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c)));
    } catch (err: any) {
      setError(err.message || 'Failed to update category');
    }
  };

  const deleteItem = async (id: string) => {
    try {
      await menuService.deleteItem(id);
      setItems((prev) => prev.filter((it) => it.id !== id));
      setDeleteConfirm(null);
    } catch (err: any) {
      setError(err.message || 'Failed to delete item');
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await menuService.deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      setItems((prev) => prev.filter((i) => i.categoryId !== id));
      setDeleteConfirm(null);
    } catch (err: any) {
      setError(err.message || 'Failed to delete category');
    }
  };

  const addItem = async () => {
    if (!newItem.name || !newItem.categoryId) {
      setError('Name and category are required');
      return;
    }
    try {
      const created = await menuService.createItem({ ...newItem, menuType });
      if (created) {
        setItems((prev) => [...prev, created]);
        setNewItem(blankItem(menuType));
        setShowAddItem(false);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create item');
    }
  };

  const updateItem = async () => {
    if (!editingItem || !editingItem.name || !editingItem.categoryId) {
      setError('Name and category are required');
      return;
    }
    try {
      const updated = await menuService.updateItem(editingItem.id, editingItem);
      if (updated) {
        setItems((prev) => prev.map((it) => (it.id === updated.id ? updated : it)));
        setEditingItem(null);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update item');
    }
  };

  const addCategory = async () => {
    if (!newCategory.name) {
      setError('Category name is required');
      return;
    }
    try {
      const created = await menuService.createCategory({ ...newCategory, menuType });
      if (created) {
        setCategories((prev) => [...prev, created]);
        setNewCategory(blankCategory(menuType));
        setShowAddCategory(false);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create category');
    }
  };

  const updateCategory = async () => {
    if (!editingCategory || !editingCategory.name) {
      setError('Category name is required');
      return;
    }
    try {
      const updated = await menuService.updateCategory(editingCategory.id, editingCategory);
      if (updated) {
        setCategories((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
        setEditingCategory(null);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update category');
    }
  };

  const handleImageUpload = async (file: File, target: 'new' | 'edit') => {
    const validationError = storageService.validateImageFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }
    setUploadingImage(true);
    try {
      const result = await storageService.uploadImage(file);
      if (target === 'edit') {
        setEditingItem((prev) => (prev ? { ...prev, imageUrl: result.url } : null));
      } else {
        setNewItem((prev) => ({ ...prev, imageUrl: result.url }));
      }
    } catch (err: any) {
      setError(err.message || 'Image upload failed');
    } finally {
      setUploadingImage(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  // ── shared form: item ────────────────────────────────────────────
  const renderItemForm = (
    state: Partial<MenuItem>,
    setState: (patch: Partial<MenuItem>) => void,
    onSave: () => void,
    onCancel: () => void,
    title: string,
    isEdit: boolean
  ) => (
    <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
      {/* image side */}
      <div className="space-y-3">
        <label className="text-[10px] uppercase tracking-widest-2 text-white/40 font-semibold">Item Image</label>
        <div className="aspect-[4/3] border border-white/10 bg-white/[0.02] flex items-center justify-center overflow-hidden">
          {state.imageUrl ? (
            <AppImage src={state.imageUrl} alt={state.imageAlt || 'preview'} className="w-full h-full object-cover" />
          ) : (
            <div className="text-center text-white/20">
              <Icon name="PhotoIcon" size={32} variant="outline" className="mx-auto mb-2" />
              <p className="text-[10px] uppercase tracking-widest-2">No image</p>
            </div>
          )}
        </div>
        <input
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleImageUpload(f, isEdit ? 'edit' : 'new');
          }}
          disabled={uploadingImage}
          className="form-input text-xs file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-[10px] file:bg-primary/20 file:text-primary hover:file:bg-primary/30 file:cursor-pointer w-full"
        />
        <input
          type="text"
          placeholder="Or paste image URL"
          value={state.imageUrl || ''}
          onChange={(e) => setState({ imageUrl: e.target.value })}
          className="form-input text-xs w-full"
        />
        {uploadingImage && <p className="text-[10px] text-white/40">Uploading...</p>}
      </div>

      {/* fields side */}
      <div className="space-y-4">
        <div>
          <label className="text-[10px] uppercase tracking-widest-2 text-white/40 font-semibold block mb-1">Name *</label>
          <input
            type="text"
            value={state.name || ''}
            onChange={(e) => setState({ name: e.target.value })}
            className="form-input text-sm w-full"
            placeholder="e.g. Salmon Nigiri"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] uppercase tracking-widest-2 text-white/40 font-semibold block mb-1">Category *</label>
            <select
              value={state.categoryId || ''}
              onChange={(e) => setState({ categoryId: e.target.value })}
              className="form-input text-sm w-full"
            >
              <option value="">Select category</option>
              {scopedCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest-2 text-white/40 font-semibold block mb-1">Price (AED)</label>
            <input
              type="number"
              value={state.price ?? ''}
              onChange={(e) => setState({ price: parseFloat(e.target.value) || 0 })}
              className="form-input text-sm w-full"
              step="0.01"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest-2 text-white/40 font-semibold block mb-1">Subcategory</label>
            <input
              type="text"
              value={state.subcategory || ''}
              onChange={(e) => setState({ subcategory: e.target.value })}
              className="form-input text-sm w-full"
              placeholder="optional"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest-2 text-white/40 font-semibold block mb-1">Tag</label>
            <select
              value={state.tag || ''}
              onChange={(e) => setState({ tag: (e.target.value || null) as any })}
              className="form-input text-sm w-full"
            >
              <option value="">No tag</option>
              {TAGS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest-2 text-white/40 font-semibold block mb-1">Image alt text</label>
            <input
              type="text"
              value={state.imageAlt || ''}
              onChange={(e) => setState({ imageAlt: e.target.value })}
              className="form-input text-sm w-full"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest-2 text-white/40 font-semibold block mb-1">Display order</label>
            <input
              type="number"
              value={state.displayOrder ?? ''}
              onChange={(e) => setState({ displayOrder: parseInt(e.target.value) || 1 })}
              className="form-input text-sm w-full"
            />
          </div>
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-widest-2 text-white/40 font-semibold block mb-1">Description</label>
          <textarea
            value={state.description || ''}
            onChange={(e) => setState({ description: e.target.value })}
            className="form-input text-sm w-full"
            rows={3}
          />
        </div>
        <div className="flex items-center gap-3">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={state.isAvailable ?? true}
              onChange={(e) => setState({ isAvailable: e.target.checked })}
            />
            <span className="toggle-slider"></span>
          </label>
          <span className="text-xs text-white/60">Available to customers</span>
        </div>
        <div className="flex gap-3 pt-2">
          <button className="btn-red py-2 px-5 text-xs" onClick={onSave}>
            {isEdit ? 'Save changes' : 'Create item'}
          </button>
          <button className="btn-ghost py-2 px-5 text-xs" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {error && (
        <div className="mb-6 p-4 border border-destructive/20 bg-destructive/10 text-destructive text-sm flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="underline ml-4">
            Dismiss
          </button>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-6">
          <div className="bg-background border border-white/10 p-8 max-w-md w-full">
            <h3 className="text-xl text-white font-display mb-4">Confirm delete</h3>
            <p className="text-white/60 text-sm mb-6">
              Are you sure you want to delete this {deleteConfirm.type}? This cannot be undone.
              {deleteConfirm.type === 'category' && ' All items in this category will be removed too.'}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  if (deleteConfirm.type === 'item') deleteItem(deleteConfirm.id);
                  else deleteCategory(deleteConfirm.id);
                }}
                className="btn-red py-2 px-4 text-xs"
              >
                Delete
              </button>
              <button onClick={() => setDeleteConfirm(null)} className="btn-ghost py-2 px-4 text-xs">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Item Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/80 flex items-start justify-center z-50 px-6 py-12 overflow-y-auto">
          <div className="bg-background border border-white/10 p-8 max-w-3xl w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl text-white font-display">Edit menu item</h3>
              <button onClick={() => setEditingItem(null)} className="text-white/40 hover:text-white">
                <Icon name="XMarkIcon" size={20} variant="outline" />
              </button>
            </div>
            {renderItemForm(
              editingItem,
              (patch) => setEditingItem((p) => (p ? { ...p, ...patch } as MenuItem : null)),
              updateItem,
              () => setEditingItem(null),
              'Edit menu item',
              true
            )}
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {editingCategory && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-6">
          <div className="bg-background border border-white/10 p-8 max-w-lg w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl text-white font-display">Edit category</h3>
              <button onClick={() => setEditingCategory(null)} className="text-white/40 hover:text-white">
                <Icon name="XMarkIcon" size={20} variant="outline" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] uppercase tracking-widest-2 text-white/40 font-semibold block mb-1">Name *</label>
                <input
                  type="text"
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory((p) => (p ? { ...p, name: e.target.value } : null))}
                  className="form-input text-sm w-full"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest-2 text-white/40 font-semibold block mb-1">Description</label>
                <input
                  type="text"
                  value={editingCategory.description}
                  onChange={(e) => setEditingCategory((p) => (p ? { ...p, description: e.target.value } : null))}
                  className="form-input text-sm w-full"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest-2 text-white/40 font-semibold block mb-1">Display order</label>
                <input
                  type="number"
                  value={editingCategory.displayOrder}
                  onChange={(e) => setEditingCategory((p) => (p ? { ...p, displayOrder: parseInt(e.target.value) || 1 } : null))}
                  className="form-input text-sm w-full"
                />
              </div>
              <div className="flex items-center gap-3">
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={editingCategory.isActive}
                    onChange={(e) => setEditingCategory((p) => (p ? { ...p, isActive: e.target.checked } : null))}
                  />
                  <span className="toggle-slider"></span>
                </label>
                <span className="text-xs text-white/60">Active</span>
              </div>
              <div className="flex gap-3 pt-2">
                <button className="btn-red py-2 px-5 text-xs" onClick={updateCategory}>
                  Save changes
                </button>
                <button className="btn-ghost py-2 px-5 text-xs" onClick={() => setEditingCategory(null)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Menu Type Switcher ──────────────────────────────────── */}
      <div className="mb-8 flex justify-center">
        <div className="relative inline-flex items-center p-1 bg-white/[0.04] border border-white/10 rounded-full">
          <span
            aria-hidden
            className="absolute top-1 bottom-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-primary transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
            style={{ transform: menuType === 'beverage' ? 'translateX(100%)' : 'translateX(0%)' }}
          />
          {(['food', 'beverage'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => switchMenuType(t)}
              className={`relative z-10 px-8 py-2.5 text-xs uppercase tracking-widest-2 font-medium transition-colors ${
                menuType === t ? 'text-white' : 'text-white/50 hover:text-white/80'
              }`}
            >
              {t === 'food' ? 'Food Menu' : 'Beverage Menu'}
              <span className="ml-2 text-white/40">
                ({categories.filter((c) => c.menuType === t).length} cats · {items.filter((i) => i.menuType === t).length} items)
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-0 mb-8 border-b border-white/10">
        <button
          className={`px-6 py-3 text-[11px] uppercase tracking-widest-2 font-semibold border-b-2 transition-all ${
            view === 'items' ? 'border-primary text-white' : 'border-transparent text-white/40 hover:text-white'
          }`}
          onClick={() => setView('items')}
        >
          Items ({scopedItems.length})
        </button>
        <button
          className={`px-6 py-3 text-[11px] uppercase tracking-widest-2 font-semibold border-b-2 transition-all ${
            view === 'categories' ? 'border-primary text-white' : 'border-transparent text-white/40 hover:text-white'
          }`}
          onClick={() => setView('categories')}
        >
          Categories ({scopedCategories.length})
        </button>
      </div>

      {/* ── Items View ──────────────────────────────────────────── */}
      {view === 'items' && (
        <div>
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between mb-6">
            <div className="flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search items..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="form-input text-sm w-full"
              />
            </div>
            <button
              className="btn-red py-2 px-5 text-xs flex items-center gap-2 self-start lg:self-auto"
              onClick={() => {
                setNewItem(blankItem(menuType));
                setShowAddItem(true);
              }}
              disabled={scopedCategories.length === 0}
              title={scopedCategories.length === 0 ? 'Create a category first' : ''}
            >
              <Icon name="PlusIcon" size={14} variant="outline" />
              Add Item
            </button>
          </div>

          {/* Category filter pills */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              className={`category-pill text-xs ${filterCat === 'all' ? 'active' : ''}`}
              onClick={() => setFilterCat('all')}
            >
              All ({scopedItems.length})
            </button>
            {scopedCategories.map((c) => {
              const count = scopedItems.filter((i) => i.categoryId === c.id).length;
              return (
                <button
                  key={c.id}
                  className={`category-pill text-xs ${filterCat === c.id ? 'active' : ''}`}
                  onClick={() => setFilterCat(c.id)}
                >
                  {c.name} ({count})
                </button>
              );
            })}
          </div>

          {/* Add Item Form */}
          {showAddItem && (
            <div className="border border-primary/20 bg-primary/5 p-6 mb-8">
              <h4 className="text-[11px] uppercase tracking-widest-2 text-white mb-5 font-semibold">
                New {menuType === 'food' ? 'food' : 'beverage'} item
              </h4>
              {renderItemForm(
                newItem,
                (patch) => setNewItem((p) => ({ ...p, ...patch })),
                addItem,
                () => {
                  setShowAddItem(false);
                  setNewItem(blankItem(menuType));
                },
                'New item',
                false
              )}
            </div>
          )}

          {scopedCategories.length === 0 && !showAddItem && (
            <div className="border border-white/5 bg-white/[0.02] p-12 text-center">
              <Icon name="TagIcon" size={32} variant="outline" className="text-white/20 mx-auto mb-3" />
              <p className="text-white/60 text-sm mb-2">No categories yet for the {menuType} menu</p>
              <p className="text-white/30 text-xs mb-4">Create a category first, then start adding items.</p>
              <button className="btn-red py-2 px-5 text-xs" onClick={() => setView('categories')}>
                Go to categories
              </button>
            </div>
          )}

          {/* Items grid */}
          {filteredItems.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredItems.map((item) => (
                <div key={item.id} className="border border-white/5 bg-white/[0.02] hover:border-white/10 transition-colors group flex flex-col">
                  <div className="aspect-[4/3] bg-white/[0.03] overflow-hidden relative">
                    {item.imageUrl ? (
                      <AppImage src={item.imageUrl} alt={item.imageAlt} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/15">
                        <Icon name="PhotoIcon" size={28} variant="outline" />
                      </div>
                    )}
                    {!item.isAvailable && (
                      <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                        <span className="text-[10px] uppercase tracking-widest-2 text-white/60">Unavailable</span>
                      </div>
                    )}
                    {item.tag && (
                      <div className="absolute top-2 left-2 bg-primary px-2 py-0.5">
                        <span className="text-[9px] uppercase tracking-widest-2 text-white font-semibold">{item.tag}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="text-sm text-white font-medium leading-tight flex-1">{item.name}</h4>
                      <span className="text-xs text-primary font-semibold whitespace-nowrap">AED {item.price}</span>
                    </div>
                    <p className="text-[11px] text-white/40 leading-relaxed line-clamp-2 mb-2">
                      {scopedCategories.find((c) => c.id === item.categoryId)?.name || ''}
                    </p>
                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={item.isAvailable}
                          onChange={() => toggleItemAvailability(item.id)}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setEditingItem(item)}
                          className="text-white/30 hover:text-white p-1.5 transition-colors"
                          aria-label="Edit"
                        >
                          <Icon name="PencilIcon" size={14} variant="outline" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm({ type: 'item', id: item.id })}
                          className="text-white/30 hover:text-destructive p-1.5 transition-colors"
                          aria-label="Delete"
                        >
                          <Icon name="TrashIcon" size={14} variant="outline" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {scopedCategories.length > 0 && filteredItems.length === 0 && (
            <div className="text-center py-16 text-white/30 text-sm">No items match your filters.</div>
          )}
        </div>
      )}

      {/* ── Categories View ─────────────────────────────────────── */}
      {view === 'categories' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <p className="text-xs text-white/40">
              {scopedCategories.length} categor{scopedCategories.length === 1 ? 'y' : 'ies'} in the {menuType} menu
            </p>
            <button
              className="btn-red py-2 px-5 text-xs flex items-center gap-2"
              onClick={() => {
                setNewCategory(blankCategory(menuType));
                setShowAddCategory(true);
              }}
            >
              <Icon name="PlusIcon" size={14} variant="outline" />
              Add Category
            </button>
          </div>

          {showAddCategory && (
            <div className="border border-primary/20 bg-primary/5 p-6 mb-6">
              <h4 className="text-[11px] uppercase tracking-widest-2 text-white mb-4 font-semibold">
                New {menuType} category
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-[10px] uppercase tracking-widest-2 text-white/40 font-semibold block mb-1">Name *</label>
                  <input
                    type="text"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory((p) => ({ ...p, name: e.target.value }))}
                    className="form-input text-sm w-full"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest-2 text-white/40 font-semibold block mb-1">Display order</label>
                  <input
                    type="number"
                    value={newCategory.displayOrder || ''}
                    onChange={(e) => setNewCategory((p) => ({ ...p, displayOrder: parseInt(e.target.value) || 1 }))}
                    className="form-input text-sm w-full"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-[10px] uppercase tracking-widest-2 text-white/40 font-semibold block mb-1">Description</label>
                  <input
                    type="text"
                    value={newCategory.description}
                    onChange={(e) => setNewCategory((p) => ({ ...p, description: e.target.value }))}
                    className="form-input text-sm w-full"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button className="btn-red py-2 px-5 text-xs" onClick={addCategory}>
                  Save category
                </button>
                <button className="btn-ghost py-2 px-5 text-xs" onClick={() => setShowAddCategory(false)}>
                  Cancel
                </button>
              </div>
            </div>
          )}

          {scopedCategories.length === 0 && !showAddCategory ? (
            <div className="border border-white/5 bg-white/[0.02] p-12 text-center">
              <p className="text-white/40 text-sm">No categories yet. Click "Add Category" to create one.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {scopedCategories.map((cat) => {
                const itemCount = scopedItems.filter((i) => i.categoryId === cat.id).length;
                return (
                  <div key={cat.id} className="border border-white/5 bg-white/[0.02] p-5 hover:border-white/10 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-base text-white font-medium truncate">{cat.name}</h4>
                        <p className="text-[10px] uppercase tracking-widest-2 text-white/30 mt-1">
                          {itemCount} item{itemCount === 1 ? '' : 's'} · order {cat.displayOrder}
                        </p>
                      </div>
                      <label className="toggle-switch shrink-0">
                        <input type="checkbox" checked={cat.isActive} onChange={() => toggleCategoryActive(cat.id)} />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                    {cat.description && (
                      <p className="text-[12px] text-white/50 mb-4 line-clamp-2">{cat.description}</p>
                    )}
                    <div className="flex items-center gap-2 pt-3 border-t border-white/5">
                      <button
                        onClick={() => setEditingCategory(cat)}
                        className="text-white/40 hover:text-white p-1.5 transition-colors"
                        aria-label="Edit"
                      >
                        <Icon name="PencilIcon" size={14} variant="outline" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm({ type: 'category', id: cat.id })}
                        className="text-white/40 hover:text-destructive p-1.5 transition-colors"
                        aria-label="Delete"
                      >
                        <Icon name="TrashIcon" size={14} variant="outline" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
