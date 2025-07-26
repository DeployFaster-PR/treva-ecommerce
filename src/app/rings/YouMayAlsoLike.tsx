'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { Ring } from '@/types/rings';
import { client } from '@/lib/sanity';
import { useCartStore } from '@/stores/cart-store';
import { useWishlistStore } from '@/stores/wishlist-store';
import { ringToCartItem, ringToWishlistItem } from '@/lib/product-helpers';
import Image from 'next/image';
import Link from 'next/link';

interface YouMayAlsoLikeProps {
  currentRing: Ring;
  maxItems?: number;
  title?: string;
}

const YouMayAlsoLike: React.FC<YouMayAlsoLikeProps> = ({
  currentRing,
  maxItems = 8,
  title = 'You may also like',
}) => {
  const [relatedRings, setRelatedRings] = useState<Ring[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Cart and Wishlist stores
  const { addItem: addToCart, openCart } = useCartStore();
  const {
    addItem: addToWishlist,
    removeItem: removeFromWishlist,
    isInWishlist,
  } = useWishlistStore();

  useEffect(() => {
    const fetchRelatedRings = async () => {
      setIsLoading(true);
      try {
        // Build query to find related rings based on similarity
        let query = `*[_type == "ring" && active == true && _id != "${currentRing._id}"`;

        // Create scoring system for relevance
        const conditions: string[] = [];

        // Same category gets highest priority
        if (currentRing.category) {
          conditions.push(`category == "${currentRing.category}"`);
        }

        // Same material gets second priority
        if (currentRing.material) {
          conditions.push(`material == "${currentRing.material}"`);
        }

        // Same stone gets third priority
        if (currentRing.stone) {
          conditions.push(`stone == "${currentRing.stone}"`);
        }

        // Same color gets fourth priority
        if (currentRing.color) {
          conditions.push(`color == "${currentRing.color}"`);
        }

        query += `] {
          _id,
          name,
          slug,
          price,
          originalPrice,
          currency,
          mainImageUrl,
          imageUrls,
          inStock,
          material,
          stone,
          color,
          size,
          category,
          featured,
          _createdAt,
          "relevanceScore": (
            ${currentRing.category ? `(category == "${currentRing.category}") * 4 +` : ''}
            ${currentRing.material ? `(material == "${currentRing.material}") * 3 +` : ''}
            ${currentRing.stone ? `(stone == "${currentRing.stone}") * 2 +` : ''}
            ${currentRing.color ? `(color == "${currentRing.color}") * 1 +` : ''}
            (featured == true) * 1
          )
        } | order(relevanceScore desc, _createdAt desc)[0...${maxItems * 2}]`;

        const result = await client.fetch(query);

        // If we don't have enough related items, fetch some random popular ones
        if (result.length < maxItems) {
          const additionalQuery = `*[_type == "ring" && active == true && _id != "${currentRing._id}" && !(_id in [${result.map((r: Ring) => `"${r._id}"`).join(', ')}])] | order(featured desc, _createdAt desc)[0...${maxItems - result.length}] {
            _id,
            name,
            slug,
            price,
            originalPrice,
            currency,
            mainImageUrl,
            imageUrls,
            inStock,
            material,
            stone,
            color,
            size,
            category,
            featured,
            _createdAt
          }`;

          const additionalItems = await client.fetch(additionalQuery);
          setRelatedRings([...result, ...additionalItems].slice(0, maxItems));
        } else {
          setRelatedRings(result.slice(0, maxItems));
        }
      } catch (error) {
        console.error('Error fetching related rings:', error);
        setRelatedRings([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRelatedRings();
  }, [currentRing, maxItems]);

  // Cart and Wishlist handlers - same as RingListing
  const handleAddToBag = (e: React.MouseEvent, ring: Ring) => {
    e.preventDefault();
    e.stopPropagation();

    if (!ring.inStock) return;

    const cartItem = ringToCartItem(ring);
    addToCart(cartItem);
    openCart();
  };

  const handleToggleWishlist = (e: React.MouseEvent, ring: Ring) => {
    e.preventDefault();
    e.stopPropagation();

    const isWishlisted = isInWishlist(ring._id, ring.size);

    if (isWishlisted) {
      removeFromWishlist(ring._id, ring.size);
    } else {
      const wishlistItem = ringToWishlistItem(ring);
      addToWishlist(wishlistItem);
    }
  };

  const getImageUrl = (ring: Ring) => {
    if (
      ring.mainImageUrl &&
      typeof ring.mainImageUrl === 'string' &&
      ring.mainImageUrl.trim() !== ''
    ) {
      return ring.mainImageUrl;
    }

    if (
      ring.imageUrls &&
      Array.isArray(ring.imageUrls) &&
      ring.imageUrls.length > 0
    ) {
      const firstUrl = ring.imageUrls[0];
      if (typeof firstUrl === 'string' && firstUrl.trim() !== '') {
        return firstUrl;
      }
    }

    return null;
  };

  const getVisibleItems = () => {
    // Responsive logic: show different number of items based on screen size
    // This will be handled by CSS grid, but we'll prepare the data
    return relatedRings;
  };

  const nextSlide = () => {
    const maxIndex = Math.max(0, relatedRings.length - 4);
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  if (isLoading) {
    return (
      <div className="w-full py-12">
        <h2 className="text-2xl font-bold mb-8 text-center">{title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (relatedRings.length === 0) {
    return null;
  }

  return (
    <div className="w-full py-12">
      <h2 className="text-2xl mb-8 font-normal">{title}</h2>

      {/* Desktop and Tablet View */}
      <div className="hidden sm:block">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {getVisibleItems().map((ring) => {
            const imageUrl = getImageUrl(ring);
            const isWishlisted = isInWishlist(ring._id, ring.size);

            return (
              <div key={ring._id} className="group">
                <Link href={`/rings/${ring.slug.current}`}>
                  <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4 cursor-pointer">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={ring.name}
                        width={300}
                        height={300}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400 text-sm">No Image</span>
                      </div>
                    )}

                    {!ring.inStock && (
                      <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm bg-black/20">
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-3 py-1">
                          <span className="text-white font-medium text-xs tracking-wide">
                            Out of Stock
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Wishlist Button */}
                    <button
                      className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm hover:bg-white rounded-full flex items-center justify-center transition-colors z-10"
                      onClick={(e) => handleToggleWishlist(e, ring)}
                    >
                      <Heart
                        className={`w-4 h-4 transition-colors ${
                          isWishlisted
                            ? 'fill-red-500 text-red-500'
                            : 'text-gray-600'
                        }`}
                      />
                    </button>

                    <button
                      className="absolute bottom-3 right-3 bg-yellow-400 text-black px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-yellow-500 transition-colors z-10 disabled:bg-gray-300 disabled:cursor-not-allowed"
                      onClick={(e) => handleAddToBag(e, ring)}
                      disabled={!ring.inStock}
                    >
                      {ring.inStock ? 'Add to bag' : 'Out of Stock'}
                    </button>
                  </div>
                </Link>

                <Link href={`/rings/${ring.slug.current}`}>
                  <div className="cursor-pointer">
                    <h3 className="font-semibold text-base mb-1 hover:text-gray-600 transition-colors line-clamp-2">
                      {ring.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-1">
                      {ring.material}
                      {ring.stone && `, ${ring.stone}`}
                      {ring.size && ` - Size ${ring.size}`}
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-800 font-medium text-sm">
                        {ring.currency === 'GBP'
                          ? '£'
                          : ring.currency === 'USD'
                            ? '$'
                            : '€'}
                        {ring.price}
                      </span>
                      {ring.originalPrice && (
                        <span className="text-gray-400 line-through text-sm">
                          {ring.currency === 'GBP'
                            ? '£'
                            : ring.currency === 'USD'
                              ? '$'
                              : '€'}
                          {ring.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile View with Carousel */}
      <div className="sm:hidden">
        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
                width: `${relatedRings.length * 100}%`,
              }}
            >
              {relatedRings.map((ring) => {
                const imageUrl = getImageUrl(ring);
                const isWishlisted = isInWishlist(ring._id, ring.size);

                return (
                  <div
                    key={ring._id}
                    className="group px-2"
                    style={{ width: `${100 / relatedRings.length}%` }}
                  >
                    <Link href={`/rings/${ring.slug.current}`}>
                      <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4 cursor-pointer">
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={ring.name}
                            width={300}
                            height={300}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-400 text-sm">
                              No Image
                            </span>
                          </div>
                        )}

                        {!ring.inStock && (
                          <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm bg-black/20">
                            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-3 py-1">
                              <span className="text-white font-medium text-xs tracking-wide">
                                Out of Stock
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Wishlist Button */}
                        <button
                          className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm hover:bg-white rounded-full flex items-center justify-center transition-colors z-10"
                          onClick={(e) => handleToggleWishlist(e, ring)}
                        >
                          <Heart
                            className={`w-4 h-4 transition-colors ${
                              isWishlisted
                                ? 'fill-red-500 text-red-500'
                                : 'text-gray-600'
                            }`}
                          />
                        </button>

                        <button
                          className="absolute bottom-3 right-3 bg-yellow-400 text-black px-2 py-1 rounded-lg text-xs font-medium hover:bg-yellow-500 transition-colors z-10 disabled:bg-gray-300 disabled:cursor-not-allowed"
                          onClick={(e) => handleAddToBag(e, ring)}
                          disabled={!ring.inStock}
                        >
                          {ring.inStock ? 'Add' : 'Out'}
                        </button>
                      </div>
                    </Link>

                    <Link href={`/rings/${ring.slug.current}`}>
                      <div className="cursor-pointer">
                        <h3 className="font-semibold text-base mb-1 hover:text-gray-600 transition-colors line-clamp-2">
                          {ring.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2 line-clamp-1">
                          {ring.material}
                          {ring.stone && `, ${ring.stone}`}
                        </p>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-800 font-medium text-sm">
                            {ring.currency === 'GBP'
                              ? '£'
                              : ring.currency === 'USD'
                                ? '$'
                                : '€'}
                            {ring.price}
                          </span>
                          {ring.originalPrice && (
                            <span className="text-gray-400 line-through text-sm">
                              {ring.currency === 'GBP'
                                ? '£'
                                : ring.currency === 'USD'
                                  ? '$'
                                  : '€'}
                              {ring.originalPrice}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation Arrows for Mobile */}
          {relatedRings.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                disabled={currentIndex === 0}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full p-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-colors z-10"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={nextSlide}
                disabled={currentIndex >= relatedRings.length - 1}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full p-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-colors z-10"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Dots Indicator for Mobile */}
          {relatedRings.length > 1 && (
            <div className="flex justify-center space-x-2 mt-4">
              {relatedRings.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-yellow-400' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default YouMayAlsoLike;
