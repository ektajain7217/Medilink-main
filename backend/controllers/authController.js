const { supabase, supabaseAdmin } = require('../config/supabase');

// Register New User
const register = async (req, res) => {
  const { name, email, password, type } = req.body;

  try {
    // Use Supabase Auth to create user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          type: type || 'donor'
        }
      }
    });

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    // Update user profile in profiles table
    if (data.user) {
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .insert({
          id: data.user.id,
          name,
          email,
          type: type || 'donor',
          verified: false,
          created_at: new Date().toISOString()
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
      }
    }

    res.status(201).json({ 
      message: 'User registered successfully',
      user: data.user 
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login User
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Use Supabase Auth to sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
    }

    res.json({
      accessToken: data.session?.access_token,
      refreshToken: data.session?.refresh_token,
      user: {
        id: data.user.id,
        name: profile?.name || data.user.user_metadata?.name,
        email: data.user.email,
        type: profile?.type || data.user.user_metadata?.type
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Refresh Access Token
const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: 'No refresh token provided' });
  }

  try {
    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: refreshToken
    });

    if (error) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    res.json({
      accessToken: data.session?.access_token,
      refreshToken: data.session?.refresh_token
    });
  } catch (err) {
    console.error('Refresh token error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Logout User
const logout = async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get current user
const getCurrentUser = async (req, res) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Get user profile
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    res.json({
      user: {
        id: user.id,
        name: profile?.name || user.user_metadata?.name,
        email: user.email,
        type: profile?.type || user.user_metadata?.type
      }
    });
  } catch (err) {
    console.error('Get current user error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { 
  register, 
  login, 
  refreshToken, 
  logout, 
  getCurrentUser 
};