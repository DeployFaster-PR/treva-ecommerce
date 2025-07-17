'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Search, User, Heart, ShoppingBag, Menu, X } from 'lucide-react';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'New In', href: '/new-in' },
    { name: 'Earrings', href: '/earrings' },
    { name: 'Necklace', href: '/necklace' },
    { name: 'Bracelets', href: '/bracelets' },
    { name: 'Rings', href: '/rings' },
  ];

  return (
    <>
      {/* Promotional Banner */}
      <div className="bg-black text-white text-center py-2 px-4 text-sm">
        FREE SHIPPING ON ORDERS OVER £150
      </div>

      {/* Main Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden p-2 rounded-md text-treva-text hover:text-treva-primary"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>

            {/* Logo */}
            <div className="flex-shrink-0">
              <Link
                href="/"
                className="text-2xl font-bold text-treva-text tracking-wide"
              >
                TREVA
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-treva-text hover:text-treva-primary font-medium text-sm transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Right side icons */}
            <div className="flex items-center space-x-4">
              <button className="p-2 text-treva-text hover:text-treva-primary transition-colors">
                <Search className="h-5 w-5" />
              </button>
              <button className="p-2 text-treva-text hover:text-treva-primary transition-colors">
                <User className="h-5 w-5" />
              </button>
              <button className="p-2 text-treva-text hover:text-treva-primary transition-colors">
                <Heart className="h-5 w-5" />
              </button>
              <button className="p-2 text-treva-text hover:text-treva-primary transition-colors relative">
                <ShoppingBag className="h-5 w-5" />
                {/* Cart count badge */}
                <span className="absolute -top-1 -right-1 bg-treva-primary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  0
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-treva-text hover:text-treva-primary font-medium text-sm transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
