// lib/product-helpers.ts
import { Ring } from '@/types/rings';
import { Necklace } from '@/types/necklaces';
import { Earring } from '@/types/earrings';
import { Bracelet } from '@/types/bracelets';
import { CartItem, WishlistItem } from '@/types/cart';

// Helper to convert Ring to CartItem
export const ringToCartItem = (
  ring: Ring
): Omit<CartItem, 'id' | 'quantity'> => ({
  productId: ring._id,
  name: ring.name,
  price: ring.price,
  currency: ring.currency,
  originalPrice: ring.originalPrice,
  image: ring.mainImageUrl,
  material: ring.material,
  stone: ring.stone,
  size: ring.size,
  inStock: ring.inStock,
  productType: 'ring',
  slug: ring.slug.current,
});

// Helper to convert Ring to WishlistItem
export const ringToWishlistItem = (
  ring: Ring
): Omit<WishlistItem, 'id' | 'addedAt'> => ({
  productId: ring._id,
  name: ring.name,
  price: ring.price,
  currency: ring.currency,
  originalPrice: ring.originalPrice,
  image: ring.mainImageUrl,
  material: ring.material,
  stone: ring.stone,
  size: ring.size,
  inStock: ring.inStock,
  productType: 'ring',
  slug: ring.slug.current,
});

// Helper to convert Bracelet to CartItem
export const braceletToCartItem = (
  bracelet: Bracelet
): Omit<CartItem, 'id' | 'quantity'> => ({
  productId: bracelet._id,
  name: bracelet.name,
  price: bracelet.price,
  currency: bracelet.currency,
  originalPrice: bracelet.originalPrice,
  image: bracelet.mainImageUrl,
  material: bracelet.material,
  stone: bracelet.stone,
  size: bracelet.size,
  inStock: bracelet.inStock,
  productType: 'bracelet',
  slug: bracelet.slug.current,
});

// Helper to convert Bracelet to WishlistItem
export const braceletToWishlistItem = (
  bracelet: Bracelet
): Omit<WishlistItem, 'id' | 'addedAt'> => ({
  productId: bracelet._id,
  name: bracelet.name,
  price: bracelet.price,
  currency: bracelet.currency,
  originalPrice: bracelet.originalPrice,
  image: bracelet.mainImageUrl,
  material: bracelet.material,
  stone: bracelet.stone,
  size: bracelet.size,
  inStock: bracelet.inStock,
  productType: 'bracelet',
  slug: bracelet.slug.current,
});

// Helper to convert Necklace to CartItem
export const necklaceToCartItem = (
  necklace: Necklace
): Omit<CartItem, 'id' | 'quantity'> => ({
  productId: necklace._id,
  name: necklace.name,
  price: necklace.price,
  currency: necklace.currency,
  originalPrice: necklace.originalPrice,
  image: necklace.mainImageUrl,
  material: necklace.material,
  stone: necklace.stone,
  size: necklace.size,
  inStock: necklace.inStock,
  productType: 'necklace',
  slug: necklace.slug.current,
});

// Helper to convert Necklace to WishlistItem
export const necklaceToWishlistItem = (
  necklace: Necklace
): Omit<WishlistItem, 'id' | 'addedAt'> => ({
  productId: necklace._id,
  name: necklace.name,
  price: necklace.price,
  currency: necklace.currency,
  originalPrice: necklace.originalPrice,
  image: necklace.mainImageUrl,
  material: necklace.material,
  stone: necklace.stone,
  size: necklace.size,
  inStock: necklace.inStock,
  productType: 'necklace',
  slug: necklace.slug.current,
});

// Helper to convert Earring to CartItem
export const earringToCartItem = (
  earring: Earring
): Omit<CartItem, 'id' | 'quantity'> => ({
  productId: earring._id,
  name: earring.name,
  price: earring.price,
  currency: earring.currency,
  originalPrice: earring.originalPrice,
  image: earring.mainImageUrl,
  material: earring.material,
  stone: earring.stone,
  //   size: earring.size,
  inStock: earring.inStock,
  productType: 'earring',
  slug: earring.slug.current,
});

// Helper to convert Earring to WishlistItem
export const earringToWishlistItem = (
  earring: Earring
): Omit<WishlistItem, 'id' | 'addedAt'> => ({
  productId: earring._id,
  name: earring.name,
  price: earring.price,
  currency: earring.currency,
  originalPrice: earring.originalPrice,
  image: earring.mainImageUrl,
  material: earring.material,
  stone: earring.stone,
  //   size: earring.size,
  inStock: earring.inStock,
  productType: 'earring',
  slug: earring.slug.current,
});

// Generic converters that can handle any product type
export const productToCartItem = (
  product: Ring | Earring | Necklace | Bracelet
): Omit<CartItem, 'id' | 'quantity'> => {
  switch (product._type) {
    case 'ring':
      return ringToCartItem(product as Ring);
    case 'earring':
      return earringToCartItem(product as Earring);
    case 'necklace':
      return necklaceToCartItem(product as Necklace);
    case 'bracelet':
      return braceletToCartItem(product as Bracelet);
    default:
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      throw new Error(`Unknown product type: ${(product as any)._type}`);
  }
};

export const productToWishlistItem = (
  product: Ring | Earring | Necklace | Bracelet
): Omit<WishlistItem, 'id' | 'addedAt'> => {
  switch (product._type) {
    case 'ring':
      return ringToWishlistItem(product as Ring);
    case 'earring':
      return earringToWishlistItem(product as Earring);
    case 'necklace':
      return necklaceToWishlistItem(product as Necklace);
    case 'bracelet':
      return braceletToWishlistItem(product as Bracelet);
    default:
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      throw new Error(`Unknown product type: ${(product as any)._type}`);
  }
};

// Generic helper to format product details for display
export const formatProductDetails = (
  material: string,
  stone: string,
  size?: string
): string => {
  const details = [material, stone];
  if (size) {
    details.push(`Size ${size}`);
  }
  return details.join(', ');
};

// Helper to format price with currency symbol
export const formatPrice = (price: number, currency: string): string => {
  const symbol = currency === 'GBP' ? '£' : currency === 'USD' ? '$' : '€';
  return `${symbol}${price.toFixed(2)}`;
};

// Helper to calculate discount percentage
export const calculateDiscountPercentage = (
  originalPrice: number,
  currentPrice: number
): number => {
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
};

// Helper to generate product URL
export const getProductUrl = (productType: string, slug: string): string => {
  return `/${productType}s/${slug}`;
};
