'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { client } from '@/lib/sanity';
import { useCartStore } from '@/stores/cart-store';
import { useWishlistStore } from '@/stores/wishlist-store';
import Image from 'next/image';
import Link from 'next/link';

// Import product types and helpers
import { Ring } from '@/types/rings';
import { Earring } from '@/types/earrings';
import { Necklace } from '@/types/necklaces';
import { Bracelet } from '@/types/bracelets';
import {
  productToCartItem,
  productToWishlistItem,
} from '@/lib/product-helpers';

// Union type for all products
type Product = Ring | Earring | Necklace | Bracelet;

const PRODUCTS_PER_PAGE = 12;

const SearchPage: React.FC = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  // Cart and Wishlist stores
  const { addItem: addToCart, openCart } = useCartStore();
  const {
    addItem: addToWishlist,
    removeItem: removeFromWishlist,
    isInWishlist,
  } = useWishlistStore();

  // Search function
  const searchProducts = useCallback(
    async (searchQuery: string, page: number = 1, filter: string = 'all') => {
      if (!searchQuery.trim()) return;

      setIsLoading(true);
      try {
        const start = (page - 1) * PRODUCTS_PER_PAGE;

        let results: Product[] = [];
        let total = 0;

        const productTypes =
          filter === 'all'
            ? ['ring', 'earring', 'necklace', 'bracelet']
            : [filter];

        for (const productType of productTypes) {
          const searchQuerySanity = `*[_type == "${productType}" && active == true && (
          name match "*${searchQuery}*" ||
          material match "*${searchQuery}*" ||
          stone match "*${searchQuery}*" ||
          color match "*${searchQuery}*" ||
          category match "*${searchQuery}*"
        )] {
          _id,
          _type,
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
        } | order(_createdAt desc)`;

          const typeResults = await client.fetch(searchQuerySanity);
          results = [...results, ...typeResults];

          // Get count for this type
          const countQuery = `count(*[_type == "${productType}" && active == true && (
          name match "*${searchQuery}*" ||
          material match "*${searchQuery}*" ||
          stone match "*${searchQuery}*" ||
          color match "*${searchQuery}*" ||
          category match "*${searchQuery}*"
        )])`;
          const typeCount = await client.fetch(countQuery);
          total += typeCount;
        }

        // Sort by relevance (featured first, then by creation date)
        results.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return (
            new Date(b._createdAt).getTime() - new Date(a._createdAt).getTime()
          );
        });

        // Paginate results
        const paginatedResults = results.slice(
          start,
          start + PRODUCTS_PER_PAGE
        );

        setProducts(paginatedResults);
        setTotalCount(total);
        setTotalPages(Math.ceil(total / PRODUCTS_PER_PAGE));
      } catch (error) {
        console.error('Error searching products:', error);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (query) {
      searchProducts(query, currentPage, selectedFilter);
    }
  }, [query, currentPage, selectedFilter, searchProducts]);

  // Cart and Wishlist handlers
  const handleAddToBag = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();

    if (!product.inStock) return;

    const cartItem = productToCartItem(product);
    // Add productId and ensure required string properties have values
    addToCart({
      ...cartItem,
      productId: product._id,
      material: cartItem.material || '',
      stone: cartItem.stone || '',
      category: cartItem.category || '',
    });
    openCart();
  };

  const handleToggleWishlist = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();

    const isWishlisted = isInWishlist(product._id, product.size);

    if (isWishlisted) {
      removeFromWishlist(product._id, product.size);
    } else {
      const wishlistItem = productToWishlistItem(product);
      // Add productId and ensure required string properties have values (only include properties that exist in WishlistItem)
      addToWishlist({
        ...wishlistItem,
        productId: product._id,
        material: wishlistItem.material || '',
        stone: wishlistItem.stone || '',
        category: wishlistItem.category || '',
      });
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

  const getProductUrl = (product: Product) => {
    const type = product._type;
    const pluralType =
      type === 'earring'
        ? 'earrings'
        : type === 'necklace'
          ? 'necklaces'
          : type === 'bracelet'
            ? 'bracelets'
            : 'rings';
    return `/${pluralType}/${product.slug.current}`;
  };

  // Pagination component
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 7;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, '...', totalPages - 1, totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, 2, '...', totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(
          1,
          '...',
          currentPage - 1,
          currentPage,
          currentPage + 1,
          '...',
          totalPages
        );
      }
    }

    return (
      <div className="flex justify-center items-center gap-2 mt-12 px-4">
        <button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors flex-shrink-0"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
          {pages.map((page, index) => (
            <button
              key={index}
              onClick={() =>
                typeof page === 'number' ? setCurrentPage(page) : null
              }
              disabled={typeof page !== 'number'}
              className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors flex-shrink-0 ${
                page === currentPage
                  ? 'bg-yellow-400 text-black font-medium'
                  : typeof page === 'number'
                    ? 'border border-gray-300 hover:bg-gray-50 text-gray-700'
                    : 'cursor-default text-gray-400'
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors flex-shrink-0"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    );
  };

  if (!query) {
    return (
      <div className="min-h-screen w-full overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Search Products</h1>
            <p className="text-gray-500">
              Enter a search term to find products
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-600 mb-4 truncate">
          <span>Home</span> / <span>Search Results</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 break-words">
            Search Results for &quot;{query}&quot;
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            {totalCount} {totalCount === 1 ? 'product' : 'products'} found
          </p>
        </div>

        {/* Filter Tabs - Horizontal scroll on mobile */}
        <div className="mb-8 w-full overflow-x-hidden">
          <div className="flex space-x-4 border-b border-gray-200 overflow-x-auto scrollbar-hide pb-0">
            {[
              { key: 'all', label: 'All Products' },
              { key: 'earring', label: 'Earrings' },
              { key: 'necklace', label: 'Necklaces' },
              { key: 'bracelet', label: 'Bracelets' },
              { key: 'ring', label: 'Rings' },
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => {
                  setSelectedFilter(filter.key);
                  setCurrentPage(1);
                }}
                className={`pb-4 px-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap flex-shrink-0 ${
                  selectedFilter === filter.key
                    ? 'border-yellow-400 text-black'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(12)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {products.map((product) => {
                const imageUrl = getImageUrl(product);
                const productUrl = getProductUrl(product);
                const isWishlisted = isInWishlist(product._id, product.size);

                return (
                  <div
                    key={`${product._type}-${product._id}`}
                    className="group w-full min-w-0"
                  >
                    <Link href={productUrl}>
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
                            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-3 py-2 max-w-[90%]">
                              <span className="text-white font-medium text-xs sm:text-sm tracking-wide">
                                Out of Stock
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Product Type Badge */}
                        <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded text-xs font-medium capitalize">
                          {product._type}
                        </div>

                        {/* Wishlist Button */}
                        <button
                          className="absolute top-2 sm:top-4 right-2 sm:right-4 w-8 h-8 sm:w-10 sm:h-10 bg-white/80 backdrop-blur-sm hover:bg-white rounded-full flex items-center justify-center transition-colors z-10"
                          onClick={(e) => handleToggleWishlist(e, product)}
                        >
                          <Heart
                            className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors ${
                              isWishlisted
                                ? 'fill-red-500 text-red-500'
                                : 'text-gray-600'
                            }`}
                          />
                        </button>

                        <button
                          className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 bg-yellow-400 text-black px-3 py-2 sm:px-4 rounded-xl text-xs sm:text-sm font-medium hover:bg-yellow-500 transition-colors z-10 disabled:bg-gray-300 disabled:cursor-not-allowed max-w-[calc(100%-1rem)]"
                          onClick={(e) => handleAddToBag(e, product)}
                          disabled={!product.inStock}
                        >
                          <span className="truncate">
                            {product.inStock ? 'Add to bag' : 'Out of Stock'}
                          </span>
                        </button>
                      </div>
                    </Link>

                    <Link href={productUrl}>
                      <div className="cursor-pointer min-w-0">
                        <h3 className="font-semibold text-base sm:text-lg mb-1 hover:text-gray-600 transition-colors truncate">
                          {product.name}
                        </h3>
                        <p className="text-gray-600 text-xs sm:text-sm mb-2 truncate">
                          {product.material}, {product.stone}
                          {product.size && `, Size ${product.size}`}
                        </p>
                        <div className="flex items-center space-x-2 min-w-0">
                          <span className="text-gray-600 text-sm flex-shrink-0">
                            {product.currency === 'GBP'
                              ? '£'
                              : product.currency === 'USD'
                                ? '$'
                                : '€'}
                            {product.price}
                          </span>
                          {product.originalPrice && (
                            <span className="text-gray-400 line-through text-sm flex-shrink-0">
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

            {/* Pagination */}
            {renderPagination()}
          </>
        ) : (
          <div className="text-center py-12 px-4">
            <h2 className="text-xl font-semibold mb-4">No products found</h2>
            <p className="text-gray-500 mb-6 break-words">
              We couldn&apos;t find any products matching &quot;{query}&quot;.
              Try adjusting your search terms.
            </p>
            <div className="text-sm text-gray-600 max-w-md mx-auto">
              <p className="mb-2">Search tips:</p>
              <ul className="list-disc list-inside space-y-1 text-left">
                <li>Check your spelling</li>
                <li>Try more general keywords</li>
                <li>Search by material, stone, or color</li>
                <li>Browse our categories instead</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
