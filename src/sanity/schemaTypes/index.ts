import { type SchemaTypeDefinition } from 'sanity';
import { earringSchemas } from './earrings';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Earring schemas
    ...earringSchemas,
  ],
};
