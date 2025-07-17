'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import {
  Earring,
  EarringFilters,
  EarringsSortBy,
  EARRING_CATEGORIES,
  EARRING_MATERIALS,
  EARRING_STONES,
  EARRING_COLORS,
  EARRING_PRICE_RANGES,
  EARRING_SORT_OPTIONS,
  CATEGORY_IMAGES,
} from '@/types/earrings';
import { client } from '@/lib/sanity';
import Image from 'next/image';

interface EarringListingProps {
  initialEarrings: Earring[];
  totalCount: number;
}

const EarringListing: React.FC<EarringListingProps> = ({
  initialEarrings,
  totalCount,
}) => {
  const [earrings, setEarrings] = useState<Earring[]>(initialEarrings);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(Math.ceil(totalCount / 24));
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState<EarringsSortBy>('NEW ARRIVALS');
  const [isLoading, setIsLoading] = useState(false);

  // Filter expansion states
  const [expandedFilters, setExpandedFilters] = useState({
    availability: false,
    material: false,
    stone: false,
    color: false,
    price: false,
  });

  const [filters, setFilters] = useState<EarringFilters>({
    availability: undefined,
    material: [],
    stone: [],
    color: [],
    priceRange: [],
    category: [],
    inStock: undefined,
  });

  // Sort options without "PRICE: HIGH TO LOW"
  const sortOptions = EARRING_SORT_OPTIONS.filter(
    (option) => option !== 'PRICE: HIGH TO LOW'
  );

  // Fetch earrings based on filters and sort
  const fetchEarrings = useCallback(
    async (page: number = 1) => {
      setIsLoading(true);
      try {
        let query = `*[_type == "earring" && active == true`;

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

        if (filters.category && filters.category.length > 0) {
          query += ` && category in [${filters.category.map((c) => `"${c}"`).join(', ')}]`;
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
          case 'TOP MATCH':
            query += ` | order(featured desc, _createdAt desc)`;
            break;
        }

        const start = (page - 1) * 24;
        const end = start + 24;
        query += `[${start}...${end}]`;

        const result = await client.fetch(query);
        setEarrings(result);

        // Get total count
        const countQuery = query.split(']')[0] + ']';
        const total = await client.fetch(`count(${countQuery})`);
        setTotalPages(Math.ceil(total / 24));
      } catch (error) {
        console.error('Error fetching earrings:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [filters, sortBy]
  ); // Dependencies that fetchEarrings uses

  useEffect(() => {
    fetchEarrings(currentPage);
  }, [fetchEarrings, filters, sortBy, currentPage]);

  const handleFilterChange = (
    filterType: keyof EarringFilters,
    value: EarringFilters[keyof EarringFilters]
  ) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
    setCurrentPage(1);
  };

  const handleArrayFilterChange = (
    filterType: keyof EarringFilters,
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
      <div className="flex justify-center items-center space-x-2 mt-12">
        <button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="p-2 rounded-full border border-gray-300 disabled:opacity-50"
        >
          <ChevronDown className="rotate-90 w-4 h-4" />
        </button>

        {pages.map((page, index) => (
          <button
            key={index}
            onClick={() =>
              typeof page === 'number' ? setCurrentPage(page) : null
            }
            className={`w-10 h-10 rounded-full ${
              page === currentPage
                ? 'bg-yellow-400 text-black'
                : 'border border-gray-300 hover:bg-gray-100'
            } ${typeof page !== 'number' ? 'cursor-default' : ''}`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="p-2 rounded-full border border-gray-300 disabled:opacity-50"
        >
          <ChevronDown className="-rotate-90 w-4 h-4" />
        </button>
      </div>
    );
  };

  const getImageUrl = (earring: Earring) => {
    if (
      earring.mainImageUrl &&
      typeof earring.mainImageUrl === 'string' &&
      earring.mainImageUrl.trim() !== ''
    ) {
      return earring.mainImageUrl;
    }

    if (
      earring.imageUrls &&
      Array.isArray(earring.imageUrls) &&
      earring.imageUrls.length > 0
    ) {
      const firstUrl = earring.imageUrls[0];
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
        <span>Home</span> / <span>All Earrings</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Earrings</h1>
        <p className="text-gray-600">
          Find your perfect pair, Earrings for every style, every occasion.
        </p>
      </div>

      {/* Category Navigation */}
      <div className="grid grid-cols-7 gap-2 mb-8">
        {EARRING_CATEGORIES.map((category) => (
          <div
            key={category}
            className="relative cursor-pointer"
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
        ))}
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

          <span className="text-sm text-gray-600">
            {earrings.length} PRODUCTS
          </span>

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
                      setSortBy(option as EarringsSortBy);
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
                    {EARRING_MATERIALS.map((material) => (
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
                    {EARRING_STONES.map((stone) => (
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
                    {EARRING_COLORS.map((color) => (
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
                    {EARRING_PRICE_RANGES.map((range) => (
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
                View Results
              </button>
            </div>
          </div>
        )}

        {/* Product Grid */}
        <div className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {earrings.map((earring) => {
                const imageUrl = getImageUrl(earring);

                return (
                  <div key={earring._id} className="group">
                    <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={earring.name}
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

                      {!earring.inStock && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <span className="text-white font-semibold">
                            Out of Stock
                          </span>
                        </div>
                      )}

                      <button className="absolute bottom-4 right-4 bg-yellow-400 text-black px-4 py-2 rounded-xl text-sm font-medium hover:bg-yellow-500 transition-colors">
                        Add to bag
                      </button>
                    </div>

                    <div>
                      <h3 className="font-semibold text-lg mb-1">
                        {earring.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2">
                        {earring.material}, {earring.stone}
                      </p>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-600 text-sm">
                          {earring.currency === 'GBP'
                            ? '£'
                            : earring.currency === 'USD'
                              ? '$'
                              : '€'}
                          {earring.price}
                        </span>
                        {earring.originalPrice && (
                          <span className="text-gray-400 line-through text-sm">
                            {earring.currency === 'GBP'
                              ? '£'
                              : earring.currency === 'USD'
                                ? '$'
                                : '€'}
                            {earring.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {earrings.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <p className="text-gray-500">
                No earrings found matching your criteria.
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && renderPagination()}
        </div>
      </div>
    </div>
  );
};

export default EarringListing;
