import React from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';

const footerLinks = [
  { id: 'ft_home', label: 'Home', href: '/' },
  { id: 'ft_menu', label: 'Menu', href: '/menu' },
  { id: 'ft_reservations', label: 'Reservations', href: '/reservations' },
  { id: 'ft_about', label: 'About', href: '/about' },
  { id: 'ft_contact', label: 'Contact', href: '/contact' },
  { id: 'ft_delivery', label: 'Delivery', href: '/delivery' },
  { id: 'ft_admin', label: 'Admin Panel', href: '/admin-panel' },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-black relative z-10">
      <div className="max-w-[1600px] mx-auto px-6 py-16">
        {/* Main row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-10 mb-12">
          <Link href="/">
            <AppLogo size={64} />
          </Link>

          <div className="flex flex-wrap justify-center gap-8">
            {footerLinks?.map((link) => (
              <Link
                key={link?.id}
                href={link?.href}
                className="text-sm uppercase tracking-widest-2 text-white/50 hover:text-white transition-colors duration-300 font-medium"
              >
                {link?.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm uppercase tracking-widest-2 text-white/50 hover:text-white transition-colors duration-300 font-medium"
            >
              Instagram
            </a>
            <a
              href={`https://wa.me/97144542706`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm uppercase tracking-widest-2 text-white/50 hover:text-white transition-colors duration-300 font-medium"
            >
              WhatsApp
            </a>
          </div>
        </div>

        {/* Bottom row */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs uppercase tracking-widest-2 text-white/40 font-medium">
            © 2026 Mizu Restaurant. Claren Towers, Downtown Dubai.
          </p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-xs uppercase tracking-widest-2 text-white/40 hover:text-white/60 transition-colors font-medium">
              Privacy
            </Link>
            <Link href="#" className="text-xs uppercase tracking-widest-2 text-white/40 hover:text-white/60 transition-colors font-medium">
              Terms
            </Link>
            <a
              href="https://dubaiprod.com"
              target="_blank"
              rel="noopener"
              className="text-xs uppercase tracking-widest-2 text-white/40 hover:text-white/60 transition-colors font-medium"
            >
              Website by dubaiprod.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}