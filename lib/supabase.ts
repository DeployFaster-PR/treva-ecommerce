// lib/supabase.ts
import {
  createClientComponentClient,
  createServerComponentClient,
} from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/database';

export const createClient = () => createClientComponentClient<Database>();

export const createServerClient = async () => {
  const { cookies } = await import('next/headers');
  return createServerComponentClient<Database>({ cookies });
};
