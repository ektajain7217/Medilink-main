const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const refreshTokens = new Set(); // Secure in-memory refresh token storage
const authController = require('../controllers/authController');


// Register New User
const register = async (req, res) => {
  const { name, email, password, type } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    await pool.query(
      'INSERT INTO users (name, email, password_hash, type, verified, created_at) VALUES ($1, $2, $3, $4, $5, NOW())',
      [name, email, hashedPassword, type, false]
    );

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login User
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const payload = { id: user.id, name: user.name, type: user.type };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

    refreshTokens.add(refreshToken); // Store refresh token securely

    res.json({
      accessToken,
      refreshToken,
      user: { id: user.id, name: user.name, type: user.type }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Refresh Access Token
const refreshToken = (req, res) => {
  const { token } = req.body;

  if (!token) return res.status(401).json({ message: 'No token provided' });
  if (!refreshTokens.has(token)) return res.status(403).json({ message: 'Invalid refresh token' });

  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });

    const payload = { id: user.id, name: user.name, type: user.type };
    const newAccessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });

    res.json({ accessToken: newAccessToken });
  });
};

// Logout User
const logout = (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ message: 'Token required' });

  refreshTokens.delete(token);
  res.status(200).json({ message: 'Logged out successfully' });
};

module.exports = { register, login, refreshToken, logout };
