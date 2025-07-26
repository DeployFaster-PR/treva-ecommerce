'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { Bracelet } from '@/types/bracelets';
import { client } from '@/lib/sanity';
import { useCartStore } from '@/stores/cart-store';
import { useWishlistStore } from '@/stores/wishlist-store';
import {
  braceletToCartItem,
  braceletToWishlistItem,
} from '@/lib/product-helpers';
import Image from 'next/image';
import Link from 'next/link';

interface YouMayAlsoLikeProps {
  currentBracelet: Bracelet;
  maxItems?: number;
  title?: string;
}

const YouMayAlsoLike: React.FC<YouMayAlsoLikeProps> = ({
  currentBracelet,
  maxItems = 8,
  title = 'You may also like',
}) => {
  const [relatedBracelets, setRelatedBracelets] = useState<Bracelet[]>([]);
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
    const fetchRelatedBracelets = async () => {
      setIsLoading(true);
      try {
        // Build query to find related bracelets based on similarity
        let query = `*[_type == "bracelet" && active == true && _id != "${currentBracelet._id}"`;

        // Create scobracelet system for relevance
        const conditions: string[] = [];

        // Same category gets highest priority
        if (currentBracelet.category) {
          conditions.push(`category == "${currentBracelet.category}"`);
        }

        // Same material gets second priority
        if (currentBracelet.material) {
          conditions.push(`material == "${currentBracelet.material}"`);
        }

        // Same stone gets third priority
        if (currentBracelet.stone) {
          conditions.push(`stone == "${currentBracelet.stone}"`);
        }

        // Same color gets fourth priority
        if (currentBracelet.color) {
          conditions.push(`color == "${currentBracelet.color}"`);
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
            ${currentBracelet.category ? `(category == "${currentBracelet.category}") * 4 +` : ''}
            ${currentBracelet.material ? `(material == "${currentBracelet.material}") * 3 +` : ''}
            ${currentBracelet.stone ? `(stone == "${currentBracelet.stone}") * 2 +` : ''}
            ${currentBracelet.color ? `(color == "${currentBracelet.color}") * 1 +` : ''}
            (featured == true) * 1
          )
        } | order(relevanceScore desc, _createdAt desc)[0...${maxItems * 2}]`;

        const result = await client.fetch(query);

        // If we don't have enough related items, fetch some random popular ones
        if (result.length < maxItems) {
          const additionalQuery = `*[_type == "bracelet" && active == true && _id != "${currentBracelet._id}" && !(_id in [${result.map((r: Bracelet) => `"${r._id}"`).join(', ')}])] | order(featured desc, _createdAt desc)[0...${maxItems - result.length}] {
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
          setRelatedBracelets(
            [...result, ...additionalItems].slice(0, maxItems)
          );
        } else {
          setRelatedBracelets(result.slice(0, maxItems));
        }
      } catch (error) {
        console.error('Error fetching related bracelets:', error);
        setRelatedBracelets([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRelatedBracelets();
  }, [currentBracelet, maxItems]);

  // Cart and Wishlist handlers - same as BraceletListing
  const handleAddToBag = (e: React.MouseEvent, bracelet: Bracelet) => {
    e.preventDefault();
    e.stopPropagation();

    if (!bracelet.inStock) return;

    const cartItem = braceletToCartItem(bracelet);
    addToCart(cartItem);
    openCart();
  };

  const handleToggleWishlist = (e: React.MouseEvent, bracelet: Bracelet) => {
    e.preventDefault();
    e.stopPropagation();

    const isWishlisted = isInWishlist(bracelet._id, bracelet.size);

    if (isWishlisted) {
      removeFromWishlist(bracelet._id, bracelet.size);
    } else {
      const wishlistItem = braceletToWishlistItem(bracelet);
      addToWishlist(wishlistItem);
    }
  };

  const getImageUrl = (bracelet: Bracelet) => {
    if (
      bracelet.mainImageUrl &&
      typeof bracelet.mainImageUrl === 'string' &&
      bracelet.mainImageUrl.trim() !== ''
    ) {
      return bracelet.mainImageUrl;
    }

    if (
      bracelet.imageUrls &&
      Array.isArray(bracelet.imageUrls) &&
      bracelet.imageUrls.length > 0
    ) {
      const firstUrl = bracelet.imageUrls[0];
      if (typeof firstUrl === 'string' && firstUrl.trim() !== '') {
        return firstUrl;
      }
    }

    return null;
  };

  const getVisibleItems = () => {
    // Responsive logic: show different number of items based on screen size
    // This will be handled by CSS grid, but we'll prepare the data
    return relatedBracelets;
  };

  const nextSlide = () => {
    const maxIndex = Math.max(0, relatedBracelets.length - 4);
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

  if (relatedBracelets.length === 0) {
    return null;
  }

  return (
    <div className="w-full py-12">
      <h2 className="text-2xl mb-8 font-normal">{title}</h2>

      {/* Desktop and Tablet View */}
      <div className="hidden sm:block">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {getVisibleItems().map((bracelet) => {
            const imageUrl = getImageUrl(bracelet);
            const isWishlisted = isInWishlist(bracelet._id, bracelet.size);

            return (
              <div key={bracelet._id} className="group">
                <Link href={`/bracelets/${bracelet.slug.current}`}>
                  <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4 cursor-pointer">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={bracelet.name}
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

                    {!bracelet.inStock && (
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
                      onClick={(e) => handleToggleWishlist(e, bracelet)}
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
                      onClick={(e) => handleAddToBag(e, bracelet)}
                      disabled={!bracelet.inStock}
                    >
                      {bracelet.inStock ? 'Add to bag' : 'Out of Stock'}
                    </button>
                  </div>
                </Link>

                <Link href={`/bracelets/${bracelet.slug.current}`}>
                  <div className="cursor-pointer">
                    <h3 className="font-semibold text-base mb-1 hover:text-gray-600 transition-colors line-clamp-2">
                      {bracelet.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-1">
                      {bracelet.material}
                      {bracelet.stone && `, ${bracelet.stone}`}
                      {bracelet.size && ` - Size ${bracelet.size}`}
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-800 font-medium text-sm">
                        {bracelet.currency === 'GBP'
                          ? '£'
                          : bracelet.currency === 'USD'
                            ? '$'
                            : '€'}
                        {bracelet.price}
                      </span>
                      {bracelet.originalPrice && (
                        <span className="text-gray-400 line-through text-sm">
                          {bracelet.currency === 'GBP'
                            ? '£'
                            : bracelet.currency === 'USD'
                              ? '$'
                              : '€'}
                          {bracelet.originalPrice}
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
                width: `${relatedBracelets.length * 100}%`,
              }}
            >
              {relatedBracelets.map((bracelet) => {
                const imageUrl = getImageUrl(bracelet);
                const isWishlisted = isInWishlist(bracelet._id, bracelet.size);

                return (
                  <div
                    key={bracelet._id}
                    className="group px-2"
                    style={{ width: `${100 / relatedBracelets.length}%` }}
                  >
                    <Link href={`/bracelets/${bracelet.slug.current}`}>
                      <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4 cursor-pointer">
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={bracelet.name}
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

                        {!bracelet.inStock && (
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
                          onClick={(e) => handleToggleWishlist(e, bracelet)}
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
                          onClick={(e) => handleAddToBag(e, bracelet)}
                          disabled={!bracelet.inStock}
                        >
                          {bracelet.inStock ? 'Add' : 'Out'}
                        </button>
                      </div>
                    </Link>

                    <Link href={`/bracelets/${bracelet.slug.current}`}>
                      <div className="cursor-pointer">
                        <h3 className="font-semibold text-base mb-1 hover:text-gray-600 transition-colors line-clamp-2">
                          {bracelet.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2 line-clamp-1">
                          {bracelet.material}
                          {bracelet.stone && `, ${bracelet.stone}`}
                        </p>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-800 font-medium text-sm">
                            {bracelet.currency === 'GBP'
                              ? '£'
                              : bracelet.currency === 'USD'
                                ? '$'
                                : '€'}
                            {bracelet.price}
                          </span>
                          {bracelet.originalPrice && (
                            <span className="text-gray-400 line-through text-sm">
                              {bracelet.currency === 'GBP'
                                ? '£'
                                : bracelet.currency === 'USD'
                                  ? '$'
                                  : '€'}
                              {bracelet.originalPrice}
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
          {relatedBracelets.length > 1 && (
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
                disabled={currentIndex >= relatedBracelets.length - 1}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full p-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-colors z-10"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Dots Indicator for Mobile */}
          {relatedBracelets.length > 1 && (
            <div className="flex justify-center space-x-2 mt-4">
              {relatedBracelets.map((_, index) => (
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
