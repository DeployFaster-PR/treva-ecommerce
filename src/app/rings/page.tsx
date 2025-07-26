import { client } from '@/lib/sanity';
import RingListing from './RingListing';

async function getRings() {
  const query = `*[_type == "ring" && active == true] | order(_createdAt desc)[0...24] {
    _id,
    name,
    slug,
    price,
    originalPrice,
    currency,
    mainImageUrl,
    imageUrls,
    inStock,
    material,
    stone,
    color,
    size,
    category,
    featured,
    _createdAt
  }`;

  const rings = await client.fetch(query);
  const totalCount = await client.fetch(
    `count(*[_type == "ring" && active == true])`
  );

  return {
    rings,
    totalCount,
  };
}

export default async function RingsPage() {
  const { rings, totalCount } = await getRings();

  return <RingListing initialRings={rings} totalCount={totalCount} />;
}
