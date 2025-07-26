'use client';
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: 'Do you have a warranty?',
    answer:
      'Yes, we offer a comprehensive 1-year warranty on all our products. This covers manufacturing defects and hardware failures under normal use conditions. The warranty does not cover damage caused by accidents, misuse, or normal wear and tear. To claim warranty service, simply contact our support team with your order number and proof of purchase.',
  },
  {
    question: 'What if my item arrives damaged?',
    answer:
      "If your item arrives damaged, we sincerely apologize for the inconvenience. Please contact us within 48 hours of delivery with photos of the damaged item and packaging. We'll immediately arrange for a replacement or full refund at no cost to you. We work with our shipping partners to ensure proper handling, but we stand behind every purchase 100%.",
  },
  {
    question: 'How long does delivery take?',
    answer:
      "Delivery times vary based on your location and selected shipping method. Standard shipping typically takes 3-7 business days within the continental US, while express shipping delivers in 1-3 business days. International orders may take 7-14 business days depending on customs processing. You'll receive a tracking number once your order ships so you can monitor its progress.",
  },
  {
    question: 'What is your return policy?',
    answer:
      "We offer a hassle-free 30-day return policy for most items. Products must be returned in original condition with all packaging and accessories. Simply initiate a return through your account dashboard or contact our customer service team. We'll provide a prepaid return label, and once we receive your item, we'll process your refund within 3-5 business days. Custom or personalized items may have different return terms.",
  },
];

const FAQComponent: React.FC = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index)
        ? prev.filter((item) => item !== index)
        : [...prev, index]
    );
  };

  return (
    <div id="faq" className="max-w-4xl mx-auto p-6 py-16 bg-white">
      <h2 className="text-2xl md:text-3xl font-semibold text-center text-gray-900 mb-8">
        Frequently Asked Questions?
      </h2>

      <div className="space-y-4">
        {faqData.map((item, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <button
              onClick={() => toggleItem(index)}
              className="w-full px-6 py-4 bg-gray-50 hover:bg-gray-100 text-left flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-inset transition-colors duration-200"
              aria-expanded={openItems.includes(index)}
              aria-controls={`faq-answer-${index}`}
            >
              <span className="text-base md:text-lg font-medium text-gray-900 pr-4">
                {item.question}
              </span>
              <div className="flex-shrink-0">
                {openItems.includes(index) ? (
                  <ChevronUp className="w-5 h-5 text-gray-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-600" />
                )}
              </div>
            </button>

            {openItems.includes(index) && (
              <div
                id={`faq-answer-${index}`}
                className="px-6 py-4 bg-white border-t border-gray-100 animate-in slide-in-from-top-2 duration-200"
              >
                <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                  {item.answer}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <p className="text-gray-600 text-sm md:text-base">
          Still have questions?{' '}
          <a
            href="#"
            className="text-emerald-600 hover:text-emerald-800 font-medium underline"
          >
            Contact our support team
          </a>
        </p>
      </div>
    </div>
  );
};

export default FAQComponent;
