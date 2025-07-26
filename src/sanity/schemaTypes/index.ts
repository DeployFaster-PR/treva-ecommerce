// schemaTypes/index.ts
import { type SchemaTypeDefinition } from 'sanity';
import { earringSchemas } from './earrings';
import { necklaceSchemas } from './necklaces';
import { braceletSchemas } from './bracelets';
import { ringSchemas } from './rings';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Earring schemas
    ...earringSchemas,
    // Necklace schemas
    ...necklaceSchemas,
    // Bracelet schemas
    ...braceletSchemas,
    // Ring schemas
    ...ringSchemas,
  ],
};
