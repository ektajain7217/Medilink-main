const express = require('express');
const router = express.Router();
const pool = require('../config/db');
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
    const result = await pool.query(
      `INSERT INTO medicines 
        (name, brand, batch_number, expiry_date, image_url, donor_id, quantity, status, barcode, condition)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        name,
        brand || null,
        batch_number || null,
        expiry_date,
        image_url || null,
        donor_id,
        quantity || 1,
        status || 'available',
        barcode || null,
        condition || null,
      ]
    );

    res.status(201).json({ message: '✅ Medicine added', medicine: result.rows[0] });
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

  let query = `SELECT * FROM medicines WHERE 1=1`;
  const values = [];

  if (search) {
    query += ` AND name ILIKE $${values.length + 1}`;
    values.push(`%${search}%`);
  }

  if (status) {
    query += ` AND status = $${values.length + 1}`;
    values.push(status);
  }

  query += ` ORDER BY created_at DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
  values.push(limit);
  values.push(offset);

  try {
    const result = await pool.query(query, values);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('❌ Error fetching medicines:', err);
    res.status(500).json({ message: 'Server error fetching medicines' });
  }
});

module.exports = router;
