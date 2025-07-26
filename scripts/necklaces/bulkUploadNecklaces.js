// bulkUploadNecklaces.js

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

// Sample necklaces data - replace with your actual data
const necklacesData = [
  {
    name: 'Elegant Pearl Pendant Necklace',
    slug: 'elegant-pearl-pendant-necklace',
    description:
      'A sophisticated pearl pendant necklace featuring lustrous cultured pearls set in sterling silver. Perfect for both casual and formal occasions.',
    price: 89.99,
    originalPrice: 119.99,
    currency: 'GBP',
    material: 'Sterling Silver',
    stone: 'Pearl',
    color: 'White',
    category: 'Pendant',
    size: 'Medium',
    mainImageUrl:
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625975/Image_fx_16_p6wkra.png',
    imageUrls: [
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625975/Image_fx_16_p6wkra.png',
    ],
    dimensions: {
      length: '18 inches',
      width: '8mm',
      weight: '12g',
    },
    inStock: true,
    stockQuantity: 25,
    freeShipping: true,
    shippingInfo: {
      estimatedDays: 3,
      returnPolicy: '30-day return policy',
    },
    featured: true,
    active: true,
    careInstructions:
      'Clean with a soft cloth. Store in a jewelry box. Avoid contact with perfume and chemicals.',
    warranty: '1 year warranty against manufacturing defects',
  },
  {
    name: 'Layered Gold Chain Necklace',
    slug: 'layered-gold-chain-necklace',
    description:
      'Multi-layered gold plated chain necklace with varying lengths. Creates a stunning cascading effect perfect for modern styling.',
    price: 65.0,
    originalPrice: null,
    currency: 'GBP',
    material: '9k Gold Plated',
    stone: 'None',
    color: 'Gold',
    category: 'Layered',
    size: 'Long',
    mainImageUrl:
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625975/Image_fx_16_p6wkra.png',
    imageUrls: [
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625975/Image_fx_16_p6wkra.png',
    ],
    dimensions: {
      length: '16-22 inches',
      width: '2-4mm',
      weight: '18g',
    },
    inStock: true,
    stockQuantity: 15,
    freeShipping: false,
    shippingInfo: {
      estimatedDays: 5,
      returnPolicy: '14-day return policy',
    },
    featured: false,
    active: true,
    careInstructions:
      'Wipe with a dry cloth after use. Store separately to prevent tangling.',
    warranty: '6 months warranty',
  },
  {
    name: 'Vintage Amethyst Choker',
    slug: 'vintage-amethyst-choker',
    description:
      'Vintage-inspired choker featuring genuine amethyst stones in an antique silver setting. A statement piece with timeless appeal.',
    price: 125.5,
    originalPrice: 150.0,
    currency: 'GBP',
    material: '925 Sterling Gold',
    stone: 'Amethyst',
    color: 'None',
    category: 'Choker',
    size: 'Choker',
    mainImageUrl:
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625975/Image_fx_16_p6wkra.png',
    imageUrls: [
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625975/Image_fx_16_p6wkra.png',
    ],
    dimensions: {
      length: '14 inches',
      width: '12mm',
      weight: '22g',
    },
    inStock: true,
    stockQuantity: 8,
    freeShipping: true,
    shippingInfo: {
      estimatedDays: 2,
      returnPolicy: '30-day return policy',
    },
    featured: true,
    active: true,
    careInstructions:
      'Clean gently with jewelry cleaner. Avoid exposure to harsh chemicals.',
    warranty: '2 year warranty',
  },
  {
    name: 'Delicate Chain Collar Necklace',
    slug: 'delicate-chain-collar-necklace',
    description:
      'Minimalist collar-style necklace in rose gold plating. Features delicate chain links for a sophisticated, understated look.',
    price: 45.0,
    originalPrice: null,
    currency: 'GBP',
    material: '14k White Gold',
    stone: 'None',
    color: 'Gold',
    category: 'Collar',
    size: 'Short',
    mainImageUrl:
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625975/Image_fx_16_p6wkra.png',
    imageUrls: [
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625975/Image_fx_16_p6wkra.png',
    ],
    dimensions: {
      length: '16 inches',
      width: '3mm',
      weight: '8g',
    },
    inStock: true,
    stockQuantity: 30,
    freeShipping: false,
    shippingInfo: {
      estimatedDays: 4,
      returnPolicy: '30-day return policy',
    },
    featured: false,
    active: true,
    careInstructions:
      'Polish regularly with soft cloth. Store in provided pouch.',
    warranty: '1 year warranty',
  },
  {
    name: 'Bohemian Citrine Lariat',
    slug: 'bohemian-citrine-lariat',
    description:
      'Flowing lariat necklace featuring warm citrine gemstones. Perfect for layering or wearing alone for a bohemian-chic look.',
    price: 78.99,
    originalPrice: 95.0,
    currency: 'GBP',
    material: 'Silver Plated',
    stone: 'Citrine',
    color: 'None',
    category: 'Lariat',
    size: 'Long',
    mainImageUrl:
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625975/Image_fx_16_p6wkra.png',
    imageUrls: [
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625975/Image_fx_16_p6wkra.png',
    ],
    dimensions: {
      length: '28 inches',
      width: '6mm',
      weight: '15g',
    },
    inStock: false,
    stockQuantity: 0,
    freeShipping: true,
    shippingInfo: {
      estimatedDays: 7,
      returnPolicy: '30-day return policy',
    },
    featured: false,
    active: true,
    careInstructions: 'Clean with mild soap and water. Pat dry immediately.',
    warranty: '1 year warranty',
  },
  {
    name: 'Elegant Pearl Pendant Necklace',
    slug: 'elegant-pearl-pendant-necklace',
    description:
      'A sophisticated pearl pendant necklace featuring lustrous cultured pearls set in sterling silver. Perfect for both casual and formal occasions.',
    price: 89.99,
    originalPrice: 119.99,
    currency: 'GBP',
    material: 'Sterling Silver',
    stone: 'Pearl',
    color: 'White',
    category: 'Pendant',
    size: 'Medium',
    mainImageUrl:
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625975/Image_fx_16_p6wkra.png',
    imageUrls: [
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625975/Image_fx_16_p6wkra.png',
    ],
    dimensions: {
      length: '18 inches',
      width: '8mm',
      weight: '12g',
    },
    inStock: true,
    stockQuantity: 25,
    freeShipping: true,
    shippingInfo: {
      estimatedDays: 3,
      returnPolicy: '30-day return policy',
    },
    featured: true,
    active: true,
    careInstructions:
      'Clean with a soft cloth. Store in a jewelry box. Avoid contact with perfume and chemicals.',
    warranty: '1 year warranty against manufacturing defects',
  },
  {
    name: 'Layered Gold Chain Necklace',
    slug: 'layered-gold-chain-necklace',
    description:
      'Multi-layered gold plated chain necklace with varying lengths. Creates a stunning cascading effect perfect for modern styling.',
    price: 65.0,
    originalPrice: null,
    currency: 'GBP',
    material: '9k Gold Plated',
    stone: 'None',
    color: 'Gold',
    category: 'Layered',
    size: 'Long',
    mainImageUrl:
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625975/Image_fx_16_p6wkra.png',
    imageUrls: [
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625975/Image_fx_16_p6wkra.png',
    ],
    dimensions: {
      length: '16-22 inches',
      width: '2-4mm',
      weight: '18g',
    },
    inStock: true,
    stockQuantity: 15,
    freeShipping: false,
    shippingInfo: {
      estimatedDays: 5,
      returnPolicy: '14-day return policy',
    },
    featured: false,
    active: true,
    careInstructions:
      'Wipe with a dry cloth after use. Store separately to prevent tangling.',
    warranty: '6 months warranty',
  },
  {
    name: 'Vintage Amethyst Choker',
    slug: 'vintage-amethyst-choker',
    description:
      'Vintage-inspired choker featuring genuine amethyst stones in an antique silver setting. A statement piece with timeless appeal.',
    price: 125.5,
    originalPrice: 150.0,
    currency: 'GBP',
    material: '925 Sterling Gold',
    stone: 'Amethyst',
    color: 'None',
    category: 'Choker',
    size: 'Choker',
    mainImageUrl:
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625975/Image_fx_16_p6wkra.png',
    imageUrls: [
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625975/Image_fx_16_p6wkra.png',
    ],
    dimensions: {
      length: '14 inches',
      width: '12mm',
      weight: '22g',
    },
    inStock: true,
    stockQuantity: 8,
    freeShipping: true,
    shippingInfo: {
      estimatedDays: 2,
      returnPolicy: '30-day return policy',
    },
    featured: true,
    active: true,
    careInstructions:
      'Clean gently with jewelry cleaner. Avoid exposure to harsh chemicals.',
    warranty: '2 year warranty',
  },
  {
    name: 'Delicate Chain Collar Necklace',
    slug: 'delicate-chain-collar-necklace',
    description:
      'Minimalist collar-style necklace in rose gold plating. Features delicate chain links for a sophisticated, understated look.',
    price: 45.0,
    originalPrice: null,
    currency: 'GBP',
    material: '14k White Gold',
    stone: 'None',
    color: 'Gold',
    category: 'Collar',
    size: 'Short',
    mainImageUrl:
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625975/Image_fx_16_p6wkra.png',
    imageUrls: [
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625975/Image_fx_16_p6wkra.png',
    ],
    dimensions: {
      length: '16 inches',
      width: '3mm',
      weight: '8g',
    },
    inStock: true,
    stockQuantity: 30,
    freeShipping: false,
    shippingInfo: {
      estimatedDays: 4,
      returnPolicy: '30-day return policy',
    },
    featured: false,
    active: true,
    careInstructions:
      'Polish regularly with soft cloth. Store in provided pouch.',
    warranty: '1 year warranty',
  },
  {
    name: 'Bohemian Citrine Lariat',
    slug: 'bohemian-citrine-lariat',
    description:
      'Flowing lariat necklace featuring warm citrine gemstones. Perfect for layering or wearing alone for a bohemian-chic look.',
    price: 78.99,
    originalPrice: 95.0,
    currency: 'GBP',
    material: 'Silver Plated',
    stone: 'Citrine',
    color: 'None',
    category: 'Lariat',
    size: 'Long',
    mainImageUrl:
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625975/Image_fx_16_p6wkra.png',
    imageUrls: [
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625975/Image_fx_16_p6wkra.png',
    ],
    dimensions: {
      length: '28 inches',
      width: '6mm',
      weight: '15g',
    },
    inStock: false,
    stockQuantity: 0,
    freeShipping: true,
    shippingInfo: {
      estimatedDays: 7,
      returnPolicy: '30-day return policy',
    },
    featured: false,
    active: true,
    careInstructions: 'Clean with mild soap and water. Pat dry immediately.',
    warranty: '1 year warranty',
  },
  {
    name: 'Delicate Chain Collar Necklace',
    slug: 'delicate-chain-collar-necklace',
    description:
      'Minimalist collar-style necklace in rose gold plating. Features delicate chain links for a sophisticated, understated look.',
    price: 45.0,
    originalPrice: null,
    currency: 'GBP',
    material: '14k White Gold',
    stone: 'None',
    color: 'Gold',
    category: 'Collar',
    size: 'Short',
    mainImageUrl:
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625975/Image_fx_16_p6wkra.png',
    imageUrls: [
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625975/Image_fx_16_p6wkra.png',
    ],
    dimensions: {
      length: '16 inches',
      width: '3mm',
      weight: '8g',
    },
    inStock: true,
    stockQuantity: 30,
    freeShipping: false,
    shippingInfo: {
      estimatedDays: 4,
      returnPolicy: '30-day return policy',
    },
    featured: false,
    active: true,
    careInstructions:
      'Polish regularly with soft cloth. Store in provided pouch.',
    warranty: '1 year warranty',
  },
  {
    name: 'Bohemian Citrine Lariat',
    slug: 'bohemian-citrine-lariat',
    description:
      'Flowing lariat necklace featuring warm citrine gemstones. Perfect for layering or wearing alone for a bohemian-chic look.',
    price: 78.99,
    originalPrice: 95.0,
    currency: 'GBP',
    material: 'Silver Plated',
    stone: 'Citrine',
    color: 'None',
    category: 'Lariat',
    size: 'Long',
    mainImageUrl:
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625975/Image_fx_16_p6wkra.png',
    imageUrls: [
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625975/Image_fx_16_p6wkra.png',
    ],
    dimensions: {
      length: '28 inches',
      width: '6mm',
      weight: '15g',
    },
    inStock: false,
    stockQuantity: 0,
    freeShipping: true,
    shippingInfo: {
      estimatedDays: 7,
      returnPolicy: '30-day return policy',
    },
    featured: false,
    active: true,
    careInstructions: 'Clean with mild soap and water. Pat dry immediately.',
    warranty: '1 year warranty',
  },
];

// Sample reviews data
const reviewsData = [
  {
    customerName: 'Emma Thompson',
    rating: 5,
    comment:
      'Absolutely stunning necklace! The quality is exceptional and it looks exactly as pictured. I get compliments every time I wear it.',
    verified: true,
  },
  {
    customerName: 'Sarah Johnson',
    rating: 4,
    comment:
      'Beautiful piece, well-crafted and arrived quickly. The chain is a bit shorter than I expected but still lovely.',
    verified: true,
  },
  {
    customerName: 'Maria Garcia',
    rating: 5,
    comment:
      'Perfect for layering with other necklaces. The quality is outstanding for the price point.',
    verified: false,
  },
  {
    customerName: 'Lisa Chen',
    rating: 4,
    comment:
      'Gorgeous necklace, very elegant. The packaging was beautiful too. Highly recommend!',
    verified: true,
  },
  {
    customerName: 'Anna Williams',
    rating: 5,
    comment:
      'This necklace exceeded my expectations. The stones are beautiful and the craftsmanship is excellent.',
    verified: true,
  },
  {
    customerName: 'Jessica Brown',
    rating: 3,
    comment:
      'Nice necklace but the clasp feels a bit flimsy. Otherwise happy with the purchase.',
    verified: false,
  },
  {
    customerName: 'Rachel Davis',
    rating: 5,
    comment:
      'Perfect gift for my sister. She absolutely loves it! Fast shipping and great customer service.',
    verified: true,
  },
  {
    customerName: 'Michelle Wilson',
    rating: 4,
    comment:
      'Beautiful design and good quality. Would definitely purchase from this brand again.',
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
        _type: 'necklaceReview',
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

// Function to bulk upload necklaces
async function bulkUploadNecklaces() {
  console.log('🚀 Starting bulk necklaces upload...');
  console.log(`📦 Total necklaces to upload: ${necklacesData.length}`);

  // First create reviews
  const reviews = await createReviews();

  let successCount = 0;
  let failureCount = 0;

  for (const necklaceData of necklacesData) {
    try {
      console.log(`\n⏳ Processing: ${necklaceData.name}`);

      // Assign random reviews to this necklace
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

      // Prepare necklace document
      const necklaceDoc = {
        _type: 'necklace',
        name: necklaceData.name,
        slug: {
          _type: 'slug',
          current: necklaceData.slug,
        },
        description: necklaceData.description,
        price: necklaceData.price,
        originalPrice: necklaceData.originalPrice,
        currency: necklaceData.currency,
        material: necklaceData.material,
        stone: necklaceData.stone,
        color: necklaceData.color,
        category: necklaceData.category,
        size: necklaceData.size,
        mainImageUrl: necklaceData.mainImageUrl,
        imageUrls: necklaceData.imageUrls,
        dimensions: necklaceData.dimensions,
        inStock: necklaceData.inStock,
        stockQuantity: necklaceData.stockQuantity,
        freeShipping: necklaceData.freeShipping,
        shippingInfo: necklaceData.shippingInfo,
        reviews: randomReviews,
        averageRating: Math.round(averageRating * 10) / 10,
        totalReviews: randomReviews.length,
        featured: necklaceData.featured,
        active: necklaceData.active,
        careInstructions: necklaceData.careInstructions,
        warranty: necklaceData.warranty,
        seoTitle: `${necklaceData.name} - Premium Jewelry | TREVA`,
        seoDescription: necklaceData.description.substring(0, 150) + '...',
      };

      // Create necklace document
      const result = await client.create(necklaceDoc);
      console.log(`✅ Successfully created: ${result.name}`);
      successCount++;
    } catch (error) {
      console.error(`❌ Error creating necklace ${necklaceData.name}:`, error);
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

bulkUploadNecklaces().catch((error) => {
  console.error('❌ Bulk upload failed:', error);
  process.exit(1);
});

// Export for use in other scripts
export { bulkUploadNecklaces, necklacesData, reviewsData, client };
