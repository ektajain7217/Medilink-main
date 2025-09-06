# MediLinks Supabase Configuration Guide

## 🚀 Your Supabase Credentials

**Supabase URL:** `https://hctrvqyhscvrxwvinbdv.supabase.co`
**Anon Key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjdHJ2cXloc2N2cnh3dmluYmR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxMzczNTIsImV4cCI6MjA3MjcxMzM1Mn0.qpMow9VYDN7UkhSYngpLUhMLm-Oq8YL44WuTTE3o-88`

## 📁 Backend Configuration

Create a `.env` file in the `backend` directory with:

```env
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
```

## 📱 Admin Panel Configuration

Create a `.env` file in the `admin_panel` directory with:

```env
# Backend API URL
REACT_APP_API_URL=http://localhost:5000/api

# Supabase Configuration (optional - for direct client usage)
REACT_APP_SUPABASE_URL=https://hctrvqyhscvrxwvinbdv.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjdHJ2cXloc2N2cnh3dmluYmR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxMzczNTIsImV4cCI6MjA3MjcxMzM1Mn0.qpMow9VYDN7UkhSYngpLUhMLm-Oq8YL44WuTTE3o-88
```

## 🗄️ Database Setup

1. **Go to your Supabase Dashboard:** https://supabase.com/dashboard/project/hctrvqyhscvrxwvinbdv
2. **Navigate to SQL Editor**
3. **Run the complete SQL schema** from `backend/supabase-schema.sql`

## 🔑 Service Role Key

To get your Service Role Key:
1. Go to Supabase Dashboard → Settings → API
2. Copy the `service_role` key (not the anon key)
3. Replace `your_service_role_key_here` in your `.env` file

## 🚀 Running the Application

### Backend:
```bash
cd backend
npm install
npm run dev
```

### Admin Panel:
```bash
cd admin_panel
npm install
npm start
```

## ✅ Verification

1. **Backend should show:** `✅ Supabase client initialized`
2. **Admin panel should connect** to the backend API
3. **Database tables** should be created in Supabase
4. **Authentication** should work with Supabase Auth

## 🔧 Troubleshooting

- **Connection issues:** Check your Supabase URL and keys
- **RLS errors:** Ensure Row Level Security policies are set up
- **Auth issues:** Verify Supabase Auth is enabled in your project
- **CORS errors:** Check CORS_ORIGIN setting matches your frontend URL

Your Supabase project is now configured and ready to use! 🎉