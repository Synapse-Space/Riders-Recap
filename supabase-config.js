/**
 * Supabase Configuration for Rider Recap
 * 
 * IMPORTANT: Replace the placeholder values below with your actual Supabase credentials.
 * Find these in your Supabase dashboard: Settings → API
 */

// ⚠️ REPLACE THESE VALUES WITH YOUR SUPABASE CREDENTIALS
const SUPABASE_URL = 'https://lpgdylwxyislpgciiwob.supabase.co';  
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwZ2R5bHd4eWlzbHBnY2lpd29iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5NzExMjEsImV4cCI6MjA4MTU0NzEyMX0.VakdAGvcP6mIgqH7qcn4y2cdFrdYEAxQCBWDT8EvjJE';

// Initialize Supabase client
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
