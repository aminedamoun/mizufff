'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';
import { imageService, type RestaurantImage } from '@/lib/services/imageService';
import { storageService } from '@/lib/services/storageService';

type UploadMode = 'url' | 'upload';

export default function AdminAtmosphereManager() {
  const [images, setImages] = useState<RestaurantImage[]>([]);
  const [uploadMode, setUploadMode] = useState<UploadMode>('url');
  const [showAddImage, setShowAddImage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);

  const [newImage, setNewImage] = useState<Partial<RestaurantImage>>({
    imageUrl: '',
    title: '',
    imageAlt: '',
    spanClass: 'col-span-1',
    isActive: true,
    isIntro: false,
  });

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await imageService.getAllImages();
      setImages(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load images');
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (id: string) => {
    const image = images.find((img) => img.id === id);
    if (!image) return;
    try {
      await imageService.updateImage(id, { isActive: !image.isActive });
      setImages((prev) => prev.map((img) => (img.id === id ? { ...img, isActive: !img.isActive } : img)));
    } catch (err: any) {
      setError(err.message || 'Failed to update image');
    }
  };

  const deleteImage = async (id: string) => {
    try {
      await imageService.deleteImage(id);
      setImages((prev) => prev.filter((img) => img.id !== id));
      setDeleteConfirm(null);
    } catch (err: any) {
      setError(err.message || 'Failed to delete image');
    }
  };

  const addImage = async () => {
    if (!newImage.imageUrl || !newImage.title) {
      setError('Image URL and title are required');
      return;
    }
    try {
      const created = await imageService.createImage(newImage);
      if (created) {
        setImages((prev) => [...prev, created]);
        setNewImage({
          imageUrl: '',
          title: '',
          imageAlt: '',
          spanClass: 'col-span-1',
          isActive: true,
          isIntro: false,
        });
        setShowAddImage(false);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create image');
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
          <button onClick={() => setError(null)} className="ml-4 underline">Dismiss</button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-6">
          <div className="bg-background border border-white/10 p-8 max-w-md w-full">
            <h3 className="text-xl text-white font-display mb-4">Confirm Delete</h3>
            <p className="text-white/60 text-sm mb-6">
              Are you sure you want to delete this atmosphere image? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => deleteImage(deleteConfirm)} className="btn-red py-2 px-4 text-xs">Delete</button>
              <button onClick={() => setDeleteConfirm(null)} className="btn-ghost py-2 px-4 text-xs">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-2xl text-white font-light">Atmosphere Images</h2>
          <p className="text-[11px] text-white/40 uppercase tracking-widest-2 mt-1">
            {images.length} images · {images.filter((i) => i.isActive).length} active
          </p>
        </div>
        <button className="btn-red py-2 px-5 text-xs flex items-center gap-2" onClick={() => setShowAddImage(true)}>
          <Icon name="PlusIcon" size={14} variant="outline" />
          Add Image
        </button>
      </div>

      {/* Add Image Form */}
      {showAddImage && (
        <div className="border border-primary/20 bg-primary/5 p-6 mb-8">
          <h4 className="text-[11px] uppercase tracking-widest-2 text-white mb-5 font-semibold">
            New Atmosphere Image
          </h4>

          {/* Upload Mode Toggle */}
          <div className="flex gap-0 mb-5 border border-white/10 inline-flex">
            <button
              className={`px-4 py-2 text-[10px] uppercase tracking-widest-2 transition-all ${
                uploadMode === 'url' ? 'bg-primary text-white' : 'text-white/40 hover:text-white'
              }`}
              onClick={() => setUploadMode('url')}
            >
              URL
            </button>
            <button
              className={`px-4 py-2 text-[10px] uppercase tracking-widest-2 transition-all ${
                uploadMode === 'upload' ? 'bg-primary text-white' : 'text-white/40 hover:text-white'
              }`}
              onClick={() => setUploadMode('upload')}
            >
              Upload File
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {uploadMode === 'url' ? (
              <input
                type="url"
                placeholder="Image URL *"
                value={newImage.imageUrl}
                onChange={(e) => setNewImage((p) => ({ ...p, imageUrl: e.target.value }))}
                className="form-input text-sm md:col-span-2"
              />
            ) : (
              <div className="md:col-span-2">
                <label className="flex flex-col items-center justify-center border border-dashed border-white/20 p-8 cursor-pointer hover:border-primary transition-colors">
                  <Icon name="CloudArrowUpIcon" size={32} variant="outline" className="text-white/30 mb-3" />
                  {uploadingFile ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mb-2"></div>
                      <span className="text-[11px] uppercase tracking-widest-2 text-white/40">Uploading...</span>
                    </>
                  ) : (
                    <>
                      <span className="text-[11px] uppercase tracking-widest-2 text-white/40">Click to upload image</span>
                      <span className="text-[10px] text-white/20 mt-1">JPG, PNG, WebP up to 5MB</span>
                    </>
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
                        setNewImage((p) => ({ ...p, imageUrl: result.url }));
                      } catch (err: any) {
                        setError(err.message || 'Upload failed');
                      } finally {
                        setUploadingFile(false);
                      }
                    }}
                  />
                </label>
                {newImage.imageUrl && uploadMode === 'upload' && (
                  <p className="text-[10px] text-green-400 mt-2">✓ Image uploaded successfully</p>
                )}
              </div>
            )}
            <input
              type="text"
              placeholder="Title *"
              value={newImage.title}
              onChange={(e) => setNewImage((p) => ({ ...p, title: e.target.value }))}
              className="form-input text-sm"
            />
            <input
              type="text"
              placeholder="Alt text (accessibility)"
              value={newImage.imageAlt}
              onChange={(e) => setNewImage((p) => ({ ...p, imageAlt: e.target.value }))}
              className="form-input text-sm"
            />
            <select
              value={newImage.spanClass}
              onChange={(e) => setNewImage((p) => ({ ...p, spanClass: e.target.value }))}
              className="form-input text-sm"
            >
              <option value="col-span-1">Normal (1 column)</option>
              <option value="col-span-2">Wide (2 columns)</option>
            </select>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newImage.isActive}
                  onChange={(e) => setNewImage((p) => ({ ...p, isActive: e.target.checked }))}
                  className="accent-primary"
                />
                <span className="text-[11px] text-white/50">Active</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newImage.isIntro}
                  onChange={(e) => setNewImage((p) => ({ ...p, isIntro: e.target.checked }))}
                  className="accent-primary"
                />
                <span className="text-[11px] text-white/50">Intro image</span>
              </label>
            </div>
          </div>

          {/* Preview */}
          {newImage.imageUrl && (
            <div className="mb-4">
              <p className="text-[9px] uppercase tracking-widest-2 text-white/30 mb-2">Preview</p>
              <div className="w-32 h-24 overflow-hidden border border-white/10">
                <AppImage src={newImage.imageUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button className="btn-red py-2 px-4 text-xs" onClick={addImage}>Save Image</button>
            <button className="btn-ghost py-2 px-4 text-xs" onClick={() => setShowAddImage(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Image Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.length === 0 ? (
          <div className="col-span-3 text-center py-12 text-white/30 text-sm">
            No atmosphere images yet. Add your first image to display it in the gallery.
          </div>
        ) : (
          images.map((img) => (
            <div
              key={img.id}
              className={`border ${
                img.isActive ? 'border-white/10' : 'border-white/5 opacity-50'
              } group relative overflow-hidden`}
            >
              <div className="aspect-[4/3] overflow-hidden">
                <AppImage
                  src={img.imageUrl}
                  alt={img.imageAlt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-sm text-white font-medium">{img.title}</h4>
                    <p className="text-[10px] text-white/30 mt-1 truncate max-w-[180px]">{img.imageAlt}</p>
                  </div>
                  <button
                    onClick={() => setDeleteConfirm(img.id)}
                    className="text-white/20 hover:text-destructive transition-colors p-1 shrink-0"
                    aria-label="Delete image"
                  >
                    <Icon name="TrashIcon" size={14} variant="outline" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <label className="toggle-switch" style={{ width: 36, height: 20 }}>
                      <input type="checkbox" checked={img.isActive} onChange={() => toggleActive(img.id)} />
                      <span className="toggle-slider"></span>
                    </label>
                    <span className="text-[9px] uppercase tracking-widest-2 text-white/30">Active</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {img.isIntro && (
                      <span className="text-[8px] uppercase tracking-widest-2 bg-primary/20 text-primary px-2 py-1">
                        Intro
                      </span>
                    )}
                    <span className="text-[8px] uppercase tracking-widest-2 text-white/20">
                      {img.spanClass === 'col-span-2' ? 'Wide' : 'Normal'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
