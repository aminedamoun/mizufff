'use client';

import React, { useState, useEffect } from 'react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import { deliverySettingsService, type DeliveryPartner } from '@/lib/services/deliverySettingsService';
import { storageService } from '@/lib/services/storageService';

export default function AdminDeliveryManager() {
  const [partners, setPartners] = useState<DeliveryPartner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);
  const [editingUrl, setEditingUrl] = useState<Record<string, string>>({});
  const [editingPartnerUrl, setEditingPartnerUrl] = useState<Record<string, string>>({});

  useEffect(() => {
    loadPartners();
  }, []);

  const loadPartners = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await deliverySettingsService.getAllPartners();
      setPartners(data);
      const urlMap: Record<string, string> = {};
      const partnerUrlMap: Record<string, string> = {};
      data.forEach((p) => {
        urlMap[p.id] = p.imageUrl;
        partnerUrlMap[p.id] = p.partnerUrl;
      });
      setEditingUrl(urlMap);
      setEditingPartnerUrl(partnerUrlMap);
    } catch (err: any) {
      setError(err.message || 'Failed to load delivery partners');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (partner: DeliveryPartner, file: File) => {
    const validationError = storageService.validateImageFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }
    setUploadingId(partner.id);
    setError(null);
    try {
      const result = await storageService.uploadImage(file);
      const updated = await deliverySettingsService.updatePartner(partner.id, {
        imageUrl: result.url,
        imageAlt: `${partner.partnerName} food delivery platform logo`,
      });
      if (updated) {
        setPartners((prev) => prev.map((p) => (p.id === partner.id ? updated : p)));
        setEditingUrl((prev) => ({ ...prev, [partner.id]: updated.imageUrl }));
        setSuccessId(partner.id);
        setTimeout(() => setSuccessId(null), 3000);
      }
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploadingId(null);
    }
  };

  const handleRemoveImage = async (partner: DeliveryPartner) => {
    setError(null);
    try {
      const updated = await deliverySettingsService.updatePartner(partner.id, {
        imageUrl: '',
        imageAlt: '',
      });
      if (updated) {
        setPartners((prev) => prev.map((p) => (p.id === partner.id ? updated : p)));
        setEditingUrl((prev) => ({ ...prev, [partner.id]: '' }));
        setSuccessId(partner.id);
        setTimeout(() => setSuccessId(null), 3000);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to remove image');
    }
  };

  const handleSaveUrl = async (partner: DeliveryPartner) => {
    setError(null);
    try {
      const updated = await deliverySettingsService.updatePartner(partner.id, {
        imageUrl: editingUrl[partner.id] ?? partner.imageUrl,
        partnerUrl: editingPartnerUrl[partner.id] ?? partner.partnerUrl,
      });
      if (updated) {
        setPartners((prev) => prev.map((p) => (p.id === partner.id ? updated : p)));
        setSuccessId(partner.id);
        setTimeout(() => setSuccessId(null), 3000);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save');
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
        <div className="mb-6 p-4 border border-destructive/20 bg-destructive/10 text-destructive text-sm flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="ml-4 underline text-xs">Dismiss</button>
        </div>
      )}

      <div className="mb-6">
        <p className="text-[11px] text-white/40 uppercase tracking-widest-2">
          {partners.length} delivery partners · Manage partner logos and links
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {partners.map((partner) => (
          <div key={partner.id} className="border border-white/10 bg-white/[0.02] p-6">
            {/* Partner Header */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-white font-display text-xl font-light">{partner.partnerName}</h3>
                <p className="text-[10px] uppercase tracking-widest-2 text-white/30 mt-1">{partner.partnerKey}</p>
              </div>
              {successId === partner.id && (
                <span className="text-[10px] uppercase tracking-widest-2 text-green-400 flex items-center gap-1">
                  <Icon name="CheckCircleIcon" size={14} variant="outline" />
                  Saved
                </span>
              )}
            </div>

            {/* Current Image Preview */}
            <div className="relative w-full aspect-video bg-[#1a1a1a] border border-white/5 mb-2 overflow-hidden flex items-center justify-center">
              {(editingUrl[partner.id] || partner.imageUrl) ? (
                <AppImage
                  src={editingUrl[partner.id] || partner.imageUrl}
                  alt={partner.imageAlt}
                  className="w-full h-full object-contain p-4"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-white/20">
                  <Icon name="PhotoIcon" size={32} variant="outline" />
                  <span className="text-[10px] uppercase tracking-widest-2">No image set</span>
                </div>
              )}
            </div>

            {/* Remove Image Button */}
            {(editingUrl[partner.id] || partner.imageUrl) && (
              <button
                onClick={() => handleRemoveImage(partner)}
                className="w-full flex items-center justify-center gap-1.5 border border-white/10 py-1.5 text-[10px] uppercase tracking-widest-2 text-white/40 hover:border-red-500/50 hover:text-red-400 transition-all mb-4"
              >
                <Icon name="TrashIcon" size={11} variant="outline" />
                Remove Image
              </button>
            )}

            {/* Upload New Image */}
            <div className="mb-4">
              <p className="text-[10px] uppercase tracking-widest-2 text-white/40 mb-2">Upload New Image</p>
              <label className="flex items-center justify-center border border-dashed border-white/20 p-4 cursor-pointer hover:border-primary transition-colors">
                {uploadingId === partner.id ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span className="text-[11px] uppercase tracking-widest-2 text-white/40">Uploading...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Icon name="CloudArrowUpIcon" size={16} variant="outline" className="text-white/30" />
                    <span className="text-[11px] uppercase tracking-widest-2 text-white/40">Click to upload image</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploadingId === partner.id}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(partner, file);
                  }}
                />
              </label>
              <p className="text-[10px] text-white/20 mt-1">JPG, PNG, WebP up to 5MB</p>
            </div>

            {/* Image URL Input */}
            <div className="mb-4">
              <p className="text-[10px] uppercase tracking-widest-2 text-white/40 mb-2">Or paste image URL</p>
              <input
                type="url"
                placeholder="https://example.com/logo.png"
                value={editingUrl[partner.id] || ''}
                onChange={(e) => setEditingUrl((prev) => ({ ...prev, [partner.id]: e.target.value }))}
                className="form-input text-sm w-full"
              />
            </div>

            {/* Partner Order URL */}
            <div className="mb-5">
              <p className="text-[10px] uppercase tracking-widest-2 text-white/40 mb-2">Order Link URL</p>
              <input
                type="url"
                placeholder="https://..."
                value={editingPartnerUrl[partner.id] || ''}
                onChange={(e) => setEditingPartnerUrl((prev) => ({ ...prev, [partner.id]: e.target.value }))}
                className="form-input text-sm w-full"
              />
            </div>

            {/* Save Button */}
            <button
              onClick={() => handleSaveUrl(partner)}
              className="btn-red py-2 px-5 text-xs w-full flex items-center justify-center gap-2"
            >
              <Icon name="CheckIcon" size={14} variant="outline" />
              Save Changes
            </button>
          </div>
        ))}
      </div>

      {partners.length === 0 && (
        <div className="text-center py-16 border border-white/5">
          <Icon name="TruckIcon" size={32} variant="outline" className="text-white/20 mx-auto mb-4" />
          <p className="text-white/30 text-sm">No delivery partners found.</p>
          <p className="text-white/20 text-xs mt-1">Run the database migration to initialize partner data.</p>
        </div>
      )}
    </div>
  );
}
