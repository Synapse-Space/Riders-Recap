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

window.SUPABASE_URL = config.SUPABASE_URL;
window.SUPABASE_ANON_KEY = config.SUPABASE_ANON_KEY;

// Initialize Supabase client
window.supabaseClient = supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
