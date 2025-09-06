# MediLinks Supabase Migration Guide

## 🚀 Complete Migration from PostgreSQL + MongoDB to Supabase

This guide covers the complete migration of the MediLinks platform from a hybrid PostgreSQL + MongoDB setup to a unified Supabase backend.

## 📋 Migration Overview

### What Changed:
- **Database**: PostgreSQL + MongoDB → Supabase (PostgreSQL with built-in features)
- **Authentication**: Custom JWT → Supabase Auth
- **API**: Raw SQL queries → Supabase Client
- **Admin Panel**: Updated to work with new API structure
- **Real-time**: Added Supabase real-time capabilities

### What Stayed the Same:
- Frontend React.js admin panel
- Mobile app Flutter structure
- Core business logic and features

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Supabase Project Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Get your project URL and API keys from the project settings
3. Run the SQL schema from `backend/supabase-schema.sql` in your Supabase SQL editor

### 3. Environment Configuration

Create a `.env` file in the backend directory:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration (if using custom JWT)
JWT_SECRET=your_jwt_secret_key
REFRESH_TOKEN_SECRET=your_refresh_token_secret_key

# Other Configuration
CORS_ORIGIN=http://localhost:3000
```

### 4. Admin Panel Configuration

Update your admin panel `.env` file:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🗄️ Database Schema

### Tables Created:

1. **profiles** - User profiles (extends Supabase auth.users)
2. **medicines** - Medicine listings and inventory
3. **logs** - System logs and activity tracking
4. **ocr_submissions** - OCR processing data

### Key Features:
- **Row Level Security (RLS)** enabled on all tables
- **Automatic profile creation** on user signup
- **Foreign key relationships** with proper cascading
- **Indexes** for optimal performance
- **Triggers** for automatic timestamp updates

## 🔐 Authentication System

### Supabase Auth Features:
- **Email/Password authentication**
- **Automatic user profile creation**
- **JWT token management**
- **Row Level Security integration**
- **Admin role-based access**

### API Endpoints:
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Token refresh
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

## 📊 Admin Panel Features

### Enhanced Dashboard:
- **Real-time statistics** from Supabase
- **System status monitoring**
- **Quick action buttons**
- **Visual data representation**

### User Management:
- **Advanced filtering** (type, verification status)
- **Bulk operations** (verify/unverify users)
- **User deletion** with confirmation
- **Pagination** for large datasets

### Medicine Management:
- **Status management** (available, claimed, expired, pending)
- **Search and filtering** capabilities
- **Donor information** display
- **Batch and expiry tracking**

### Log Management:
- **Real-time log statistics**
- **Level-based filtering** (error, warn, info, debug)
- **Type-based filtering** (auth, medicine, user, system)
- **Metadata display** for detailed logs

## 🚀 Running the Application

### Backend:
```bash
cd backend
npm run dev
```

### Admin Panel:
```bash
cd admin_panel
npm start
```

## 🔧 API Routes

### Medicine Routes (`/api/medicines`):
- `GET /medicines` - List medicines with filters
- `POST /medicines` - Add new medicine
- `GET /medicines/:id` - Get single medicine
- `PUT /medicines/:id` - Update medicine
- `DELETE /medicines/:id` - Delete medicine

### User Routes (`/api/users`):
- `GET /users` - List users with filters
- `GET /users/:id` - Get single user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user
- `GET /users/:id/medicines` - Get user's medicines

### Log Routes (`/api/logs`):
- `GET /logs` - List logs with filters
- `POST /logs` - Create log entry
- `GET /logs/stats` - Get log statistics
- `DELETE /logs/:id` - Delete log

## 🔒 Security Features

### Row Level Security (RLS):
- **User-specific data access**
- **Admin override capabilities**
- **Automatic policy enforcement**
- **Secure data isolation**

### Authentication:
- **Supabase Auth integration**
- **JWT token validation**
- **Role-based access control**
- **Secure API endpoints**

## 📈 Performance Improvements

### Database:
- **Optimized queries** with Supabase client
- **Automatic indexing** on key columns
- **Connection pooling** handled by Supabase
- **Real-time subscriptions** available

### API:
- **Reduced latency** with Supabase edge functions
- **Automatic caching** for frequently accessed data
- **Efficient pagination** implementation
- **Optimized data fetching**

## 🧪 Testing

### Backend Testing:
```bash
cd backend
npm test
```

### Admin Panel Testing:
```bash
cd admin_panel
npm test
```

## 🚨 Troubleshooting

### Common Issues:

1. **Supabase Connection Error**:
   - Check your environment variables
   - Verify Supabase project URL and keys
   - Ensure database schema is properly set up

2. **Authentication Issues**:
   - Verify JWT secret configuration
   - Check RLS policies are correctly set
   - Ensure user profiles are being created

3. **Admin Panel Not Loading Data**:
   - Check API URL configuration
   - Verify authentication tokens
   - Check browser console for errors

### Debug Mode:
Set `NODE_ENV=development` for detailed error logging.

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Client](https://supabase.com/docs/reference/javascript)

## 🎯 Next Steps

1. **Set up Supabase project** and run the schema
2. **Configure environment variables**
3. **Test the API endpoints**
4. **Verify admin panel functionality**
5. **Deploy to production**

## ✅ Migration Checklist

- [x] Update backend dependencies
- [x] Create Supabase configuration
- [x] Migrate authentication system
- [x] Update API routes
- [x] Enhance admin panel
- [x] Create database schema
- [x] Set up security policies
- [x] Test complete system

The migration is now complete! Your MediLinks platform is running on Supabase with enhanced features and improved performance.