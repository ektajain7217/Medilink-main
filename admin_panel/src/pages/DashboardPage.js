import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMedicines: 0,
    availableMedicines: 0,
    recentActivity: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      // Fetch users count
      const usersRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/users?limit=1`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      
      // Fetch medicines count
      const medicinesRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/medicines?limit=1`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      
      // Fetch available medicines count
      const availableRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/medicines?status=available&limit=1`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      
      // Fetch recent logs count
      const logsRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/logs/stats`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      setStats({
        totalUsers: usersRes.data.length,
        totalMedicines: medicinesRes.data.length,
        availableMedicines: availableRes.data.length,
        recentActivity: logsRes.data.recentLogs || 0
      });
    } catch (err) {
      console.error('Failed to fetch dashboard stats', err);
      setError('Failed to fetch dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  if (loading) return <Layout><div>Loading dashboard...</div></Layout>;
  if (error) return <Layout><div>Error: {error}</div></Layout>;

  return (
    <Layout>
      <div>
        <h2>Dashboard</h2>
        <p>Welcome to the MediLinks Admin Dashboard.</p>
        
        {/* Statistics Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '20px', 
          marginTop: '20px' 
        }}>
          <div style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '20px', 
            borderRadius: '8px', 
            border: '1px solid #dee2e6',
            textAlign: 'center'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#495057' }}>Total Users</h3>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#007bff' }}>
              {stats.totalUsers}
            </div>
            <p style={{ margin: '10px 0 0 0', color: '#6c757d', fontSize: '14px' }}>
              Registered users
            </p>
          </div>
          
          <div style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '20px', 
            borderRadius: '8px', 
            border: '1px solid #dee2e6',
            textAlign: 'center'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#495057' }}>Total Medicines</h3>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#28a745' }}>
              {stats.totalMedicines}
            </div>
            <p style={{ margin: '10px 0 0 0', color: '#6c757d', fontSize: '14px' }}>
              Medicine listings
            </p>
          </div>
          
          <div style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '20px', 
            borderRadius: '8px', 
            border: '1px solid #dee2e6',
            textAlign: 'center'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#495057' }}>Available</h3>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#ffc107' }}>
              {stats.availableMedicines}
            </div>
            <p style={{ margin: '10px 0 0 0', color: '#6c757d', fontSize: '14px' }}>
              Available medicines
            </p>
          </div>
          
          <div style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '20px', 
            borderRadius: '8px', 
            border: '1px solid #dee2e6',
            textAlign: 'center'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#495057' }}>Recent Activity</h3>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#dc3545' }}>
              {stats.recentActivity}
            </div>
            <p style={{ margin: '10px 0 0 0', color: '#6c757d', fontSize: '14px' }}>
              Logs (24h)
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ marginTop: '30px' }}>
          <h3>Quick Actions</h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '15px',
            marginTop: '15px'
          }}>
            <button 
              onClick={() => window.location.href = '/users'}
              style={{ 
                padding: '15px', 
                backgroundColor: '#007bff', 
                color: 'white', 
                border: 'none', 
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              Manage Users
            </button>
            
            <button 
              onClick={() => window.location.href = '/listings'}
              style={{ 
                padding: '15px', 
                backgroundColor: '#28a745', 
                color: 'white', 
                border: 'none', 
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              Manage Medicines
            </button>
            
            <button 
              onClick={() => window.location.href = '/logs'}
              style={{ 
                padding: '15px', 
                backgroundColor: '#6c757d', 
                color: 'white', 
                border: 'none', 
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              View Logs
            </button>
          </div>
        </div>

        {/* System Status */}
        <div style={{ marginTop: '30px' }}>
          <h3>System Status</h3>
          <div style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '20px', 
            borderRadius: '8px', 
            border: '1px solid #dee2e6',
            marginTop: '15px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ 
                width: '12px', 
                height: '12px', 
                backgroundColor: '#28a745', 
                borderRadius: '50%' 
              }}></div>
              <span style={{ fontWeight: 'bold' }}>Supabase Database</span>
              <span style={{ color: '#6c757d' }}>- Connected</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
              <div style={{ 
                width: '12px', 
                height: '12px', 
                backgroundColor: '#28a745', 
                borderRadius: '50%' 
              }}></div>
              <span style={{ fontWeight: 'bold' }}>API Server</span>
              <span style={{ color: '#6c757d' }}>- Running</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
              <div style={{ 
                width: '12px', 
                height: '12px', 
                backgroundColor: '#28a745', 
                borderRadius: '50%' 
              }}></div>
              <span style={{ fontWeight: 'bold' }}>Authentication</span>
              <span style={{ color: '#6c757d' }}>- Active</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;