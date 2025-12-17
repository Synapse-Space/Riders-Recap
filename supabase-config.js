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

window.SUPABASE_URL = config.SUPABASE_URL || '';
window.SUPABASE_ANON_KEY = config.SUPABASE_ANON_KEY || '';

// Initialize Supabase client only if URL is valid
console.log('Supabase Config Debug:', {
    hasConfig: !!window.CONFIG,
    url: window.SUPABASE_URL,
    keyLength: window.SUPABASE_ANON_KEY ? window.SUPABASE_ANON_KEY.length : 0
});

if (window.SUPABASE_URL && window.SUPABASE_URL !== 'YOUR_SUPABASE_URL' && window.SUPABASE_URL.startsWith('http')) {
    window.supabaseClient = supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
    console.log('Supabase client initialized successfully.');
} else {
    console.warn('Supabase configuration missing or invalid. Data saving will be disabled.');
    console.warn('Validation failed:', {
        urlPresent: !!window.SUPABASE_URL,
        notPlaceholder: window.SUPABASE_URL !== 'YOUR_SUPABASE_URL',
        startsWithHttp: window.SUPABASE_URL ? window.SUPABASE_URL.startsWith('http') : false
    });
}
