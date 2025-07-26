// app/rings/[slug]/page.tsx
import { client } from '@/lib/sanity';
import { notFound } from 'next/navigation';
import RingDetails from './RingDetails';
import { Ring } from '@/types/rings';
import YouMayAlsoLike from '../YouMayAlsoLike';

interface RingPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function getRing(slug: string): Promise<Ring | null> {
  const query = `*[_type == "ring" && slug.current == $slug && active == true][0] {
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
    size,
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
    const ring = await client.fetch(query, { slug });
    return ring || null;
  } catch (error) {
    console.error('Error fetching ring:', error);
    return null;
  }
}

export default async function RingPage({ params }: RingPageProps) {
  const resolvedParams = await params;
  const ring = await getRing(resolvedParams.slug);

  if (!ring) {
    notFound();
  }

  return (
    <div>
      {/* Main product details */}
      <RingDetails ring={ring} />

      {/* You May Also Like section */}
      <div className="border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4">
          <YouMayAlsoLike currentRing={ring} maxItems={4} />
        </div>
      </div>
    </div>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }: RingPageProps) {
  const resolvedParams = await params;
  const ring = await getRing(resolvedParams.slug);

  if (!ring) {
    return {
      title: 'Ring Not Found',
    };
  }

  return {
    title: ring.seoTitle || `${ring.name} - TREVA Jewelry`,
    description:
      ring.seoDescription ||
      `${ring.name} - ${ring.material}, ${ring.stone} - Size ${ring.size}. Starting from ${ring.currency === 'GBP' ? '£' : ring.currency === 'USD' ? '$' : '€'}${ring.price}`,
    openGraph: {
      title: ring.seoTitle || `${ring.name} - TREVA Jewelry`,
      description:
        ring.seoDescription ||
        `${ring.name} - ${ring.material}, ${ring.stone} - Size ${ring.size}`,
      images: ring.mainImageUrl ? [ring.mainImageUrl] : [],
    },
  };
}
