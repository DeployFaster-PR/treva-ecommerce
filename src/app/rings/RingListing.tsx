'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  ChevronDown,
  ChevronUp,
  X,
  ChevronLeft,
  ChevronRight,
  Heart,
} from 'lucide-react';
import {
  Ring,
  RingFilters,
  RingsSortBy,
  RING_CATEGORIES,
  RING_MATERIALS,
  RING_STONES,
  RING_COLORS,
  RING_SIZES,
  RING_PRICE_RANGES,
  RING_SORT_OPTIONS,
  CATEGORY_IMAGES,
} from '@/types/rings';
import { client } from '@/lib/sanity';
import { useCartStore } from '@/stores/cart-store';
import { useWishlistStore } from '@/stores/wishlist-store';
import { ringToCartItem, ringToWishlistItem } from '@/lib/product-helpers';
import Image from 'next/image';
import Link from 'next/link';

interface RingListingProps {
  initialRings: Ring[];
  totalCount: number;
}

const PRODUCTS_PER_PAGE = 12;

const RingListing: React.FC<RingListingProps> = ({
  initialRings,
  totalCount,
}) => {
  const [rings, setRings] = useState<Ring[]>(initialRings);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(
    Math.ceil(totalCount / PRODUCTS_PER_PAGE)
  );
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState<RingsSortBy>('NEW ARRIVALS');
  const [isLoading, setIsLoading] = useState(false);

  // Cart and Wishlist stores
  const { addItem: addToCart, openCart } = useCartStore();
  const {
    addItem: addToWishlist,
    removeItem: removeFromWishlist,
    isInWishlist,
  } = useWishlistStore();

  // Filter expansion states
  const [expandedFilters, setExpandedFilters] = useState({
    availability: false,
    material: false,
    stone: false,
    color: false,
    size: false,
    price: false,
  });

  const [filters, setFilters] = useState<RingFilters>({
    availability: undefined,
    material: [],
    stone: [],
    color: [],
    size: [],
    priceRange: [],
    category: [],
    inStock: undefined,
  });

  const sortOptions = RING_SORT_OPTIONS;

  // Cart and Wishlist handlers
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

  // Fetch rings based on filters and sort
  const fetchRings = useCallback(
    async (page: number = 1) => {
      setIsLoading(true);
      try {
        let query = `*[_type == "ring" && active == true`;

        // Add filters to query
        if (filters.inStock) {
          query += ` && inStock == true`;
        }

        if (filters.material && filters.material.length > 0) {
          query += ` && material in [${filters.material.map((m) => `"${m}"`).join(', ')}]`;
        }

        if (filters.stone && filters.stone.length > 0) {
          query += ` && stone in [${filters.stone.map((s) => `"${s}"`).join(', ')}]`;
        }

        if (filters.color && filters.color.length > 0) {
          query += ` && color in [${filters.color.map((c) => `"${c}"`).join(', ')}]`;
        }

        if (filters.size && filters.size.length > 0) {
          query += ` && size in [${filters.size.map((s) => `"${s}"`).join(', ')}]`;
        }

        if (filters.category && filters.category.length > 0) {
          query += ` && category in [${filters.category.map((c) => `"${c}"`).join(', ')}]`;
        }

        if (filters.priceRange && filters.priceRange.length > 0) {
          const priceConditions: string[] = [];

          filters.priceRange.forEach((range) => {
            // Extract numbers from strings like "£25 - £50"
            const numbers = range.match(/[\d.]+/g);
            if (numbers && numbers.length >= 2) {
              const min = parseFloat(numbers[0]);
              const max = parseFloat(numbers[1]);
              priceConditions.push(`(price >= ${min} && price <= ${max})`);
            } else if (range.toLowerCase().includes('over')) {
              const overNumber = range.match(/[\d.]+/);
              if (overNumber) {
                const min = parseFloat(overNumber[0]);
                priceConditions.push(`price >= ${min}`);
              }
            }
          });

          if (priceConditions.length > 0) {
            query += ` && (${priceConditions.join(' || ')})`;
          }
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
        _createdAt
      }`;

        // Add sorting
        switch (sortBy) {
          case 'NEW ARRIVALS':
            query += ` | order(_createdAt desc)`;
            break;
          case 'PRICE: LOW TO HIGH':
            query += ` | order(price asc)`;
            break;
          case 'PRICE: HIGH TO LOW':
            query += ` | order(price desc)`;
            break;
          case 'TOP MATCH':
            query += ` | order(featured desc, _createdAt desc)`;
            break;
        }

        const start = (page - 1) * PRODUCTS_PER_PAGE;
        const end = start + PRODUCTS_PER_PAGE;
        query += `[${start}...${end}]`;

        const result = await client.fetch(query);
        setRings(result);

        // Get total count
        const countQuery = query.split(']')[0] + ']';
        const total = await client.fetch(`count(${countQuery})`);
        setTotalPages(Math.ceil(total / PRODUCTS_PER_PAGE));
      } catch (error) {
        console.error('Error fetching rings:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [filters, sortBy]
  );

  useEffect(() => {
    fetchRings(currentPage);
  }, [fetchRings, filters, sortBy, currentPage]);

  const handleFilterChange = (
    filterType: keyof RingFilters,
    value: RingFilters[keyof RingFilters]
  ) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
    setCurrentPage(1);
  };

  const handleArrayFilterChange = (
    filterType: keyof RingFilters,
    value: string
  ) => {
    setFilters((prev) => {
      const currentValues = (prev[filterType] as string[]) || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];

      return {
        ...prev,
        [filterType]: newValues,
      };
    });
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      availability: undefined,
      material: [],
      stone: [],
      color: [],
      size: [],
      priceRange: [],
      category: [],
      inStock: undefined,
    });
    setCurrentPage(1);
  };

  const toggleFilterExpansion = (filterType: keyof typeof expandedFilters) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [filterType]: !prev[filterType],
    }));
  };

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
      <div className="flex justify-center items-center gap-2 mt-12">
        <button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {pages.map((page, index) => (
          <button
            key={index}
            onClick={() =>
              typeof page === 'number' ? setCurrentPage(page) : null
            }
            disabled={typeof page !== 'number'}
            className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
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

        <button
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    );
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600 mb-4">
        <span>Home</span> / <span>All Rings</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Rings</h1>
        <p className="text-gray-600">
          Find your perfect ring, Rings for every style, every occasion.
        </p>
      </div>

      {/* Category Navigation */}
      <div className="mb-8">
        {/* Desktop View */}
        <div className="hidden lg:grid lg:grid-cols-7 gap-2">
          {RING_CATEGORIES.map((category) => {
            const isActive = filters.category?.includes(category) || false;
            return (
              <div
                key={category}
                className={`relative cursor-pointer transition-all duration-200 ${
                  isActive ? 'ring-2 ring-green-800 ring-offset-2' : ''
                }`}
                onClick={() => handleArrayFilterChange('category', category)}
              >
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-200">
                  <Image
                    src={CATEGORY_IMAGES[category]}
                    alt={category}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div
                  className="absolute bottom-2 left-2 text-white text-sm font-medium"
                  style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}
                >
                  {category}
                </div>
              </div>
            );
          })}
        </div>

        {/* Tablet and Mobile View */}
        <div className="lg:hidden relative">
          <div
            className="flex gap-2 overflow-x-auto scrollbar-hide pb-2"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {RING_CATEGORIES.map((category, index) => {
              const isActive = filters.category?.includes(category) || false;
              return (
                <div
                  key={category}
                  className={`relative flex-none cursor-pointer transition-all duration-200 ${
                    isActive ? 'ring-2 ring-green-800 ring-offset-2' : ''
                  }`}
                  style={{
                    width: '120px',
                    marginRight:
                      index === RING_CATEGORIES.length - 1 ? '16px' : '0px',
                  }}
                  onClick={() => handleArrayFilterChange('category', category)}
                >
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-200">
                    <Image
                      src={CATEGORY_IMAGES[category]}
                      alt={category}
                      width={200}
                      height={200}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div
                    className="absolute bottom-2 left-2 text-white text-sm font-medium"
                    style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}
                  >
                    {category}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Fade indicator for scrollable content */}
          <div className="absolute top-0 right-0 w-8 h-full bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="border-t border-b border-gray-200 py-4 mb-8">
        <div className="flex justify-between items-center">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="text-sm font-medium cursor-pointer"
          >
            FILTER
          </button>

          <span className="text-sm text-gray-600">{rings.length} PRODUCTS</span>

          <div className="relative">
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="flex items-center space-x-2 text-sm font-medium"
            >
              <span>SORT BY</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${isSortOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {isSortOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                {sortOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setSortBy(option as RingsSortBy);
                      setIsSortOpen(false);
                    }}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${
                      sortBy === option
                        ? 'text-black font-medium'
                        : 'text-gray-600'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex gap-8">
        {/* Filter Sidebar */}
        {isFilterOpen && (
          <div className="w-64 flex-shrink-0">
            <div className="bg-white">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-lg">Filters</h3>
                <button onClick={() => setIsFilterOpen(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Availability Filter */}
              <div className="mb-6">
                <button
                  onClick={() => toggleFilterExpansion('availability')}
                  className="flex justify-between items-center w-full py-2 font-medium"
                >
                  <span>Availability</span>
                  {expandedFilters.availability ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
                {expandedFilters.availability && (
                  <div className="mt-3">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={filters.inStock === true}
                        onChange={(e) =>
                          handleFilterChange(
                            'inStock',
                            e.target.checked ? true : undefined
                          )
                        }
                        className="rounded"
                      />
                      <span className="text-sm">In stock only</span>
                    </label>
                  </div>
                )}
              </div>

              {/* Material Filter */}
              <div className="mb-6">
                <button
                  onClick={() => toggleFilterExpansion('material')}
                  className="flex justify-between items-center w-full py-2 font-medium"
                >
                  <span>Material</span>
                  {expandedFilters.material ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
                {expandedFilters.material && (
                  <div className="mt-3 space-y-2">
                    {RING_MATERIALS.map((material) => (
                      <label
                        key={material}
                        className="flex items-center space-x-2"
                      >
                        <input
                          type="checkbox"
                          checked={
                            filters.material?.includes(material) || false
                          }
                          onChange={() =>
                            handleArrayFilterChange('material', material)
                          }
                          className="rounded"
                        />
                        <span className="text-sm">{material}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Stone Filter */}
              <div className="mb-6">
                <button
                  onClick={() => toggleFilterExpansion('stone')}
                  className="flex justify-between items-center w-full py-2 font-medium"
                >
                  <span>Stone</span>
                  {expandedFilters.stone ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
                {expandedFilters.stone && (
                  <div className="mt-3 space-y-2">
                    {RING_STONES.map((stone) => (
                      <label
                        key={stone}
                        className="flex items-center space-x-2"
                      >
                        <input
                          type="checkbox"
                          checked={filters.stone?.includes(stone) || false}
                          onChange={() =>
                            handleArrayFilterChange('stone', stone)
                          }
                          className="rounded"
                        />
                        <span className="text-sm">{stone}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Color Filter */}
              <div className="mb-6">
                <button
                  onClick={() => toggleFilterExpansion('color')}
                  className="flex justify-between items-center w-full py-2 font-medium"
                >
                  <span>Color</span>
                  {expandedFilters.color ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
                {expandedFilters.color && (
                  <div className="mt-3 space-y-2">
                    {RING_COLORS.map((color) => (
                      <label
                        key={color}
                        className="flex items-center space-x-2"
                      >
                        <input
                          type="checkbox"
                          checked={filters.color?.includes(color) || false}
                          onChange={() =>
                            handleArrayFilterChange('color', color)
                          }
                          className="rounded"
                        />
                        <span className="text-sm">{color}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Size Filter */}
              <div className="mb-6">
                <button
                  onClick={() => toggleFilterExpansion('size')}
                  className="flex justify-between items-center w-full py-2 font-medium"
                >
                  <span>Size</span>
                  {expandedFilters.size ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
                {expandedFilters.size && (
                  <div className="mt-3 space-y-2">
                    {RING_SIZES.map((size) => (
                      <label key={size} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={filters.size?.includes(size) || false}
                          onChange={() => handleArrayFilterChange('size', size)}
                          className="rounded"
                        />
                        <span className="text-sm">Size {size}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Price Filter */}
              <div className="mb-6">
                <button
                  onClick={() => toggleFilterExpansion('price')}
                  className="flex justify-between items-center w-full py-2 font-medium"
                >
                  <span>Price</span>
                  {expandedFilters.price ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
                {expandedFilters.price && (
                  <div className="mt-3 space-y-2">
                    {RING_PRICE_RANGES.map((range) => (
                      <label
                        key={range}
                        className="flex items-center space-x-2"
                      >
                        <input
                          type="checkbox"
                          checked={filters.priceRange?.includes(range) || false}
                          onChange={() =>
                            handleArrayFilterChange('priceRange', range)
                          }
                          className="rounded"
                        />
                        <span className="text-sm">{range}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={clearFilters}
                className="w-full bg-yellow-400 text-black py-2 px-4 rounded-md hover:bg-yellow-500 font-medium"
              >
                Clear all filters
              </button>
            </div>
          </div>
        )}

        {/* Product Grid */}
        <div className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(12)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {rings.map((ring) => {
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
                            width={400}
                            height={400}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-400">No Image</span>
                          </div>
                        )}

                        {!ring.inStock && (
                          <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm bg-black/20">
                            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-4 py-2">
                              <span className="text-white font-medium text-sm tracking-wide">
                                Out of Stock
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Wishlist Button */}
                        <button
                          className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-sm hover:bg-white rounded-full flex items-center justify-center transition-colors z-10"
                          onClick={(e) => handleToggleWishlist(e, ring)}
                        >
                          <Heart
                            className={`w-5 h-5 transition-colors ${
                              isWishlisted
                                ? 'fill-red-500 text-red-500'
                                : 'text-gray-600'
                            }`}
                          />
                        </button>

                        <button
                          className="absolute bottom-4 right-4 bg-yellow-400 text-black px-4 py-2 rounded-xl text-sm font-medium hover:bg-yellow-500 transition-colors z-10 disabled:bg-gray-300 disabled:cursor-not-allowed"
                          onClick={(e) => handleAddToBag(e, ring)}
                          disabled={!ring.inStock}
                        >
                          {ring.inStock ? 'Add to bag' : 'Out of Stock'}
                        </button>
                      </div>
                    </Link>

                    <Link href={`/rings/${ring.slug.current}`}>
                      <div className="cursor-pointer">
                        <h3 className="font-semibold text-lg mb-1 hover:text-gray-600 transition-colors">
                          {ring.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2">
                          {ring.material}, {ring.stone}, Size {ring.size}
                        </p>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-600 text-sm">
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
          )}

          {rings.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <p className="text-gray-500">
                No rings found matching your criteria.
              </p>
            </div>
          )}

          {/* Pagination */}
          {renderPagination()}
        </div>
      </div>
    </div>
  );
};

export default RingListing;
