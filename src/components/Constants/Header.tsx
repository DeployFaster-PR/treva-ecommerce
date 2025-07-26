'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import {
  Search,
  User,
  Heart,
  ShoppingBag,
  Menu,
  X,
  LogOut,
  Settings,
  UserCircle,
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { useCartStore } from '@/stores/cart-store';
import { useWishlistStore } from '@/stores/wishlist-store';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// Import all product types and constants
import { EARRING_CATEGORIES } from '@/types/earrings';
import { NECKLACE_CATEGORIES } from '@/types/necklaces';
import { BRACELET_CATEGORIES } from '@/types/bracelets';
import { RING_CATEGORIES } from '@/types/rings';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const { user, loading } = useAuthStore();
  const { openCart, getItemCount } = useCartStore();
  const { getItemCount: getWishlistCount } = useWishlistStore();
  const { signOut } = useAuth();
  const router = useRouter();

  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const menuTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const cartItemCount = getItemCount();
  const wishlistItemCount = getWishlistCount();

  const navigation = [
    { name: 'Earrings', href: '/earrings' },
    { name: 'Necklaces', href: '/necklaces' },
    { name: 'Bracelets', href: '/bracelets' },
    { name: 'Rings', href: '/rings' },
  ];

  // Menu configurations
  const menuConfigs = {
    Earrings: {
      categories: EARRING_CATEGORIES,
      trending: [
        'Stud Earrings',
        'Hoops Earrings',
        'Drops Earrings',
        'Dangles Earrings',
      ],
      images: [
        'https://res.cloudinary.com/dfwty72r9/image/upload/v1752626010/Image_fx_8_fg9tp4.png',
        'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625967/Image_fx_14_mgbsmp.png',
        'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625972/Image_fx_15_oclace.png',
      ],
    },
    Necklaces: {
      categories: NECKLACE_CATEGORIES,
      trending: [
        'Layered Necklaces',
        'Pendant Necklaces',
        'Choker Necklaces',
        'Pearl Necklaces',
      ],
      images: [
        'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625975/Image_fx_16_p6wkra.png',
        'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625979/Image_fx_17_hxyapl.png',
        'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625984/Image_fx_19_z1m5pa.png',
      ],
    },
    Bracelets: {
      categories: BRACELET_CATEGORIES,
      trending: [
        'Tennis Bracelets',
        'Pearl Bracelets',
        'Gemstone Bracelets',
        'Gold Bracelets',
      ],
      images: [
        'https://res.cloudinary.com/dfwty72r9/image/upload/v1753118862/bracelet_slpyrz.png',
        'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625993/Image_fx_21_x8nbkf.png',
        'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625958/Image_fx_10_sy16ug.png',
      ],
    },
    Rings: {
      categories: RING_CATEGORIES,
      trending: [
        'Pearl Rings',
        'Cocktail Rings',
        'Birthstone Rings',
        'Statement Rings',
      ],
      images: [
        'https://res.cloudinary.com/dfwty72r9/image/upload/v1752626001/Image_fx_25_cvxelk.png',
        'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625997/Image_fx_24_hatsbv.png',
        'https://res.cloudinary.com/dfwty72r9/image/upload/v1752626006/Image_fx_28_sbkkl8.png',
      ],
    },
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setSearchOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Track scroll position for mega menu positioning
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    try {
      setUserMenuOpen(false);
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleMenuEnter = (menuName: string) => {
    if (menuTimeoutRef.current) {
      clearTimeout(menuTimeoutRef.current);
    }
    setHoveredMenu(menuName);
  };

  const handleMenuLeave = () => {
    menuTimeoutRef.current = setTimeout(() => {
      setHoveredMenu(null);
    }, 150);
  };

  const handleCategoryClick = (productType: string, category: string) => {
    const baseUrl = `/${productType.toLowerCase()}`;
    const params = new URLSearchParams();
    params.set('category', category);
    router.push(`${baseUrl}?${params.toString()}`);
    setHoveredMenu(null);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Search across all product types
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const renderMegaMenu = (menuName: string) => {
    const config = menuConfigs[menuName as keyof typeof menuConfigs];
    if (!config) return null;

    // Dynamic top positioning based on scroll state
    const topPosition = isScrolled ? '64px' : '96px';

    return (
      <div
        className="fixed left-0 right-0 bg-white border-t border-gray-300 shadow-2xl z-50"
        style={{
          top: topPosition,
          width: '100vw',
          height: '95vh',
          overflow: 'auto',
        }}
        onMouseEnter={() => handleMenuEnter(menuName)}
        onMouseLeave={handleMenuLeave}
      >
        <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-5xl mx-auto h-full flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12 w-full max-w-4xl">
              {/* Categories */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm mb-4 text-black tracking-wide uppercase">
                  CATEGORIES
                </h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href={`/${menuName.toLowerCase()}`}
                      className="text-gray-700 hover:text-black text-sm font-medium transition-colors duration-200 block cursor-pointer"
                      onClick={() => setHoveredMenu(null)}
                    >
                      All {menuName}
                    </Link>
                  </li>
                  {config.categories.slice(0, 8).map((category) => (
                    <li key={category}>
                      <button
                        onClick={() => handleCategoryClick(menuName, category)}
                        className="text-gray-700 hover:text-black text-sm font-medium transition-colors duration-200 text-left w-full cursor-pointer"
                      >
                        {category} {menuName}
                      </button>
                    </li>
                  ))}
                  {config.categories.length > 8 && (
                    <li>
                      <Link
                        href={`/${menuName.toLowerCase()}`}
                        className="text-treva-primary hover:text-yellow-600 text-sm font-semibold transition-colors duration-200 block cursor-pointer"
                        onClick={() => setHoveredMenu(null)}
                      >
                        View All →
                      </Link>
                    </li>
                  )}
                </ul>
              </div>

              {/* Trending */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm mb-4 text-black tracking-wide uppercase">
                  TRENDING
                </h3>
                <ul className="space-y-2">
                  {config.trending.map((item) => (
                    <li key={item}>
                      <button
                        onClick={() => {
                          const categoryName = item
                            .replace(` ${menuName}`, '')
                            .replace(`${menuName.slice(0, -1)} `, '');
                          handleCategoryClick(menuName, categoryName);
                        }}
                        className="text-gray-700 hover:text-black text-sm font-medium transition-colors duration-200 text-left w-full cursor-pointer"
                      >
                        {item}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Images - Non-clickable */}
              <div className="md:col-span-2 space-y-4">
                <h3 className="font-semibold text-sm mb-4 text-black tracking-wide uppercase">
                  FEATURED
                </h3>
                <div className="flex justify-center">
                  <div className="grid grid-cols-3 gap-4 max-w-sm">
                    {config.images.map((image, index) => (
                      <div
                        key={index}
                        className="group aspect-square rounded-full overflow-hidden bg-gray-100 transition-transform duration-300 hover:scale-105 w-20 h-20 sm:w-24 sm:h-24"
                      >
                        <Image
                          src={image}
                          alt={`${menuName} ${index + 1}`}
                          width={120}
                          height={120}
                          className="w-full h-full object-cover group-hover:opacity-90 transition-opacity duration-300"
                          quality={95}
                          priority={index === 0}
                          sizes="(max-width: 640px) 80px, 96px"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

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
              className="md:hidden p-2 rounded-md text-treva-text hover:text-treva-primary cursor-pointer"
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
                className="text-2xl font-bold text-treva-text tracking-wide cursor-pointer"
              >
                TREVA
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8 relative">
              {navigation.map((item) => (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => handleMenuEnter(item.name)}
                  onMouseLeave={handleMenuLeave}
                >
                  <Link
                    href={item.href}
                    className={`relative text-treva-text hover:text-black font-medium text-sm transition-all duration-300 py-2 cursor-pointer ${
                      hoveredMenu === item.name ? 'text-black' : ''
                    }`}
                  >
                    {item.name}
                    {/* Active underline */}
                    <span
                      className={`absolute bottom-0 left-0 w-full h-0.5 bg-gray-400 transform origin-left transition-transform duration-300 ${
                        hoveredMenu === item.name ? 'scale-x-100' : 'scale-x-0'
                      }`}
                    />
                  </Link>
                  {hoveredMenu === item.name && renderMegaMenu(item.name)}
                </div>
              ))}
            </nav>

            {/* Right side icons */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative" ref={searchRef}>
                <button
                  className="p-2 text-treva-text hover:text-treva-primary transition-colors cursor-pointer"
                  onClick={() => setSearchOpen(!searchOpen)}
                >
                  <Search className="h-5 w-5" />
                </button>

                {/* Search Dropdown */}
                {searchOpen && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-300 rounded-md shadow-lg p-4 z-50">
                    <form onSubmit={handleSearch}>
                      <div className="flex">
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search products..."
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-treva-primary focus:border-treva-primary text-sm"
                          autoFocus
                        />
                        <button
                          type="submit"
                          className="px-4 py-2 bg-treva-primary text-white rounded-r-md hover:bg-yellow-500 transition-colors cursor-pointer"
                        >
                          <Search className="h-4 w-4" />
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>

              {/* User Menu */}
              <div className="relative" ref={userMenuRef}>
                {loading ? (
                  <div className="p-2">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-treva-primary border-t-transparent"></div>
                  </div>
                ) : user ? (
                  <>
                    <button
                      className="p-2 text-treva-text hover:text-treva-primary transition-colors flex items-center space-x-1 cursor-pointer"
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                    >
                      <UserCircle className="h-5 w-5" />
                      <span className="hidden sm:block text-sm max-w-fit font-medium">
                        {user.user_metadata?.full_name || 'Not provided'}
                      </span>
                    </button>

                    {/* User Dropdown Menu */}
                    {userMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-100">
                        <Link
                          href="/dashboard"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Profile Settings
                        </Link>
                        <Link
                          href="/orders"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <ShoppingBag className="h-4 w-4 mr-2" />
                          My Orders
                        </Link>
                        <button
                          onClick={handleSignOut}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign Out
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Link
                      href="/auth/signin"
                      className="p-2 text-treva-text hover:text-treva-primary transition-colors cursor-pointer"
                    >
                      <User className="h-5 w-5" />
                    </Link>
                    <span className="hidden sm:block text-sm text-gray-400">
                      |
                    </span>
                    <Link
                      href="/auth/signin"
                      className="hidden sm:block text-sm font-medium text-treva-text hover:text-treva-primary transition-colors cursor-pointer"
                    >
                      Sign In
                    </Link>
                  </div>
                )}
              </div>

              {/* Wishlist Icon */}
              <Link
                href="/wishlist"
                className="p-2 text-treva-text hover:text-treva-primary transition-colors relative cursor-pointer"
              >
                <Heart className="h-5 w-5" />
                {wishlistItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-treva-primary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {wishlistItemCount > 9 ? '9+' : wishlistItemCount}
                  </span>
                )}
              </Link>

              {/* Cart Icon */}
              <button
                onClick={openCart}
                className="p-2 text-treva-text hover:text-treva-primary transition-colors relative cursor-pointer"
              >
                <ShoppingBag className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-treva-primary text-white text-xs rounded-full h-4 w-5 flex items-center justify-center">
                    {cartItemCount > 9 ? '9+' : cartItemCount}
                  </span>
                )}
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
                  className="block px-3 py-2 text-treva-text hover:text-treva-primary font-medium text-sm transition-colors cursor-pointer"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {/* Mobile Auth Links */}
              <div className="border-t border-gray-100 pt-2 mt-2">
                {user ? (
                  <>
                    <div className="px-3 py-2 text-xs max-w-fit text-gray-600">
                      {user.user_metadata?.full_name || 'Not provided'}
                    </div>
                    <Link
                      href="/dashboard"
                      className="block px-3 py-2 text-treva-text hover:text-treva-primary font-medium text-sm transition-colors cursor-pointer"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Profile Settings
                    </Link>
                    <Link
                      href="/orders"
                      className="block px-3 py-2 text-treva-text hover:text-treva-primary font-medium text-sm transition-colors cursor-pointer"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      My Orders
                    </Link>
                    <button
                      onClick={() => {
                        handleSignOut();
                        setMobileMenuOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 text-treva-text hover:text-treva-primary font-medium text-sm transition-colors cursor-pointer"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link
                    href="/auth/signin"
                    className="block px-3 py-2 text-treva-text hover:text-treva-primary font-medium text-sm transition-colors cursor-pointer"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                )}
              </div>

              {/* Mobile Wishlist and Cart */}
              <div className="border-t border-gray-100 pt-2 mt-2 flex justify-center space-x-6">
                <Link
                  href="/wishlist"
                  className="flex items-center space-x-2 px-3 py-2 text-treva-text hover:text-treva-primary font-medium text-sm transition-colors cursor-pointer"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Heart className="h-4 w-4" />
                  <span>Wishlist ({wishlistItemCount})</span>
                </Link>
                <button
                  onClick={() => {
                    openCart();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 px-3 py-2 text-treva-text hover:text-treva-primary font-medium text-sm transition-colors cursor-pointer"
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>Cart ({cartItemCount})</span>
                </button>
              </div>

              {/* Mobile Search */}
              <div className="border-t border-gray-100 pt-2 mt-2">
                <form onSubmit={handleSearch} className="px-3 py-2">
                  <div className="flex">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search products..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-treva-primary focus:border-treva-primary text-sm"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-treva-primary text-white rounded-r-md hover:bg-yellow-500 transition-colors cursor-pointer"
                    >
                      <Search className="h-4 w-4" />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
