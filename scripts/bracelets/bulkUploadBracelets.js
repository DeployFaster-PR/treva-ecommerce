// bulkUploadBracelets.js

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

// Sample bracelets data - 15 different bracelets
const braceletsData = [
  {
    name: 'Classic Pearl Tennis Bracelet',
    slug: 'classic-pearl-tennis-bracelet',
    description:
      'Elegant tennis bracelet featuring lustrous freshwater pearls set in sterling silver. A timeless piece perfect for any occasion.',
    price: 89.99,
    originalPrice: 110.0,
    currency: 'GBP',
    material: 'Sterling Silver',
    stone: 'Pearl',
    color: 'Silver',
    category: 'Tennis',
    size: 'Medium',
    mainImageUrl:
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1753118862/bracelet_slpyrz.png',
    imageUrls: [
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625707/Image_fx_35_b6m2eb.png',
    ],
    dimensions: {
      length: '7 inches',
      width: '5mm',
      weight: '12g',
    },
    inStock: true,
    stockQuantity: 25,
    freeShipping: true,
    shippingInfo: {
      estimatedDays: 5,
      returnPolicy: '30-day return policy',
    },
    featured: true,
    active: true,
    careInstructions:
      'Clean with pearl-safe cleaner. Store separately to avoid scratches.',
    warranty: '2 year warranty',
  },
  {
    name: 'Bohemian Turquoise Beaded Bracelet',
    slug: 'bohemian-turquoise-beaded-bracelet',
    description:
      'Free-spirited beaded bracelet featuring natural turquoise stones and silver accents. Perfect for adding a boho touch to any outfit.',
    price: 34.5,
    originalPrice: null,
    currency: 'GBP',
    material: 'Silver Plated',
    stone: 'Turquoise',
    color: 'Blue',
    category: 'Beaded',
    size: 'One Size',
    mainImageUrl:
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1753118862/bracelet_slpyrz.png',
    imageUrls: [
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625707/Image_fx_35_b6m2eb.png',
    ],
    dimensions: {
      length: '7.5 inches',
      width: '8mm',
      weight: '18g',
    },
    inStock: true,
    stockQuantity: 40,
    freeShipping: false,
    shippingInfo: {
      estimatedDays: 3,
      returnPolicy: '30-day return policy',
    },
    featured: false,
    active: true,
    careInstructions: 'Avoid water and chemicals. Clean with dry cloth.',
    warranty: '1 year warranty',
  },
  {
    name: 'Rose Gold Diamond Link Bracelet',
    slug: 'rose-gold-diamond-link-bracelet',
    description:
      'Luxurious rose gold bracelet with sparkling diamond accents. Each link catches the light beautifully for maximum elegance.',
    price: 245.0,
    originalPrice: 295.0,
    currency: 'GBP',
    material: '14k Rose Gold',
    stone: 'Diamond',
    color: 'Rose Gold',
    category: 'Chain',
    size: 'Medium',
    mainImageUrl:
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1753118862/bracelet_slpyrz.png',
    imageUrls: [
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625707/Image_fx_35_b6m2eb.png',
    ],
    dimensions: {
      length: '7 inches',
      width: '6mm',
      weight: '22g',
    },
    inStock: true,
    stockQuantity: 8,
    freeShipping: true,
    shippingInfo: {
      estimatedDays: 2,
      returnPolicy: '60-day return policy',
    },
    featured: true,
    active: true,
    careInstructions:
      'Professional cleaning recommended. Store in jewelry box.',
    warranty: '5 year warranty',
  },
  {
    name: 'Vintage Amethyst Charm Bracelet',
    slug: 'vintage-amethyst-charm-bracelet',
    description:
      'Charming vintage-inspired bracelet adorned with purple amethyst stones and delicate silver charms. A whimsical addition to any collection.',
    price: 67.99,
    originalPrice: 85.0,
    currency: 'GBP',
    material: 'Sterling Silver',
    stone: 'Amethyst',
    color: 'Silver',
    category: 'Charm',
    size: 'Small',
    mainImageUrl:
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1753118862/bracelet_slpyrz.png',
    imageUrls: [
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625707/Image_fx_35_b6m2eb.png',
    ],
    dimensions: {
      length: '6.5 inches',
      width: '4mm',
      weight: '14g',
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
    careInstructions: 'Clean with silver polish. Avoid harsh chemicals.',
    warranty: '2 year warranty',
  },
  {
    name: 'Minimalist Gold Cuff Bracelet',
    slug: 'minimalist-gold-cuff-bracelet',
    description:
      'Simple yet sophisticated gold cuff bracelet. The perfect statement piece for modern minimalist style.',
    price: 125.0,
    originalPrice: null,
    currency: 'GBP',
    material: '14k Yellow Gold',
    stone: 'None',
    color: 'Gold',
    category: 'Cuff',
    size: 'One Size',
    mainImageUrl:
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1753118862/bracelet_slpyrz.png',
    imageUrls: [
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625707/Image_fx_35_b6m2eb.png',
    ],
    dimensions: {
      length: '6 inches',
      width: '15mm',
      weight: '28g',
    },
    inStock: true,
    stockQuantity: 15,
    freeShipping: true,
    shippingInfo: {
      estimatedDays: 4,
      returnPolicy: '45-day return policy',
    },
    featured: false,
    active: true,
    careInstructions: 'Polish with gold cleaner. Store flat to maintain shape.',
    warranty: '3 year warranty',
  },
  {
    name: 'Ocean Blue Sapphire Tennis Bracelet',
    slug: 'ocean-blue-sapphire-tennis-bracelet',
    description:
      'Stunning tennis bracelet featuring brilliant blue sapphires in a classic white gold setting. Makes an unforgettable impression.',
    price: 189.99,
    originalPrice: 225.0,
    currency: 'GBP',
    material: '14k White Gold',
    stone: 'Sapphire',
    color: 'White Gold',
    category: 'Tennis',
    size: 'Medium',
    mainImageUrl:
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1753118862/bracelet_slpyrz.png',
    imageUrls: [
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625707/Image_fx_35_b6m2eb.png',
    ],
    dimensions: {
      length: '7 inches',
      width: '4mm',
      weight: '16g',
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
    careInstructions: 'Professional cleaning recommended every 6 months.',
    warranty: '4 year warranty',
  },
  {
    name: 'Leather Cord Wrap Bracelet',
    slug: 'leather-cord-wrap-bracelet',
    description:
      'Casual yet stylish leather wrap bracelet with metallic accents. Perfect for everyday wear or casual occasions.',
    price: 28.99,
    originalPrice: 35.0,
    currency: 'GBP',
    material: 'Leather',
    stone: 'None',
    color: 'Brown',
    category: 'Wrap',
    size: 'One Size',
    mainImageUrl:
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1753118862/bracelet_slpyrz.png',
    imageUrls: [
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625707/Image_fx_35_b6m2eb.png',
    ],
    dimensions: {
      length: '24 inches',
      width: '3mm',
      weight: '8g',
    },
    inStock: true,
    stockQuantity: 50,
    freeShipping: false,
    shippingInfo: {
      estimatedDays: 5,
      returnPolicy: '14-day return policy',
    },
    featured: false,
    active: true,
    careInstructions: 'Keep dry. Condition leather monthly.',
    warranty: '1 year warranty',
  },
  {
    name: 'Emerald Garden Chain Bracelet',
    slug: 'emerald-garden-chain-bracelet',
    description:
      'Delicate chain bracelet featuring emerald green stones that evoke a lush garden. Perfect for spring and summer styling.',
    price: 98.5,
    originalPrice: 120.0,
    currency: 'GBP',
    material: 'Sterling Silver',
    stone: 'Emerald',
    color: 'Silver',
    category: 'Chain',
    size: 'Small',
    mainImageUrl:
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1753118862/bracelet_slpyrz.png',
    imageUrls: [
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625707/Image_fx_35_b6m2eb.png',
    ],
    dimensions: {
      length: '6.5 inches',
      width: '3mm',
      weight: '10g',
    },
    inStock: true,
    stockQuantity: 18,
    freeShipping: true,
    shippingInfo: {
      estimatedDays: 4,
      returnPolicy: '30-day return policy',
    },
    featured: false,
    active: true,
    careInstructions: 'Clean with mild soap and water. Dry thoroughly.',
    warranty: '2 year warranty',
  },
  {
    name: 'Gothic Black Onyx Cuff',
    slug: 'gothic-black-onyx-cuff',
    description:
      'Bold gothic-inspired cuff bracelet featuring striking black onyx stones. Makes a dramatic statement for evening wear.',
    price: 76.0,
    originalPrice: null,
    currency: 'GBP',
    material: 'Silver Plated',
    stone: 'Onyx',
    color: 'Black',
    category: 'Cuff',
    size: 'Large',
    mainImageUrl:
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1753118862/bracelet_slpyrz.png',
    imageUrls: [
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625707/Image_fx_35_b6m2eb.png',
    ],
    dimensions: {
      length: '6.5 inches',
      width: '20mm',
      weight: '35g',
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
    careInstructions: 'Avoid water. Polish with silver cloth.',
    warranty: '1 year warranty',
  },
  {
    name: 'Delicate Ruby Heart Charm Bracelet',
    slug: 'delicate-ruby-heart-charm-bracelet',
    description:
      'Sweet and romantic bracelet featuring tiny ruby heart charms on a delicate gold chain. Perfect for expressing love.',
    price: 145.99,
    originalPrice: 175.0,
    currency: 'GBP',
    material: '14k Yellow Gold',
    stone: 'Ruby',
    color: 'Gold',
    category: 'Charm',
    size: 'Small',
    mainImageUrl:
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1753118862/bracelet_slpyrz.png',
    imageUrls: [
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625707/Image_fx_35_b6m2eb.png',
    ],
    dimensions: {
      length: '6.5 inches',
      width: '2mm',
      weight: '6g',
    },
    inStock: false,
    stockQuantity: 0,
    freeShipping: true,
    shippingInfo: {
      estimatedDays: 8,
      returnPolicy: '30-day return policy',
    },
    featured: true,
    active: true,
    careInstructions: 'Store separately. Clean with gold jewelry cleaner.',
    warranty: '3 year warranty',
  },
  {
    name: 'Tribal Silver Beaded Bracelet',
    slug: 'tribal-silver-beaded-bracelet',
    description:
      'Handcrafted beaded bracelet inspired by tribal designs. Features intricate silver beadwork with geometric patterns.',
    price: 52.99,
    originalPrice: 65.0,
    currency: 'GBP',
    material: 'Sterling Silver',
    stone: 'None',
    color: 'Silver',
    category: 'Beaded',
    size: 'Medium',
    mainImageUrl:
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1753118862/bracelet_slpyrz.png',
    imageUrls: [
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625707/Image_fx_35_b6m2eb.png',
    ],
    dimensions: {
      length: '7 inches',
      width: '10mm',
      weight: '20g',
    },
    inStock: true,
    stockQuantity: 30,
    freeShipping: false,
    shippingInfo: {
      estimatedDays: 5,
      returnPolicy: '30-day return policy',
    },
    featured: false,
    active: true,
    careInstructions: 'Clean with silver polish. Store in anti-tarnish pouch.',
    warranty: '2 year warranty',
  },
  {
    name: 'Sunset Citrine Link Bracelet',
    slug: 'sunset-citrine-link-bracelet',
    description:
      'Warm and inviting bracelet featuring golden citrine stones that capture the beauty of a sunset. Perfect for autumn styling.',
    price: 87.5,
    originalPrice: null,
    currency: 'GBP',
    material: '14k Yellow Gold',
    stone: 'Citrine',
    color: 'Gold',
    category: 'Chain',
    size: 'Medium',
    mainImageUrl:
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1753118862/bracelet_slpyrz.png',
    imageUrls: [
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625707/Image_fx_35_b6m2eb.png',
    ],
    dimensions: {
      length: '7 inches',
      width: '5mm',
      weight: '14g',
    },
    inStock: true,
    stockQuantity: 16,
    freeShipping: true,
    shippingInfo: {
      estimatedDays: 3,
      returnPolicy: '45-day return policy',
    },
    featured: false,
    active: true,
    careInstructions: 'Clean with warm soapy water. Dry completely.',
    warranty: '2 year warranty',
  },
  {
    name: 'Vintage Art Deco Tennis Bracelet',
    slug: 'vintage-art-deco-tennis-bracelet',
    description:
      'Inspired by the glamorous Art Deco era, this tennis bracelet features geometric patterns and sparkling white diamonds.',
    price: 299.99,
    originalPrice: 350.0,
    currency: 'GBP',
    material: 'Platinum',
    stone: 'Diamond',
    color: 'White Gold',
    category: 'Tennis',
    size: 'Medium',
    mainImageUrl:
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1753118862/bracelet_slpyrz.png',
    imageUrls: [
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625707/Image_fx_35_b6m2eb.png',
    ],
    dimensions: {
      length: '7 inches',
      width: '7mm',
      weight: '25g',
    },
    inStock: true,
    stockQuantity: 5,
    freeShipping: true,
    shippingInfo: {
      estimatedDays: 1,
      returnPolicy: '60-day return policy',
    },
    featured: true,
    active: true,
    careInstructions:
      'Professional cleaning and inspection recommended annually.',
    warranty: '10 year warranty',
  },
  {
    name: 'Bohemian Wrapped Leather Bracelet',
    slug: 'bohemian-wrapped-leather-bracelet',
    description:
      'Multi-strand leather wrap bracelet with colorful beads and charms. Embodies the free-spirited bohemian aesthetic.',
    price: 39.99,
    originalPrice: 48.0,
    currency: 'GBP',
    material: 'Leather',
    stone: 'Mixed Gemstones',
    color: 'Multi-color',
    category: 'Wrap',
    size: 'One Size',
    mainImageUrl:
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1753118862/bracelet_slpyrz.png',
    imageUrls: [
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625707/Image_fx_35_b6m2eb.png',
    ],
    dimensions: {
      length: '30 inches',
      width: '5mm',
      weight: '12g',
    },
    inStock: true,
    stockQuantity: 35,
    freeShipping: false,
    shippingInfo: {
      estimatedDays: 4,
      returnPolicy: '21-day return policy',
    },
    featured: false,
    active: true,
    careInstructions: 'Keep away from water. Condition leather as needed.',
    warranty: '1 year warranty',
  },
  {
    name: 'Modern Geometric Silver Cuff',
    slug: 'modern-geometric-silver-cuff',
    description:
      'Contemporary cuff bracelet featuring bold geometric patterns in brushed sterling silver. Perfect for the modern minimalist.',
    price: 92.0,
    originalPrice: null,
    currency: 'GBP',
    material: 'Sterling Silver',
    stone: 'None',
    color: 'Silver',
    category: 'Cuff',
    size: 'Large',
    mainImageUrl:
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1753118862/bracelet_slpyrz.png',
    imageUrls: [
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625707/Image_fx_35_b6m2eb.png',
    ],
    dimensions: {
      length: '6.5 inches',
      width: '18mm',
      weight: '32g',
    },
    inStock: true,
    stockQuantity: 20,
    freeShipping: true,
    shippingInfo: {
      estimatedDays: 4,
      returnPolicy: '30-day return policy',
    },
    featured: false,
    active: true,
    careInstructions: 'Polish with silver cloth. Store in dry place.',
    warranty: '3 year warranty',
  },
];

// Sample reviews data - 5 different reviews
const reviewsData = [
  {
    customerName: 'Sarah Mitchell',
    rating: 5,
    comment:
      'Absolutely gorgeous bracelet! The quality exceeded my expectations and it arrived beautifully packaged. Will definitely shop here again.',
    verified: true,
  },
  {
    customerName: 'Emma Thompson',
    rating: 4,
    comment:
      'Really lovely piece, great craftsmanship. Took a little longer to arrive than expected but worth the wait. Very pleased with my purchase.',
    verified: true,
  },
  {
    customerName: 'David Rodriguez',
    rating: 5,
    comment:
      'Bought this as a gift for my wife and she loves it! Perfect size and the stones are brilliant. Excellent customer service too.',
    verified: true,
  },
  {
    customerName: 'Lisa Chen',
    rating: 3,
    comment:
      'Nice bracelet overall but smaller than I expected from the photos. Still good quality though and fast shipping.',
    verified: false,
  },
  {
    customerName: 'Michael Johnson',
    rating: 5,
    comment:
      'Exceptional quality and design. This bracelet gets compliments every time I wear it. Highly recommend this brand!',
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
        _type: 'braceletReview',
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

// Function to bulk upload bracelets
async function bulkUploadBracelets() {
  console.log('🚀 Starting bulk bracelets upload...');
  console.log(`📦 Total bracelets to upload: ${braceletsData.length}`);

  // First create reviews
  const reviews = await createReviews();

  let successCount = 0;
  let failureCount = 0;

  for (const braceletData of braceletsData) {
    try {
      console.log(`\n⏳ Processing: ${braceletData.name}`);

      // Assign random reviews to this bracelet
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

      // Prepare bracelet document
      const braceletDoc = {
        _type: 'bracelet',
        name: braceletData.name,
        slug: {
          _type: 'slug',
          current: braceletData.slug,
        },
        description: braceletData.description,
        price: braceletData.price,
        originalPrice: braceletData.originalPrice,
        currency: braceletData.currency,
        material: braceletData.material,
        stone: braceletData.stone,
        color: braceletData.color,
        category: braceletData.category,
        size: braceletData.size,
        mainImageUrl: braceletData.mainImageUrl,
        imageUrls: braceletData.imageUrls,
        dimensions: braceletData.dimensions,
        inStock: braceletData.inStock,
        stockQuantity: braceletData.stockQuantity,
        freeShipping: braceletData.freeShipping,
        shippingInfo: braceletData.shippingInfo,
        reviews: randomReviews,
        averageRating: Math.round(averageRating * 10) / 10,
        totalReviews: randomReviews.length,
        featured: braceletData.featured,
        active: braceletData.active,
        careInstructions: braceletData.careInstructions,
        warranty: braceletData.warranty,
        seoTitle: `${braceletData.name} - Premium Jewelry | TREVA`,
        seoDescription: braceletData.description.substring(0, 150) + '...',
      };

      // Create bracelet document
      const result = await client.create(braceletDoc);
      console.log(`✅ Successfully created: ${result.name}`);
      successCount++;
    } catch (error) {
      console.error(`❌ Error creating bracelet ${braceletData.name}:`, error);
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

bulkUploadBracelets().catch((error) => {
  console.error('❌ Bulk upload failed:', error);
  process.exit(1);
});

// Export for use in other scripts
export { bulkUploadBracelets, braceletsData, reviewsData, client };
