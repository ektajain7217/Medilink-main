const express = require('express');
const router = express.Router();
const { supabase, supabaseAdmin } = require('../config/supabase');

console.log("📦 medicineRoutes loaded");

// POST /api/medicines
router.post('/medicines', async (req, res) => {
  console.log("📨 POST /api/medicines hit");
  const {
    name,
    brand,
    batch_number,
    expiry_date,
    image_url,
    donor_id,
    quantity,
    status,
    barcode,
    condition,
  } = req.body;

  if (!name || !expiry_date || !donor_id) {
    return res.status(400).json({ message: 'Missing required fields (name, expiry_date, donor_id)' });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('medicines')
      .insert({
        name,
        brand: brand || null,
        batch_number: batch_number || null,
        expiry_date,
        image_url: image_url || null,
        donor_id,
        quantity: quantity || 1,
        status: status || 'available',
        barcode: barcode || null,
        condition: condition || null,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Error inserting medicine:', error);
      return res.status(500).json({ message: 'Server error while inserting medicine' });
    }

    res.status(201).json({ message: '✅ Medicine added', medicine: data });
  } catch (err) {
    console.error('❌ Error inserting medicine:', err);
    res.status(500).json({ message: 'Server error while inserting medicine' });
  }
});

// GET /api/medicines with optional filters
// Supports: ?search=&status=&page=&limit=
router.get('/medicines', async (req, res) => {
  const { search = '', status = '', page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  try {
    let query = supabaseAdmin
      .from('medicines')
      .select(`
        *,
        profiles:donor_id (
          name,
          email,
          type
        )
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply filters
    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('❌ Error fetching medicines:', error);
      return res.status(500).json({ message: 'Server error fetching medicines' });
    }

    res.status(200).json(data || []);
  } catch (err) {
    console.error('❌ Error fetching medicines:', err);
    res.status(500).json({ message: 'Server error fetching medicines' });
  }
});

// GET /api/medicines/:id - Get single medicine
router.get('/medicines/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabaseAdmin
      .from('medicines')
      .select(`
        *,
        profiles:donor_id (
          name,
          email,
          type
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('❌ Error fetching medicine:', error);
      return res.status(404).json({ message: 'Medicine not found' });
    }

    res.status(200).json(data);
  } catch (err) {
    console.error('❌ Error fetching medicine:', err);
    res.status(500).json({ message: 'Server error fetching medicine' });
  }
});

// PUT /api/medicines/:id - Update medicine
router.put('/medicines/:id', async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const { data, error } = await supabaseAdmin
      .from('medicines')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('❌ Error updating medicine:', error);
      return res.status(500).json({ message: 'Server error updating medicine' });
    }

    res.status(200).json({ message: '✅ Medicine updated', medicine: data });
  } catch (err) {
    console.error('❌ Error updating medicine:', err);
    res.status(500).json({ message: 'Server error updating medicine' });
  }
});

// DELETE /api/medicines/:id - Delete medicine
router.delete('/medicines/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const { error } = await supabaseAdmin
      .from('medicines')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('❌ Error deleting medicine:', error);
      return res.status(500).json({ message: 'Server error deleting medicine' });
    }

    res.status(200).json({ message: '✅ Medicine deleted' });
  } catch (err) {
    console.error('❌ Error deleting medicine:', err);
    res.status(500).json({ message: 'Server error deleting medicine' });
  }
});

module.exports = router;