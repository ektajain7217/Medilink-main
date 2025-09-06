const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL || 'https://hctrvqyhscvrxwvinbdv.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjdHJ2cXloc2N2cnh3dmluYmR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxMzczNTIsImV4cCI6MjA3MjcxMzM1Mn0.qpMow9VYDN7UkhSYngpLUhMLm-Oq8YL44WuTTE3o-88';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables. Please check SUPABASE_URL and SUPABASE_ANON_KEY');
}

// Create Supabase client for general operations
const supabase = createClient(supabaseUrl, supabaseKey);

// Create Supabase client with service role key for admin operations
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey || supabaseKey);

console.log('✅ Supabase client initialized');
console.log('🔗 Supabase URL:', supabaseUrl);
console.log('🔑 Using Anon Key:', supabaseKey.substring(0, 20) + '...');

module.exports = {
  supabase,
  supabaseAdmin
};