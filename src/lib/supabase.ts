import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// These will be replaced with your new Supabase project credentials
const supabaseUrl = "YOUR_SUPABASE_URL";
const supabaseAnonKey = "YOUR_SUPABASE_ANON_KEY";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});