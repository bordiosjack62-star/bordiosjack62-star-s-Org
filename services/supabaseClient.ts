
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jnarwjrpbccdvxndpwva.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuYXJ3anJwYmNjZHZ4bmRwd3ZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3NTQ0MDgsImV4cCI6MjA4NjMzMDQwOH0.4HeseoRaq-CgqnIVU1uB-zjtFox6UubWGAbYjASpggs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
