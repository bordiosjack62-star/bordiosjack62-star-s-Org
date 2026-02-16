
import { createClient } from '@supabase/supabase-js';

// Project URL from your project details
const supabaseUrl = 'https://jnarwjrpbccdvxndpwva.supabase.co';

/**
 * INSTRUCTIONS:
 * 1. Go to your Supabase Dashboard (jnarwjrpbccdvxndpwva)
 * 2. Go to Project Settings > API
 * 3. Copy the 'anon' 'public' key
 * 4. Replace 'YOUR_SUPABASE_ANON_KEY' below with that string
 */
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
