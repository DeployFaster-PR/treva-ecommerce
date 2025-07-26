// bulkUploadRings.js

import { createClient } from '@sanity/client';

// Initialize Sanity client with direct values
const client = createClient({
  projectId: 'raxxjas2',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: 'tokenvalue',
  useCdn: false,
});

console.log('Sanity client created successfully!');

// Sample rings data - 15 different rings
const ringsData = [
  {
    name: 'Classic Diamond Solitaire Ring',
    slug: 'classic-diamond-solitaire-ring',
    description:
      'Timeless elegance in this classic diamond solitaire ring. Features a brilliant round-cut diamond set in premium white gold for the perfect engagement ring.',
    price: 1299.99,
    originalPrice: 1599.0,
    currency: 'GBP',
    material: '18k White Gold',
    stone: 'Diamond',
    color: 'White',
    category: 'Engagement',
    size: 'M',
    mainImageUrl:
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625803/gold-ring-with-shiny-diamond-stone-it_thgjsd.png',
    imageUrls: [
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625803/gold-ring-with-shiny-diamond-stone-it_thgjsd.png',
    ],
    dimensions: {
      length: '18mm',
      width: '4mm',
      weight: '3.2g',
    },
    inStock: true,
    stockQuantity: 12,
    freeShipping: true,
    shippingInfo: {
      estimatedDays: 3,
      returnPolicy: '30-day return policy',
    },
    featured: true,
    active: true,
    careInstructions:
      'Clean with jewelry cleaner and soft brush. Store in provided box.',
    warranty: '2 year warranty',
  },
  {
    name: 'Vintage Rose Gold Band',
    slug: 'vintage-rose-gold-band',
    description:
      'Beautifully crafted vintage-style rose gold wedding band with intricate detailing. Perfect for those who love classic romance.',
    price: 189.99,
    originalPrice: null,
    currency: 'GBP',
    material: '14k Rose Gold',
    stone: 'None',
    color: 'Rose Gold',
    category: 'Wedding',
    size: 'N',
    mainImageUrl:
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625803/gold-ring-with-shiny-diamond-stone-it_thgjsd.png',
    imageUrls: [
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625803/gold-ring-with-shiny-diamond-stone-it_thgjsd.png',
    ],
    dimensions: {
      length: '16mm',
      width: '3mm',
      weight: '2.8g',
    },
    inStock: true,
    stockQuantity: 25,
    freeShipping: false,
    shippingInfo: {
      estimatedDays: 5,
      returnPolicy: '30-day return policy',
    },
    featured: false,
    active: true,
    careInstructions: 'Polish with soft cloth. Avoid harsh chemicals.',
    warranty: '1 year warranty',
  },
  {
    name: 'Sapphire Halo Engagement Ring',
    slug: 'sapphire-halo-engagement-ring',
    description:
      'Stunning blue sapphire surrounded by brilliant diamonds in a halo setting. A unique alternative to traditional diamond engagement rings.',
    price: 899.99,
    originalPrice: 1099.0,
    currency: 'GBP',
    material: 'Platinum',
    stone: 'Sapphire',
    color: 'Blue',
    category: 'Engagement',
    size: 'L',
    mainImageUrl:
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625803/gold-ring-with-shiny-diamond-stone-it_thgjsd.png',
    imageUrls: [
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625803/gold-ring-with-shiny-diamond-stone-it_thgjsd.png',
    ],
    dimensions: {
      length: '19mm',
      width: '5mm',
      weight: '4.1g',
    },
    inStock: true,
    stockQuantity: 8,
    freeShipping: true,
    shippingInfo: {
      estimatedDays: 3,
      returnPolicy: '30-day return policy',
    },
    featured: true,
    active: true,
    careInstructions: 'Clean with warm soapy water and soft brush.',
    warranty: '2 year warranty',
  },
  {
    name: 'Minimalist Silver Stack Ring',
    slug: 'minimalist-silver-stack-ring',
    description:
      'Modern and minimalist silver stacking ring. Perfect for everyday wear or stacking with other rings for a contemporary look.',
    price: 39.99,
    originalPrice: null,
    currency: 'GBP',
    material: 'Sterling Silver',
    stone: 'None',
    color: 'Silver',
    category: 'Statement',
    size: 'O',
    mainImageUrl:
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625803/gold-ring-with-shiny-diamond-stone-it_thgjsd.png',
    imageUrls: [
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625803/gold-ring-with-shiny-diamond-stone-it_thgjsd.png',
    ],
    dimensions: {
      length: '15mm',
      width: '2mm',
      weight: '1.5g',
    },
    inStock: true,
    stockQuantity: 50,
    freeShipping: false,
    shippingInfo: {
      estimatedDays: 7,
      returnPolicy: '30-day return policy',
    },
    featured: false,
    active: true,
    careInstructions: 'Clean with silver polish. Store in anti-tarnish pouch.',
    warranty: '1 year warranty',
  },
  {
    name: 'Emerald Cut Ruby Cocktail Ring',
    slug: 'emerald-cut-ruby-cocktail-ring',
    description:
      'Bold and dramatic cocktail ring featuring a stunning emerald-cut ruby. Perfect statement piece for special occasions.',
    price: 679.99,
    originalPrice: 829.0,
    currency: 'GBP',
    material: '14k Yellow Gold',
    stone: 'Ruby',
    color: 'Red',
    category: 'Cocktail',
    size: 'P',
    mainImageUrl:
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625803/gold-ring-with-shiny-diamond-stone-it_thgjsd.png',
    imageUrls: [
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625803/gold-ring-with-shiny-diamond-stone-it_thgjsd.png',
    ],
    dimensions: {
      length: '20mm',
      width: '6mm',
      weight: '5.2g',
    },
    inStock: true,
    stockQuantity: 6,
    freeShipping: true,
    shippingInfo: {
      estimatedDays: 4,
      returnPolicy: '30-day return policy',
    },
    featured: false,
    active: true,
    careInstructions: 'Professional cleaning recommended. Avoid impact.',
    warranty: '2 year warranty',
  },
  {
    name: 'Art Deco Inspired Eternity Band',
    slug: 'art-deco-inspired-eternity-band',
    description:
      'Exquisite Art Deco inspired eternity band with geometric diamond patterns. A celebration of vintage glamour and timeless style.',
    price: 459.99,
    originalPrice: null,
    currency: 'GBP',
    material: '18k White Gold',
    stone: 'Diamond',
    color: 'White',
    category: 'Eternity',
    size: 'K',
    mainImageUrl:
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625803/gold-ring-with-shiny-diamond-stone-it_thgjsd.png',
    imageUrls: [
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625803/gold-ring-with-shiny-diamond-stone-it_thgjsd.png',
    ],
    dimensions: {
      length: '17mm',
      width: '4mm',
      weight: '3.8g',
    },
    inStock: false,
    stockQuantity: 0,
    freeShipping: true,
    shippingInfo: {
      estimatedDays: 14,
      returnPolicy: '30-day return policy',
    },
    featured: false,
    active: true,
    careInstructions: 'Regular professional cleaning recommended.',
    warranty: '2 year warranty',
  },
  {
    name: 'Bohemian Moonstone Ring',
    slug: 'bohemian-moonstone-ring',
    description:
      'Mystical moonstone ring with silver plated bohemian design. Features an oval moonstone with beautiful adularescence effect.',
    price: 89.99,
    originalPrice: 115.0,
    currency: 'GBP',
    material: 'Silver Plated',
    stone: 'Moonstone',
    color: 'White',
    category: 'Statement',
    size: 'M',
    mainImageUrl:
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625803/gold-ring-with-shiny-diamond-stone-it_thgjsd.png',
    imageUrls: [
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625803/gold-ring-with-shiny-diamond-stone-it_thgjsd.png',
    ],
    dimensions: {
      length: '18mm',
      width: '5mm',
      weight: '2.9g',
    },
    inStock: true,
    stockQuantity: 18,
    freeShipping: false,
    shippingInfo: {
      estimatedDays: 6,
      returnPolicy: '30-day return policy',
    },
    featured: false,
    active: true,
    careInstructions: 'Handle gently. Clean with soft damp cloth only.',
    warranty: '1 year warranty',
  },
  {
    name: 'Three Stone Diamond Ring',
    slug: 'three-stone-diamond-ring',
    description:
      'Elegant three stone diamond ring representing past, present, and future. Each diamond perfectly matched for brilliance and clarity.',
    price: 1899.99,
    originalPrice: 2299.0,
    currency: 'GBP',
    material: 'Platinum',
    stone: 'Diamond',
    color: 'White',
    category: 'Engagement',
    size: 'N',
    mainImageUrl:
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625803/gold-ring-with-shiny-diamond-stone-it_thgjsd.png',
    imageUrls: [
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625803/gold-ring-with-shiny-diamond-stone-it_thgjsd.png',
    ],
    dimensions: {
      length: '19mm',
      width: '5mm',
      weight: '4.5g',
    },
    inStock: true,
    stockQuantity: 4,
    freeShipping: true,
    shippingInfo: {
      estimatedDays: 2,
      returnPolicy: '30-day return policy',
    },
    featured: true,
    active: true,
    careInstructions: 'Professional cleaning every 6 months recommended.',
    warranty: '2 year warranty',
  },
  {
    name: 'Twisted Gold Band',
    slug: 'twisted-gold-band',
    description:
      'Contemporary twisted gold band with unique spiral design. Modern interpretation of classic wedding band styling.',
    price: 199.99,
    originalPrice: null,
    currency: 'GBP',
    material: '14k Yellow Gold',
    stone: 'None',
    color: 'Yellow Gold',
    category: 'Wedding',
    size: 'O',
    mainImageUrl:
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625803/gold-ring-with-shiny-diamond-stone-it_thgjsd.png',
    imageUrls: [
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625803/gold-ring-with-shiny-diamond-stone-it_thgjsd.png',
    ],
    dimensions: {
      length: '16mm',
      width: '3mm',
      weight: '2.4g',
    },
    inStock: true,
    stockQuantity: 32,
    freeShipping: false,
    shippingInfo: {
      estimatedDays: 5,
      returnPolicy: '30-day return policy',
    },
    featured: false,
    active: true,
    careInstructions: 'Polish with soft cloth. Professional cleaning annually.',
    warranty: '1 year warranty',
  },
  {
    name: 'Vintage Emerald Signet Ring',
    slug: 'vintage-emerald-signet-ring',
    description:
      'Distinguished emerald signet ring with traditional styling. Features a square-cut emerald in a classic signet setting.',
    price: 549.99,
    originalPrice: 649.0,
    currency: 'GBP',
    material: '18k Yellow Gold',
    stone: 'Emerald',
    color: 'Green',
    category: 'Signet',
    size: 'Q',
    mainImageUrl:
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625803/gold-ring-with-shiny-diamond-stone-it_thgjsd.png',
    imageUrls: [
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625803/gold-ring-with-shiny-diamond-stone-it_thgjsd.png',
    ],
    dimensions: {
      length: '21mm',
      width: '7mm',
      weight: '6.8g',
    },
    inStock: true,
    stockQuantity: 9,
    freeShipping: true,
    shippingInfo: {
      estimatedDays: 4,
      returnPolicy: '30-day return policy',
    },
    featured: false,
    active: true,
    careInstructions:
      'Avoid harsh chemicals. Professional cleaning recommended.',
    warranty: '2 year warranty',
  },
  {
    name: 'Delicate Rose Gold Stack Set',
    slug: 'delicate-rose-gold-stack-set',
    description:
      'Set of three delicate rose gold stacking rings with varying textures. Mix and match for a personalized stacked look.',
    price: 129.99,
    originalPrice: null,
    currency: 'GBP',
    material: '14k Rose Gold',
    stone: 'None',
    color: 'Rose Gold',
    category: 'Statement',
    size: 'L',
    mainImageUrl:
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625803/gold-ring-with-shiny-diamond-stone-it_thgjsd.png',
    imageUrls: [
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625803/gold-ring-with-shiny-diamond-stone-it_thgjsd.png',
    ],
    dimensions: {
      length: '15mm',
      width: '2mm',
      weight: '4.2g',
    },
    inStock: true,
    stockQuantity: 22,
    freeShipping: false,
    shippingInfo: {
      estimatedDays: 6,
      returnPolicy: '30-day return policy',
    },
    featured: false,
    active: true,
    careInstructions:
      'Clean with jewelry cloth. Store separately to prevent scratching.',
    warranty: '1 year warranty',
  },
  {
    name: 'Black Diamond Solitaire',
    slug: 'black-diamond-solitaire',
    description:
      'Bold and modern black diamond solitaire ring. A striking alternative to traditional white diamonds with contemporary appeal.',
    price: 799.99,
    originalPrice: 999.0,
    currency: 'GBP',
    material: '18k White Gold',
    stone: 'Black Diamond',
    color: 'Black',
    category: 'Engagement',
    size: 'M',
    mainImageUrl:
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625803/gold-ring-with-shiny-diamond-stone-it_thgjsd.png',
    imageUrls: [
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625803/gold-ring-with-shiny-diamond-stone-it_thgjsd.png',
    ],
    dimensions: {
      length: '18mm',
      width: '4mm',
      weight: '3.6g',
    },
    inStock: true,
    stockQuantity: 7,
    freeShipping: true,
    shippingInfo: {
      estimatedDays: 3,
      returnPolicy: '30-day return policy',
    },
    featured: true,
    active: true,
    careInstructions: 'Clean with soft brush and mild soap.',
    warranty: '2 year warranty',
  },
  {
    name: 'Infinity Diamond Band',
    slug: 'infinity-diamond-band',
    description:
      'Romantic infinity symbol diamond band representing eternal love. Features continuous diamond setting in infinity pattern.',
    price: 349.99,
    originalPrice: null,
    currency: 'GBP',
    material: '14k White Gold',
    stone: 'Diamond',
    color: 'White',
    category: 'Eternity',
    size: 'N',
    mainImageUrl:
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625803/gold-ring-with-shiny-diamond-stone-it_thgjsd.png',
    imageUrls: [
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625803/gold-ring-with-shiny-diamond-stone-it_thgjsd.png',
    ],
    dimensions: {
      length: '17mm',
      width: '4mm',
      weight: '2.9g',
    },
    inStock: false,
    stockQuantity: 0,
    freeShipping: false,
    shippingInfo: {
      estimatedDays: 10,
      returnPolicy: '30-day return policy',
    },
    featured: false,
    active: true,
    careInstructions: 'Regular cleaning with jewelry solution recommended.',
    warranty: '1 year warranty',
  },
  {
    name: 'Antique Citrine Cocktail Ring',
    slug: 'antique-citrine-cocktail-ring',
    description:
      'Vintage-inspired citrine cocktail ring with ornate detailing. Features a large oval citrine in an elaborate antique-style setting.',
    price: 289.99,
    originalPrice: 359.0,
    currency: 'GBP',
    material: 'Sterling Silver',
    stone: 'Citrine',
    color: 'Yellow',
    category: 'Cocktail',
    size: 'P',
    mainImageUrl:
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625803/gold-ring-with-shiny-diamond-stone-it_thgjsd.png',
    imageUrls: [
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625803/gold-ring-with-shiny-diamond-stone-it_thgjsd.png',
    ],
    dimensions: {
      length: '22mm',
      width: '8mm',
      weight: '7.1g',
    },
    inStock: true,
    stockQuantity: 11,
    freeShipping: true,
    shippingInfo: {
      estimatedDays: 5,
      returnPolicy: '30-day return policy',
    },
    featured: false,
    active: true,
    careInstructions:
      'Clean gently with soft cloth. Avoid ultrasonic cleaners.',
    warranty: '1 year warranty',
  },
  {
    name: 'Modern Geometric Statement Ring',
    slug: 'modern-geometric-statement-ring',
    description:
      'Contemporary geometric statement ring with angular design. Perfect for those who love modern architectural jewelry.',
    price: 159.99,
    originalPrice: null,
    currency: 'GBP',
    material: 'Sterling Silver',
    stone: 'None',
    color: 'Silver',
    category: 'Statement',
    size: 'O',
    mainImageUrl:
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625803/gold-ring-with-shiny-diamond-stone-it_thgjsd.png',
    imageUrls: [
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625803/gold-ring-with-shiny-diamond-stone-it_thgjsd.png',
    ],
    dimensions: {
      length: '20mm',
      width: '6mm',
      weight: '4.8g',
    },
    inStock: true,
    stockQuantity: 15,
    freeShipping: false,
    shippingInfo: {
      estimatedDays: 7,
      returnPolicy: '30-day return policy',
    },
    featured: false,
    active: true,
    careInstructions: 'Polish with silver cloth. Store in anti-tarnish bag.',
    warranty: '1 year warranty',
  },
];

// Sample reviews data - 5 different reviews
const reviewsData = [
  {
    customerName: 'Victoria Sterling',
    rating: 5,
    comment:
      'Absolutely breathtaking ring! The craftsmanship is impeccable and it fits perfectly. Exceeded all my expectations and I receive compliments constantly.',
    verified: true,
  },
  {
    customerName: 'Alexander Hayes',
    rating: 4,
    comment:
      'High quality ring with beautiful detailing. The stone is gorgeous and catches light beautifully. Shipping was fast and packaging was elegant.',
    verified: true,
  },
  {
    customerName: 'Isabella Rodriguez',
    rating: 5,
    comment:
      'This ring is a masterpiece! The design is unique and the quality is outstanding. It arrived exactly as described and I could not be happier with my purchase.',
    verified: false,
  },
  {
    customerName: 'James Wellington',
    rating: 4,
    comment:
      'Excellent ring with superb build quality. The metal feels substantial and the finish is flawless. Great value for the price point offered.',
    verified: true,
  },
  {
    customerName: 'Sophia Mitchell',
    rating: 5,
    comment:
      'Stunning piece of jewelry! The ring is even more beautiful in person. Perfect for special occasions and everyday wear. Highly recommend this brand.',
    verified: true,
  },
];

// Function to create reviews
async function createReviews() {
  console.log('Creating reviews...');
  const createdReviews = [];

  for (const reviewData of reviewsData) {
    try {
      const review = await client.create({
        _type: 'ringReview',
        ...reviewData,
      });
      createdReviews.push(review);
      console.log(`Created review: ${review.customerName}`);
    } catch (error) {
      console.error('Error creating review:', error);
    }
  }

  return createdReviews;
}

// Function to bulk upload rings
async function bulkUploadRings() {
  console.log('🚀 Starting bulk rings upload...');
  console.log(`📦 Total rings to upload: ${ringsData.length}`);

  // First create reviews
  const reviews = await createReviews();

  let successCount = 0;
  let failureCount = 0;

  for (const ringData of ringsData) {
    try {
      console.log(`\n⏳ Processing: ${ringData.name}`);

      // Assign random reviews to this ring
      const randomReviews = reviews
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.floor(Math.random() * 3) + 1)
        .map((review) => ({
          _type: 'reference',
          _ref: review._id,
        }));

      // Calculate average rating
      const totalRating = randomReviews.reduce((sum, reviewRef) => {
        const review = reviews.find((r) => r._id === reviewRef._ref);
        return sum + (review ? review.rating : 0);
      }, 0);
      const averageRating =
        randomReviews.length > 0 ? totalRating / randomReviews.length : 0;

      // Prepare ring document
      const ringDoc = {
        _type: 'ring',
        name: ringData.name,
        slug: {
          _type: 'slug',
          current: ringData.slug,
        },
        description: ringData.description,
        price: ringData.price,
        originalPrice: ringData.originalPrice,
        currency: ringData.currency,
        material: ringData.material,
        stone: ringData.stone,
        color: ringData.color,
        category: ringData.category,
        size: ringData.size,
        mainImageUrl: ringData.mainImageUrl,
        imageUrls: ringData.imageUrls,
        dimensions: ringData.dimensions,
        inStock: ringData.inStock,
        stockQuantity: ringData.stockQuantity,
        freeShipping: ringData.freeShipping,
        shippingInfo: ringData.shippingInfo,
        reviews: randomReviews,
        averageRating: Math.round(averageRating * 10) / 10,
        totalReviews: randomReviews.length,
        featured: ringData.featured,
        active: ringData.active,
        careInstructions: ringData.careInstructions,
        warranty: ringData.warranty,
        seoTitle: `${ringData.name} - Premium Jewelry | TREVA`,
        seoDescription: ringData.description.substring(0, 150) + '...',
      };

      // Create ring document
      const result = await client.create(ringDoc);
      console.log(`✅ Successfully created: ${result.name}`);
      successCount++;
    } catch (error) {
      console.error(`❌ Error creating ring ${ringData.name}:`, error);
      failureCount++;
    }
  }

  console.log('\n🎉 Bulk upload complete!');
  console.log(`✅ Successful uploads: ${successCount}`);
  console.log(`❌ Failed uploads: ${failureCount}`);
  console.log(`📊 Total processed: ${successCount + failureCount}`);
}

// Add debugging and start the upload tool immediately
console.log('🔍 About to start bulk upload...');

bulkUploadRings().catch((error) => {
  console.error('❌ Bulk upload failed:', error);
  process.exit(1);
});

// Export for use in other scripts
export { bulkUploadRings, ringsData, reviewsData, client };
