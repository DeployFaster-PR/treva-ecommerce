// types/rings.ts

export interface RingReview {
  _id: string;
  _type: 'ringReview';
  customerName: string;
  rating: number; // 1-5 stars
  comment: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Ring {
  _id: string;
  _type: 'ring';
  _createdAt: string;
  _updatedAt: string;

  // Basic Info
  name: string;
  slug: {
    _type: 'slug';
    current: string;
  };
  description?: string;

  // Pricing
  price: number;
  originalPrice?: number; // For sale items
  currency: string;

  // Product Details
  material: RingMaterial;
  stone: RingStone;
  color: RingColor;
  category: RingCategory;
  size: RingSize;

  // Images - Using URL strings instead of Sanity image objects
  mainImageUrl: string;
  imageUrls?: string[];

  // Product Specifications
  dimensions?: {
    length?: string;
    width?: string;
    weight?: string;
  };

  // Inventory
  inStock: boolean;
  stockQuantity?: number;

  // Shipping
  freeShipping: boolean;
  shippingInfo?: {
    estimatedDays: number;
    returnPolicy: string;
  };

  // Reviews
  reviews?: RingReview[];
  averageRating?: number;
  totalReviews?: number;

  // SEO
  seoTitle?: string;
  seoDescription?: string;

  // Status
  featured: boolean;
  active: boolean;

  // Additional Info
  careInstructions?: string;
  warranty?: string;
}

// Enums/Constants for dropdown values
export type RingMaterial =
  | 'Sterling Silver'
  | 'Silver Plated'
  | '9k Gold Plated'
  | '14k White Gold'
  | '925 Sterling Gold'
  | 'Hypoallergenic';

export type RingStone =
  | 'Agate'
  | 'Amethyst'
  | 'Citrine'
  | 'Diamond'
  | 'Emerald'
  | 'Gemstone'
  | 'Pearl'
  | 'None';

export type RingColor =
  | 'Black'
  | 'Blue'
  | 'Cream'
  | 'Gold'
  | 'Green'
  | 'None'
  | 'White';

export type RingSize = '3' | '4' | '4.5' | '5' | '5.5' | '6' | '6.5';

export type RingCategory =
  | 'Cocktail'
  | 'Pearl'
  | 'Stackable'
  | 'Birthstone'
  | 'Bombe'
  | 'Cluster'
  | 'Statement';

export type RingPriceRange =
  | '£0 - 50'
  | '£50 - 100'
  | '£100 - 200'
  | 'Under £50';

export type RingAvailability = 'In stock only' | 'All items';

export type RingsSortBy =
  | 'NEW ARRIVALS'
  | 'PRICE: HIGH TO LOW'
  | 'PRICE: LOW TO HIGH'
  | 'TOP MATCH';

// Filter interface for the listing page
export interface RingFilters {
  availability?: RingAvailability;
  material?: RingMaterial[];
  stone?: RingStone[];
  color?: RingColor[];
  priceRange?: RingPriceRange[];
  category?: RingCategory[];
  size?: RingSize[];
  inStock?: boolean;
}

// Search and listing interfaces
export interface RingSearchParams {
  page?: number;
  limit?: number;
  sortBy?: RingsSortBy;
  filters?: RingFilters;
  search?: string;
}

export interface RingListingResponse {
  rings: Ring[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// Constants for predefined values - FIXED NAMING
export const RING_MATERIALS: RingMaterial[] = [
  'Sterling Silver',
  'Silver Plated',
  '9k Gold Plated',
  '14k White Gold',
  '925 Sterling Gold',
  'Hypoallergenic',
];

export const RING_STONES: RingStone[] = [
  'Agate',
  'Amethyst',
  'Citrine',
  'Diamond',
  'Emerald',
  'Gemstone',
  'Pearl',
  'None',
];

export const RING_COLORS: RingColor[] = [
  'Black',
  'Blue',
  'Cream',
  'Gold',
  'Green',
  'None',
  'White',
];

export const RING_SIZES: RingSize[] = ['3', '4', '4.5', '5', '5.5', '6', '6.5'];

export const RING_CATEGORIES: RingCategory[] = [
  'Cocktail',
  'Pearl',
  'Stackable',
  'Birthstone',
  'Bombe',
  'Cluster',
  'Statement',
];

export const RING_PRICE_RANGES: RingPriceRange[] = [
  '£0 - 50',
  '£50 - 100',
  '£100 - 200',
  'Under £50',
];

export const RING_SORT_OPTIONS: RingsSortBy[] = [
  'NEW ARRIVALS',
  'PRICE: HIGH TO LOW',
  'PRICE: LOW TO HIGH',
  'TOP MATCH',
];

// Category background images mapping
export const CATEGORY_IMAGES: Record<RingCategory, string> = {
  Cocktail:
    'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625809/Image_fx_41_co8rmr.png',
  Pearl:
    'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625813/Image_fx_42_ve1ov1.png',
  Stackable:
    'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625818/Image_fx_43_edbf6s.png',
  Birthstone:
    'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625821/Image_fx_44_se7c0e.png',
  Bombe:
    'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625836/Image_fx_45_fuq2z4.png',
  Cluster:
    'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625825/Image_fx_46_ct5qu5.png',
  Statement:
    'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625830/Image_fx_47_dvkpll.png',
};
