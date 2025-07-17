// bulkUploadEarrings.js

import { createClient } from '@sanity/client';

// Initialize Sanity client with direct values
const client = createClient({
  projectId: 'projectid',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: 'token',
  useCdn: false,
});

console.log('Sanity client created successfully!');

// Sample earrings data - replace with your actual data
const earringsData = [
  {
    name: 'Gold Pearl Dropping Earring',
    slug: 'gold-pearl-dropping-earring',
    description:
      'Effortlessly elegant and radiantly versatile, our Gold Dropping Earring blend timeless sophistication with modern femininity.',
    price: 49.99,
    originalPrice: 69.99,
    currency: 'GBP',
    material: '925 Sterling Gold',
    stone: 'Pearl',
    color: 'Gold',
    category: 'Drops',
    mainImageUrl:
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752626010/Image_fx_8_fg9tp4.png',
    imageUrls: [
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625203/Image_fx_62_kcr52m.png',
    ],
    dimensions: {
      length: '15mm',
      width: '8mm',
      weight: '2.3g',
    },
    inStock: true,
    stockQuantity: 50,
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
    name: 'Sterling Gold Minimalist Earrings',
    slug: 'sterling-gold-minimalist-earrings',
    description:
      'Delicate and elegant minimalist earrings perfect for everyday wear.',
    price: 49.99,
    currency: 'GBP',
    material: '925 Sterling Gold',
    stone: 'None',
    color: 'Gold',
    category: 'Stud',
    mainImageUrl:
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752626010/Image_fx_8_fg9tp4.png',
    imageUrls: [
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625203/Image_fx_62_kcr52m.png',
    ],
    dimensions: {
      length: '12mm',
      width: '5mm',
      weight: '1.8g',
    },
    inStock: true,
    stockQuantity: 75,
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
    name: 'Classic Pearl Hoop Earrings',
    slug: 'classic-pearl-hoop-earrings',
    description:
      'Timeless pearl hoop earrings that add elegance to any outfit.',
    price: 39.99,
    currency: 'GBP',
    material: 'Sterling Silver',
    stone: 'Pearl',
    color: 'White',
    category: 'Hoops',
    mainImageUrl:
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752626010/Image_fx_8_fg9tp4.png',
    imageUrls: [
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625203/Image_fx_62_kcr52m.png',
    ],
    dimensions: {
      length: '20mm',
      width: '20mm',
      weight: '3.2g',
    },
    inStock: true,
    stockQuantity: 30,
    freeShipping: false,
    shippingInfo: {
      estimatedDays: 5,
      returnPolicy: '30 Day Returns',
    },
    featured: true,
    active: true,
    careInstructions: 'Clean with soft cloth. Store in jewelry box.',
    warranty: '1 year warranty',
  },
  {
    name: 'Diamond Stud Earrings',
    slug: 'diamond-stud-earrings',
    description:
      'Brilliant diamond stud earrings perfect for special occasions.',
    price: 199.99,
    currency: 'GBP',
    material: '14k White Gold',
    stone: 'Diamond',
    color: 'White',
    category: 'Stud',
    mainImageUrl:
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752626010/Image_fx_8_fg9tp4.png',
    imageUrls: [
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625203/Image_fx_62_kcr52m.png',
    ],
    dimensions: {
      length: '6mm',
      width: '6mm',
      weight: '1.5g',
    },
    inStock: true,
    stockQuantity: 15,
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
    name: 'Amethyst Dangle Earrings',
    slug: 'amethyst-dangle-earrings',
    description:
      'Beautiful amethyst dangle earrings with sterling silver setting.',
    price: 89.99,
    currency: 'GBP',
    material: 'Sterling Silver',
    stone: 'Amethyst',
    color: 'None', // Consider changing to 'Black' or 'Blue' if the amethyst has a visible color
    category: 'Dangles',
    mainImageUrl:
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752626010/Image_fx_8_fg9tp4.png',
    imageUrls: [
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625203/Image_fx_62_kcr52m.png',
    ],
    dimensions: {
      length: '25mm',
      width: '10mm',
      weight: '4.1g',
    },
    inStock: true,
    stockQuantity: 25,
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
    name: 'Gold Threader Earrings',
    slug: 'gold-threader-earrings',
    description: 'Modern gold threader earrings for a contemporary look.',
    price: 69.99,
    currency: 'GBP',
    material: '9k Gold Plated',
    stone: 'None',
    color: 'Gold',
    category: 'Threader',
    mainImageUrl:
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752626010/Image_fx_8_fg9tp4.png',
    imageUrls: [
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625203/Image_fx_62_kcr52m.png',
    ],
    dimensions: {
      length: '35mm',
      width: '2mm',
      weight: '2.8g',
    },
    inStock: true,
    stockQuantity: 40,
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
    name: 'Silver Ear Cuff Set',
    slug: 'silver-ear-cuff-set',
    description: 'Trendy silver ear cuff set for a modern edge.',
    price: 29.99,
    currency: 'GBP',
    material: 'Silver Plated',
    stone: 'None',
    color: 'None', // Consider changing to 'White' or the actual color of the silver
    category: 'Ear cuff',
    mainImageUrl:
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752626010/Image_fx_8_fg9tp4.png',
    imageUrls: [
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625203/Image_fx_62_kcr52m.png',
    ],
    dimensions: {
      length: '18mm',
      width: '15mm',
      weight: '1.2g',
    },
    inStock: true,
    stockQuantity: 60,
    freeShipping: false,
    shippingInfo: {
      estimatedDays: 5,
      returnPolicy: '30 Day Returns',
    },
    featured: false,
    active: true,
    careInstructions: 'Clean with soft cloth. Store in jewelry box.',
    warranty: '1 year warranty',
  },
  {
    name: 'Classic Pearl Studs',
    slug: 'classic-pearl-studs',
    description: 'Elegant pearl stud earrings for everyday sophistication.',
    price: 59.99,
    currency: 'GBP',
    material: 'Sterling Silver',
    stone: 'Pearl',
    color: 'White',
    category: 'Stud', // Changed from 'Pearl' to 'Stud' since these are stud earrings
    mainImageUrl:
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752626010/Image_fx_8_fg9tp4.png',
    imageUrls: [
      'https://res.cloudinary.com/dfwty72r9/image/upload/v1752625203/Image_fx_62_kcr52m.png',
    ],
    dimensions: {
      length: '8mm',
      width: '8mm',
      weight: '2.0g',
    },
    inStock: true,
    stockQuantity: 45,
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
];

// Sample reviews data
const reviewsData = [
  {
    customerName: 'Jane Cooper',
    rating: 5,
    comment:
      "The earring and necklace is even more beautiful in person! I've worn it daily for 3 months, and I haven't tarnished. Perfect for layering, gets compliments every time I wear it.",
    verified: true,
  },
  {
    customerName: 'Sarah Johnson',
    rating: 4,
    comment: 'Great quality and fast shipping. Perfect for daily wear.',
    verified: true,
  },
  {
    customerName: 'Emily Davis',
    rating: 5,
    comment:
      "Absolutely love these earrings! They're so comfortable and stylish.",
    verified: true,
  },
  {
    customerName: 'Michael Brown',
    rating: 5,
    comment:
      'Bought these as a gift and they were perfect. Beautiful packaging too.',
    verified: true,
  },
  {
    customerName: 'Lisa Wilson',
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
