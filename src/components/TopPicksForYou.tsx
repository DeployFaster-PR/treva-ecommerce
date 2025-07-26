'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { Ring } from '@/types/rings';
import { Necklace } from '@/types/necklaces';
import { Earring } from '@/types/earrings';
import { Bracelet } from '@/types/bracelets';
import { client } from '@/lib/sanity';
import { useCartStore } from '@/stores/cart-store';
import { useWishlistStore } from '@/stores/wishlist-store';
import {
  ringToCartItem,
  ringToWishlistItem,
  necklaceToCartItem,
  necklaceToWishlistItem,
  earringToCartItem,
  earringToWishlistItem,
  braceletToCartItem,
  braceletToWishlistItem,
} from '@/lib/product-helpers';
import Image from 'next/image';
import Link from 'next/link';

// Union type for all products
type Product = Ring | Necklace | Earring | Bracelet;

interface TopPicksForYouProps {
  maxItems?: number;
  title?: string;
}

interface ProductWithType {
  product: Product;
  productType: 'ring' | 'necklace' | 'earring' | 'bracelet';
  linkPath: string;
}

const TopPicksForYou: React.FC<TopPicksForYouProps> = ({
  maxItems = 3,
  title = 'Top Picks for You',
}) => {
  const [topPicks, setTopPicks] = useState<ProductWithType[]>([]);
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
    const fetchTopPicks = async () => {
      setIsLoading(true);
      try {
        // Fetch one featured product from each category with higher preference for featured items
        const queries = [
          // Rings query
          `*[_type == "ring" && active == true && inStock == true] | order(featured desc, _createdAt desc)[0] {
            _id, _type, name, slug, price, originalPrice, currency, mainImageUrl, imageUrls,
            inStock, material, stone, color, size, category, featured, _createdAt
          }`,

          // Necklaces query
          `*[_type == "necklace" && active == true && inStock == true] | order(featured desc, _createdAt desc)[0] {
            _id, _type, name, slug, price, originalPrice, currency, mainImageUrl, imageUrls,
            inStock, material, stone, color, size, category, featured, _createdAt
          }`,

          // Earrings query
          `*[_type == "earring" && active == true && inStock == true] | order(featured desc, _createdAt desc)[0] {
            _id, _type, name, slug, price, originalPrice, currency, mainImageUrl, imageUrls,
            inStock, material, stone, color, size, category, featured, _createdAt
          }`,

          // Bracelets query
          `*[_type == "bracelet" && active == true && inStock == true] | order(featured desc, _createdAt desc)[0] {
            _id, _type, name, slug, price, originalPrice, currency, mainImageUrl, imageUrls,
            inStock, material, stone, color, size, category, featured, _createdAt
          }`,
        ];

        const results = await Promise.all(
          queries.map((query) => client.fetch(query))
        );

        const productsWithType: ProductWithType[] = [];

        // Process results and add type information
        if (results[0]) {
          productsWithType.push({
            product: results[0] as Ring,
            productType: 'ring',
            linkPath: `/rings/${results[0].slug.current}`,
          });
        }

        if (results[1]) {
          productsWithType.push({
            product: results[1] as Necklace,
            productType: 'necklace',
            linkPath: `/necklaces/${results[1].slug.current}`,
          });
        }

        if (results[2]) {
          productsWithType.push({
            product: results[2] as Earring,
            productType: 'earring',
            linkPath: `/earrings/${results[2].slug.current}`,
          });
        }

        if (results[3]) {
          productsWithType.push({
            product: results[3] as Bracelet,
            productType: 'bracelet',
            linkPath: `/bracelets/${results[3].slug.current}`,
          });
        }

        // Shuffle and limit to maxItems
        const shuffled = productsWithType.sort(() => 0.5 - Math.random());
        setTopPicks(shuffled.slice(0, maxItems));
      } catch (error) {
        console.error('Error fetching top picks:', error);
        setTopPicks([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopPicks();
  }, [maxItems]);

  // Helper functions for cart and wishlist operations
  const getCartItem = (product: Product, productType: string) => {
    switch (productType) {
      case 'ring':
        return ringToCartItem(product as Ring);
      case 'necklace':
        return necklaceToCartItem(product as Necklace);
      case 'earring':
        return earringToCartItem(product as Earring);
      case 'bracelet':
        return braceletToCartItem(product as Bracelet);
      default:
        throw new Error('Unknown product type');
    }
  };

  const getWishlistItem = (product: Product, productType: string) => {
    switch (productType) {
      case 'ring':
        return ringToWishlistItem(product as Ring);
      case 'necklace':
        return necklaceToWishlistItem(product as Necklace);
      case 'earring':
        return earringToWishlistItem(product as Earring);
      case 'bracelet':
        return braceletToWishlistItem(product as Bracelet);
      default:
        throw new Error('Unknown product type');
    }
  };

  const handleAddToBag = (
    e: React.MouseEvent,
    productWithType: ProductWithType
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (!productWithType.product.inStock) return;

    const cartItem = getCartItem(
      productWithType.product,
      productWithType.productType
    );
    addToCart(cartItem);
    openCart();
  };

  const handleToggleWishlist = (
    e: React.MouseEvent,
    productWithType: ProductWithType
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const { product } = productWithType;
    const isWishlisted = isInWishlist(product._id, product.size);

    if (isWishlisted) {
      removeFromWishlist(product._id, product.size);
    } else {
      const wishlistItem = getWishlistItem(
        product,
        productWithType.productType
      );
      addToWishlist(wishlistItem);
    }
  };

  const getImageUrl = (product: Product) => {
    if (
      product.mainImageUrl &&
      typeof product.mainImageUrl === 'string' &&
      product.mainImageUrl.trim() !== ''
    ) {
      return product.mainImageUrl;
    }

    if (
      product.imageUrls &&
      Array.isArray(product.imageUrls) &&
      product.imageUrls.length > 0
    ) {
      const firstUrl = product.imageUrls[0];
      if (typeof firstUrl === 'string' && firstUrl.trim() !== '') {
        return firstUrl;
      }
    }

    return null;
  };

  const formatProductDetails = (product: Product) => {
    let details = product.material;
    if (product.stone && product.stone !== 'None') {
      details += `, ${product.stone}`;
    }

    // Handle different size formats
    if (product.size) {
      if (product._type === 'necklace') {
        details += ` - ${product.size}`;
      } else {
        details += ` - Size ${product.size}`;
      }
    }

    return details;
  };

  const nextSlide = () => {
    const maxIndex = Math.max(0, topPicks.length - 1);
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  if (isLoading) {
    return (
      <div className="w-full py-12">
        <h2 className="text-2xl font-bold mb-8 text-center">{title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, index) => (
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

  if (topPicks.length === 0) {
    return null;
  }

  return (
    <div className="w-full py-12 px-8 md:px-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-normal">{title}</h2>

        {/* Desktop Navigation */}
        <div className="hidden sm:flex items-center space-x-2">
          {topPicks.length > 3 && (
            <>
              <button
                onClick={prevSlide}
                disabled={currentIndex === 0}
                className="p-2 rounded-full border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex space-x-1">
                {Array.from(
                  { length: Math.ceil(topPicks.length / 3) },
                  (_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentIndex(i * 3)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        Math.floor(currentIndex / 3) === i
                          ? 'bg-yellow-400'
                          : 'bg-gray-300'
                      }`}
                    />
                  )
                )}
              </div>

              <button
                onClick={nextSlide}
                disabled={currentIndex >= topPicks.length - 3}
                className="p-2 rounded-full border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Desktop and Tablet View */}
      <div className="hidden sm:block">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {topPicks
            .slice(currentIndex, currentIndex + 3)
            .map((productWithType) => {
              const { product, linkPath } = productWithType;
              const imageUrl = getImageUrl(product);
              const isWishlisted = isInWishlist(product._id, product.size);

              return (
                <div key={product._id} className="group">
                  <Link href={linkPath}>
                    <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4 cursor-pointer">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={product.name}
                          width={400}
                          height={400}
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

                      {!product.inStock && (
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
                        onClick={(e) =>
                          handleToggleWishlist(e, productWithType)
                        }
                      >
                        <Heart
                          className={`w-4 h-4 transition-colors ${
                            isWishlisted
                              ? 'fill-red-500 text-red-500'
                              : 'text-gray-600'
                          }`}
                        />
                      </button>

                      {/* Add to Bag Button */}
                      <button
                        className="absolute bottom-3 cursor-pointer right-3 bg-yellow-400 text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-500 transition-colors z-10 disabled:bg-gray-300 disabled:cursor-not-allowed"
                        onClick={(e) => handleAddToBag(e, productWithType)}
                        disabled={!product.inStock}
                      >
                        {product.inStock ? 'Add to bag' : 'Out of Stock'}
                      </button>
                    </div>
                  </Link>

                  <Link href={linkPath}>
                    <div className="cursor-pointer">
                      <h3 className="font-semibold text-lg mb-1 hover:text-gray-600 transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2 line-clamp-1">
                        {formatProductDetails(product)}
                      </p>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-800 font-medium">
                          {product.currency === 'GBP'
                            ? '£'
                            : product.currency === 'USD'
                              ? '$'
                              : '€'}
                          {product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="text-gray-400 line-through text-sm">
                            {product.currency === 'GBP'
                              ? '£'
                              : product.currency === 'USD'
                                ? '$'
                                : '€'}
                            {product.originalPrice}
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
                width: `${topPicks.length * 100}%`,
              }}
            >
              {topPicks.map((productWithType) => {
                const { product, linkPath } = productWithType;
                const imageUrl = getImageUrl(product);
                const isWishlisted = isInWishlist(product._id, product.size);

                return (
                  <div
                    key={product._id}
                    className="group px-2"
                    style={{ width: `${100 / topPicks.length}%` }}
                  >
                    <Link href={linkPath}>
                      <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4 cursor-pointer">
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={product.name}
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

                        {!product.inStock && (
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
                          onClick={(e) =>
                            handleToggleWishlist(e, productWithType)
                          }
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
                          onClick={(e) => handleAddToBag(e, productWithType)}
                          disabled={!product.inStock}
                        >
                          {product.inStock ? 'Add' : 'Out'}
                        </button>
                      </div>
                    </Link>

                    <Link href={linkPath}>
                      <div className="cursor-pointer">
                        <h3 className="font-semibold text-base mb-1 hover:text-gray-600 transition-colors line-clamp-2">
                          {product.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2 line-clamp-1">
                          {formatProductDetails(product)}
                        </p>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-800 font-medium text-sm">
                            {product.currency === 'GBP'
                              ? '£'
                              : product.currency === 'USD'
                                ? '$'
                                : '€'}
                            {product.price}
                          </span>
                          {product.originalPrice && (
                            <span className="text-gray-400 line-through text-sm">
                              {product.currency === 'GBP'
                                ? '£'
                                : product.currency === 'USD'
                                  ? '$'
                                  : '€'}
                              {product.originalPrice}
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
          {topPicks.length > 1 && (
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
                disabled={currentIndex >= topPicks.length - 1}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full p-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-colors z-10"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Dots Indicator for Mobile */}
          {topPicks.length > 1 && (
            <div className="flex justify-center space-x-2 mt-4">
              {topPicks.map((_, index) => (
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

export default TopPicksForYou;
