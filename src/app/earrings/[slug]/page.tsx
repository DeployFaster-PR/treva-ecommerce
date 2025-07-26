// app/earrings/[slug]/page.tsx
import { client } from '@/lib/sanity';
import { notFound } from 'next/navigation';
import EarringDetails from './EarringDetails';
import { Earring } from '@/types/earrings';

interface EarringPageProps {
  params: {
    slug: string;
  };
}

async function getEarring(slug: string): Promise<Earring | null> {
  const query = `*[_type == "earring" && slug.current == $slug && active == true][0] {
    _id,
    _createdAt,
    _updatedAt,
    name,
    slug,
    description,
    price,
    originalPrice,
    currency,
    material,
    stone,
    color,
    category,
    mainImageUrl,
    imageUrls,
    dimensions {
      length,
      width,
      weight
    },
    inStock,
    stockQuantity,
    freeShipping,
    shippingInfo {
      estimatedDays,
      returnPolicy
    },
    reviews[]-> {
      _id,
      customerName,
      rating,
      comment,
      verified,
      _createdAt,
      _updatedAt
    },
    averageRating,
    totalReviews,
    seoTitle,
    seoDescription,
    featured,
    active,
    careInstructions,
    warranty
  }`;

  try {
    const earring = await client.fetch(query, { slug });
    return earring || null;
  } catch (error) {
    console.error('Error fetching earring:', error);
    return null;
  }
}

export default async function EarringPage({ params }: EarringPageProps) {
  const resolvedParams = await params;
  const earring = await getEarring(resolvedParams.slug);

  if (!earring) {
    notFound();
  }

  return <EarringDetails earring={earring} />;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: EarringPageProps) {
  const resolvedParams = await params;
  const earring = await getEarring(resolvedParams.slug);

  if (!earring) {
    return {
      title: 'Earring Not Found',
    };
  }

  return {
    title: earring.seoTitle || `${earring.name} - TREVA Jewelry`,
    description:
      earring.seoDescription ||
      `${earring.name} - ${earring.material}, ${earring.stone}. Starting from ${earring.currency === 'GBP' ? '£' : earring.currency === 'USD' ? '$' : '€'}${earring.price}`,
    openGraph: {
      title: earring.seoTitle || `${earring.name} - TREVA Jewelry`,
      description:
        earring.seoDescription ||
        `${earring.name} - ${earring.material}, ${earring.stone}`,
      images: earring.mainImageUrl ? [earring.mainImageUrl] : [],
    },
  };
}
