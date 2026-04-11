'use client';

import React, { useState, useEffect, useRef } from 'react';
import Icon from '@/components/ui/AppIcon';

export default function AdminBannerManager() {
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        setVideoUrl(data.banner_video_url || '');
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      setMessage('Please upload a video file (MP4, WebM, etc.)');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setMessage('Video file too large. Max 50MB.');
      return;
    }

    setUploading(true);
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadRes.ok) throw new Error('Upload failed');
      const { url } = await uploadRes.json();

      const saveRes = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ banner_video_url: url }),
      });

      if (!saveRes.ok) throw new Error('Save failed');
      const data = await saveRes.json();
      setVideoUrl(data.banner_video_url);
      setMessage('Banner video updated successfully!');
    } catch (err) {
      setMessage('Failed to upload video. Please try again.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleUrlSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ banner_video_url: videoUrl }),
      });
      if (!res.ok) throw new Error('Save failed');
      setMessage('Banner video URL saved successfully!');
    } catch {
      setMessage('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Current Video Preview */}
      <div className="border border-white/10 p-6">
        <h3 className="text-white font-display text-xl mb-4 font-light">Current Banner Video</h3>
        {videoUrl ? (
          <div className="aspect-video bg-black/50 rounded overflow-hidden mb-4 max-w-2xl">
            <video
              src={videoUrl}
              className="w-full h-full object-cover"
              controls
              muted
              playsInline
            />
          </div>
        ) : (
          <div className="aspect-video bg-white/5 flex items-center justify-center mb-4 max-w-2xl">
            <p className="text-white/30 text-sm">No banner video set</p>
          </div>
        )}
        <p className="text-white/40 text-xs font-mono break-all">{videoUrl}</p>
      </div>

      {/* Upload New Video */}
      <div className="border border-white/10 p-6">
        <h3 className="text-white font-display text-xl mb-4 font-light">Upload New Video</h3>
        <p className="text-white/40 text-sm mb-4">Upload an MP4 video file (max 50MB). This will replace the current homepage banner video.</p>

        <input
          ref={fileInputRef}
          type="file"
          accept="video/mp4,video/webm,video/mov"
          onChange={handleUpload}
          className="hidden"
          id="video-upload"
        />
        <label
          htmlFor="video-upload"
          className={`inline-flex items-center gap-2 px-6 py-3 text-sm uppercase tracking-widest-2 font-semibold cursor-pointer transition-all ${
            uploading
              ? 'bg-white/10 text-white/30 cursor-wait'
              : 'bg-primary text-white hover:bg-primary/90'
          }`}
        >
          <Icon name="ArrowUpTrayIcon" size={16} variant="outline" />
          {uploading ? 'Uploading...' : 'Choose Video File'}
        </label>
      </div>

      {/* Or Set URL Manually */}
      <div className="border border-white/10 p-6">
        <h3 className="text-white font-display text-xl mb-4 font-light">Or Set Video URL</h3>
        <p className="text-white/40 text-sm mb-4">Paste a direct URL to a video file.</p>

        <div className="flex gap-3 max-w-2xl">
          <input
            type="text"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="/images/hero/banner-video.mp4"
            className="flex-1 bg-white/5 border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-primary/50 placeholder:text-white/20"
          />
          <button
            onClick={handleUrlSave}
            disabled={saving}
            className="px-6 py-3 bg-primary text-white text-sm uppercase tracking-widest-2 font-semibold hover:bg-primary/90 transition-all disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`px-4 py-3 text-sm ${message.includes('success') ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
          {message}
        </div>
      )}
    </div>
  );
}
