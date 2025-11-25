"use client";

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from './ui/button';

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  
  // Detect scroll and apply scrolled state
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
 // Hide navbar on dashboard, profile, and settings pages
  if (pathname === '/dashboard' || pathname?.startsWith('/dashboard/profile') || pathname?.startsWith('/dashboard/settings')) {
    return null;
  }

  return (
    <nav
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300
        ${scrolled
          ? "w-[95vw] max-w-4xl rounded-2xl bg-white/85 shadow-lg border border-gray-200 backdrop-blur"
          : "w-[95vw] max-w-7xl rounded-2xl bg-white/90 shadow-sm border border-gray-100 backdrop-blur-sm"
        }`}
      style={{
        height: scrolled ? 56 : 72,
        minHeight: 56,
        paddingLeft: scrolled ? 16 : 0,
        paddingRight: scrolled ? 16 : 0,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between h-full items-center">
          {/* Brand */}
          <Link href="/" className="flex-shrink-0 flex items-center">
            <span className="text-xl font-bold text-indigo-600">HirePilot</span>
          </Link>
          {/* Desktop Links */}
          <div className="hidden sm:flex sm:space-x-8">
            <Link href="/" className="text-gray-500 hover:text-gray-700 transition px-3 py-2 font-semibold">Home</Link>
            <Link href="/features" className="text-gray-500 hover:text-gray-700 transition px-3 py-2 font-semibold">Features</Link>
            <Link href="/pricing" className="text-gray-500 hover:text-gray-700 transition px-3 py-2 font-semibold">Pricing</Link>
            <Link href="/contact" className="text-gray-500 hover:text-gray-700 transition px-3 py-2 font-semibold">Contact</Link>
          </div>
          {/* Desktop Actions */}
          <div className="hidden sm:flex sm:items-center gap-2">
            <Link href="/login">
              <Button variant="ghost" className="text-gray-700 hover:bg-gray-100 rounded-md">Log in</Button>
            </Link>
            <Link href="/register">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-md shadow">
                Get Started
              </Button>
            </Link>
          </div>
          {/* Mobile Hamburger */}
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              type="button"
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`sm:hidden transition-all duration-200 ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="pt-2 pb-3 space-y-1 bg-white/95 border-t border-gray-200 rounded-b-2xl shadow">
          <Link href="/" className="block text-gray-700 hover:text-indigo-600 py-2 px-6 font-semibold">Home</Link>
          <Link href="/features" className="block text-gray-700 hover:text-indigo-600 py-2 px-6 font-semibold">Features</Link>
          <Link href="/pricing" className="block text-gray-700 hover:text-indigo-600 py-2 px-6 font-semibold">Pricing</Link>
          <Link href="/contact" className="block text-gray-700 hover:text-indigo-600 py-2 px-6 font-semibold">Contact</Link>
          <Link href="/login" className="block text-gray-700 hover:text-indigo-600 py-2 px-6 font-semibold border-t border-gray-100 mt-2">Log in</Link>
          <Link href="/register" className="block text-indigo-600 hover:bg-indigo-50 py-2 px-6 font-bold rounded mb-2">Get Started</Link>
        </div>
      </div>
    </nav>
  );
}
