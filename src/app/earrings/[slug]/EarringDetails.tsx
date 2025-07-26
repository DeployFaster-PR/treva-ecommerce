'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Heart, Star } from 'lucide-react';
import { Earring } from '@/types/earrings';
import { useCartStore } from '@/stores/cart-store';
import { useWishlistStore } from '@/stores/wishlist-store';
import {
  earringToCartItem,
  earringToWishlistItem,
} from '@/lib/product-helpers';
import Image from 'next/image';

interface EarringDetailsProps {
  earring: Earring;
}

const EarringDetails: React.FC<EarringDetailsProps> = ({ earring }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [expandedSections, setExpandedSections] = useState({
    description: true,
    details: false,
    materials: false,
    reviews: false,
    size: false,
  });
  const [quantity, setQuantity] = useState(1);

  // Cart and Wishlist stores
  const { addItem: addToCart, openCart } = useCartStore();
  const {
    addItem: addToWishlist,
    removeItem: removeFromWishlist,
    isInWishlist,
  } = useWishlistStore();

  const isWishlisted = isInWishlist(earring._id, earring.size);

  // Get all available images
  const allImages: string[] = [];
  if (earring.mainImageUrl) {
    allImages.push(earring.mainImageUrl);
  }
  if (earring.imageUrls && Array.isArray(earring.imageUrls)) {
    earring.imageUrls.forEach((url) => {
      if (
        url &&
        typeof url === 'string' &&
        url.trim() !== '' &&
        !allImages.includes(url)
      ) {
        allImages.push(url);
      }
    });
  }

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleAddToBag = () => {
    if (!earring.inStock) return;

    const cartItem = earringToCartItem(earring);
    // Add quantity support
    for (let i = 0; i < quantity; i++) {
      addToCart(cartItem);
    }

    // Show success message and open cart
    openCart();
  };

  const handleToggleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(earring._id, earring.size);
    } else {
      const wishlistItem = earringToWishlistItem(earring);
      addToWishlist(wishlistItem);
    }
  };

  const formatPrice = (price: number, currency: string) => {
    const symbol = currency === 'GBP' ? '£' : currency === 'USD' ? '$' : '€';
    return `${symbol}${price.toFixed(2)}`;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? 'text-green-700 fill-current'
            : i < rating
              ? 'text-green-700 fill-current opacity-50'
              : 'text-gray-300'
        }`}
      />
    ));
  };

  const handleImageClick = (index: number) => {
    setSelectedImage(index);
  };

  // Calculate average rating and total reviews
  const averageRating = earring.averageRating || 0;
  const totalReviews = earring.totalReviews || 0;
  const hasReviews = earring.reviews && earring.reviews.length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-900 mb-6">
        <span>Home</span> / <span>Earrings</span> / <span>{earring.name}</span>
      </div>

      {/* Main Layout - Responsive */}
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 mb-12">
        {/* Images Section */}
        <div className="flex-1 lg:flex-none lg:w-3/5">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Thumbnail Images - Above main image on mobile/tablet, left side on desktop */}
            <div className="order-1 lg:order-1 flex xs:flex-row lg:flex-col space-x-2 lg:space-x-0 lg:space-y-2 overflow-x-auto lg:overflow-visible lg:w-20">
              {allImages.length > 0 &&
                allImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => handleImageClick(index)}
                    className={`flex-shrink-0 w-16 h-16 lg:w-20 lg:h-20 aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                      selectedImage === index
                        ? 'border-green-700 scale-105'
                        : 'border-transparent hover:border-gray-300 hover:scale-102'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${earring.name} view ${index + 1}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
            </div>

            {/* Main Image - Only display the selected image */}
            <div id="main-images" className="order-2 lg:order-2 flex-1">
              {allImages.length > 0 ? (
                <div className="w-full h-96 lg:h-[500px] bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={allImages[selectedImage]}
                    alt={`${earring.name} view ${selectedImage + 1}`}
                    width={600}
                    height={600}
                    className="w-full h-full object-cover"
                    priority={selectedImage === 0}
                  />
                </div>
              ) : (
                <div className="w-full h-96 lg:h-[500px] bg-gray-200 flex items-center justify-center rounded-lg">
                  <span className="text-gray-900">No Image Available</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Info Section */}
        <div className="flex-1 lg:w-2/5 space-y-6">
          {/* Basic Product Info */}
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold mb-2 text-gray-900">
              {earring.name}
            </h1>

            {/* Price */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xl lg:text-2xl font-bold text-gray-900">
                {formatPrice(earring.price, earring.currency)}
              </span>
              {earring.originalPrice && (
                <span className="text-lg lg:text-xl text-gray-500 line-through">
                  {formatPrice(earring.originalPrice, earring.currency)}
                </span>
              )}
            </div>

            {/* Rating */}
            {totalReviews > 0 && (
              <div className="flex items-center gap-2 mb-2">
                <div className="flex">{renderStars(averageRating)}</div>
                <span className="text-sm text-gray-900">
                  ({totalReviews} review{totalReviews !== 1 ? 's' : ''})
                </span>
              </div>
            )}

            <p className="text-gray-900 text-lg mb-4">
              {earring.material}, {earring.stone} - Size {earring.size}
            </p>
          </div>

          {/* Stock Status */}
          <div>
            {earring.inStock ? (
              <span className="text-green-600 font-medium">✓ In Stock</span>
            ) : (
              <span className="text-red-600 font-medium">Out of Stock</span>
            )}
          </div>

          {/* Description - Only on desktop in this section */}
          {earring.description && (
            <div className="hidden lg:block">
              <p className="text-gray-900 leading-relaxed">
                {earring.description}
              </p>
            </div>
          )}

          {/* Size Display */}
          <div className="bg-gray-100 p-4 rounded-lg">
            <button
              onClick={() => toggleSection('size')}
              className="w-full flex justify-between items-center text-left"
            >
              <span className="text-sm font-medium text-gray-900">Size</span>
              {expandedSections.size ? (
                <ChevronUp className="w-4 h-4 text-gray-900" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-900" />
              )}
            </button>
            {expandedSections.size && (
              <div className="mt-3">
                <span className="text-gray-900">Size {earring.size}</span>
              </div>
            )}
          </div>

          {/* Quantity Selector */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-900">
              Quantity
            </label>
            <select
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-900 w-24"
              disabled={!earring.inStock}
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleToggleWishlist}
              className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
            >
              <Heart
                className={`w-6 h-6 transition-colors ${
                  isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-500'
                }`}
              />
            </button>

            <button
              onClick={handleAddToBag}
              disabled={!earring.inStock}
              className="flex-1 bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-black font-medium py-3 px-6 rounded-lg transition-colors"
            >
              {earring.inStock ? 'Add to bag' : 'Out of Stock'}
            </button>
          </div>

          {/* Shipping Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-900">
                {earring.freeShipping || earring.price >= 150
                  ? '🚚 Free shipping'
                  : '🚚 Free shipping on orders over £150'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-900">
                {earring.warranty || '↩️ 3 year warranty'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-900">
                {earring.shippingInfo?.returnPolicy || '🔄 30 Day Returns'}
              </span>
            </div>
          </div>

          {/* Expandable Sections */}
          <div className="space-y-4 mt-8">
            {/* Description */}
            <div className="border-b-2 border-gray-400">
              <button
                onClick={() => toggleSection('description')}
                className="w-full flex justify-between items-center py-4 text-left"
              >
                <span className="text-lg font-medium text-gray-900">
                  DESCRIPTION
                </span>
                {expandedSections.description ? (
                  <ChevronUp className="w-5 h-5 text-gray-900" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-900" />
                )}
              </button>
              {expandedSections.description && (
                <div className="pb-4 transition-all duration-300">
                  <p className="text-gray-900 leading-relaxed">
                    {earring.description || 'No description available.'}
                  </p>
                </div>
              )}
            </div>

            {/* Details */}
            <div className="border-b-2 border-gray-400">
              <button
                onClick={() => toggleSection('details')}
                className="w-full flex justify-between items-center py-4 text-left"
              >
                <span className="text-lg font-medium text-gray-900">
                  DETAILS
                </span>
                {expandedSections.details ? (
                  <ChevronUp className="w-5 h-5 text-gray-900" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-900" />
                )}
              </button>
              {expandedSections.details && (
                <div className="pb-4 space-y-2 transition-all duration-300">
                  {earring.dimensions?.length && (
                    <p className="text-sm text-gray-900">
                      <strong>Length:</strong> {earring.dimensions.length}
                    </p>
                  )}
                  {earring.dimensions?.width && (
                    <p className="text-sm text-gray-900">
                      <strong>Width:</strong> {earring.dimensions.width}
                    </p>
                  )}
                  {earring.dimensions?.weight && (
                    <p className="text-sm text-gray-900">
                      <strong>Weight:</strong> {earring.dimensions.weight}
                    </p>
                  )}
                  <p className="text-sm text-gray-900">
                    <strong>Size:</strong> {earring.size}
                  </p>
                  <p className="text-sm text-gray-900">
                    <strong>Color:</strong> {earring.color}
                  </p>
                  <p className="text-sm text-gray-900">
                    <strong>Category:</strong> {earring.category}
                  </p>
                </div>
              )}
            </div>

            {/* Materials */}
            <div className="border-b-2 border-gray-400">
              <button
                onClick={() => toggleSection('materials')}
                className="w-full flex justify-between items-center py-4 text-left"
              >
                <span className="text-lg font-medium text-gray-900">
                  MATERIALS
                </span>
                {expandedSections.materials ? (
                  <ChevronUp className="w-5 h-5 text-gray-900" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-900" />
                )}
              </button>
              {expandedSections.materials && (
                <div className="pb-4 transition-all duration-300">
                  <p className="text-sm text-gray-900 mb-2">
                    <strong>Material:</strong> {earring.material}
                  </p>
                  <p className="text-sm text-gray-900 mb-2">
                    <strong>Stone:</strong> {earring.stone}
                  </p>
                  {earring.careInstructions && (
                    <p className="text-sm text-gray-900">
                      <strong>Care Instructions:</strong>{' '}
                      {earring.careInstructions}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Reviews */}
            <div className="border-b-2 border-gray-400">
              <button
                onClick={() => toggleSection('reviews')}
                className="w-full flex justify-between items-center py-4 text-left"
              >
                <span className="text-lg font-medium text-gray-900">
                  REVIEWS
                </span>
                {expandedSections.reviews ? (
                  <ChevronUp className="w-5 h-5 text-gray-900" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-900" />
                )}
              </button>
              {expandedSections.reviews && (
                <div className="pb-4 space-y-4 transition-all duration-300">
                  {hasReviews ? (
                    <div className="space-y-4">
                      {earring.reviews!.map((review) => (
                        <div key={review._id}>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex">
                              {renderStars(review.rating)}
                            </div>
                            <span className="font-medium text-gray-900">
                              {review.customerName}
                            </span>
                            {review.verified && (
                              <span className="text-xs text-green-600">
                                Verified
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-900">
                            {review.comment}
                          </p>
                        </div>
                      ))}
                      <p className="text-sm text-gray-700 mt-4">
                        {totalReviews} review{totalReviews !== 1 ? 's' : ''}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-900">No reviews yet.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarringDetails;
