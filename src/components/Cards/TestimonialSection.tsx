'use client';
import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

const testimonials = [
  {
    id: 1,
    name: 'Esther Howard',
    date: '9/07/25',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    text: 'The sterling gold necklace is even more beautiful in person! I&apos;ve worn it daily for 3 months, and it hasn&apos;t tarnished. Perfect for layering, gets compliments every time.',
  },
  {
    id: 2,
    name: 'Leslie Alexander',
    date: '9/07/25',
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    text: 'The bohemian earrings are STUNNING. Lightweight but vibrant, I wore them to a festival and danced all night without discomfort. So unique!',
  },
  {
    id: 3,
    name: 'Theresa Webb',
    date: '9/07/25',
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    text: "Ordered the nameplate bracelet for my sister's birthday, she cried! The engraving was flawless, and the gold plating hasn't faded after 2 months. 10/10!",
  },
  {
    id: 4,
    name: 'Devon Lane',
    date: '9/07/25',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    text: 'The vintage ring exceeded my expectations. The craftsmanship is incredible and it fits perfectly. I&apos;ve gotten so many compliments!',
  },
  {
    id: 5,
    name: 'Courtney Henry',
    date: '9/07/25',
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
    text: 'Fast shipping and beautiful packaging! The charm bracelet is exactly what I wanted. Quality is amazing for the price point.',
  },
];

export default function TestimonialComponent() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [showArrows, setShowArrows] = useState(false);

  const checkScrollability = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
    }
  };

  const checkIfScrollable = () => {
    if (scrollContainerRef.current) {
      const { scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowArrows(scrollWidth > clientWidth);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      checkScrollability();
      checkIfScrollable();

      const handleResize = () => {
        checkScrollability();
        checkIfScrollable();
      };

      window.addEventListener('resize', handleResize);
      container.addEventListener('scroll', checkScrollability);

      return () => {
        window.removeEventListener('resize', handleResize);
        container.removeEventListener('scroll', checkScrollability);
      };
    }
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320; // Approximate width of one testimonial card
      const newScrollLeft =
        direction === 'left'
          ? scrollContainerRef.current.scrollLeft - scrollAmount
          : scrollContainerRef.current.scrollLeft + scrollAmount;

      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-20 relative">
      {/* Header */}
      <div className="mb-8">
        <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-2">
          TESTIMONIALS
        </h3>
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 leading-tight">
          Don&apos;t take our word for it!
          <br />
          Read reviews from our customers.
        </h2>
      </div>

      {/* Testimonials Container */}
      <div className="relative">
        {/* Left Arrow */}
        {showArrows && (
          <button
            onClick={() => scroll('left')}
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center transition-opacity duration-200 ${
              canScrollLeft
                ? 'opacity-100 hover:bg-gray-50'
                : 'opacity-50 cursor-not-allowed'
            }`}
            disabled={!canScrollLeft}
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
        )}

        {/* Right Arrow */}
        {showArrows && (
          <button
            onClick={() => scroll('right')}
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center transition-opacity duration-200 ${
              canScrollRight
                ? 'opacity-100 hover:bg-gray-50'
                : 'opacity-50 cursor-not-allowed'
            }`}
            disabled={!canScrollRight}
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        )}

        {/* Scrollable Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide px-8 md:px-12"
        >
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="flex-none w-80 md:w-96 bg-[#046A38] rounded-lg p-6 text-white"
            >
              {/* Avatar */}
              <div className="mb-4">
                <Image
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white/20"
                />
              </div>

              {/* Testimonial Text */}
              <p className="text-base leading-relaxed mb-6">
                {testimonial.text}
              </p>

              {/* Author Info */}
              <div>
                <h4 className="font-semibold text-lg mb-1">
                  {testimonial.name}
                </h4>
                <p className="text-green-200 text-sm">{testimonial.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Hint for Mobile */}
      <div className="flex justify-center mt-4 md:hidden">
        <div className="flex space-x-2">
          {testimonials.map((_, index) => (
            <div key={index} className="w-2 h-2 rounded-full bg-gray-300" />
          ))}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
