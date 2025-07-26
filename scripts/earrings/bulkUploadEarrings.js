// bulkUploadEarrings.js

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

// Sample earrings data - replace with your actual data
const earringsData = [
  {
    name: 'Rose Gold Infinity Drop Earrings',
    slug: 'rose-gold-infinity-drop-earrings',
    description:
      'Romantic rose gold infinity drops that symbolize eternal elegance and love.',
    price: 79.99,
    originalPrice: 99.99,
    currency: 'GBP',
    material: '18k Rose Gold Plated',
    stone: 'None',
    color: 'Rose Gold',
    category: 'Drops',
    size: '3',
    mainImageUrl:
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752626010/Image_fx_8_fg9tp4.png',
    imageUrls: [
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625203/Image_fx_62_kcr52m.png',
    ],
    dimensions: {
      length: '22mm',
      width: '12mm',
      weight: '3.1g',
    },
    inStock: true,
    stockQuantity: 35,
    freeShipping: true,
    shippingInfo: {
      estimatedDays: 3,
      returnPolicy: '30 Day Returns',
    },
    featured: true,
    active: true,
    careInstructions: 'Clean with soft cloth. Store in jewelry box.',
    warranty: '1 year warranty',
  },
  {
    name: 'Emerald Cut Crystal Studs',
    slug: 'emerald-cut-crystal-studs',
    description:
      'Sophisticated emerald cut crystal studs that capture light beautifully.',
    price: 34.99,
    currency: 'GBP',
    material: 'Sterling Silver',
    stone: 'Crystal',
    color: 'Clear',
    category: 'Stud',
    size: '3',
    mainImageUrl:
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752626010/Image_fx_8_fg9tp4.png',
    imageUrls: [
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625203/Image_fx_62_kcr52m.png',
    ],
    dimensions: {
      length: '7mm',
      width: '5mm',
      weight: '1.4g',
    },
    inStock: true,
    stockQuantity: 80,
    freeShipping: true,
    shippingInfo: {
      estimatedDays: 3,
      returnPolicy: '30 Day Returns',
    },
    featured: false,
    active: true,
    careInstructions: 'Clean with soft cloth. Store in jewelry box.',
    warranty: '1 year warranty',
  },
  {
    name: 'Geometric Gold Hoop Earrings',
    slug: 'geometric-gold-hoop-earrings',
    description:
      'Contemporary geometric hoops with clean lines and modern appeal.',
    price: 54.99,
    currency: 'GBP',
    material: '14k Gold Plated',
    stone: 'None',
    color: 'Gold',
    category: 'Hoops',
    size: '3',
    mainImageUrl:
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752626010/Image_fx_8_fg9tp4.png',
    imageUrls: [
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625203/Image_fx_62_kcr52m.png',
    ],
    dimensions: {
      length: '28mm',
      width: '28mm',
      weight: '4.5g',
    },
    inStock: true,
    stockQuantity: 25,
    freeShipping: true,
    shippingInfo: {
      estimatedDays: 3,
      returnPolicy: '30 Day Returns',
    },
    featured: true,
    active: true,
    careInstructions: 'Clean with soft cloth. Store in jewelry box.',
    warranty: '1 year warranty',
  },
  {
    name: 'Vintage Style Chandelier Earrings',
    slug: 'vintage-style-chandelier-earrings',
    description:
      'Ornate chandelier earrings inspired by vintage glamour and Art Deco design.',
    price: 94.99,
    originalPrice: 129.99,
    currency: 'GBP',
    material: 'Antique Brass',
    stone: 'Cubic Zirconia',
    color: 'Brass',
    category: 'Dangles',
    size: '4',
    mainImageUrl:
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752626010/Image_fx_8_fg9tp4.png',
    imageUrls: [
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625203/Image_fx_62_kcr52m.png',
    ],
    dimensions: {
      length: '45mm',
      width: '18mm',
      weight: '6.2g',
    },
    inStock: true,
    stockQuantity: 20,
    freeShipping: true,
    shippingInfo: {
      estimatedDays: 2,
      returnPolicy: '30 Day Returns',
    },
    featured: false,
    active: true,
    careInstructions: 'Clean with soft cloth. Store in jewelry box.',
    warranty: '1 year warranty',
  },
  {
    name: 'Sapphire Oval Drop Earrings',
    slug: 'sapphire-oval-drop-earrings',
    description:
      'Luxurious sapphire oval drops set in sterling silver for special occasions.',
    price: 149.99,
    currency: 'GBP',
    material: 'Sterling Silver',
    stone: 'Sapphire',
    color: 'Blue',
    category: 'Drops',
    size: '4',
    mainImageUrl:
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752626010/Image_fx_8_fg9tp4.png',
    imageUrls: [
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625203/Image_fx_62_kcr52m.png',
    ],
    dimensions: {
      length: '19mm',
      width: '9mm',
      weight: '3.8g',
    },
    inStock: true,
    stockQuantity: 12,
    freeShipping: true,
    shippingInfo: {
      estimatedDays: 2,
      returnPolicy: '30 Day Returns',
    },
    featured: true,
    active: true,
    careInstructions: 'Clean with soft cloth. Store in jewelry box.',
    warranty: '2 year warranty',
  },
  {
    name: 'Triple Chain Ear Climber',
    slug: 'triple-chain-ear-climber',
    description:
      'Edgy triple chain ear climber that creates a striking cascade effect.',
    price: 42.99,
    currency: 'GBP',
    material: 'Gold Filled',
    stone: 'None',
    color: 'Gold',
    category: 'Ear cuff',
    size: '3',
    mainImageUrl:
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752626010/Image_fx_8_fg9tp4.png',
    imageUrls: [
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625203/Image_fx_62_kcr52m.png',
    ],
    dimensions: {
      length: '32mm',
      width: '8mm',
      weight: '2.6g',
    },
    inStock: true,
    stockQuantity: 55,
    freeShipping: false,
    shippingInfo: {
      estimatedDays: 4,
      returnPolicy: '30 Day Returns',
    },
    featured: false,
    active: true,
    careInstructions: 'Clean with soft cloth. Store in jewelry box.',
    warranty: '1 year warranty',
  },
  {
    name: 'Diamond Accent Teardrop Earrings',
    slug: 'diamond-accent-teardrop-earrings',
    description:
      'Elegant teardrop earrings with sparkling diamond accents for timeless sophistication.',
    price: 189.99,
    originalPrice: 249.99,
    currency: 'GBP',
    material: '18k White Gold',
    stone: 'Diamond',
    color: 'White Gold',
    category: 'Drops',
    size: '3',
    mainImageUrl:
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752626010/Image_fx_8_fg9tp4.png',
    imageUrls: [
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625203/Image_fx_62_kcr52m.png',
    ],
    dimensions: {
      length: '25mm',
      width: '14mm',
      weight: '4.2g',
    },
    inStock: true,
    stockQuantity: 18,
    freeShipping: true,
    shippingInfo: {
      estimatedDays: 2,
      returnPolicy: '30 Day Returns',
    },
    featured: true,
    active: true,
    careInstructions: 'Clean with soft cloth. Store in jewelry box.',
    warranty: '2 year warranty',
  },
  {
    name: 'Minimalist Bar Stud Earrings',
    slug: 'minimalist-bar-stud-earrings',
    description:
      'Clean and modern bar studs perfect for everyday wear and effortless style.',
    price: 28.99,
    currency: 'GBP',
    material: 'Sterling Silver',
    stone: 'None',
    color: 'Silver',
    category: 'Stud',
    size: '4',
    mainImageUrl:
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752626010/Image_fx_8_fg9tp4.png',
    imageUrls: [
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625203/Image_fx_62_kcr52m.png',
    ],
    dimensions: {
      length: '12mm',
      width: '2mm',
      weight: '1.1g',
    },
    inStock: true,
    stockQuantity: 95,
    freeShipping: true,
    shippingInfo: {
      estimatedDays: 3,
      returnPolicy: '30 Day Returns',
    },
    featured: false,
    active: true,
    careInstructions: 'Clean with soft cloth. Store in jewelry box.',
    warranty: '1 year warranty',
  },
  {
    name: 'Pearl Cluster Statement Earrings',
    slug: 'pearl-cluster-statement-earrings',
    description:
      'Dramatic pearl cluster earrings that make a bold statement with organic beauty.',
    price: 124.99,
    currency: 'GBP',
    material: '14k Gold Plated',
    stone: 'Freshwater Pearl',
    color: 'Gold',
    category: 'Dangles',
    size: 'L',
    mainImageUrl:
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752626010/Image_fx_8_fg9tp4.png',
    imageUrls: [
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625203/Image_fx_62_kcr52m.png',
    ],
    dimensions: {
      length: '38mm',
      width: '22mm',
      weight: '5.8g',
    },
    inStock: true,
    stockQuantity: 28,
    freeShipping: true,
    shippingInfo: {
      estimatedDays: 3,
      returnPolicy: '30 Day Returns',
    },
    featured: true,
    active: true,
    careInstructions: 'Clean with soft cloth. Store in jewelry box.',
    warranty: '1 year warranty',
  },
  {
    name: 'Twisted Wire Hoop Earrings',
    slug: 'twisted-wire-hoop-earrings',
    description:
      'Textured twisted wire hoops that add dimension and movement to any outfit.',
    price: 38.99,
    currency: 'GBP',
    material: 'Rose Gold Plated',
    stone: 'None',
    color: 'Rose Gold',
    category: 'Hoops',
    size: '4',
    mainImageUrl:
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752626010/Image_fx_8_fg9tp4.png',
    imageUrls: [
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625203/Image_fx_62_kcr52m.png',
    ],
    dimensions: {
      length: '20mm',
      width: '20mm',
      weight: '2.8g',
    },
    inStock: true,
    stockQuantity: 65,
    freeShipping: false,
    shippingInfo: {
      estimatedDays: 4,
      returnPolicy: '30 Day Returns',
    },
    featured: false,
    active: true,
    careInstructions: 'Clean with soft cloth. Store in jewelry box.',
    warranty: '1 year warranty',
  },
  {
    name: 'Amethyst Cushion Cut Earrings',
    slug: 'amethyst-cushion-cut-earrings',
    description:
      'Rich purple amethyst cushion cuts set in sterling silver for regal elegance.',
    price: 78.99,
    currency: 'GBP',
    material: 'Sterling Silver',
    stone: 'Amethyst',
    color: 'Purple',
    category: 'Stud',
    size: '3',
    mainImageUrl:
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752626010/Image_fx_8_fg9tp4.png',
    imageUrls: [
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625203/Image_fx_62_kcr52m.png',
    ],
    dimensions: {
      length: '10mm',
      width: '10mm',
      weight: '2.4g',
    },
    inStock: true,
    stockQuantity: 42,
    freeShipping: true,
    shippingInfo: {
      estimatedDays: 3,
      returnPolicy: '30 Day Returns',
    },
    featured: false,
    active: true,
    careInstructions: 'Clean with soft cloth. Store in jewelry box.',
    warranty: '1 year warranty',
  },
  {
    name: 'Feather-Inspired Ear Cuff Set',
    slug: 'feather-inspired-ear-cuff-set',
    description:
      'Delicate feather-inspired ear cuffs sold as a set for layering and versatility.',
    price: 64.99,
    currency: 'GBP',
    material: 'Gold Filled',
    stone: 'None',
    color: 'Gold',
    category: 'Ear cuff',
    size: '4',
    mainImageUrl:
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752626010/Image_fx_8_fg9tp4.png',
    imageUrls: [
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625203/Image_fx_62_kcr52m.png',
    ],
    dimensions: {
      length: '28mm',
      width: '6mm',
      weight: '1.9g',
    },
    inStock: true,
    stockQuantity: 38,
    freeShipping: true,
    shippingInfo: {
      estimatedDays: 3,
      returnPolicy: '30 Day Returns',
    },
    featured: false,
    active: true,
    careInstructions: 'Clean with soft cloth. Store in jewelry box.',
    warranty: '1 year warranty',
  },
  {
    name: 'Citrine Oval Dangle Earrings',
    slug: 'citrine-oval-dangle-earrings',
    description:
      'Warm citrine oval dangles that capture golden sunlight in every movement.',
    price: 89.99,
    originalPrice: 119.99,
    currency: 'GBP',
    material: '14k Gold Plated',
    stone: 'Citrine',
    color: 'Yellow',
    category: 'Dangles',
    size: '3',
    mainImageUrl:
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752626010/Image_fx_8_fg9tp4.png',
    imageUrls: [
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625203/Image_fx_62_kcr52m.png',
    ],
    dimensions: {
      length: '30mm',
      width: '12mm',
      weight: '3.5g',
    },
    inStock: true,
    stockQuantity: 22,
    freeShipping: true,
    shippingInfo: {
      estimatedDays: 2,
      returnPolicy: '30 Day Returns',
    },
    featured: true,
    active: true,
    careInstructions: 'Clean with soft cloth. Store in jewelry box.',
    warranty: '1 year warranty',
  },
  {
    name: 'Art Nouveau Butterfly Studs',
    slug: 'art-nouveau-butterfly-studs',
    description:
      'Intricate butterfly studs inspired by Art Nouveau design with detailed metalwork.',
    price: 46.99,
    currency: 'GBP',
    material: 'Antique Silver',
    stone: 'None',
    color: 'Silver',
    category: 'Stud',
    size: '3',
    mainImageUrl:
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752626010/Image_fx_8_fg9tp4.png',
    imageUrls: [
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625203/Image_fx_62_kcr52m.png',
    ],
    dimensions: {
      length: '15mm',
      width: '13mm',
      weight: '2.1g',
    },
    inStock: true,
    stockQuantity: 58,
    freeShipping: false,
    shippingInfo: {
      estimatedDays: 4,
      returnPolicy: '30 Day Returns',
    },
    featured: false,
    active: true,
    careInstructions: 'Clean with soft cloth. Store in jewelry box.',
    warranty: '1 year warranty',
  },
  {
    name: 'Hammered Gold Disc Drops',
    slug: 'hammered-gold-disc-drops',
    description:
      'Hand-hammered gold disc drops with organic texture and contemporary appeal.',
    price: 59.99,
    currency: 'GBP',
    material: '18k Gold Plated',
    stone: 'None',
    color: 'Gold',
    category: 'Drops',
    size: '3',
    mainImageUrl:
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752626010/Image_fx_8_fg9tp4.png',
    imageUrls: [
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625203/Image_fx_62_kcr52m.png',
    ],
    dimensions: {
      length: '26mm',
      width: '16mm',
      weight: '3.7g',
    },
    inStock: true,
    stockQuantity: 33,
    freeShipping: true,
    shippingInfo: {
      estimatedDays: 3,
      returnPolicy: '30 Day Returns',
    },
    featured: false,
    active: true,
    careInstructions: 'Clean with soft cloth. Store in jewelry box.',
    warranty: '1 year warranty',
  },
];

// Sample reviews data
const reviewsData = [
  {
    customerName: 'David Joe',
    rating: 5,
    comment:
      "The earring and necklace is even more beautiful in person! I've worn it daily for 3 months, and I haven't tarnished. Perfect for layering, gets compliments every time I wear it.",
    verified: true,
  },
  {
    customerName: 'Clara Smith',
    rating: 4,
    comment: 'Great quality and fast shipping. Perfect for daily wear.',
    verified: true,
  },
  {
    customerName: 'Tina Johnson',
    rating: 5,
    comment:
      "Absolutely love these earrings! They're so comfortable and stylish.",
    verified: true,
  },
  {
    customerName: 'Daniel Brown',
    rating: 5,
    comment:
      'Bought these as a gift and they were perfect. Beautiful packaging too.',
    verified: true,
  },
  {
    customerName: 'Paula White',
    rating: 4,
    comment: 'Nice earrings, exactly as described. Will order again.',
    verified: true,
  },
];

// Function to create image asset from URL
async function createImageAsset(imageUrl, alt = '') {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    const buffer = await response.arrayBuffer();
    const asset = await client.assets.upload('image', Buffer.from(buffer), {
      filename: imageUrl.split('/').pop() || 'image.jpg',
    });

    return {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: asset._id,
      },
      alt: alt,
    };
  } catch (error) {
    console.error('Error creating image asset:', error);
    return null;
  }
}

// Function to create reviews
async function createReviews() {
  console.log('Creating reviews...');
  const createdReviews = [];

  for (const reviewData of reviewsData) {
    try {
      const review = await client.create({
        _type: 'earringReview',
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

// Function to bulk upload earrings
async function bulkUploadEarrings() {
  console.log('🚀 Starting bulk earrings upload...');
  console.log(`📦 Total earrings to upload: ${earringsData.length}`);

  // First create reviews
  const reviews = await createReviews();

  let successCount = 0;
  let failureCount = 0;

  for (const earringData of earringsData) {
    try {
      console.log(`\n⏳ Processing: ${earringData.name}`);

      // Create main image asset
      const mainImage = await createImageAsset(
        earringData.mainImageUrl,
        earringData.name
      );
      if (!mainImage) {
        console.error(`❌ Failed to create main image for ${earringData.name}`);
        failureCount++;
        continue;
      }

      // Create additional image assets
      const images = [];
      for (const imageUrl of earringData.imageUrls) {
        const image = await createImageAsset(imageUrl, earringData.name);
        if (image) {
          images.push(image);
        }
      }

      // Assign random reviews to this earring
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

      // Prepare earring document
      const earringDoc = {
        _type: 'earring',
        name: earringData.name,
        slug: {
          _type: 'slug',
          current: earringData.slug,
        },
        description: earringData.description,
        price: earringData.price,
        originalPrice: earringData.originalPrice,
        currency: earringData.currency,
        material: earringData.material,
        stone: earringData.stone,
        color: earringData.color,
        category: earringData.category,
        mainImageUrl: earringData.mainImageUrl,
        imageUrls: earringData.imageUrls,
        dimensions: earringData.dimensions,
        inStock: earringData.inStock,
        stockQuantity: earringData.stockQuantity,
        freeShipping: earringData.freeShipping,
        shippingInfo: earringData.shippingInfo,
        reviews: randomReviews,
        averageRating: Math.round(averageRating * 10) / 10,
        totalReviews: randomReviews.length,
        featured: earringData.featured,
        active: earringData.active,
        careInstructions: earringData.careInstructions,
        warranty: earringData.warranty,
        seoTitle: `${earringData.name} - Premium Jewelry | TREVA`,
        seoDescription: earringData.description.substring(0, 150) + '...',
      };

      // Create earring document
      const result = await client.create(earringDoc);
      console.log(`✅ Successfully created: ${result.name}`);
      successCount++;
    } catch (error) {
      console.error(`❌ Error creating earring ${earringData.name}:`, error);
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

bulkUploadEarrings().catch((error) => {
  console.error('❌ Bulk upload failed:', error);
  process.exit(1);
});

// Export for use in other scripts
export { bulkUploadEarrings, earringsData, reviewsData, client };
