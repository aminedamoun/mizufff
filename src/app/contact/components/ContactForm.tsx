'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '', email: '', phone: '', subject: '', message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="text-center py-16">
        <div className="w-14 h-14 border border-primary flex items-center justify-center mx-auto mb-6 animate-pulse-red">
          <Icon name="CheckIcon" size={24} variant="outline" className="text-primary" />
        </div>
        <h3 className="font-display text-3xl text-white font-light italic mb-3">Message Sent</h3>
        <p className="text-white/40 text-sm">
          Thank you, {formData.name}. We'll respond within 24 hours to {formData.email}.
        </p>
        <button
          onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', phone: '', subject: '', message: '' }); }}
          className="btn-ghost mt-8"
        >
          Send Another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label className="text-xs uppercase tracking-widest-2 text-white/40 mb-2 block font-medium">Full Name *</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your name" required className="form-input" />
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest-2 text-white/40 mb-2 block font-medium">Email *</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="your@email.com" required className="form-input" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label className="text-xs uppercase tracking-widest-2 text-white/40 mb-2 block font-medium">Phone</label>
          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+971 50 000 0000" className="form-input" />
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest-2 text-white/40 mb-2 block font-medium">Subject *</label>
          <select name="subject" value={formData.subject} onChange={handleChange} required className="form-input">
            <option value="">Select subject</option>
            <option value="Reservation Inquiry">Reservation Inquiry</option>
            <option value="Private Dining">Private Dining</option>
            <option value="Catering">Catering</option>
            <option value="Media & Press">Media & Press</option>
            <option value="Feedback">Feedback</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>
      <div>
        <label className="text-xs uppercase tracking-widest-2 text-white/40 mb-2 block font-medium">Message *</label>
        <textarea name="message" value={formData.message} onChange={handleChange} placeholder="How can we help you?" rows={5} required className="form-input resize-none" />
      </div>
      <button type="submit" disabled={loading} className="btn-red flex items-center gap-3">
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            Sending...
          </>
        ) : (
          <>
            <Icon name="PaperAirplaneIcon" size={16} variant="outline" />
            Send Message
          </>
        )}
      </button>
    </form>
  );
}