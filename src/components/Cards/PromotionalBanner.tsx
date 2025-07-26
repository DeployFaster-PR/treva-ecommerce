'use client';

import React from 'react';
import Image from 'next/image';

const PromotionalBanner: React.FC = () => {
  const handleShopNowClick = (): void => {
    window.location.href = '/rings';
  };

  return (
    <div className="w-full">
      {/* Desktop and Mobile View */}
      <div
        className="relative overflow-hidden"
        style={{ backgroundColor: '#046A38' }}
      >
        {/* Light gray background strip for TREVA text */}
        <div className="absolute top-4 sm:top-10 left-0 right-0 h-12 sm:h-20 bg-gray-200">
          <div className="flex items-center justify-center h-full overflow-hidden">
            <div
              className="text-gray-500 text-2xl sm:text-4xl lg:text-6xl font-bold whitespace-nowrap leading-none"
              style={{ letterSpacing: '0.2em' }}
            >
              TREVA TREVA TREVA TREVA TREVA TREVA TREVA TREVA TREVA TREVA
            </div>
          </div>
        </div>

        <div className="relative z-10 pt-20 sm:pt-40 pb-8 sm:pb-16 px-4 sm:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-center max-w-6xl mx-auto">
            {/* Left side - Jewelry image */}
            <div className="mb-6 sm:mb-0 sm:mr-8">
              <Image
                src="https://res.cloudinary.com/dfwty72r9/image/upload/v1752625662/homepage-img1_lvkzfv.png"
                alt="Gold jewelry collection"
                width={500}
                height={400}
                className="w-[500px] h-96 object-cover shadow-2xl sm:rounded-none"
              />
            </div>

            {/* Right side - Promotional content */}
            <div className="w-full sm:w-auto sm:-ml-8 lg:-ml-20">
              <div className="bg-white p-8 sm:p-14 max-w-md mx-auto text-center shadow-xl">
                <p className="text-xs sm:text-sm text-gray-600 mb-2 tracking-wide">
                  SHOP BEFORE IT ENDS
                </p>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
                  Save 20% on all orders
                </h2>
                <button
                  onClick={handleShopNowClick}
                  className="bg-gradient-gold hover:bg-gradient-gold-hover cursor-pointer text-black font-semibold px-6 sm:px-8 py-3 transition-colors duration-300 w-full sm:w-auto"
                >
                  Shop Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionalBanner;
