// lib/sanity.ts

import { createClient } from '@sanity/client';
import { groq } from 'next-sanity';
import imageUrlBuilder from '@sanity/image-url';
import {
  Earring,
  EarringFilters,
  EarringsSortBy,
  EarringSearchParams,
  EarringListingResponse,
} from '../types/earrings';

// Sanity client configuration
export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: process.env.NODE_ENV === 'production',
  token: process.env.SANITY_API_TOKEN,
});

// Image URL builder
const builder = imageUrlBuilder(client);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function urlFor(source: any) {
  return builder.image(source);
}

// GROQ Queries for Earrings

// Get all earrings with basic info
export const EARRINGS_QUERY = groq`
  *[_type == "earring" && active == true] | order(_createdAt desc) {
    _id,
    _type,
    _createdAt,
    _updatedAt,
    name,
    slug,
    description,
    price,
    originalPrice,
    currency,
    material,
    stone,
    color,
    category,
    mainImage {
      asset-> {
        _id,
        url,
        metadata {
          dimensions {
            width,
            height
          }
        }
      },
      alt,
      caption
    },
    images[] {
      asset-> {
        _id,
        url,
        metadata {
          dimensions {
            width,
            height
          }
        }
      },
      alt,
      caption
    },
    dimensions,
    inStock,
    stockQuantity,
    freeShipping,
    shippingInfo,
    reviews[]-> {
      _id,
      customerName,
      rating,
      comment,
      verified,
      _createdAt,
      _updatedAt
    },
    averageRating,
    totalReviews,
    featured,
    active,
    careInstructions,
    warranty
  }
`;

// Get single earring by slug
export const EARRING_BY_SLUG_QUERY = groq`
  *[_type == "earring" && slug.current == $slug && active == true][0] {
    _id,
    _type,
    _createdAt,
    _updatedAt,
    name,
    slug,
    description,
    price,
    originalPrice,
    currency,
    material,
    stone,
    color,
    category,
    mainImage {
      asset-> {
        _id,
        url,
        metadata {
          dimensions {
            width,
            height
          }
        }
      },
      alt,
      caption
    },
    images[] {
      asset-> {
        _id,
        url,
        metadata {
          dimensions {
            width,
            height
          }
        }
      },
      alt,
      caption
    },
    dimensions,
    inStock,
    stockQuantity,
    freeShipping,
    shippingInfo,
    reviews[]-> {
      _id,
      customerName,
      rating,
      comment,
      verified,
      _createdAt,
      _updatedAt
    },
    averageRating,
    totalReviews,
    seoTitle,
    seoDescription,
    featured,
    active,
    careInstructions,
    warranty
  }
`;

// Get featured earrings
export const FEATURED_EARRINGS_QUERY = groq`
  *[_type == "earring" && featured == true && active == true] | order(_createdAt desc) [0...6] {
    _id,
    name,
    slug,
    price,
    originalPrice,
    currency,
    material,
    category,
    mainImage {
      asset-> {
        _id,
        url
      },
      alt
    },
    inStock,
    averageRating,
    totalReviews
  }
`;

// Get earrings by category
export const EARRINGS_BY_CATEGORY_QUERY = groq`
  *[_type == "earring" && category == $category && active == true] | order(_createdAt desc) {
    _id,
    name,
    slug,
    price,
    originalPrice,
    currency,
    material,
    category,
    mainImage {
      asset-> {
        _id,
        url
      },
      alt
    },
    inStock,
    averageRating,
    totalReviews
  }
`;

// Sanity helper functions

// Build filter query based on filters
function buildFilterQuery(filters: EarringFilters): string {
  const conditions = ['_type == "earring"', 'active == true'];

  if (filters.material && filters.material.length > 0) {
    const materialCondition = filters.material
      .map((m) => `material == "${m}"`)
      .join(' || ');
    conditions.push(`(${materialCondition})`);
  }

  if (filters.stone && filters.stone.length > 0) {
    const stoneCondition = filters.stone
      .map((s) => `stone == "${s}"`)
      .join(' || ');
    conditions.push(`(${stoneCondition})`);
  }

  if (filters.color && filters.color.length > 0) {
    const colorCondition = filters.color
      .map((c) => `color == "${c}"`)
      .join(' || ');
    conditions.push(`(${colorCondition})`);
  }

  if (filters.category && filters.category.length > 0) {
    const categoryCondition = filters.category
      .map((c) => `category == "${c}"`)
      .join(' || ');
    conditions.push(`(${categoryCondition})`);
  }

  if (filters.priceRange && filters.priceRange.length > 0) {
    const priceConditions = filters.priceRange
      .map((range) => {
        switch (range) {
          case '£0 - 50':
            return 'price >= 0 && price <= 50';
          case '£50 - 100':
            return 'price >= 50 && price <= 100';
          case '£100 - 200':
            return 'price >= 100 && price <= 200';
          case 'Under £50':
            return 'price < 50';
          default:
            return '';
        }
      })
      .filter(Boolean)
      .join(' || ');
    if (priceConditions) {
      conditions.push(`(${priceConditions})`);
    }
  }

  if (filters.inStock) {
    conditions.push('inStock == true');
  }

  return conditions.join(' && ');
}

// Build sort query based on sort option
function buildSortQuery(sortBy: EarringsSortBy): string {
  switch (sortBy) {
    case 'NEW ARRIVALS':
      return 'order(_createdAt desc)';
    case 'PRICE: HIGH TO LOW':
      return 'order(price desc)';
    case 'PRICE: LOW TO HIGH':
      return 'order(price asc)';
    case 'TOP MATCH':
      return 'order(averageRating desc, totalReviews desc)';
    default:
      return 'order(_createdAt desc)';
  }
}

// API functions

// Get all earrings
export async function getAllEarrings(): Promise<Earring[]> {
  try {
    const earrings = await client.fetch(EARRINGS_QUERY);
    return earrings || [];
  } catch (error) {
    console.error('Error fetching earrings:', error);
    return [];
  }
}

// Get earring by slug
export async function getEarringBySlug(slug: string): Promise<Earring | null> {
  try {
    const earring = await client.fetch(EARRING_BY_SLUG_QUERY, { slug });
    return earring || null;
  } catch (error) {
    console.error('Error fetching earring:', error);
    return null;
  }
}

// Get featured earrings
export async function getFeaturedEarrings(): Promise<Earring[]> {
  try {
    const earrings = await client.fetch(FEATURED_EARRINGS_QUERY);
    return earrings || [];
  } catch (error) {
    console.error('Error fetching featured earrings:', error);
    return [];
  }
}

// Get earrings by category
export async function getEarringsByCategory(
  category: string
): Promise<Earring[]> {
  try {
    const earrings = await client.fetch(EARRINGS_BY_CATEGORY_QUERY, {
      category,
    });
    return earrings || [];
  } catch (error) {
    console.error('Error fetching earrings by category:', error);
    return [];
  }
}

// Get earrings with filters and pagination
export async function getEarringsWithFilters(
  params: EarringSearchParams
): Promise<EarringListingResponse> {
  const {
    page = 1,
    limit = 24,
    sortBy = 'NEW ARRIVALS',
    filters = {},
    search,
  } = params;

  try {
    const filterQuery = buildFilterQuery(filters);
    const sortQuery = buildSortQuery(sortBy);

    let searchCondition = '';
    if (search) {
      searchCondition = ` && (name match "${search}*" || description match "${search}*")`;
    }

    const query = groq`
      {
        "earrings": *[${filterQuery}${searchCondition}] | ${sortQuery} [${(page - 1) * limit}...${page * limit}] {
          _id,
          name,
          slug,
          price,
          originalPrice,
          currency,
          material,
          stone,
          color,
          category,
          mainImage {
            asset-> {
              _id,
              url
            },
            alt
          },
          inStock,
          averageRating,
          totalReviews,
          featured
        },
        "totalCount": count(*[${filterQuery}${searchCondition}])
      }
    `;

    const result = await client.fetch(query);
    const { earrings, totalCount } = result;

    const totalPages = Math.ceil(totalCount / limit);

    return {
      earrings: earrings || [],
      totalCount: totalCount || 0,
      currentPage: page,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };
  } catch (error) {
    console.error('Error fetching earrings with filters:', error);
    return {
      earrings: [],
      totalCount: 0,
      currentPage: page,
      totalPages: 0,
      hasNextPage: false,
      hasPrevPage: false,
    };
  }
}

// Get related earrings (same category, different product)
export async function getRelatedEarrings(
  earringId: string,
  category: string,
  limit: number = 6
): Promise<Earring[]> {
  try {
    const query = groq`
      *[_type == "earring" && category == $category && _id != $earringId && active == true] | order(_createdAt desc) [0...${limit}] {
        _id,
        name,
        slug,
        price,
        originalPrice,
        currency,
        material,
        category,
        mainImage {
          asset-> {
            _id,
            url
          },
          alt
        },
        inStock,
        averageRating,
        totalReviews
      }
    `;

    const earrings = await client.fetch(query, { category, earringId });
    return earrings || [];
  } catch (error) {
    console.error('Error fetching related earrings:', error);
    return [];
  }
}

// Utility function to get image URL from Sanity
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getImageUrl(image: any): string {
  return (
    image?.asset?.url ||
    'https://res.cloudinary.com/dfwty72r9/image/upload/v1752626010/Image_fx_8_fg9tp4.png'
  );
}

// Utility function to format price
export function formatPrice(price: number, currency: string = 'GBP'): string {
  const symbol = currency === 'GBP' ? '£' : currency === 'USD' ? '$' : '€';
  return `${symbol}${price.toFixed(2)}`;
}
