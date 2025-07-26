'use client';

import React, { useRef, useEffect, useState } from 'react';

interface Category {
  id: string;
  title: string;
  route: string;
  image: string;
}

const ProductCategoryGrid: React.FC = () => {
  const tabletScrollRef = useRef<HTMLDivElement>(null);
  const mobileScrollRef = useRef<HTMLDivElement>(null);

  const [tabletScrollState, setTabletScrollState] = useState<
    'start' | 'middle' | 'end'
  >('start');
  const [mobileScrollState, setMobileScrollState] = useState<
    'start' | 'middle' | 'end'
  >('start');

  const categories: Category[] = [
    {
      id: 'necklaces',
      title: 'NECKLACES',
      route: '/necklaces',
      image:
        'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625295/young-woman-wearing-chain-necklace_ft2cip.jpg',
    },
    {
      id: 'earrings',
      title: 'EARRINGS',
      route: '/earrings',
      image:
        'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625657/homepage-img4_xmjp7n.png',
    },
    {
      id: 'bracelets',
      title: 'BRACELETS',
      route: '/bracelets',
      image:
        'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625655/homepage-img3_gjmpjf.png',
    },
    {
      id: 'rings',
      title: 'RINGS',
      route: '/rings',
      image:
        'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625666/homepage-img2_a2zw0i.png',
    },
  ];

  const handleScroll = (
    element: HTMLDivElement,
    setScrollState: React.Dispatch<
      React.SetStateAction<'start' | 'middle' | 'end'>
    >
  ) => {
    if (!element) return;

    const { scrollLeft, scrollWidth, clientWidth } = element;
    const threshold = 10; // Small threshold to account for rounding

    if (scrollLeft <= threshold) {
      setScrollState('start');
    } else if (scrollLeft >= scrollWidth - clientWidth - threshold) {
      setScrollState('end');
    } else {
      setScrollState('middle');
    }
  };

  useEffect(() => {
    const tabletElement = tabletScrollRef.current;
    const mobileElement = mobileScrollRef.current;

    const handleTabletScroll = () =>
      handleScroll(tabletElement!, setTabletScrollState);
    const handleMobileScroll = () =>
      handleScroll(mobileElement!, setMobileScrollState);

    if (tabletElement) {
      tabletElement.addEventListener('scroll', handleTabletScroll);
      // Check initial state
      handleTabletScroll();
    }

    if (mobileElement) {
      mobileElement.addEventListener('scroll', handleMobileScroll);
      // Check initial state
      handleMobileScroll();
    }

    return () => {
      if (tabletElement) {
        tabletElement.removeEventListener('scroll', handleTabletScroll);
      }
      if (mobileElement) {
        mobileElement.removeEventListener('scroll', handleMobileScroll);
      }
    };
  }, []);

  const handleCategoryClick = (route: string): void => {
    // Use standard navigation that works in all contexts
    window.location.href = route;
  };

  return (
    <div className="w-full px-4 py-16">
      {/* Desktop View - Grid Layout */}
      <div className="hidden lg:grid lg:grid-cols-4 lg:gap-6 lg:h-96">
        {categories.map((category) => (
          <div
            key={category.id}
            onClick={() => handleCategoryClick(category.route)}
            className="relative overflow-hidden rounded-lg cursor-pointer group transition-transform duration-300 hover:scale-105 h-full"
            style={{
              backgroundImage: `url(${category.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundColor: '#f3f4f6',
            }}
          >
            <div className="absolute inset-0 bg-black/0 bg-opacity-20 group-hover:bg-opacity-30 transition-opacity duration-300" />
            <div className="absolute bottom-4 left-4">
              <span className="inline-block bg-[#046A38] text-white px-4 py-2 text-sm font-semibold tracking-wide rounded">
                {category.title}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Tablet View - Horizontal Scroll with dynamic fade hints */}
      <div className="hidden md:block lg:hidden relative">
        {/* Left fade gradient */}
        <div
          className={`absolute left-0 top-0 bottom-4 w-8 bg-gradient-to-r from-white via-white/50 to-transparent z-10 pointer-events-none transition-opacity duration-500 ${
            tabletScrollState === 'end'
              ? 'opacity-70 animate-pulse'
              : tabletScrollState === 'middle'
                ? 'opacity-60'
                : 'opacity-0'
          }`}
        />

        {/* Right fade gradient */}
        <div
          className={`absolute right-0 top-0 bottom-4 w-8 bg-gradient-to-l from-white via-white/50 to-transparent z-10 pointer-events-none transition-opacity duration-500 ${
            tabletScrollState === 'start'
              ? 'opacity-70 animate-pulse'
              : tabletScrollState === 'middle'
                ? 'opacity-60'
                : 'opacity-0'
          }`}
        />

        <div
          ref={tabletScrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category.route)}
              className="relative flex-shrink-0 w-72 h-80 overflow-hidden rounded-lg cursor-pointer group transition-transform duration-300 hover:scale-105"
              style={{
                backgroundImage: `url(${category.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundColor: '#f3f4f6',
              }}
            >
              <div className="absolute inset-0 bg-black/0 bg-opacity-20 group-hover:bg-opacity-30 transition-opacity duration-300" />
              <div className="absolute bottom-4 left-4">
                <span className="inline-block bg-[#046A38] text-white px-4 py-2 text-sm font-semibold tracking-wide rounded">
                  {category.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile View - Horizontal Scroll with dynamic fade hints */}
      <div className="block md:hidden relative">
        {/* Left fade gradient */}
        <div
          className={`absolute left-0 top-0 bottom-4 w-6 bg-gradient-to-r from-white via-white/60 to-transparent z-10 pointer-events-none transition-opacity duration-500 ${
            mobileScrollState === 'end'
              ? 'opacity-70 animate-pulse'
              : mobileScrollState === 'middle'
                ? 'opacity-60'
                : 'opacity-0'
          }`}
        />

        {/* Right fade gradient */}
        <div
          className={`absolute right-0 top-0 bottom-4 w-6 bg-gradient-to-l from-white via-white/60 to-transparent z-10 pointer-events-none transition-opacity duration-500 ${
            mobileScrollState === 'start'
              ? 'opacity-70 animate-pulse'
              : mobileScrollState === 'middle'
                ? 'opacity-60'
                : 'opacity-0'
          }`}
        />

        <div
          ref={mobileScrollRef}
          className="flex gap-3 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category.route)}
              className="relative flex-shrink-0 w-60 h-72 overflow-hidden rounded-lg cursor-pointer group transition-transform duration-300 active:scale-95"
              style={{
                backgroundImage: `url(${category.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundColor: '#f3f4f6',
              }}
            >
              <div className="absolute inset-0 bg-black/0 bg-opacity-20 group-active:bg-opacity-30 transition-opacity duration-300" />
              <div className="absolute bottom-4 left-4">
                <span className="inline-block bg-[#046A38] text-white px-3 py-2 text-xs font-semibold tracking-wide rounded">
                  {category.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default ProductCategoryGrid;
