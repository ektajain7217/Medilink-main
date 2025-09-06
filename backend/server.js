const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { supabase } = require('./config/supabase');

const authRoutes = require('./routes/authRoutes');
const ocrRoutes = require('./routes/ocrRoutes');
const medicineRoutes = require('./routes/medicineRoutes');
const userRoutes = require('./routes/userRoutes');
const logRoutes = require('./routes/logRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Connect to Supabase
console.log('✅ Supabase connected');

// ✅ Routes
app.use('/api/auth', authRoutes);         // /api/auth/login, /api/auth/register
app.use('/api', ocrRoutes);                // /api/ocr
app.use('/api', medicineRoutes);          // /api/medicines
app.use('/api', userRoutes);              // /api/users
app.use('/api', logRoutes);               // /api/logs

// ✅ JWT Middleware for protected routes
const protectRoute = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// ✅ Test protected route
app.get('/api/protected', protectRoute, (req, res) => {
  res.status(200).json({ message: 'This is a protected route!', user: req.user });
});

// ✅ Test Supabase Connection
app.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);

    if (error) {
      throw error;
    }

    res.json({ message: 'Supabase connection successful', profiles: data });
  } catch (err) {
    res.status(500).json({ message: 'Supabase connection error', error: err.message });
  }
});

// ✅ Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'MediLinks Backend'
  });
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Supabase integration active`);
});