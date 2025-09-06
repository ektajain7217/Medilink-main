const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables. Please check SUPABASE_URL and SUPABASE_ANON_KEY');
}

// Create Supabase client for general operations
const supabase = createClient(supabaseUrl, supabaseKey);

// Create Supabase client with service role key for admin operations
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey || supabaseKey);

console.log('✅ Supabase client initialized');

module.exports = {
  supabase,
  supabaseAdmin
};