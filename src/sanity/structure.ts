import type { StructureResolver } from 'sanity/structure';

export const structure: StructureResolver = (S) =>
  S.list()
    .title('TREVA Content')
    .items([
      S.listItem()
        .title('Earrings')
        .child(S.documentTypeList('earring').title('Earrings')),
      S.listItem()
        .title('Reviews')
        .child(S.documentTypeList('earringReview').title('Reviews')),
      // Add a divider
      S.divider(),
      // You can add other sections here if needed
    ]);
