// app/necklaces/[slug]/page.tsx
import { client } from '@/lib/sanity';
import { notFound } from 'next/navigation';
import NecklaceDetails from './NecklaceDetails';
import { Necklace } from '@/types/necklaces';
import YouMayAlsoLike from '../YouMayAlsoLike';

interface NecklacePageProps {
  params: {
    slug: string;
  };
}

async function getNecklace(slug: string): Promise<Necklace | null> {
  const query = `*[_type == "necklace" && slug.current == $slug && active == true][0] {
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
    const necklace = await client.fetch(query, { slug });
    return necklace || null;
  } catch (error) {
    console.error('Error fetching necklace:', error);
    return null;
  }
}

export default async function NecklacePage({ params }: NecklacePageProps) {
  const resolvedParams = await params;
  const necklace = await getNecklace(resolvedParams.slug);

  if (!necklace) {
    notFound();
  }

  return (
    <div>
      {/* Main product details */}
      <NecklaceDetails necklace={necklace} />

      {/* You May Also Like section */}
      <div className="border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4">
          <YouMayAlsoLike currentNecklace={necklace} maxItems={4} />
        </div>
      </div>
    </div>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }: NecklacePageProps) {
  const resolvedParams = await params;
  const necklace = await getNecklace(resolvedParams.slug);

  if (!necklace) {
    return {
      title: 'Necklace Not Found',
    };
  }

  return {
    title: necklace.seoTitle || `${necklace.name} - TREVA Jewelry`,
    description:
      necklace.seoDescription ||
      `${necklace.name} - ${necklace.material}, ${necklace.stone} - ${necklace.size}. Starting from ${necklace.currency === 'GBP' ? '£' : necklace.currency === 'USD' ? '$' : '€'}${necklace.price}`,
    openGraph: {
      title: necklace.seoTitle || `${necklace.name} - TREVA Jewelry`,
      description:
        necklace.seoDescription ||
        `${necklace.name} - ${necklace.material}, ${necklace.stone} - ${necklace.size}`,
      images: necklace.mainImageUrl ? [necklace.mainImageUrl] : [],
    },
  };
}
