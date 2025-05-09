const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectMongo = require('./config/mongo');
const pool = require('./config/db');
const jwt = require('jsonwebtoken');

const authRoutes = require('./routes/authRoutes');
const ocrRoutes = require('./routes/ocrRoutes');
const medicineRoutes = require('./routes/medicineRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(cors());
app.use(express.json()); // For parsing application/json

// ✅ Connect to MongoDB
connectMongo();

// ✅ JWT Middleware (optional)
const protectRoute = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
    req.user = decoded;
    next();
  });
};

// ✅ Public or Protected Routes
app.use('/api', authRoutes);         // /api/login, /api/register
app.use('/api', ocrRoutes);          // /api/ocr
app.use('/api/medicines', medicineRoutes); // 👈 Clean route: POST /api/medicines

// ✅ Optional test for protected route
app.get('/api/protected', protectRoute, (req, res) => {
  res.status(200).json({ message: 'This is a protected route!', user: req.user });
});

// ✅ Test PostgreSQL Connection
app.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM users');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Database query error' });
  }
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
