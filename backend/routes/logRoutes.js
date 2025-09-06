const express = require('express');
const router = express.Router();
const { supabase, supabaseAdmin } = require('../config/supabase');

console.log("📋 logRoutes loaded");

// GET /api/logs - Get all logs
router.get('/logs', async (req, res) => {
  const { page = 1, limit = 10, level = '', type = '' } = req.query;
  const offset = (page - 1) * limit;

  try {
    let query = supabaseAdmin
      .from('logs')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply filters
    if (level) {
      query = query.eq('level', level);
    }

    if (type) {
      query = query.eq('type', type);
    }

    const { data, error } = await query;

    if (error) {
      console.error('❌ Error fetching logs:', error);
      return res.status(500).json({ message: 'Server error fetching logs' });
    }

    res.status(200).json(data || []);
  } catch (err) {
    console.error('❌ Error fetching logs:', err);
    res.status(500).json({ message: 'Server error fetching logs' });
  }
});

// POST /api/logs - Create new log entry
router.post('/logs', async (req, res) => {
  const { level, type, message, user_id, metadata } = req.body;

  if (!level || !type || !message) {
    return res.status(400).json({ message: 'Missing required fields (level, type, message)' });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('logs')
      .insert({
        level,
        type,
        message,
        user_id: user_id || null,
        metadata: metadata || null,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Error creating log:', error);
      return res.status(500).json({ message: 'Server error creating log' });
    }

    res.status(201).json({ message: '✅ Log created', log: data });
  } catch (err) {
    console.error('❌ Error creating log:', err);
    res.status(500).json({ message: 'Server error creating log' });
  }
});

// GET /api/logs/stats - Get log statistics
router.get('/logs/stats', async (req, res) => {
  try {
    // Get total logs count
    const { count: totalLogs } = await supabaseAdmin
      .from('logs')
      .select('*', { count: 'exact', head: true });

    // Get logs by level
    const { data: logsByLevel } = await supabaseAdmin
      .from('logs')
      .select('level')
      .not('level', 'is', null);

    // Get logs by type
    const { data: logsByType } = await supabaseAdmin
      .from('logs')
      .select('type')
      .not('type', 'is', null);

    // Get recent activity (last 24 hours)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const { count: recentLogs } = await supabaseAdmin
      .from('logs')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', yesterday.toISOString());

    // Process level counts
    const levelCounts = logsByLevel?.reduce((acc, log) => {
      acc[log.level] = (acc[log.level] || 0) + 1;
      return acc;
    }, {}) || {};

    // Process type counts
    const typeCounts = logsByType?.reduce((acc, log) => {
      acc[log.type] = (acc[log.type] || 0) + 1;
      return acc;
    }, {}) || {};

    res.status(200).json({
      totalLogs: totalLogs || 0,
      recentLogs: recentLogs || 0,
      levelCounts,
      typeCounts
    });
  } catch (err) {
    console.error('❌ Error fetching log stats:', err);
    res.status(500).json({ message: 'Server error fetching log stats' });
  }
});

// DELETE /api/logs/:id - Delete log
router.delete('/logs/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const { error } = await supabaseAdmin
      .from('logs')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('❌ Error deleting log:', error);
      return res.status(500).json({ message: 'Server error deleting log' });
    }

    res.status(200).json({ message: '✅ Log deleted' });
  } catch (err) {
    console.error('❌ Error deleting log:', err);
    res.status(500).json({ message: 'Server error deleting log' });
  }
});

module.exports = router;