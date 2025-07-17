import { client } from '@/lib/sanity';
import EarringListing from './EarringListing';

async function getEarrings() {
  const query = `*[_type == "earring" && active == true] | order(_createdAt desc)[0...24] {
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
    category,
    featured,
    _createdAt
  }`;

  const earrings = await client.fetch(query);
  const totalCount = await client.fetch(
    `count(*[_type == "earring" && active == true])`
  );

  return {
    earrings,
    totalCount,
  };
}

export default async function EarringsPage() {
  const { earrings, totalCount } = await getEarrings();

  return <EarringListing initialEarrings={earrings} totalCount={totalCount} />;
}
