const express = require('express');
const router = express.Router();
const { supabase, supabaseAdmin } = require('../config/supabase');

console.log("👥 userRoutes loaded");

// GET /api/users - Get all users
router.get('/users', async (req, res) => {
  const { page = 1, limit = 10, type = '', verified = '' } = req.query;
  const offset = (page - 1) * limit;

  try {
    let query = supabaseAdmin
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply filters
    if (type) {
      query = query.eq('type', type);
    }

    if (verified !== '') {
      query = query.eq('verified', verified === 'true');
    }

    const { data, error } = await query;

    if (error) {
      console.error('❌ Error fetching users:', error);
      return res.status(500).json({ message: 'Server error fetching users' });
    }

    res.status(200).json(data || []);
  } catch (err) {
    console.error('❌ Error fetching users:', err);
    res.status(500).json({ message: 'Server error fetching users' });
  }
});

// GET /api/users/:id - Get single user
router.get('/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('❌ Error fetching user:', error);
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(data);
  } catch (err) {
    console.error('❌ Error fetching user:', err);
    res.status(500).json({ message: 'Server error fetching user' });
  }
});

// PUT /api/users/:id - Update user
router.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('❌ Error updating user:', error);
      return res.status(500).json({ message: 'Server error updating user' });
    }

    res.status(200).json({ message: '✅ User updated', user: data });
  } catch (err) {
    console.error('❌ Error updating user:', err);
    res.status(500).json({ message: 'Server error updating user' });
  }
});

// DELETE /api/users/:id - Delete user
router.delete('/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // First delete user from auth
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(id);
    
    if (authError) {
      console.error('❌ Error deleting user from auth:', authError);
    }

    // Then delete from profiles
    const { error } = await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('❌ Error deleting user profile:', error);
      return res.status(500).json({ message: 'Server error deleting user' });
    }

    res.status(200).json({ message: '✅ User deleted' });
  } catch (err) {
    console.error('❌ Error deleting user:', err);
    res.status(500).json({ message: 'Server error deleting user' });
  }
});

// GET /api/users/:id/medicines - Get medicines by user
router.get('/users/:id/medicines', async (req, res) => {
  const { id } = req.params;
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  try {
    const { data, error } = await supabaseAdmin
      .from('medicines')
      .select('*')
      .eq('donor_id', id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('❌ Error fetching user medicines:', error);
      return res.status(500).json({ message: 'Server error fetching user medicines' });
    }

    res.status(200).json(data || []);
  } catch (err) {
    console.error('❌ Error fetching user medicines:', err);
    res.status(500).json({ message: 'Server error fetching user medicines' });
  }
});

module.exports = router;