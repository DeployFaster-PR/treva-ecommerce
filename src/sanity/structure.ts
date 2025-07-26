// sanity/structure.ts
import type { StructureResolver } from 'sanity/structure';

export const structure: StructureResolver = (S) =>
  S.list()
    .title('TREVA Content')
    .items([
      // Earrings Section
      S.listItem()
        .title('Earrings')
        .child(S.documentTypeList('earring').title('Earrings')),
      S.listItem()
        .title('Earring Reviews')
        .child(S.documentTypeList('earringReview').title('Earring Reviews')),

      // Add a divider
      S.divider(),

      // Necklaces Section
      S.listItem()
        .title('Necklaces')
        .child(S.documentTypeList('necklace').title('Necklaces')),
      S.listItem()
        .title('Necklace Reviews')
        .child(S.documentTypeList('necklaceReview').title('Necklace Reviews')),

      // Add another divider
      S.divider(),

      // Bracelet Section
      S.listItem()
        .title('Bracelets')
        .child(S.documentTypeList('bracelet').title('Bracelets')),
      S.listItem()
        .title('Bracelet Reviews')
        .child(S.documentTypeList('braceletReview').title('Bracelet Reviews')),

      // Add another divider
      S.divider(),

      // Rings Section
      S.listItem()
        .title('Rings')
        .child(S.documentTypeList('ring').title('Rings')),
      S.listItem()
        .title('Ring Reviews')
        .child(S.documentTypeList('ringReview').title('Ring Reviews')),

      // Add another divider for future products
      S.divider(),
    ]);
