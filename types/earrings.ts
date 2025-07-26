// types/earrings.ts

export interface EarringReview {
  _id: string;
  _type: 'earringReview';
  customerName: string;
  rating: number; // 1-5 stars
  comment: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Earring {
  _id: string;
  _type: 'earring';
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
  material: EarringMaterial;
  stone: EarringStone;
  color: EarringColor;
  category: EarringCategory;
  size: EarringSize;

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
  reviews?: EarringReview[];
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
export type EarringMaterial =
  | 'Sterling Silver'
  | 'Silver Plated'
  | '9k Gold Plated'
  | '14k White Gold'
  | '925 Sterling Gold'
  | 'Hypoallergenic';

export type EarringStone =
  | 'Agate'
  | 'Amethyst'
  | 'Citrine'
  | 'Diamond'
  | 'Emerald'
  | 'Gemstone'
  | 'Pearl'
  | 'None';

export type EarringColor =
  | 'Black'
  | 'Blue'
  | 'Cream'
  | 'Gold'
  | 'Green'
  | 'None'
  | 'White';

export type EarringSize = '3' | '4' | '4.5' | '5' | '5.5' | '6' | '6.5';

export type EarringCategory =
  | 'Stud'
  | 'Hoops'
  | 'Drops'
  | 'Dangles'
  | 'Threader'
  | 'Ear cuff'
  | 'Pearl';

export type EarringPriceRange =
  | '£0 - 50'
  | '£50 - 100'
  | '£100 - 200'
  | 'Under £50';

export type EarringAvailability = 'In stock only' | 'All items';

export type EarringsSortBy =
  | 'NEW ARRIVALS'
  | 'PRICE: HIGH TO LOW'
  | 'PRICE: LOW TO HIGH'
  | 'TOP MATCH';

// Filter interface for the listing page
export interface EarringFilters {
  availability?: EarringAvailability;
  material?: EarringMaterial[];
  stone?: EarringStone[];
  color?: EarringColor[];
  priceRange?: EarringPriceRange[];
  category?: EarringCategory[];
  size?: EarringSize[];
  inStock?: boolean;
}

// Search and listing interfaces
export interface EarringSearchParams {
  page?: number;
  limit?: number;
  sortBy?: EarringsSortBy;
  filters?: EarringFilters;
  search?: string;
}

export interface EarringListingResponse {
  earrings: Earring[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// Constants for predefined values
export const EARRING_MATERIALS: EarringMaterial[] = [
  'Sterling Silver',
  'Silver Plated',
  '9k Gold Plated',
  '14k White Gold',
  '925 Sterling Gold',
  'Hypoallergenic',
];

export const EARRING_STONES: EarringStone[] = [
  'Agate',
  'Amethyst',
  'Citrine',
  'Diamond',
  'Emerald',
  'Gemstone',
  'Pearl',
  'None',
];

export const EARRING_COLORS: EarringColor[] = [
  'Black',
  'Blue',
  'Cream',
  'Gold',
  'Green',
  'None',
  'White',
];

export const EARRING_SIZES: EarringSize[] = [
  '3',
  '4',
  '4.5',
  '5',
  '5.5',
  '6',
  '6.5',
];

export const EARRING_CATEGORIES: EarringCategory[] = [
  'Stud',
  'Hoops',
  'Drops',
  'Dangles',
  'Threader',
  'Ear cuff',
  'Pearl',
];

export const EARRING_PRICE_RANGES: EarringPriceRange[] = [
  '£0 - 50',
  '£50 - 100',
  '£100 - 200',
  'Under £50',
];

export const EARRING_SORT_OPTIONS: EarringsSortBy[] = [
  'NEW ARRIVALS',
  'PRICE: HIGH TO LOW',
  'PRICE: LOW TO HIGH',
  'TOP MATCH',
];

// Category background images mapping
export const CATEGORY_IMAGES: Record<EarringCategory, string> = {
  Stud: 'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625188/Image_fx_54_vxiqis.png',
  Hoops:
    'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625191/Image_fx_55_s1kvlv.png',
  Drops:
    'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625192/Image_fx_58_wzznux.png',
  Dangles:
    'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625195/Image_fx_59_bacvfu.png',
  Threader:
    'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625197/Image_fx_60_hyezuo.png',
  'Ear cuff':
    'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625200/Image_fx_61_kdhzch.png',
  Pearl:
    'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625203/Image_fx_62_kcr52m.png',
};
