import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    type: '',
    verified: ''
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...filters
      });

      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/users?${params}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      
      setUsers(res.data);
      setTotalPages(Math.ceil(res.data.length / 10));
    } catch (err) {
      console.error('Failed to fetch users', err);
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleVerifyUser = async (userId, verified) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/api/users/${userId}`, {
        verified: !verified
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      
      fetchUsers(); // Refresh the list
    } catch (err) {
      console.error('Failed to update user', err);
      alert('Failed to update user');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      
      fetchUsers(); // Refresh the list
    } catch (err) {
      console.error('Failed to delete user', err);
      alert('Failed to delete user');
    }
  };

  if (loading) return <div>Loading users...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Registered Users</h2>
      
      {/* Filters */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <select 
          value={filters.type} 
          onChange={(e) => handleFilterChange('type', e.target.value)}
        >
          <option value="">All Types</option>
          <option value="donor">Donor</option>
          <option value="ngo">NGO</option>
          <option value="pharmacy">Pharmacy</option>
          <option value="patient">Patient</option>
        </select>
        
        <select 
          value={filters.verified} 
          onChange={(e) => handleFilterChange('verified', e.target.value)}
        >
          <option value="">All Users</option>
          <option value="true">Verified</option>
          <option value="false">Unverified</option>
        </select>
      </div>

      {/* Users List */}
      <div style={{ display: 'grid', gap: '10px' }}>
        {users.map((user) => (
          <div key={user.id} style={{ 
            border: '1px solid #ccc', 
            padding: '15px', 
            borderRadius: '5px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <strong>{user.name}</strong> - {user.email}
              <br />
              <small>Type: {user.type} | Verified: {user.verified ? 'Yes' : 'No'}</small>
              <br />
              <small>Joined: {new Date(user.created_at).toLocaleDateString()}</small>
            </div>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => handleVerifyUser(user.id, user.verified)}
                style={{ 
                  backgroundColor: user.verified ? '#ff6b6b' : '#51cf66',
                  color: 'white',
                  border: 'none',
                  padding: '5px 10px',
                  borderRadius: '3px',
                  cursor: 'pointer'
                }}
              >
                {user.verified ? 'Unverify' : 'Verify'}
              </button>
              
              <button 
                onClick={() => handleDeleteUser(user.id)}
                style={{ 
                  backgroundColor: '#ff6b6b',
                  color: 'white',
                  border: 'none',
                  padding: '5px 10px',
                  borderRadius: '3px',
                  cursor: 'pointer'
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
        >
          Previous
        </button>
        <span>Page {page} of {totalPages}</span>
        <button 
          onClick={() => setPage(p => p + 1)}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UsersPage;