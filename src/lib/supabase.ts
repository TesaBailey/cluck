
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

const supabaseUrl = "https://tjxwlrhxirglcmifwgyw.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqeHdscmh4aXJnbGNtaWZ3Z3l3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxMTIzMjMsImV4cCI6MjA1OTY4ODMyM30.TiGxcakJg3QHI_LMw8RR4nIJALQu75uqF6TOa5_vxK0";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});
