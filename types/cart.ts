// types/cart.ts

// Base product information that both cart and wishlist items share
export interface BaseProductInfo {
  productId: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  material: string;
  stone: string;
  size?: string;
  currency: string;
  productType: string;
  slug: string;
  description?: string;
  category?: string;
  tags?: string[];
  inStock?: boolean;
  stockQuantity?: number;
}

// Cart item extends base product info with cart-specific properties
export interface CartItem extends BaseProductInfo {
  id: string;
  quantity: number;
  addedAt?: string;
  selectedVariant?: string;
  customizations?: {
    engraving?: string;
    giftWrap?: boolean;
    giftMessage?: string;
  };
}

// Wishlist item extends base product info with wishlist-specific properties
export interface WishlistItem extends BaseProductInfo {
  id: string;
  addedAt: string;
  notes?: string;
  priority?: 'low' | 'medium' | 'high';
  notifyOnSale?: boolean;
  notifyOnRestock?: boolean;
}

// Cart summary for checkout calculations
export interface CartSummary {
  subtotal: number;
  shipping: number;
  tax?: number;
  discount?: number;
  total: number;
  currency: string;
  itemCount: number;
  freeShippingThreshold?: number;
  freeShippingEligible?: boolean;
}

// For product variants/options
export interface ProductVariant {
  id: string;
  name: string;
  value: string;
  price?: number; // Additional price for this variant
  inStock?: boolean;
  image?: string;
}

// For product options (like size, color, etc.)
export interface ProductOption {
  id: string;
  name: string;
  type: 'select' | 'radio' | 'checkbox' | 'text';
  required: boolean;
  variants: ProductVariant[];
}

// For shipping options
export interface ShippingOption {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: number;
  currency: string;
}

// For discount/coupon codes
export interface DiscountCode {
  code: string;
  type: 'percentage' | 'fixed' | 'free_shipping';
  value: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  expiresAt?: string;
  usageLimit?: number;
  usedCount?: number;
}

// For order/checkout data
export interface CheckoutData {
  items: CartItem[];
  summary: CartSummary;
  shippingAddress?: Address;
  billingAddress?: Address;
  shippingOption?: ShippingOption;
  discountCode?: DiscountCode;
  paymentMethod?: string;
  specialInstructions?: string;
}

// Address interface for shipping/billing
export interface Address {
  id?: string;
  firstName: string;
  lastName: string;
  company?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault?: boolean;
}

// Shipping information interface (used in checkout)
export interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  company?: string;
  addressLine2?: string;
}

// Order item interface (for completed orders)
export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  productType: string;
  image?: string;
  material?: string;
  stone?: string;
}

// Complete order interface
export interface Order {
  id: string;
  userId?: string;
  items: OrderItem[];
  shippingInfo: ShippingInfo;
  subtotal: number;
  shipping: number;
  tax?: number;
  discount?: number;
  total: number;
  currency: string;
  paymentReference: string;
  paymentMethod?: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded';
  createdAt: string;
  updatedAt?: string;
  shippingOption?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  notes?: string;
}
