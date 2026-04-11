'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';
import { aboutImagesService, type AboutPageImage } from '@/lib/services/aboutImagesService';
import { storageService } from '@/lib/services/storageService';

type UploadMode = 'url' | 'upload';

interface EditState {
  imageUrl: string;
  imageAlt: string;
  uploadMode: UploadMode;
  uploading: boolean;
}

export default function AdminAboutImagesManager() {
  const [images, setImages] = useState<AboutPageImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStates, setEditStates] = useState<Record<string, EditState>>({});

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await aboutImagesService.getAllImages();
      setImages(data);
      const states: Record<string, EditState> = {};
      data.forEach((img) => {
        states[img.id] = {
          imageUrl: img.imageUrl,
          imageAlt: img.imageAlt,
          uploadMode: 'url',
          uploading: false,
        };
      });
      setEditStates(states);
    } catch (err: any) {
      setError(err.message || 'Failed to load about page images');
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (id: string) => {
    setEditingId(id);
    setError(null);
    setSuccess(null);
  };

  const cancelEdit = (id: string) => {
    const img = images.find((i) => i.id === id);
    if (img) {
      setEditStates((prev) => ({
        ...prev,
        [id]: { imageUrl: img.imageUrl, imageAlt: img.imageAlt, uploadMode: 'url', uploading: false },
      }));
    }
    setEditingId(null);
  };

  const saveEdit = async (id: string) => {
    const state = editStates[id];
    try {
      const updated = await aboutImagesService.updateImage(id, {
        imageUrl: state?.imageUrl || '',
        imageAlt: state?.imageAlt || '',
      });
      if (updated) {
        setImages((prev) => prev.map((img) => (img.id === id ? updated : img)));
        setSuccess('Image updated successfully');
        setTimeout(() => setSuccess(null), 3000);
      }
      setEditingId(null);
    } catch (err: any) {
      setError(err.message || 'Failed to update image');
    }
  };

  const handleRemoveImage = async (id: string) => {
    setError(null);
    try {
      const updated = await aboutImagesService.updateImage(id, {
        imageUrl: '',
        imageAlt: '',
      });
      if (updated) {
        setImages((prev) => prev.map((img) => (img.id === id ? updated : img)));
        setEditStates((prev) => ({
          ...prev,
          [id]: { ...prev[id], imageUrl: '', imageAlt: '' },
        }));
        setSuccess('Image removed successfully');
        setTimeout(() => setSuccess(null), 3000);
      }
      setEditingId(null);
    } catch (err: any) {
      setError(err.message || 'Failed to remove image');
    }
  };

  const updateEditState = (id: string, patch: Partial<EditState>) => {
    setEditStates((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));
  };

  const handleFileUpload = async (id: string, file: File) => {
    const validationError = storageService.validateImageFile(file);
    if (validationError) { setError(validationError); return; }
    updateEditState(id, { uploading: true });
    try {
      const result = await storageService.uploadImage(file);
      updateEditState(id, { imageUrl: result.url, uploading: false });
    } catch (err: any) {
      setError(err.message || 'Upload failed');
      updateEditState(id, { uploading: false });
    }
  };

  // Group images by section
  const sections = images.reduce<Record<string, AboutPageImage[]>>((acc, img) => {
    if (!acc[img.section]) acc[img.section] = [];
    acc[img.section].push(img);
    return acc;
  }, {});

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
        <div className="mb-6 p-4 border border-destructive/20 bg-destructive/10 text-destructive text-sm flex items-center justify-between">
          {error}
          <button onClick={() => setError(null)} className="ml-4 underline text-xs">Dismiss</button>
        </div>
      )}
      {success && (
        <div className="mb-6 p-4 border border-green-500/20 bg-green-500/10 text-green-400 text-sm">
          {success}
        </div>
      )}

      <div className="mb-6">
        <p className="text-[11px] text-white/40 uppercase tracking-widest-2">
          {images.length} images across {Object.keys(sections).length} sections
        </p>
        <p className="text-white/30 text-xs mt-1">Changes made here are reflected live on the About page.</p>
      </div>

      {Object.entries(sections).map(([sectionName, sectionImages]) => (
        <div key={sectionName} className="mb-12">
          {/* Section Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-6 h-px bg-primary"></div>
            <h3 className="text-[11px] uppercase tracking-widest-2 text-white font-semibold">{sectionName}</h3>
            <div className="flex-1 h-px bg-white/5"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {sectionImages.map((img) => {
              const state = editStates[img.id];
              const isEditing = editingId === img.id;
              const currentUrl = isEditing ? (state?.imageUrl || '') : img.imageUrl;

              return (
                <div key={img.id} className="border border-white/10 bg-white/2 overflow-hidden">
                  {/* Image Preview */}
                  <div className="aspect-[4/3] relative overflow-hidden bg-white/5">
                    {currentUrl ? (
                      <AppImage
                        src={currentUrl}
                        alt={img.imageAlt}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-white/20">
                        <Icon name="PhotoIcon" size={32} variant="outline" />
                        <span className="text-[10px] uppercase tracking-widest-2">No image</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="text-[10px] uppercase tracking-widest-2 text-white/60 font-medium truncate">
                        {img.label}
                      </p>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4">
                    {!isEditing ? (
                      <>
                        <p className="text-white/40 text-[11px] truncate mb-3" title={img.imageUrl}>
                          {img.imageUrl || <span className="italic text-white/20">No image set</span>}
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEdit(img.id)}
                            className="flex-1 flex items-center justify-center gap-2 border border-white/10 py-2 text-[11px] uppercase tracking-widest-2 text-white/60 hover:border-primary hover:text-white transition-all"
                          >
                            <Icon name="PencilIcon" size={12} variant="outline" />
                            Change
                          </button>
                          {img.imageUrl && (
                            <button
                              onClick={() => handleRemoveImage(img.id)}
                              className="flex items-center justify-center gap-1.5 border border-white/10 px-3 py-2 text-[11px] uppercase tracking-widest-2 text-white/40 hover:border-red-500/50 hover:text-red-400 transition-all"
                              title="Remove image"
                            >
                              <Icon name="TrashIcon" size={12} variant="outline" />
                            </button>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="space-y-3">
                        {/* Upload Mode Toggle */}
                        <div className="flex gap-0 border border-white/10">
                          <button
                            className={`flex-1 py-1.5 text-[10px] uppercase tracking-widest-2 transition-all ${
                              state?.uploadMode === 'url' ? 'bg-primary text-white' : 'text-white/40 hover:text-white'
                            }`}
                            onClick={() => updateEditState(img.id, { uploadMode: 'url' })}
                          >
                            URL
                          </button>
                          <button
                            className={`flex-1 py-1.5 text-[10px] uppercase tracking-widest-2 transition-all ${
                              state?.uploadMode === 'upload' ? 'bg-primary text-white' : 'text-white/40 hover:text-white'
                            }`}
                            onClick={() => updateEditState(img.id, { uploadMode: 'upload' })}
                          >
                            Upload
                          </button>
                        </div>

                        {state?.uploadMode === 'url' ? (
                          <input
                            type="url"
                            placeholder="Image URL"
                            value={state?.imageUrl || ''}
                            onChange={(e) => updateEditState(img.id, { imageUrl: e.target.value })}
                            className="form-input text-xs w-full"
                          />
                        ) : (
                          <label className="flex flex-col items-center justify-center border border-dashed border-white/20 p-4 cursor-pointer hover:border-primary transition-colors">
                            {state?.uploading ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mb-1"></div>
                                <span className="text-[10px] text-white/40">Uploading...</span>
                              </>
                            ) : (
                              <>
                                <Icon name="CloudArrowUpIcon" size={20} variant="outline" className="text-white/30 mb-1" />
                                <span className="text-[10px] text-white/40">Click to upload</span>
                                {state?.imageUrl && state.imageUrl !== img.imageUrl && (
                                  <span className="text-[10px] text-green-400 mt-1">✓ Uploaded</span>
                                )}
                              </>
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              disabled={state?.uploading}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleFileUpload(img.id, file);
                              }}
                            />
                          </label>
                        )}

                        <input
                          type="text"
                          placeholder="Alt text (accessibility)"
                          value={state?.imageAlt || ''}
                          onChange={(e) => updateEditState(img.id, { imageAlt: e.target.value })}
                          className="form-input text-xs w-full"
                        />

                        <div className="flex gap-2">
                          <button
                            onClick={() => saveEdit(img.id)}
                            className="flex-1 btn-red py-2 text-[10px] flex items-center justify-center gap-1"
                          >
                            <Icon name="CheckIcon" size={12} variant="outline" />
                            Save
                          </button>
                          <button
                            onClick={() => cancelEdit(img.id)}
                            className="flex-1 btn-ghost py-2 text-[10px] flex items-center justify-center gap-1"
                          >
                            <Icon name="XMarkIcon" size={12} variant="outline" />
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
