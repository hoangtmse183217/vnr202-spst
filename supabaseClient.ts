import { createClient } from '@supabase/supabase-js';

// NOTE: In a real Next.js app, these would be process.env.NEXT_PUBLIC_SUPABASE_URL
// For this standalone demo, you should replace these strings with your actual Supabase credentials.
// Or set them in your environment variables.

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://owojavhylelqoitcqwmf.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_secret_TJXGAonhS4vb5kixwqrGxg_Qw-eJkYR';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
