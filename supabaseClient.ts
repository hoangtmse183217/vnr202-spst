import { createClient } from '@supabase/supabase-js';

// Cấu hình Supabase từ thông tin bạn cung cấp
const SUPABASE_URL = 'https://owojavhylelqoitcqwmf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93b2phdmh5bGVscW9pdGNxd21mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxODc3NzQsImV4cCI6MjA3ODc2Mzc3NH0.hRqBT3T7qlS-XnR2dky5A40WFdLthpd0n7xHB8PWZpc';

// Helper để kiểm tra cấu hình
export const isSupabaseConfigured = () => {
  return SUPABASE_URL.length > 0 && SUPABASE_ANON_KEY.length > 0;
};

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);