import FAQComponent from '@/components/Cards/FAQComponent';
import ProductCategoryGrid from '@/components/Cards/ProductCategoryGrid';
import PromotionalBanner from '@/components/Cards/PromotionalBanner';
import TestimonialSection from '@/components/Cards/TestimonialSection';
import Hero from '@/components/Constants/Hero';
import TopPicksForYou from '@/components/TopPicksForYou';
import React from 'react';

const page = () => {
  return (
    <div>
      <Hero />
      <ProductCategoryGrid />
      <TopPicksForYou />
      <PromotionalBanner />
      <TestimonialSection />
      <FAQComponent />
    </div>
  );
};

export default page;
