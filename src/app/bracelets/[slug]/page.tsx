// app/bracelets/[slug]/page.tsx
import { client } from '@/lib/sanity';
import { notFound } from 'next/navigation';
import BraceletDetails from './BraceletDetails';
import { Bracelet } from '@/types/bracelets';
import YouMayAlsoLike from '../YouMayAlsoLike';

interface BraceletPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function getBracelet(slug: string): Promise<Bracelet | null> {
  const query = `*[_type == "bracelet" && slug.current == $slug && active == true][0] {
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
    const bracelet = await client.fetch(query, { slug });
    return bracelet || null;
  } catch (error) {
    console.error('Error fetching bracelet:', error);
    return null;
  }
}

export default async function BraceletPage({ params }: BraceletPageProps) {
  const resolvedParams = await params;
  const bracelet = await getBracelet(resolvedParams.slug);

  if (!bracelet) {
    notFound();
  }

  return (
    <div>
      {/* Main product details */}
      <BraceletDetails bracelet={bracelet} />

      {/* You May Also Like section */}
      <div className="border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4">
          <YouMayAlsoLike currentBracelet={bracelet} maxItems={4} />
        </div>
      </div>
    </div>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }: BraceletPageProps) {
  const resolvedParams = await params;
  const bracelet = await getBracelet(resolvedParams.slug);

  if (!bracelet) {
    return {
      title: 'Bracelet Not Found',
    };
  }

  return {
    title: bracelet.seoTitle || `${bracelet.name} - TREVA Jewelry`,
    description:
      bracelet.seoDescription ||
      `${bracelet.name} - ${bracelet.material}, ${bracelet.stone} - ${bracelet.size}. Starting from ${bracelet.currency === 'GBP' ? '£' : bracelet.currency === 'USD' ? '$' : '€'}${bracelet.price}`,
    openGraph: {
      title: bracelet.seoTitle || `${bracelet.name} - TREVA Jewelry`,
      description:
        bracelet.seoDescription ||
        `${bracelet.name} - ${bracelet.material}, ${bracelet.stone} - ${bracelet.size}`,
      images: bracelet.mainImageUrl ? [bracelet.mainImageUrl] : [],
    },
  };
}
