'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AppLogo from '@/components/ui/AppLogo';
import Icon from '@/components/ui/AppIcon';

const navLinks = [
  { id: 'nav_menu', label: 'Menu', href: '/menu' },
  { id: 'nav_about', label: 'About', href: '/about' },
  { id: 'nav_reservations', label: 'Reservations', href: '/reservations' },
  { id: 'nav_delivery', label: 'Delivery', href: '/delivery' },
  { id: 'nav_contact', label: 'Contact', href: '/contact' },
];

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (href: string) => {
    if (href.includes('#')) return pathname === href.split('#')[0];
    return pathname === href;
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled || menuOpen
            ? 'bg-black/95 backdrop-blur-md border-b border-white/5 py-4' :'bg-transparent py-6'
        }`}
      >
        <div className="max-w-[1600px] mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <AppLogo size={64} />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                className={`nav-link font-header text-[11px] uppercase tracking-widest-2 font-semibold transition-colors duration-300 ${
                  isActive(link.href) ? 'text-white active' : 'text-white/60 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href={`https://wa.me/97144542706`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-hollow"
            >
              Order Now
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <Icon name={menuOpen ? 'XMarkIcon' : 'Bars3Icon'} size={24} variant="outline" />
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-black/98 border-t border-white/5 px-6 py-8">
            <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.id}
                  href={link.href}
                  className={`font-header text-sm uppercase tracking-widest-2 font-semibold transition-colors ${
                    isActive(link.href) ? 'text-white' : 'text-white/60'
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <a
                href={`https://wa.me/97144542706`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-hollow text-center mt-4"
                onClick={() => setMenuOpen(false)}
              >
                Order Now
              </a>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}