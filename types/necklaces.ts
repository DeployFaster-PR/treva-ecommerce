// types/necklaces.ts

export interface NecklaceReview {
  _id: string;
  _type: 'necklaceReview';
  customerName: string;
  rating: number; // 1-5 stars
  comment: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Necklace {
  _id: string;
  _type: 'necklace';
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
  material: NecklaceMaterial;
  stone: NecklaceStone;
  color: NecklaceColor;
  category: NecklaceCategory;
  size: NecklaceSize; // Added size field to interface

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
  reviews?: NecklaceReview[];
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
export type NecklaceMaterial =
  | 'Sterling Silver'
  | 'Silver Plated'
  | '9k Gold Plated'
  | '14k White Gold'
  | '925 Sterling Gold'
  | 'Hypoallergenic';

export type NecklaceStone =
  | 'Agate'
  | 'Amethyst'
  | 'Citrine'
  | 'Diamond'
  | 'Emerald'
  | 'Gemstone'
  | 'Pearl'
  | 'None';

export type NecklaceColor =
  | 'Black'
  | 'Blue'
  | 'Cream'
  | 'Gold'
  | 'Green'
  | 'None'
  | 'White';

export type NecklaceSize = 'Medium' | 'Short' | 'Choker' | 'Long';

export type NecklaceCategory =
  | 'Layered'
  | 'Pendant'
  | 'Pearl'
  | 'Chain'
  | 'Choker'
  | 'Collar'
  | 'Lariat';

export type NecklacePriceRange =
  | '£0 - 50'
  | '£50 - 100'
  | '£100 - 200'
  | 'Under £50';

export type NecklaceAvailability = 'In stock only' | 'All items';

export type NecklacesSortBy =
  | 'NEW ARRIVALS'
  | 'PRICE: HIGH TO LOW'
  | 'PRICE: LOW TO HIGH'
  | 'TOP MATCH';

// Filter interface for the listing page
export interface NecklaceFilters {
  availability?: NecklaceAvailability;
  material?: NecklaceMaterial[];
  stone?: NecklaceStone[];
  color?: NecklaceColor[];
  size?: NecklaceSize[]; // Added size filter
  priceRange?: NecklacePriceRange[];
  category?: NecklaceCategory[];
  inStock?: boolean;
}

// Search and listing interfaces
export interface NecklaceSearchParams {
  page?: number;
  limit?: number;
  sortBy?: NecklacesSortBy;
  filters?: NecklaceFilters;
  search?: string;
}

export interface NecklaceListingResponse {
  necklaces: Necklace[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// Constants for predefined values - FIXED NAMES
export const NECKLACE_MATERIALS: NecklaceMaterial[] = [
  'Sterling Silver',
  'Silver Plated',
  '9k Gold Plated',
  '14k White Gold',
  '925 Sterling Gold',
  'Hypoallergenic',
];

export const NECKLACE_STONES: NecklaceStone[] = [
  'Agate',
  'Amethyst',
  'Citrine',
  'Diamond',
  'Emerald',
  'Gemstone',
  'Pearl',
  'None',
];

export const NECKLACE_COLORS: NecklaceColor[] = [
  'Black',
  'Blue',
  'Cream',
  'Gold',
  'Green',
  'None',
  'White',
];

export const NECKLACE_SIZES: NecklaceSize[] = [
  'Medium',
  'Short',
  'Choker',
  'Long',
];

export const NECKLACE_CATEGORIES: NecklaceCategory[] = [
  'Layered',
  'Pendant',
  'Pearl',
  'Chain',
  'Choker',
  'Collar',
  'Lariat',
];

export const NECKLACE_PRICE_RANGES: NecklacePriceRange[] = [
  '£0 - 50',
  '£50 - 100',
  '£100 - 200',
  'Under £50',
];

export const NECKLACE_SORT_OPTIONS: NecklacesSortBy[] = [
  'NEW ARRIVALS',
  'PRICE: HIGH TO LOW',
  'PRICE: LOW TO HIGH',
  'TOP MATCH',
];

// Category background images mapping
export const CATEGORY_IMAGES: Record<NecklaceCategory, string> = {
  Layered:
    'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625768/Image_fx_29_gro6ee.png',
  Pendant:
    'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625787/Image_fx_52_oftm2j.png',
  Pearl:
    'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625770/Image_fx_30_urx7xb.png',
  Chain:
    'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625790/Image_fx_53_nf9xmu.png',
  Choker:
    'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625775/Image_fx_32_igflkp.png',
  Collar:
    'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625782/Image_fx_34_mpgpem.png',
  Lariat:
    'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625778/Image_fx_33_lx0sjr.png',
};
