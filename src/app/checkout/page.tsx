/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useCartStore } from '@/stores/cart-store';
import { useAuthStore } from '@/stores/auth-store';
import { ShippingInfo, Order } from '@/types/cart';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Paystack types
declare global {
  interface Window {
    PaystackPop: {
      setup: (config: {
        key: string;
        email: string;
        amount: number;
        currency: string;
        ref: string;
        callback: (response: any) => void;
        onClose: () => void;
      }) => {
        openIframe: () => void;
      };
    };
  }
}

const CheckoutPage: React.FC = () => {
  const router = useRouter();
  const { items, getCartSummary, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const cartSummary = getCartSummary();

  // Selected currency state
  const [selectedCurrency, setSelectedCurrency] = useState<
    'NGN' | 'USD' | 'GBP'
  >('NGN');

  // Currency conversion rates (you should fetch these from an API in production)
  const EXCHANGE_RATES = {
    // Base rates to NGN
    NGN: 1,
    USD: 1650, // 1 USD = 1650 NGN
    GBP: 2100, // 1 GBP = 2100 NGN
    // Cross rates
    USD_TO_GBP: 0.79, // 1 USD = 0.79 GBP
    GBP_TO_USD: 1.27, // 1 GBP = 1.27 USD
  };

  // Convert price between currencies
  const convertPrice = (
    price: number,
    fromCurrency: string,
    toCurrency: string
  ): number => {
    if (fromCurrency === toCurrency) return price;

    // Convert to NGN first, then to target currency
    let priceInNGN = price;
    if (fromCurrency !== 'NGN') {
      priceInNGN =
        price * EXCHANGE_RATES[fromCurrency as keyof typeof EXCHANGE_RATES];
    }

    if (toCurrency === 'NGN') {
      return Math.round(priceInNGN);
    } else if (toCurrency === 'USD') {
      return Math.round((priceInNGN / EXCHANGE_RATES.USD) * 100) / 100;
    } else if (toCurrency === 'GBP') {
      return Math.round((priceInNGN / EXCHANGE_RATES.GBP) * 100) / 100;
    }

    return price;
  };

  // Convert cart summary to selected currency
  const convertedSubtotal = convertPrice(
    cartSummary.subtotal,
    cartSummary.currency,
    selectedCurrency
  );

  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: 'Nigeria',
    postalCode: '',
  });

  const [shippingOption, setShippingOption] = useState<
    'standard' | 'express' | 'overnight'
  >('standard');
  const [paymentMethod, setPaymentMethod] = useState<
    'paystack' | 'bank_transfer'
  >('paystack');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<Partial<ShippingInfo>>({});

  // Load Paystack script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.push('/');
    }
  }, [items.length, router]);

  // Calculate shipping cost based on option (in selected currency)
  const getShippingCost = () => {
    const freeShippingThreshold =
      selectedCurrency === 'NGN'
        ? 315000
        : selectedCurrency === 'USD'
          ? 190
          : 150;

    if (convertedSubtotal >= freeShippingThreshold) return 0;

    switch (shippingOption) {
      case 'standard':
        return 0; // Free pickup
      case 'express':
        return selectedCurrency === 'NGN'
          ? 42000
          : selectedCurrency === 'USD'
            ? 25
            : 20;
      case 'overnight':
        return selectedCurrency === 'NGN'
          ? 147000
          : selectedCurrency === 'USD'
            ? 89
            : 70;
      default:
        return 0;
    }
  };

  const shippingCost = getShippingCost();
  const totalAmount = convertedSubtotal + shippingCost;

  const formatPrice = (price: number, currency: string = selectedCurrency) => {
    const symbol = currency === 'NGN' ? '₦' : currency === 'USD' ? '$' : '£';

    if (currency === 'NGN') {
      return `${symbol}${price.toLocaleString()}`;
    } else {
      return `${symbol}${price.toFixed(2)}`;
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ShippingInfo> = {};

    if (!shippingInfo.firstName.trim())
      newErrors.firstName = 'First name is required';
    if (!shippingInfo.lastName.trim())
      newErrors.lastName = 'Last name is required';
    if (!shippingInfo.email.trim()) newErrors.email = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(shippingInfo.email))
      newErrors.email = 'Email is invalid';
    if (!shippingInfo.phone.trim())
      newErrors.phone = 'Phone number is required';
    if (!shippingInfo.address.trim()) newErrors.address = 'Address is required';
    if (!shippingInfo.city.trim()) newErrors.city = 'City is required';
    if (!shippingInfo.state.trim()) newErrors.state = 'State is required';
    if (!shippingInfo.postalCode.trim())
      newErrors.postalCode = 'Postal code is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof ShippingInfo, value: string) => {
    setShippingInfo((prev: ShippingInfo) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev: Partial<ShippingInfo>) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const generateOrderReference = () => {
    return `TREVA_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const handlePaystackPayment = () => {
    if (!validateForm()) return;

    const reference = generateOrderReference();

    // Convert amount to appropriate minor units based on currency
    let amountInMinorUnits: number;
    let paystackCurrency: string;

    if (selectedCurrency === 'NGN') {
      amountInMinorUnits = totalAmount * 100; // Convert to kobo
      paystackCurrency = 'NGN';
    } else if (selectedCurrency === 'USD') {
      amountInMinorUnits = Math.round(totalAmount * 100); // Convert to cents
      paystackCurrency = 'USD';
    } else {
      // GBP
      amountInMinorUnits = Math.round(totalAmount * 100); // Convert to pence
      paystackCurrency = 'GBP';
    }

    const handler = window.PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
      email: shippingInfo.email,
      amount: amountInMinorUnits,
      currency: paystackCurrency,
      ref: reference,
      callback: function (response) {
        console.log('Payment successful:', response);
        handlePaymentSuccess(response, reference);
      },
      onClose: function () {
        setIsProcessing(false);
        console.log('Payment window closed');
      },
    });

    setIsProcessing(true);
    handler.openIframe();
  };

  const handlePaymentSuccess = async (
    response: any,
    orderReference: string
  ) => {
    try {
      // Create order object
      const order: Order = {
        id: orderReference,
        userId: user?.id,
        items: items.map((item) => ({
          productId: item.productId,
          name: item.name,
          price: convertPrice(item.price, item.currency, selectedCurrency),
          quantity: item.quantity,
          size: item.size,
          productType: item.productType,
        })),
        shippingInfo,
        subtotal: convertedSubtotal,
        shipping: shippingCost,
        total: totalAmount,
        currency: selectedCurrency,
        paymentReference: response.reference,
        status: 'completed',
        createdAt: new Date().toISOString(),
      };

      // Here you would typically:
      // 1. Save the order to your database
      // 2. Send confirmation email
      // 3. Update inventory

      console.log('Order created:', order);

      // Clear cart and redirect to success page
      clearCart();
      router.push(`/order-success?ref=${orderReference}`);
    } catch (error) {
      console.error('Error processing order:', error);
      setIsProcessing(false);
      // Handle error - show error message to user
    }
  };

  const handleBankTransfer = () => {
    if (!validateForm()) return;

    // Handle bank transfer logic here
    console.log('Bank transfer selected');
    // You would typically show bank details and order reference
  };

  const handlePlaceOrder = () => {
    if (paymentMethod === 'paystack') {
      handlePaystackPayment();
    } else {
      handleBankTransfer();
    }
  };

  if (items.length === 0) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-lg font-medium text-gray-900">
                Checkout
              </span>
            </div>
            <Link
              href="/"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Shopping</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Free Shipping Banner */}
      <div className="bg-black text-white text-center py-2 px-4 text-sm">
        FREE SHIPPING ON ORDERS OVER{' '}
        {selectedCurrency === 'NGN'
          ? '₦315,000'
          : selectedCurrency === 'USD'
            ? '$190'
            : '£150'}
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Forms */}
          <div className="space-y-8">
            {/* Currency Selector */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Currency
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Choose your preferred currency for checkout
              </p>

              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setSelectedCurrency('NGN')}
                  className={`p-3 border rounded-lg text-center transition-colors ${
                    selectedCurrency === 'NGN'
                      ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="font-medium">₦ NGN</div>
                  <div className="text-xs text-gray-600">Nigerian Naira</div>
                </button>
                <button
                  onClick={() => setSelectedCurrency('USD')}
                  className={`p-3 border rounded-lg text-center transition-colors ${
                    selectedCurrency === 'USD'
                      ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="font-medium">$ USD</div>
                  <div className="text-xs text-gray-600">US Dollar</div>
                </button>
                <button
                  onClick={() => setSelectedCurrency('GBP')}
                  className={`p-3 border rounded-lg text-center transition-colors ${
                    selectedCurrency === 'GBP'
                      ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="font-medium">£ GBP</div>
                  <div className="text-xs text-gray-600">British Pound</div>
                </button>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Contact Information
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                We&apos;ll use this email to send you details and updates about
                your order
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email address *
                  </label>
                  <input
                    type="email"
                    value={shippingInfo.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Shipping Address
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Enter the address where you want your order delivered
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First name *
                  </label>
                  <input
                    type="text"
                    value={shippingInfo.firstName}
                    onChange={(e) =>
                      handleInputChange('firstName', e.target.value)
                    }
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                      errors.firstName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last name *
                  </label>
                  <input
                    type="text"
                    value={shippingInfo.lastName}
                    onChange={(e) =>
                      handleInputChange('lastName', e.target.value)
                    }
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                      errors.lastName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address *
                </label>
                <input
                  type="text"
                  value={shippingInfo.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                    errors.address ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Street address"
                />
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    value={shippingInfo.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                      errors.city ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State *
                  </label>
                  <select
                    value={shippingInfo.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                      errors.state ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select State</option>
                    <option value="Lagos">Lagos</option>
                    <option value="Abuja">Abuja</option>
                    <option value="Rivers">Rivers</option>
                    <option value="Kano">Kano</option>
                    <option value="Ogun">Ogun</option>
                    {/* Add more states as needed */}
                  </select>
                  {errors.state && (
                    <p className="text-red-500 text-sm mt-1">{errors.state}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone number *
                  </label>
                  <input
                    type="tel"
                    value={shippingInfo.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="+234 xxx xxx xxxx"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Postal code *
                  </label>
                  <input
                    type="text"
                    value={shippingInfo.postalCode}
                    onChange={(e) =>
                      handleInputChange('postalCode', e.target.value)
                    }
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                      errors.postalCode ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.postalCode && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.postalCode}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Shipping Options */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Shipping Options
              </h2>

              <div className="space-y-3">
                <label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="shipping"
                      value="standard"
                      checked={shippingOption === 'standard'}
                      onChange={(e) => setShippingOption(e.target.value as any)}
                      className="mr-3"
                    />
                    <div>
                      <p className="font-medium text-gray-900">
                        Pickup at store, 24 calls etc, Lagos
                      </p>
                      <p className="text-sm text-gray-600">
                        Pickup at store, 24 calls etc, Lagos
                      </p>
                    </div>
                  </div>
                  <span className="font-medium text-gray-900">FREE</span>
                </label>

                <label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="shipping"
                      value="express"
                      checked={shippingOption === 'express'}
                      onChange={(e) => setShippingOption(e.target.value as any)}
                      className="mr-3"
                    />
                    <div>
                      <p className="font-medium text-gray-900">
                        Doorstep Lagos - Door step delivery
                      </p>
                      <p className="text-sm text-gray-600">
                        Will be waiting days(14 days delivery)
                      </p>
                    </div>
                  </div>
                  <span className="font-medium text-gray-900">
                    {formatPrice(
                      selectedCurrency === 'NGN'
                        ? 42000
                        : selectedCurrency === 'USD'
                          ? 25
                          : 20
                    )}
                  </span>
                </label>

                <label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="shipping"
                      value="overnight"
                      checked={shippingOption === 'overnight'}
                      onChange={(e) => setShippingOption(e.target.value as any)}
                      className="mr-3"
                    />
                    <div>
                      <p className="font-medium text-gray-900">
                        Doorstep Lagos - Door step delivery
                      </p>
                      <p className="text-sm text-gray-600">
                        DHL delivery service(5 to 8 working days)
                      </p>
                    </div>
                  </div>
                  <span className="font-medium text-gray-900">
                    {formatPrice(
                      selectedCurrency === 'NGN'
                        ? 147000
                        : selectedCurrency === 'USD'
                          ? 89
                          : 70
                    )}
                  </span>
                </label>
              </div>
            </div>

            {/* Payment Options */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Payment Options
              </h2>

              <div className="space-y-3">
                <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="paystack"
                    checked={paymentMethod === 'paystack'}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="mr-3"
                  />
                  <div>
                    <p className="font-medium text-gray-900">
                      Debit/Credit Cards
                    </p>
                    <p className="text-sm text-gray-600">
                      Make payment using your debit or credit card
                    </p>
                  </div>
                </label>

                <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="bank_transfer"
                    checked={paymentMethod === 'bank_transfer'}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="mr-3"
                  />
                  <div>
                    <p className="font-medium text-gray-900">
                      Direct bank transfer
                    </p>
                    <p className="text-sm text-gray-600">
                      Make payment directly to our bank account
                    </p>
                  </div>
                </label>
              </div>

              <div className="mt-6">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" required />
                  <span className="text-sm text-gray-600">
                    Add me to your order
                  </span>
                </label>
              </div>

              <div className="mt-4 text-sm text-gray-600">
                <p>
                  By proceeding with your purchase you agree to our{' '}
                  <Link href="/terms" className="text-blue-600 hover:underline">
                    Terms and Conditions
                  </Link>{' '}
                  and{' '}
                  <Link
                    href="/privacy"
                    className="text-blue-600 hover:underline"
                  >
                    Privacy Policy
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:sticky lg:top-8 h-fit">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Order Summary
              </h2>

              {/* Order Items */}
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute -top-2 -right-2 bg-gray-900 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">
                        {item.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {item.material}, {item.stone}
                        {item.size && ` - Size ${item.size}`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        {formatPrice(
                          convertPrice(
                            item.price * item.quantity,
                            item.currency,
                            selectedCurrency
                          )
                        )}
                      </p>
                      {item.originalPrice && (
                        <p className="text-sm text-gray-400 line-through">
                          {formatPrice(
                            convertPrice(
                              item.originalPrice * item.quantity,
                              item.currency,
                              selectedCurrency
                            )
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Totals */}
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">
                    {formatPrice(convertedSubtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery</span>
                  <span className="text-gray-900">
                    {shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}
                  </span>
                </div>
                <div className="flex justify-between font-semibold text-lg pt-2 border-t border-gray-200">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">
                    {formatPrice(totalAmount)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-3">
                <Link
                  href="/"
                  className="w-full bg-white hover:bg-gray-50 text-gray-900 font-medium py-3 px-6 rounded-lg border border-gray-300 transition-colors text-center block"
                >
                  Return to Cart
                </Link>
                <button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-black font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  {isProcessing ? 'Processing...' : 'Place Order'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
