// components/Cart.tsx
'use client';

import React from 'react';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/stores/cart-store';
import Image from 'next/image';
import Link from 'next/link';

const Cart: React.FC = () => {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    getCartSummary,
  } = useCartStore();

  const cartSummary = getCartSummary();

  if (!isOpen) return null;

  const formatPrice = (price: number, currency: string) => {
    const symbol = currency === 'GBP' ? '£' : currency === 'USD' ? '$' : '€';
    return `${symbol}${price.toFixed(2)}`;
  };

  return (
    <>
      {/* Backdrop - Changed to use backdrop-blur and reduced opacity */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
        onClick={closeCart}
      />

      {/* Cart Panel - Increased z-index to be above backdrop */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-xl transform transition-transform duration-300 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {items.length === 0 ? 'Empty Cart' : 'Shopping Cart'}
          </h2>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Free Shipping Banner */}
        <div className="bg-black text-white text-center py-2 px-4 text-xs">
          FREE SHIPPING ON ORDERS OVER £150
        </div>

        {/* Cart Content */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            // Empty Cart State
            <div className="flex flex-col items-center justify-center h-full px-4 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <ShoppingBag className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Your Cart is Empty
              </h3>
              <p className="text-gray-600 mb-6">
                Looks like you haven&apos;t added anything to your cart yet.
              </p>
              <button
                onClick={closeCart}
                className="w-full max-w-xs bg-white hover:bg-gray-50 text-gray-900 font-medium py-3 px-6 rounded-full border border-gray-300 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            // Cart Items
            <div className="p-4 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 pb-4 border-b border-gray-100 last:border-b-0"
                >
                  {/* Product Image */}
                  <Link
                    href={`/${item.productType}s/${item.slug}`}
                    onClick={closeCart}
                  >
                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </Link>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/${item.productType}s/${item.slug}`}
                      onClick={closeCart}
                    >
                      <h4 className="font-medium text-gray-900 mb-1 cursor-pointer hover:text-gray-600 transition-colors">
                        {item.name}
                      </h4>
                    </Link>
                    <p className="text-sm text-gray-600 mb-2">
                      {item.material}, {item.stone}
                      {item.size && ` - Size ${item.size}`}
                    </p>

                    {/* Price and Quantity */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">
                          {formatPrice(item.price, item.currency)}
                        </span>
                        {item.originalPrice && (
                          <span className="text-sm text-gray-400 line-through">
                            {formatPrice(item.originalPrice, item.currency)}
                          </span>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                        >
                          <Minus className="w-4 h-4 text-gray-600" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium text-gray-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                        >
                          <Plus className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-sm text-red-600 hover:text-red-700 transition-colors mt-2"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cart Footer - Only show when items exist */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 p-4 space-y-4">
            {/* Cart Summary */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">
                  {formatPrice(cartSummary.subtotal, cartSummary.currency)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="text-gray-900">
                  {cartSummary.shipping === 0
                    ? 'FREE'
                    : formatPrice(cartSummary.shipping, cartSummary.currency)}
                </span>
              </div>
              <div className="flex justify-between font-semibold text-lg pt-2 border-t border-gray-200">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900">
                  {formatPrice(cartSummary.total, cartSummary.currency)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link
                href="/checkout"
                onClick={closeCart}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-3 px-6 rounded-lg transition-colors text-center block"
              >
                Proceed to Checkout
              </Link>
              <button
                onClick={closeCart}
                className="w-full bg-white hover:bg-gray-50 text-gray-900 font-medium py-3 px-6 rounded-lg border border-gray-300 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
