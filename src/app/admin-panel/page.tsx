import React from 'react';
import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import AdminPanel from './components/AdminPanel';

export const metadata: Metadata = {
  title: 'Admin Panel – Mizu Restaurant Management',
  description: 'Mizu restaurant admin panel for managing menu items, categories, and restaurant images.',
};

export default function AdminPanelPage() {
  return (
    <main className="bg-black min-h-screen">
      <div className="noise-overlay"></div>
      <Header />
      <AdminPanel />
      <Footer />
    </main>
  );
}