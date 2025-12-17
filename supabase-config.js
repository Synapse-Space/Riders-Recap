/**
 * Supabase Configuration for Rider Recap
 * 
 * IMPORTANT: Replace the placeholder values below with your actual Supabase credentials.
 * Find these in your Supabase dashboard: Settings → API
 */

// Check for configuration from window.CONFIG (injected by config.js or CI)
const config = window.CONFIG || {
    SUPABASE_URL: 'YOUR_SUPABASE_URL',
    SUPABASE_ANON_KEY: 'YOUR_SUPABASE_ANON_KEY'
};

const SUPABASE_URL = config.SUPABASE_URL;
const SUPABASE_ANON_KEY = config.SUPABASE_ANON_KEY;

// Initialize Supabase client
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
