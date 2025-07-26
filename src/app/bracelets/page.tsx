import { client } from '@/lib/sanity';
import BraceletListing from './BraceletListing';

async function getBracelets() {
  const query = `*[_type == "bracelet" && active == true] | order(_createdAt desc)[0...24] {
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

  const bracelets = await client.fetch(query);
  const totalCount = await client.fetch(
    `count(*[_type == "bracelet" && active == true])`
  );

  return {
    bracelets,
    totalCount,
  };
}

export default async function BraceletsPage() {
  const { bracelets, totalCount } = await getBracelets();

  return (
    <BraceletListing initialBracelets={bracelets} totalCount={totalCount} />
  );
}
