'use client';

import { useState } from 'react';
import { Facebook, Instagram, X, Linkedin } from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter signup
    console.log('Newsletter signup:', email);
    setEmail('');
  };

  return (
    <footer className="bg-treva-primary text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-16 md:gap-28">
          {/* Newsletter Section - Left side on desktop */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-light mb-4">
              Get exclusive access to new deals
            </h2>

            <div className="mb-6">
              <div className="bg-white rounded-4xl p-3 px-4">
                <div className="flex items-center justify-between gap-2 sm:gap-0">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email to register"
                    className="flex-1 px-2 sm:px-4 py-3 text-gray-900 placeholder-gray-700 border-0 focus:ring-0 focus:outline-none bg-transparent text-sm sm:text-base min-w-0"
                    required
                  />
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    className="bg-gradient-gold hover:bg-gradient-gold-hover px-3 sm:px-5 py-3 rounded-4xl font-medium text-white transition-all duration-300 whitespace-nowrap text-sm sm:text-base shrink-0"
                  >
                    SUBMIT
                  </button>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-300 mb-8">
              You&#39;re signing up to receive product updates and newsletters.
              By signing up you&#39;re consenting to our privacy policy but you
              can opt out at any time.
            </p>

            {/* Country/Currency Selector */}
            <div className="mb-6">
              <select className="bg-white text-treva-text px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-treva-accent outline-none w-full max-w-xs">
                <option>🇬🇧 United Kingdom (GBP £)</option>
                <option>🇺🇸 United States (USD $)</option>
                <option>🇪🇺 European Union (EUR €)</option>
              </select>
            </div>

            {/* Payment Methods */}
            <div className="flex space-x-2">
              <div className="bg-white rounded px-3 py-2 flex items-center">
                <span className="text-blue-600 font-bold text-sm">PayPal</span>
              </div>
              <div className="bg-white rounded px-3 py-2 flex items-center">
                <span className="text-blue-600 font-bold text-sm">VISA</span>
              </div>
            </div>
          </div>

          {/* Footer Links - Right side on desktop */}
          <div className="md:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Help Column */}
              <div>
                <h3 className="font-medium mb-4">Help</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a
                      href="#"
                      className="hover:text-gray-300 transition-colors"
                    >
                      FAQs
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-gray-300 transition-colors"
                    >
                      Shipping
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-gray-300 transition-colors"
                    >
                      Returns
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-gray-300 transition-colors"
                    >
                      Size Guides
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-gray-300 transition-colors"
                    >
                      Contact Us
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-gray-300 transition-colors"
                    >
                      Terms & Condition
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-gray-300 transition-colors"
                    >
                      Privacy Policy
                    </a>
                  </li>
                </ul>
              </div>

              {/* About Us Column */}
              <div>
                <h3 className="font-medium mb-4">About Us</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a
                      href="#"
                      className="hover:text-gray-300 transition-colors"
                    >
                      Our Mission
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-gray-300 transition-colors"
                    >
                      Our Story
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-gray-300 transition-colors"
                    >
                      Our Vision
                    </a>
                  </li>
                </ul>
              </div>

              {/* Shop Products Column */}
              <div>
                <h3 className="font-medium mb-4">Shop Products</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a
                      href="#"
                      className="hover:text-gray-300 transition-colors"
                    >
                      Bracelets
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-gray-300 transition-colors"
                    >
                      Necklaces
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-gray-300 transition-colors"
                    >
                      Earrings
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-gray-300 transition-colors"
                    >
                      Rings
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-700 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Logo and Copyright */}
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="text-xl text-treva-gold-500">TREVA</div>
              <span className="text-sm text-gray-400">
                © 2025 Annoniq. All Rights Reserved.
              </span>
            </div>

            {/* Social Media Icons */}
            <div className="flex space-x-3">
              <a
                href="#"
                className="w-8 h-8 bg-black border-1 border-white rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-black border-1 border-white rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-black border-1 border-white rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
              >
                <X className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-black border-1 border-white rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
              >
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
