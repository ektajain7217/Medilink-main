#!/bin/bash

echo "🚀 MediLinks Supabase Setup Script"
echo "=================================="

# Check if we're in the backend directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the backend directory"
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

echo ""
echo "🔧 Creating environment file..."
cat > .env << EOF
# Supabase Configuration
SUPABASE_URL=https://hctrvqyhscvrxwvinbdv.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjdHJ2cXloc2N2cnh3dmluYmR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxMzczNTIsImV4cCI6MjA3MjcxMzM1Mn0.qpMow9VYDN7UkhSYngpLUhMLm-Oq8YL44WuTTE3o-88
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
REFRESH_TOKEN_SECRET=your_refresh_token_secret_key_here

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
EOF

echo "✅ Environment file created!"

echo ""
echo "🧪 Testing Supabase connection..."
node test-supabase.js

echo ""
echo "📋 Setup Complete!"
echo ""
echo "🔧 Next steps:"
echo "1. Get your Service Role Key from Supabase Dashboard"
echo "2. Update SUPABASE_SERVICE_ROLE_KEY in .env file"
echo "3. Run the SQL schema in your Supabase dashboard"
echo "4. Start the server: npm run dev"
echo ""
echo "🌐 Supabase Dashboard: https://supabase.com/dashboard/project/hctrvqyhscvrxwvinbdv"