'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';
import { offerService, type Offer } from '@/lib/services/offerService';
import { storageService } from '@/lib/services/storageService';

function StarRatingInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-widest-2 text-white/40 mb-2 block">Rating (1–5 stars)</label>
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className={`w-8 h-8 transition-colors ${
              value >= star ? 'text-primary' : 'text-white/20 hover:text-white/50'
            }`}
          >
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ))}
        <span className="text-sm text-white/50 ml-1">{value?.toFixed(1)}</span>
      </div>
    </div>
  );
}

export default function AdminOffersManager() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [showAddOffer, setShowAddOffer] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadingEditFile, setUploadingEditFile] = useState(false);

  const [newOffer, setNewOffer] = useState<Partial<Offer>>({
    title: '',
    description: '',
    imageUrl: '',
    imageAlt: '',
    isActive: true,
    displayOrder: 1,
    rating: 5,
  });

  useEffect(() => {
    loadOffers();
  }, []);

  const loadOffers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await offerService.getAllOffers();
      setOffers(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load offers');
    } finally {
      setLoading(false);
    }
  };

  const toggleOfferActive = async (id: string) => {
    const offer = offers.find((o) => o.id === id);
    if (!offer) return;

    try {
      await offerService.updateOffer(id, { isActive: !offer.isActive });
      setOffers((prev) => prev.map((o) => (o.id === id ? { ...o, isActive: !o.isActive } : o)));
    } catch (err: any) {
      setError(err.message || 'Failed to update offer');
    }
  };

  const deleteOffer = async (id: string) => {
    try {
      await offerService.deleteOffer(id);
      setOffers((prev) => prev.filter((o) => o.id !== id));
      setDeleteConfirm(null);
    } catch (err: any) {
      setError(err.message || 'Failed to delete offer');
    }
  };

  const addOffer = async () => {
    if (!newOffer.title) {
      setError('Title is required');
      return;
    }

    try {
      const created = await offerService.createOffer(newOffer);
      if (created) {
        setOffers((prev) => [...prev, created]);
        setNewOffer({
          title: '',
          description: '',
          imageUrl: '',
          imageAlt: '',
          isActive: true,
          displayOrder: 1,
          rating: 5,
        });
        setShowAddOffer(false);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create offer');
    }
  };

  const updateOffer = async () => {
    if (!editingOffer || !editingOffer.title) {
      setError('Title is required');
      return;
    }

    try {
      const updated = await offerService.updateOffer(editingOffer.id, editingOffer);
      if (updated) {
        setOffers((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
        setEditingOffer(null);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update offer');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div className="mb-6 p-4 border border-destructive/20 bg-destructive/10 text-destructive text-sm">
          {error}
          <button onClick={() => setError(null)} className="ml-4 underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-6">
          <div className="bg-background border border-white/10 p-8 max-w-md w-full">
            <h3 className="text-xl text-white font-display mb-4">Confirm Delete</h3>
            <p className="text-white/60 text-sm mb-6">
              Are you sure you want to delete this offer? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => deleteOffer(deleteConfirm)} className="btn-red py-2 px-4 text-xs">
                Delete
              </button>
              <button onClick={() => setDeleteConfirm(null)} className="btn-ghost py-2 px-4 text-xs">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Offer Modal */}
      {editingOffer && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-6 overflow-y-auto">
          <div className="bg-background border border-white/10 p-8 max-w-2xl w-full my-8">
            <h3 className="text-xl text-white font-display mb-6">Edit Offer</h3>
            <div className="grid grid-cols-1 gap-4 mb-6">
              <input
                type="text"
                placeholder="Offer title *"
                value={editingOffer.title}
                onChange={(e) => setEditingOffer((p) => (p ? { ...p, title: e.target.value } : null))}
                className="form-input text-sm"
              />
              <textarea
                placeholder="Description"
                value={editingOffer.description}
                onChange={(e) => setEditingOffer((p) => (p ? { ...p, description: e.target.value } : null))}
                rows={3}
                className="form-input text-sm"
              />
              <input
                type="text"
                placeholder="Image URL"
                value={editingOffer.imageUrl}
                onChange={(e) => setEditingOffer((p) => (p ? { ...p, imageUrl: e.target.value } : null))}
                className="form-input text-sm"
              />
              <div>
                <label className="text-[10px] uppercase tracking-widest-2 text-white/40 mb-2 block">Or upload image file</label>
                <label className="flex items-center gap-3 border border-dashed border-white/20 p-4 cursor-pointer hover:border-primary transition-colors">
                  <Icon name="CloudArrowUpIcon" size={20} variant="outline" className="text-white/30 shrink-0" />
                  {uploadingEditFile ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span className="text-[11px] text-white/40">Uploading...</span>
                    </>
                  ) : (
                    <span className="text-[11px] text-white/40">Click to upload (JPG, PNG, WebP up to 5MB)</span>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploadingEditFile}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const validationError = storageService.validateImageFile(file);
                      if (validationError) { setError(validationError); return; }
                      setUploadingEditFile(true);
                      try {
                        const result = await storageService.uploadImage(file);
                        setEditingOffer((p) => p ? { ...p, imageUrl: result.url } : null);
                      } catch (err: any) {
                        setError(err.message || 'Upload failed');
                      } finally {
                        setUploadingEditFile(false);
                      }
                    }}
                  />
                </label>
                {editingOffer.imageUrl && (
                  <p className="text-[10px] text-green-400 mt-1">✓ Image ready</p>
                )}
              </div>
              <input
                type="text"
                placeholder="Image alt text"
                value={editingOffer.imageAlt}
                onChange={(e) => setEditingOffer((p) => (p ? { ...p, imageAlt: e.target.value } : null))}
                className="form-input text-sm"
              />
              <input
                type="number"
                placeholder="Display order"
                value={editingOffer.displayOrder}
                onChange={(e) =>
                  setEditingOffer((p) => (p ? { ...p, displayOrder: parseInt(e.target.value) || 1 } : null))
                }
                className="form-input text-sm"
              />
              <StarRatingInput
                value={editingOffer.rating ?? 5}
                onChange={(v) => setEditingOffer((p) => (p ? { ...p, rating: v } : null))}
              />
              <label className="flex items-center gap-2 text-white/60 text-sm">
                <input
                  type="checkbox"
                  checked={editingOffer.isActive}
                  onChange={(e) => setEditingOffer((p) => (p ? { ...p, isActive: e.target.checked } : null))}
                  className="form-checkbox"
                />
                Active
              </label>
            </div>
            <div className="flex gap-3">
              <button onClick={updateOffer} className="btn-red py-2 px-4 text-xs">
                Save Changes
              </button>
              <button onClick={() => setEditingOffer(null)} className="btn-ghost py-2 px-4 text-xs">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Offer Modal */}
      {showAddOffer && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-6 overflow-y-auto">
          <div className="bg-background border border-white/10 p-8 max-w-2xl w-full my-8">
            <h3 className="text-xl text-white font-display mb-6">Add New Offer</h3>
            <div className="grid grid-cols-1 gap-4 mb-6">
              <input
                type="text"
                placeholder="Offer title *"
                value={newOffer.title}
                onChange={(e) => setNewOffer((p) => ({ ...p, title: e.target.value }))}
                className="form-input text-sm"
              />
              <textarea
                placeholder="Description"
                value={newOffer.description}
                onChange={(e) => setNewOffer((p) => ({ ...p, description: e.target.value }))}
                rows={3}
                className="form-input text-sm"
              />
              <input
                type="text"
                placeholder="Image URL"
                value={newOffer.imageUrl}
                onChange={(e) => setNewOffer((p) => ({ ...p, imageUrl: e.target.value }))}
                className="form-input text-sm"
              />
              <div>
                <label className="text-[10px] uppercase tracking-widest-2 text-white/40 mb-2 block">Or upload image file</label>
                <label className="flex items-center gap-3 border border-dashed border-white/20 p-4 cursor-pointer hover:border-primary transition-colors">
                  <Icon name="CloudArrowUpIcon" size={20} variant="outline" className="text-white/30 shrink-0" />
                  {uploadingFile ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span className="text-[11px] text-white/40">Uploading...</span>
                    </>
                  ) : (
                    <span className="text-[11px] text-white/40">Click to upload (JPG, PNG, WebP up to 5MB)</span>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploadingFile}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const validationError = storageService.validateImageFile(file);
                      if (validationError) { setError(validationError); return; }
                      setUploadingFile(true);
                      try {
                        const result = await storageService.uploadImage(file);
                        setNewOffer((p) => ({ ...p, imageUrl: result.url }));
                      } catch (err: any) {
                        setError(err.message || 'Upload failed');
                      } finally {
                        setUploadingFile(false);
                      }
                    }}
                  />
                </label>
                {newOffer.imageUrl && (
                  <p className="text-[10px] text-green-400 mt-1">✓ Image ready</p>
                )}
              </div>
              <input
                type="text"
                placeholder="Image alt text"
                value={newOffer.imageAlt}
                onChange={(e) => setNewOffer((p) => ({ ...p, imageAlt: e.target.value }))}
                className="form-input text-sm"
              />
              <input
                type="number"
                placeholder="Display order"
                value={newOffer.displayOrder}
                onChange={(e) => setNewOffer((p) => ({ ...p, displayOrder: parseInt(e.target.value) || 1 }))}
                className="form-input text-sm"
              />
              <StarRatingInput
                value={newOffer.rating ?? 5}
                onChange={(v) => setNewOffer((p) => ({ ...p, rating: v }))}
              />
              <label className="flex items-center gap-2 text-white/60 text-sm">
                <input
                  type="checkbox"
                  checked={newOffer.isActive}
                  onChange={(e) => setNewOffer((p) => ({ ...p, isActive: e.target.checked }))}
                  className="form-checkbox"
                />
                Active
              </label>
            </div>
            <div className="flex gap-3">
              <button onClick={addOffer} className="btn-red py-2 px-4 text-xs">
                Add Offer
              </button>
              <button onClick={() => setShowAddOffer(false)} className="btn-ghost py-2 px-4 text-xs">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-display text-2xl text-white font-light">Offers Management</h2>
        <button onClick={() => setShowAddOffer(true)} className="btn-red text-xs flex items-center gap-2">
          <Icon name="PlusIcon" size={14} variant="outline" />
          Add Offer
        </button>
      </div>

      {/* Offers List */}
      <div className="space-y-4">
        {offers.length === 0 ? (
          <div className="text-center py-12 text-white/30 text-sm">No offers found. Add your first offer.</div>
        ) : (
          offers.map((offer) => (
            <div key={offer.id} className="border border-white/10 p-6 flex gap-6">
              <div className="w-32 h-24 flex-shrink-0 overflow-hidden">
                <AppImage src={offer.imageUrl} alt={offer.imageAlt} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-white text-lg font-display font-light">{offer.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-0.5">
                        {[1,2,3,4,5].map((s) => (
                          <svg key={s} className={`w-3 h-3 ${offer.rating >= s ? 'text-primary' : 'text-white/20'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-white/30 text-xs">{offer.rating?.toFixed(1)}</span>
                      <span className="text-white/20 text-xs">· Order: {offer.displayOrder}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleOfferActive(offer.id)}
                      className={`text-xs px-3 py-1 border ${
                        offer.isActive
                          ? 'border-success/30 text-success bg-success/10' : 'border-white/10 text-white/30'
                      }`}
                    >
                      {offer.isActive ? 'Active' : 'Inactive'}
                    </button>
                    <button
                      onClick={() => setEditingOffer(offer)}
                      className="text-white/40 hover:text-white transition-colors"
                    >
                      <Icon name="PencilIcon" size={16} variant="outline" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(offer.id)}
                      className="text-white/40 hover:text-destructive transition-colors"
                    >
                      <Icon name="TrashIcon" size={16} variant="outline" />
                    </button>
                  </div>
                </div>
                <p className="text-white/50 text-sm leading-relaxed">{offer.description}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}