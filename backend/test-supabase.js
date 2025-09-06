const { supabase, supabaseAdmin } = require('./config/supabase');

async function testSupabaseConnection() {
  console.log('🧪 Testing Supabase Connection...');
  console.log('🔗 URL: https://hctrvqyhscvrxwvinbdv.supabase.co');
  
  try {
    // Test basic connection
    console.log('\n1️⃣ Testing basic connection...');
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    if (error) {
      console.log('❌ Basic connection failed:', error.message);
      return;
    }
    
    console.log('✅ Basic connection successful');
    
    // Test admin connection
    console.log('\n2️⃣ Testing admin connection...');
    const { data: adminData, error: adminError } = await supabaseAdmin
      .from('profiles')
      .select('count')
      .limit(1);
    
    if (adminError) {
      console.log('❌ Admin connection failed:', adminError.message);
      return;
    }
    
    console.log('✅ Admin connection successful');
    
    // Test auth functionality
    console.log('\n3️⃣ Testing auth functionality...');
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.log('⚠️ Auth test (expected - no active session):', authError.message);
    } else {
      console.log('✅ Auth functionality working');
    }
    
    console.log('\n🎉 All Supabase tests passed!');
    console.log('\n📋 Next steps:');
    console.log('1. Run the SQL schema in your Supabase dashboard');
    console.log('2. Create your first admin user');
    console.log('3. Start the backend server: npm run dev');
    console.log('4. Test the admin panel');
    
  } catch (err) {
    console.log('❌ Connection test failed:', err.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check your Supabase URL and keys');
    console.log('2. Ensure your Supabase project is active');
    console.log('3. Verify the database schema is set up');
  }
}

// Run the test
testSupabaseConnection();