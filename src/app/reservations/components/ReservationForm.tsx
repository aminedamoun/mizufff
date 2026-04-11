'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface FormData {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: string;
  occasion: string;
  requests: string;
}

const timeSlots = [
  '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
  '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
  '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM',
  '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM',
  '10:00 PM', '10:30 PM', '11:00 PM',
];

const occasions = [
  'Birthday', 'Anniversary', 'Business Dinner', 'Date Night',
  'Family Gathering', 'Celebration', 'Other',
];

export default function ReservationForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '', email: '', phone: '', date: '',
    time: '', guests: '2', occasion: '', requests: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setSubmitted(true);
  };

  const getTodayString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  if (submitted) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 border border-primary flex items-center justify-center mx-auto mb-6 animate-pulse-red">
          <Icon name="CheckIcon" size={28} variant="outline" className="text-primary" />
        </div>
        <h3 className="font-display text-4xl text-white font-light italic mb-4">Reservation Confirmed</h3>
        <p className="text-white/50 text-sm mb-2">
          Thank you, <span className="text-white">{formData.name}</span>. Your table for{' '}
          <span className="text-white">{formData.guests} guests</span> on{' '}
          <span className="text-white">{formData.date}</span> at{' '}
          <span className="text-white">{formData.time}</span> has been reserved.
        </p>
        <p className="text-white/30 text-xs mb-8">A confirmation has been sent to {formData.email}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={`https://wa.me/97144542706?text=Hi, I just made a reservation for ${formData.guests} guests on ${formData.date} at ${formData.time}. Name: ${formData.name}`}
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-btn inline-flex justify-center"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Confirm via WhatsApp
          </a>
          <button
            onClick={() => setSubmitted(false)}
            className="btn-ghost"
          >
            New Reservation
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {/* Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <label className="text-xs uppercase tracking-widest-2 text-white/40 mb-2 block font-medium">Full Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your full name"
            required
            className="form-input"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest-2 text-white/40 mb-2 block font-medium">Email Address *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your@email.com"
            required
            className="form-input"
          />
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <label className="text-xs uppercase tracking-widest-2 text-white/40 mb-2 block font-medium">Phone Number *</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+971 50 000 0000"
            required
            className="form-input"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest-2 text-white/40 mb-2 block font-medium">Number of Guests *</label>
          <select
            name="guests"
            value={formData.guests}
            onChange={handleChange}
            required
            className="form-input"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
              <option key={`guest_${n}`} value={String(n)}>
                {n} {n === 1 ? 'Guest' : 'Guests'}
              </option>
            ))}
            <option value="10+">10+ Guests (Private Dining)</option>
          </select>
        </div>
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <label className="text-xs uppercase tracking-widest-2 text-white/40 mb-2 block font-medium">Date *</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            min={getTodayString()}
            required
            className="form-input"
            style={{ colorScheme: 'dark' }}
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest-2 text-white/40 mb-2 block font-medium">Preferred Time *</label>
          <select
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
            className="form-input"
          >
            <option value="">Select a time</option>
            {timeSlots.map((slot) => (
              <option key={`slot_${slot}`} value={slot}>{slot}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Row 4 */}
      <div>
        <label className="text-xs uppercase tracking-widest-2 text-white/40 mb-2 block font-medium">Occasion</label>
        <select
          name="occasion"
          value={formData.occasion}
          onChange={handleChange}
          className="form-input"
        >
          <option value="">Select occasion (optional)</option>
          {occasions.map((occ) => (
            <option key={`occ_${occ}`} value={occ}>{occ}</option>
          ))}
        </select>
      </div>

      {/* Row 5 */}
      <div>
        <label className="text-xs uppercase tracking-widest-2 text-white/40 mb-2 block font-medium">Special Requests</label>
        <textarea
          name="requests"
          value={formData.requests}
          onChange={handleChange}
          placeholder="Dietary requirements, allergies, seating preferences, special arrangements..."
          rows={3}
          className="form-input resize-none"
        />
      </div>

      {/* Submit */}
      <div className="flex flex-col sm:flex-row gap-4 items-start pt-4">
        <button
          type="submit"
          disabled={loading}
          className="btn-red flex items-center gap-3"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Confirming...
            </>
          ) : (
            <>
              <Icon name="CalendarDaysIcon" size={16} variant="outline" />
              Confirm Reservation
            </>
          )}
        </button>
        <a
          href={`https://wa.me/97144542706?text=Hi, I'd like to reserve a table for ${formData.guests} guests`}
          target="_blank"
          rel="noopener noreferrer"
          className="whatsapp-btn"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Reserve via WhatsApp
        </a>
      </div>
    </form>
  );
}