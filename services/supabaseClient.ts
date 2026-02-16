
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jnarwjrpbccdvxndpwva.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuYXJ3anJwYmNjZHZ4bmRwd3ZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3NTQ0MDgsImV4cCI6MjA4NjMzMDQwOH0.4HeseoRaq-CgqnIVU1uB-zjtFox6UubWGAbYjASpggs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Proactively checks if the Supabase project is reachable.
 */
export async function checkConnection() {
  try {
    const { data, error } = await supabase.from('incidents').select('id').limit(1);
    if (error) throw error;
    return true;
  } catch (err) {
    console.warn('Supabase connection check failed:', err);
    return false;
  }
}
