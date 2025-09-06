@echo off
echo 🚀 MediLinks Supabase Setup Script
echo ==================================

REM Check if we're in the backend directory
if not exist "package.json" (
    echo ❌ Please run this script from the backend directory
    pause
    exit /b 1
)

echo 📦 Installing dependencies...
npm install

echo.
echo 🔧 Creating environment file...
(
echo # Supabase Configuration
echo SUPABASE_URL=https://hctrvqyhscvrxwvinbdv.supabase.co
echo SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjdHJ2cXloc2N2cnh3dmluYmR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxMzczNTIsImV4cCI6MjA3MjcxMzM1Mn0.qpMow9VYDN7UkhSYngpLUhMLm-Oq8YL44WuTTE3o-88
echo SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
echo.
echo # Server Configuration
echo PORT=5000
echo NODE_ENV=development
echo.
echo # JWT Configuration
echo JWT_SECRET=your_jwt_secret_key_here
echo REFRESH_TOKEN_SECRET=your_refresh_token_secret_key_here
echo.
echo # CORS Configuration
echo CORS_ORIGIN=http://localhost:3000
) > .env

echo ✅ Environment file created!

echo.
echo 🧪 Testing Supabase connection...
node test-supabase.js

echo.
echo 📋 Setup Complete!
echo.
echo 🔧 Next steps:
echo 1. Get your Service Role Key from Supabase Dashboard
echo 2. Update SUPABASE_SERVICE_ROLE_KEY in .env file
echo 3. Run the SQL schema in your Supabase dashboard
echo 4. Start the server: npm run dev
echo.
echo 🌐 Supabase Dashboard: https://supabase.com/dashboard/project/hctrvqyhscvrxwvinbdv
pause