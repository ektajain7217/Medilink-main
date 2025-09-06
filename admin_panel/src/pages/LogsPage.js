import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    level: '',
    type: ''
  });
  const [stats, setStats] = useState(null);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...filters
      });

      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/logs?${params}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      
      setLogs(res.data);
      setTotalPages(Math.ceil(res.data.length / 10));
    } catch (err) {
      console.error('Failed to fetch logs', err);
      setError('Failed to fetch logs');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/logs/stats`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      
      setStats(res.data);
    } catch (err) {
      console.error('Failed to fetch log stats', err);
    }
  };

  useEffect(() => {
    fetchLogs();
    fetchStats();
  }, [page, filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleDeleteLog = async (logId) => {
    if (!window.confirm('Are you sure you want to delete this log entry?')) {
      return;
    }

    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/logs/${logId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      
      fetchLogs(); // Refresh the list
      fetchStats(); // Refresh stats
    } catch (err) {
      console.error('Failed to delete log', err);
      alert('Failed to delete log');
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'error': return '#ff6b6b';
      case 'warn': return '#ffd43b';
      case 'info': return '#74c0fc';
      case 'debug': return '#868e96';
      default: return '#51cf66';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'auth': return '#e599f7';
      case 'medicine': return '#51cf66';
      case 'user': return '#74c0fc';
      case 'system': return '#ffd43b';
      default: return '#868e96';
    }
  };

  if (loading) return <div>Loading logs...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>System Logs</h2>
      
      {/* Statistics */}
      {stats && (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '15px', 
          marginBottom: '20px' 
        }}>
          <div style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '15px', 
            borderRadius: '8px', 
            border: '1px solid #dee2e6' 
          }}>
            <h4 style={{ margin: '0 0 5px 0', color: '#495057' }}>Total Logs</h4>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>
              {stats.totalLogs}
            </div>
          </div>
          
          <div style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '15px', 
            borderRadius: '8px', 
            border: '1px solid #dee2e6' 
          }}>
            <h4 style={{ margin: '0 0 5px 0', color: '#495057' }}>Recent (24h)</h4>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>
              {stats.recentLogs}
            </div>
          </div>
          
          <div style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '15px', 
            borderRadius: '8px', 
            border: '1px solid #dee2e6' 
          }}>
            <h4 style={{ margin: '0 0 5px 0', color: '#495057' }}>Error Logs</h4>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc3545' }}>
              {stats.levelCounts.error || 0}
            </div>
          </div>
          
          <div style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '15px', 
            borderRadius: '8px', 
            border: '1px solid #dee2e6' 
          }}>
            <h4 style={{ margin: '0 0 5px 0', color: '#495057' }}>Warning Logs</h4>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffc107' }}>
              {stats.levelCounts.warn || 0}
            </div>
          </div>
        </div>
      )}
      
      {/* Filters */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <select 
          value={filters.level} 
          onChange={(e) => handleFilterChange('level', e.target.value)}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          <option value="">All Levels</option>
          <option value="error">Error</option>
          <option value="warn">Warning</option>
          <option value="info">Info</option>
          <option value="debug">Debug</option>
        </select>
        
        <select 
          value={filters.type} 
          onChange={(e) => handleFilterChange('type', e.target.value)}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          <option value="">All Types</option>
          <option value="auth">Authentication</option>
          <option value="medicine">Medicine</option>
          <option value="user">User</option>
          <option value="system">System</option>
        </select>
      </div>

      {/* Logs List */}
      <div style={{ display: 'grid', gap: '10px' }}>
        {logs.map((log) => (
          <div key={log.id} style={{ 
            border: '1px solid #ccc', 
            padding: '15px', 
            borderRadius: '8px',
            backgroundColor: '#f8f9fa'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ 
                    padding: '2px 8px', 
                    borderRadius: '12px', 
                    backgroundColor: getLevelColor(log.level),
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {log.level.toUpperCase()}
                  </span>
                  
                  <span style={{ 
                    padding: '2px 8px', 
                    borderRadius: '12px', 
                    backgroundColor: getTypeColor(log.type),
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {log.type.toUpperCase()}
                  </span>
                </div>
                
                <div style={{ marginBottom: '8px', fontSize: '14px' }}>
                  {log.message}
                </div>
                
                <div style={{ fontSize: '12px', color: '#666' }}>
                  <strong>Timestamp:</strong> {new Date(log.created_at).toLocaleString()}
                  {log.user_id && (
                    <span> | <strong>User ID:</strong> {log.user_id}</span>
                  )}
                </div>
                
                {log.metadata && (
                  <div style={{ 
                    marginTop: '8px', 
                    padding: '8px', 
                    backgroundColor: '#e9ecef', 
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontFamily: 'monospace'
                  }}>
                    <strong>Metadata:</strong> {JSON.stringify(log.metadata, null, 2)}
                  </div>
                )}
              </div>
              
              <button 
                onClick={() => handleDeleteLog(log.id)}
                style={{ 
                  backgroundColor: '#ff6b6b',
                  color: 'white',
                  border: 'none',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
        <button 
          onClick={() => setPage(p => Math.max(p - 1, 1))}
          disabled={page === 1}
          style={{ padding: '8px 16px', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          Previous
        </button>
        <span style={{ padding: '8px 16px' }}>Page {page} of {totalPages}</span>
        <button 
          onClick={() => setPage(p => p + 1)}
          disabled={page === totalPages}
          style={{ padding: '8px 16px', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default LogsPage;