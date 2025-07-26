'use client';

import React from 'react';
import { Heart, ShoppingBag, X } from 'lucide-react';
import { useWishlistStore } from '@/stores/wishlist-store';
import { useCartStore } from '@/stores/cart-store';
import Image from 'next/image';
import Link from 'next/link';

const WishlistPage: React.FC = () => {
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const { addItem: addToCart, openCart } = useCartStore();

  const formatPrice = (price: number, currency: string) => {
    const symbol = currency === 'GBP' ? '£' : currency === 'USD' ? '$' : '€';
    return `${symbol}${price.toFixed(2)}`;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleAddToBag = (item: any) => {
    if (!item.inStock) return;

    const cartItem = {
      productId: item.productId,
      name: item.name,
      price: item.price,
      currency: item.currency,
      originalPrice: item.originalPrice,
      image: item.image,
      material: item.material,
      stone: item.stone,
      size: item.size,
      inStock: item.inStock,
      productType: item.productType,
      slug: item.slug,
    };

    addToCart(cartItem);
    openCart();
  };

  const handleRemoveFromWishlist = (productId: string, size?: string) => {
    removeItem(productId, size);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {items.length === 0 ? (
          // Empty Wishlist State
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Your Wishlist is Empty
            </h2>
            <p className="text-gray-600">
              {items.length === 0
                ? "You haven't added any items to your wishlist yet"
                : `${items.length} item${items.length !== 1 ? 's' : ''} in your wishlist`}
            </p>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Save your favorite items to your wishlist so you can easily find
              them later.
            </p>
            <Link
              href="/"
              className="inline-flex items-center bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-3 px-6 rounded-lg transition-colors"
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              Start Shopping
            </Link>
          </div>
        ) : (
          // Wishlist Items
          <div>
            {/* Actions Bar */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  {items.length} item{items.length !== 1 ? 's' : ''}
                </span>
              </div>
              <button
                onClick={clearWishlist}
                className="text-sm text-red-600 hover:text-red-700 transition-colors"
              >
                Clear All
              </button>
            </div>

            {/* Wishlist Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden group"
                >
                  {/* Remove Button */}
                  <div className="relative">
                    <button
                      onClick={() =>
                        handleRemoveFromWishlist(item.productId, item.size)
                      }
                      className="absolute top-3 right-3 z-10 w-8 h-8 bg-white hover:bg-gray-100 rounded-full flex items-center justify-center shadow-sm transition-colors"
                    >
                      <X className="w-4 h-4 text-gray-600" />
                    </button>

                    {/* Product Image */}
                    <Link href={`/${item.productType}s/${item.slug}`}>
                      <div className="aspect-square bg-gray-100 overflow-hidden cursor-pointer">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={300}
                          height={300}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </Link>

                    {/* Out of Stock Overlay */}
                    {!item.inStock && (
                      <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm bg-black/20">
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-4 py-2">
                          <span className="text-white font-medium text-sm tracking-wide">
                            Out of Stock
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <Link href={`/${item.productType}s/${item.slug}`}>
                      <h3 className="font-semibold text-lg mb-1 hover:text-gray-600 transition-colors cursor-pointer">
                        {item.name}
                      </h3>
                    </Link>

                    <p className="text-gray-600 text-sm mb-3">
                      {item.material}, {item.stone}
                      {item.size && ` - Size ${item.size}`}
                    </p>

                    {/* Price */}
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="font-semibold text-gray-900">
                        {formatPrice(item.price, item.currency)}
                      </span>
                      {item.originalPrice && (
                        <span className="text-gray-400 line-through text-sm">
                          {formatPrice(item.originalPrice, item.currency)}
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      <button
                        onClick={() => handleAddToBag(item)}
                        disabled={!item.inStock}
                        className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-black font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                      >
                        {item.inStock ? 'Add to Bag' : 'Out of Stock'}
                      </button>

                      <button
                        onClick={() =>
                          handleRemoveFromWishlist(item.productId, item.size)
                        }
                        className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-lg border border-gray-300 transition-colors text-sm"
                      >
                        Remove from Wishlist
                      </button>
                    </div>
                  </div>

                  {/* Added Date */}
                  <div className="px-4 pb-4">
                    <p className="text-xs text-gray-500">
                      Added {new Date(item.addedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Continue Shopping */}
            <div className="text-center mt-12">
              <Link
                href="/"
                className="inline-flex items-center bg-white hover:bg-gray-50 text-gray-900 font-medium py-3 px-6 rounded-lg border border-gray-300 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
