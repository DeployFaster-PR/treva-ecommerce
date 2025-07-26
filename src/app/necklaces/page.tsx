import { client } from '@/lib/sanity';
import NecklaceListing from './NecklaceListing';

async function getNecklaces() {
  const query = `*[_type == "necklace" && active == true] | order(_createdAt desc)[0...24] {
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

  const necklaces = await client.fetch(query);
  const totalCount = await client.fetch(
    `count(*[_type == "necklace" && active == true])`
  );

  return {
    necklaces,
    totalCount,
  };
}

export default async function NecklacesPage() {
  const { necklaces, totalCount } = await getNecklaces();

  return (
    <NecklaceListing initialNecklaces={necklaces} totalCount={totalCount} />
  );
}
