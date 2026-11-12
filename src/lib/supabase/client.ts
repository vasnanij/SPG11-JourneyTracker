import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { supabase, SUPABASE_URL, SUPABASE_ANON_KEY } from '../supabase';

export function createClient() {
  if (supabase) return supabase;
  return createSupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
