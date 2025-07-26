// sanity/schemaTypes/earrings.ts

import { defineType, defineField } from 'sanity';
import {
  EARRING_MATERIALS,
  EARRING_STONES,
  EARRING_COLORS,
  EARRING_CATEGORIES,
  EARRING_SIZES,
} from '@/types/earrings';

// Earring Review Schema
export const earringReview = defineType({
  name: 'earringReview',
  title: 'Earring Review',
  type: 'document',
  fields: [
    defineField({
      name: 'customerName',
      title: 'Customer Name',
      type: 'string',
      validation: (Rule) => Rule.required().min(2).max(50),
    }),
    defineField({
      name: 'rating',
      title: 'Rating',
      type: 'number',
      validation: (Rule) => Rule.required().min(1).max(5),
    }),
    defineField({
      name: 'comment',
      title: 'Review Comment',
      type: 'text',
      validation: (Rule) => Rule.required().min(10).max(500),
    }),
    defineField({
      name: 'verified',
      title: 'Verified Purchase',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'customerName',
      subtitle: 'rating',
      media: 'rating',
    },
    prepare(selection) {
      const { title, subtitle } = selection;
      return {
        title: title,
        subtitle: `${subtitle} stars`,
      };
    },
  },
});

// Main Earring Schema
export const earring = defineType({
  name: 'earring',
  title: 'Earring',
  type: 'document',
  fields: [
    // Basic Information
    defineField({
      name: 'name',
      title: 'Product Name',
      type: 'string',
      validation: (Rule) => Rule.required().min(3).max(100),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
    }),

    // Pricing
    defineField({
      name: 'price',
      title: 'Current Price',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'originalPrice',
      title: 'Original Price (for sales)',
      type: 'number',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'currency',
      title: 'Currency',
      type: 'string',
      options: {
        list: [
          { title: 'GBP (£)', value: 'GBP' },
          { title: 'USD ($)', value: 'USD' },
          { title: 'EUR (€)', value: 'EUR' },
        ],
      },
      initialValue: 'GBP',
    }),

    // Product Specifications
    defineField({
      name: 'material',
      title: 'Material',
      type: 'string',
      options: {
        list: EARRING_MATERIALS.map((material) => ({
          title: material,
          value: material,
        })),
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'stone',
      title: 'Stone',
      type: 'string',
      options: {
        list: EARRING_STONES.map((stone) => ({
          title: stone,
          value: stone,
        })),
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'color',
      title: 'Color',
      type: 'string',
      options: {
        list: EARRING_COLORS.map((color) => ({
          title: color,
          value: color,
        })),
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: EARRING_CATEGORIES.map((category) => ({
          title: category,
          value: category,
        })),
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'size',
      title: 'Size',
      type: 'string',
      options: {
        list: EARRING_SIZES.map((size) => ({
          title: size,
          value: size,
        })),
      },
      validation: (Rule) => Rule.required(),
    }),

    // Images - Using URL strings instead of Sanity image objects
    defineField({
      name: 'mainImageUrl',
      title: 'Main Image URL',
      type: 'url',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'imageUrls',
      title: 'Additional Image URLs',
      type: 'array',
      of: [
        {
          type: 'url',
        },
      ],
    }),

    // Dimensions
    defineField({
      name: 'dimensions',
      title: 'Dimensions',
      type: 'object',
      fields: [
        {
          name: 'length',
          title: 'Length',
          type: 'string',
        },
        {
          name: 'width',
          title: 'Width',
          type: 'string',
        },
        {
          name: 'weight',
          title: 'Weight',
          type: 'string',
        },
      ],
    }),

    // Inventory
    defineField({
      name: 'inStock',
      title: 'In Stock',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'stockQuantity',
      title: 'Stock Quantity',
      type: 'number',
      validation: (Rule) => Rule.min(0),
    }),

    // Shipping
    defineField({
      name: 'freeShipping',
      title: 'Free Shipping',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'shippingInfo',
      title: 'Shipping Information',
      type: 'object',
      fields: [
        {
          name: 'estimatedDays',
          title: 'Estimated Delivery Days',
          type: 'number',
        },
        {
          name: 'returnPolicy',
          title: 'Return Policy',
          type: 'string',
        },
      ],
    }),

    // Reviews
    defineField({
      name: 'reviews',
      title: 'Reviews',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'earringReview' }],
        },
      ],
    }),
    defineField({
      name: 'averageRating',
      title: 'Average Rating',
      type: 'number',
      validation: (Rule) => Rule.min(0).max(5),
      readOnly: true,
    }),
    defineField({
      name: 'totalReviews',
      title: 'Total Reviews',
      type: 'number',
      validation: (Rule) => Rule.min(0),
      readOnly: true,
    }),

    // SEO
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      validation: (Rule) => Rule.max(60),
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      validation: (Rule) => Rule.max(160),
    }),

    // Status
    defineField({
      name: 'featured',
      title: 'Featured Product',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'active',
      title: 'Active',
      type: 'boolean',
      initialValue: true,
    }),

    // Additional Information
    defineField({
      name: 'careInstructions',
      title: 'Care Instructions',
      type: 'text',
    }),
    defineField({
      name: 'warranty',
      title: 'Warranty Information',
      type: 'string',
    }),
  ],

  preview: {
    select: {
      title: 'name',
      // media: 'mainImageUrl',
      price: 'price',
      currency: 'currency',
      inStock: 'inStock',
      size: 'size',
    },
    prepare(selection) {
      const { title, price, currency, inStock, size } = selection;
      return {
        title: title,
        subtitle: `${currency === 'GBP' ? '£' : currency === 'USD' ? '$' : '€'}${price} - Size ${size} - ${inStock ? 'In Stock' : 'Out of Stock'}`,
        // media: media,
      };
    },
  },

  orderings: [
    {
      title: 'Name A-Z',
      name: 'nameAsc',
      by: [{ field: 'name', direction: 'asc' }],
    },
    {
      title: 'Name Z-A',
      name: 'nameDesc',
      by: [{ field: 'name', direction: 'desc' }],
    },
    {
      title: 'Price Low to High',
      name: 'priceLowToHigh',
      by: [{ field: 'price', direction: 'asc' }],
    },
    {
      title: 'Price High to Low',
      name: 'priceHighToLow',
      by: [{ field: 'price', direction: 'desc' }],
    },
    {
      title: 'Size (Small to Large)',
      name: 'sizeAsc',
      by: [{ field: 'size', direction: 'asc' }],
    },
    {
      title: 'Size (Large to Small)',
      name: 'sizeDesc',
      by: [{ field: 'size', direction: 'desc' }],
    },
    {
      title: 'Newest First',
      name: 'newest',
      by: [{ field: '_createdAt', direction: 'desc' }],
    },
  ],
});

// Export all schemas
export const earringSchemas = [earring, earringReview];
