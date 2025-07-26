import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen bg-treva-primary overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-transparent"></div>

      <div className="relative max-w-7xl mx-auto h-screen flex items-center">
        <div className="pl-4 sm:pl-6 lg:pl-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center w-full">
          {/* Left Content */}
          <div className="space-y-8 z-10 order-2 md:order-1">
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-white leading-tight">
                Design to Be Felt,
                <span className="block">Not Just Worn</span>
              </h1>

              <p className="text-lg sm:text-xl text-gray-200 max-w-lg leading-relaxed">
                Jewelry inspired by nature, memory, and human connection.
                Discover a new language of elegance.
              </p>
            </div>

            <Link
              href="/rings"
              className="bg-gradient-gold hover:bg-amber-500 text-slate-900 font-semibold px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg inline-block text-center no-underline"
            >
              Browse Collection
            </Link>
          </div>

          {/* Right Image */}
          <div className="relative md:justify-self-end -mr-4 sm:-mr-6 md:-mr-8 xl:-mr-16 order-1 md:order-2">
            <Image
              src="https://res.cloudinary.com/dfwty72r9/image/upload/v1752625278/freepik_br_8bf8ca0e-b190-4fbc-b4d2-d7cce514740e_fvvzlj.png"
              alt="Elegant pearl necklace held delicately in hand"
              width={800}
              height={600}
              className="w-full h-auto max-w-2xl mx-auto md:mx-0 md:max-w-none object-contain"
            />
          </div>
        </div>
      </div>

      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '50px 50px',
          }}
        ></div>
      </div>
    </section>
  );
};

export default Hero;
