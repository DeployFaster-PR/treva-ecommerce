// types/bracelets.ts

export interface BraceletReview {
  _id: string;
  _type: 'braceletReview';
  customerName: string;
  rating: number; // 1-5 stars
  comment: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Bracelet {
  _id: string;
  _type: 'bracelet';
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
  material: BraceletMaterial;
  stone: BraceletStone;
  color: BraceletColor;
  category: BraceletCategory;
  size: BraceletSize;

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
  reviews?: BraceletReview[];
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
export type BraceletMaterial =
  | 'Sterling Silver'
  | 'Silver Plated'
  | '9k Gold Plated'
  | '14k White Gold'
  | '925 Sterling Gold'
  | 'Hypoallergenic';

export type BraceletStone =
  | 'Agate'
  | 'Amethyst'
  | 'Citrine'
  | 'Diamond'
  | 'Emerald'
  | 'Gemstone'
  | 'Pearl'
  | 'None';

export type BraceletColor =
  | 'Black'
  | 'Blue'
  | 'Cream'
  | 'Gold'
  | 'Green'
  | 'None'
  | 'White';

export type BraceletSize = 'S' | 'S/M' | 'M' | 'M/L' | 'L' | 'XL';

export type BraceletCategory =
  | 'Tennis'
  | 'Bangle'
  | 'Cuff'
  | 'Pearl'
  | 'Slider'
  | 'Gemstone'
  | 'Gold';

export type BraceletPriceRange =
  | '£0 - 50'
  | '£50 - 100'
  | '£100 - 200'
  | 'Under £50';

export type BraceletAvailability = 'In stock only' | 'All items';

export type BraceletsSortBy =
  | 'NEW ARRIVALS'
  | 'PRICE: HIGH TO LOW'
  | 'PRICE: LOW TO HIGH'
  | 'TOP MATCH';

// Filter interface for the listing page
export interface BraceletFilters {
  availability?: BraceletAvailability;
  material?: BraceletMaterial[];
  stone?: BraceletStone[];
  color?: BraceletColor[];
  priceRange?: BraceletPriceRange[];
  category?: BraceletCategory[];
  size?: BraceletSize[];
  inStock?: boolean;
}

// Search and listing interfaces
export interface BraceletSearchParams {
  page?: number;
  limit?: number;
  sortBy?: BraceletsSortBy;
  filters?: BraceletFilters;
  search?: string;
}

export interface BraceletListingResponse {
  bracelets: Bracelet[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// Constants for predefined values - FIXED NAMING
export const BRACELET_MATERIALS: BraceletMaterial[] = [
  'Sterling Silver',
  'Silver Plated',
  '9k Gold Plated',
  '14k White Gold',
  '925 Sterling Gold',
  'Hypoallergenic',
];

export const BRACELET_STONES: BraceletStone[] = [
  'Agate',
  'Amethyst',
  'Citrine',
  'Diamond',
  'Emerald',
  'Gemstone',
  'Pearl',
  'None',
];

export const BRACELET_COLORS: BraceletColor[] = [
  'Black',
  'Blue',
  'Cream',
  'Gold',
  'Green',
  'None',
  'White',
];

export const BRACELET_SIZES: BraceletSize[] = [
  'S',
  'S/M',
  'M',
  'M/L',
  'L',
  'XL',
];

export const BRACELET_CATEGORIES: BraceletCategory[] = [
  'Tennis',
  'Bangle',
  'Cuff',
  'Pearl',
  'Slider',
  'Gemstone',
  'Gold',
];

export const BRACELET_PRICE_RANGES: BraceletPriceRange[] = [
  '£0 - 50',
  '£50 - 100',
  '£100 - 200',
  'Under £50',
];

export const BRACELET_SORT_OPTIONS: BraceletsSortBy[] = [
  'NEW ARRIVALS',
  'PRICE: HIGH TO LOW',
  'PRICE: LOW TO HIGH',
  'TOP MATCH',
];

// Category background images mapping
export const CATEGORY_IMAGES: Record<BraceletCategory, string> = {
  Tennis:
    'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625707/Image_fx_35_b6m2eb.png',
  Bangle:
    'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625711/Image_fx_36_spgtww.png',
  Cuff: 'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625729/Image_fx_49_nu2xo0.png',
  Pearl:
    'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625715/Image_fx_37_ggbzr9.png',
  Slider:
    'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625718/Image_fx_38_eyiejq.png',
  Gemstone:
    'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625723/Image_fx_39_odpyj8.png',
  Gold: 'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625726/Image_fx_40_xlym5b.png',
};
