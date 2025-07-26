'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { Necklace } from '@/types/necklaces';
import { client } from '@/lib/sanity';
import { useCartStore } from '@/stores/cart-store';
import { useWishlistStore } from '@/stores/wishlist-store';
import {
  necklaceToCartItem,
  necklaceToWishlistItem,
} from '@/lib/product-helpers';
import Image from 'next/image';
import Link from 'next/link';

interface YouMayAlsoLikeProps {
  currentNecklace: Necklace;
  maxItems?: number;
  title?: string;
}

const YouMayAlsoLike: React.FC<YouMayAlsoLikeProps> = ({
  currentNecklace,
  maxItems = 8,
  title = 'You may also like',
}) => {
  const [relatedNecklaces, setRelatedNecklaces] = useState<Necklace[]>([]);
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
    const fetchRelatedNecklaces = async () => {
      setIsLoading(true);
      try {
        // Build query to find related necklaces based on similarity
        let query = `*[_type == "necklace" && active == true && _id != "${currentNecklace._id}"`;

        // Create sconecklace system for relevance
        const conditions: string[] = [];

        // Same category gets highest priority
        if (currentNecklace.category) {
          conditions.push(`category == "${currentNecklace.category}"`);
        }

        // Same material gets second priority
        if (currentNecklace.material) {
          conditions.push(`material == "${currentNecklace.material}"`);
        }

        // Same stone gets third priority
        if (currentNecklace.stone) {
          conditions.push(`stone == "${currentNecklace.stone}"`);
        }

        // Same color gets fourth priority
        if (currentNecklace.color) {
          conditions.push(`color == "${currentNecklace.color}"`);
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
            ${currentNecklace.category ? `(category == "${currentNecklace.category}") * 4 +` : ''}
            ${currentNecklace.material ? `(material == "${currentNecklace.material}") * 3 +` : ''}
            ${currentNecklace.stone ? `(stone == "${currentNecklace.stone}") * 2 +` : ''}
            ${currentNecklace.color ? `(color == "${currentNecklace.color}") * 1 +` : ''}
            (featured == true) * 1
          )
        } | order(relevanceScore desc, _createdAt desc)[0...${maxItems * 2}]`;

        const result = await client.fetch(query);

        // If we don't have enough related items, fetch some random popular ones
        if (result.length < maxItems) {
          const additionalQuery = `*[_type == "necklace" && active == true && _id != "${currentNecklace._id}" && !(_id in [${result.map((r: Necklace) => `"${r._id}"`).join(', ')}])] | order(featured desc, _createdAt desc)[0...${maxItems - result.length}] {
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
          setRelatedNecklaces(
            [...result, ...additionalItems].slice(0, maxItems)
          );
        } else {
          setRelatedNecklaces(result.slice(0, maxItems));
        }
      } catch (error) {
        console.error('Error fetching related necklaces:', error);
        setRelatedNecklaces([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRelatedNecklaces();
  }, [currentNecklace, maxItems]);

  // Cart and Wishlist handlers - same as NecklaceListing
  const handleAddToBag = (e: React.MouseEvent, necklace: Necklace) => {
    e.preventDefault();
    e.stopPropagation();

    if (!necklace.inStock) return;

    const cartItem = necklaceToCartItem(necklace);
    addToCart(cartItem);
    openCart();
  };

  const handleToggleWishlist = (e: React.MouseEvent, necklace: Necklace) => {
    e.preventDefault();
    e.stopPropagation();

    const isWishlisted = isInWishlist(necklace._id, necklace.size);

    if (isWishlisted) {
      removeFromWishlist(necklace._id, necklace.size);
    } else {
      const wishlistItem = necklaceToWishlistItem(necklace);
      addToWishlist(wishlistItem);
    }
  };

  const getImageUrl = (necklace: Necklace) => {
    if (
      necklace.mainImageUrl &&
      typeof necklace.mainImageUrl === 'string' &&
      necklace.mainImageUrl.trim() !== ''
    ) {
      return necklace.mainImageUrl;
    }

    if (
      necklace.imageUrls &&
      Array.isArray(necklace.imageUrls) &&
      necklace.imageUrls.length > 0
    ) {
      const firstUrl = necklace.imageUrls[0];
      if (typeof firstUrl === 'string' && firstUrl.trim() !== '') {
        return firstUrl;
      }
    }

    return null;
  };

  const getVisibleItems = () => {
    // Responsive logic: show different number of items based on screen size
    // This will be handled by CSS grid, but we'll prepare the data
    return relatedNecklaces;
  };

  const nextSlide = () => {
    const maxIndex = Math.max(0, relatedNecklaces.length - 4);
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

  if (relatedNecklaces.length === 0) {
    return null;
  }

  return (
    <div className="w-full py-12">
      <h2 className="text-2xl mb-8 font-normal">{title}</h2>

      {/* Desktop and Tablet View */}
      <div className="hidden sm:block">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {getVisibleItems().map((necklace) => {
            const imageUrl = getImageUrl(necklace);
            const isWishlisted = isInWishlist(necklace._id, necklace.size);

            return (
              <div key={necklace._id} className="group">
                <Link href={`/necklaces/${necklace.slug.current}`}>
                  <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4 cursor-pointer">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={necklace.name}
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

                    {!necklace.inStock && (
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
                      onClick={(e) => handleToggleWishlist(e, necklace)}
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
                      onClick={(e) => handleAddToBag(e, necklace)}
                      disabled={!necklace.inStock}
                    >
                      {necklace.inStock ? 'Add to bag' : 'Out of Stock'}
                    </button>
                  </div>
                </Link>

                <Link href={`/necklaces/${necklace.slug.current}`}>
                  <div className="cursor-pointer">
                    <h3 className="font-semibold text-base mb-1 hover:text-gray-600 transition-colors line-clamp-2">
                      {necklace.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-1">
                      {necklace.material}
                      {necklace.stone && `, ${necklace.stone}`}
                      {necklace.size && ` - Size ${necklace.size}`}
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-800 font-medium text-sm">
                        {necklace.currency === 'GBP'
                          ? '£'
                          : necklace.currency === 'USD'
                            ? '$'
                            : '€'}
                        {necklace.price}
                      </span>
                      {necklace.originalPrice && (
                        <span className="text-gray-400 line-through text-sm">
                          {necklace.currency === 'GBP'
                            ? '£'
                            : necklace.currency === 'USD'
                              ? '$'
                              : '€'}
                          {necklace.originalPrice}
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
                width: `${relatedNecklaces.length * 100}%`,
              }}
            >
              {relatedNecklaces.map((necklace) => {
                const imageUrl = getImageUrl(necklace);
                const isWishlisted = isInWishlist(necklace._id, necklace.size);

                return (
                  <div
                    key={necklace._id}
                    className="group px-2"
                    style={{ width: `${100 / relatedNecklaces.length}%` }}
                  >
                    <Link href={`/necklaces/${necklace.slug.current}`}>
                      <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4 cursor-pointer">
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={necklace.name}
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

                        {!necklace.inStock && (
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
                          onClick={(e) => handleToggleWishlist(e, necklace)}
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
                          onClick={(e) => handleAddToBag(e, necklace)}
                          disabled={!necklace.inStock}
                        >
                          {necklace.inStock ? 'Add' : 'Out'}
                        </button>
                      </div>
                    </Link>

                    <Link href={`/necklaces/${necklace.slug.current}`}>
                      <div className="cursor-pointer">
                        <h3 className="font-semibold text-base mb-1 hover:text-gray-600 transition-colors line-clamp-2">
                          {necklace.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2 line-clamp-1">
                          {necklace.material}
                          {necklace.stone && `, ${necklace.stone}`}
                        </p>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-800 font-medium text-sm">
                            {necklace.currency === 'GBP'
                              ? '£'
                              : necklace.currency === 'USD'
                                ? '$'
                                : '€'}
                            {necklace.price}
                          </span>
                          {necklace.originalPrice && (
                            <span className="text-gray-400 line-through text-sm">
                              {necklace.currency === 'GBP'
                                ? '£'
                                : necklace.currency === 'USD'
                                  ? '$'
                                  : '€'}
                              {necklace.originalPrice}
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
          {relatedNecklaces.length > 1 && (
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
                disabled={currentIndex >= relatedNecklaces.length - 1}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full p-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-colors z-10"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Dots Indicator for Mobile */}
          {relatedNecklaces.length > 1 && (
            <div className="flex justify-center space-x-2 mt-4">
              {relatedNecklaces.map((_, index) => (
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
