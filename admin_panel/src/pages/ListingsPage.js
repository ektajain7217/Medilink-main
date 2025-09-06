import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ListingsPage = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    search: '',
    status: ''
  });

  const fetchListings = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...filters
      });

      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/medicines?${params}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      
      setListings(res.data);
      setTotalPages(Math.ceil(res.data.length / 10));
    } catch (err) {
      console.error('Failed to fetch listings', err);
      setError('Failed to fetch listings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [page, filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleStatusChange = async (medicineId, newStatus) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/api/medicines/${medicineId}`, {
        status: newStatus
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      
      fetchListings(); // Refresh the list
    } catch (err) {
      console.error('Failed to update medicine status', err);
      alert('Failed to update medicine status');
    }
  };

  const handleDeleteMedicine = async (medicineId) => {
    if (!window.confirm('Are you sure you want to delete this medicine listing?')) {
      return;
    }

    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/medicines/${medicineId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      
      fetchListings(); // Refresh the list
    } catch (err) {
      console.error('Failed to delete medicine', err);
      alert('Failed to delete medicine');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return '#51cf66';
      case 'claimed': return '#ffd43b';
      case 'expired': return '#ff6b6b';
      case 'pending': return '#74c0fc';
      default: return '#868e96';
    }
  };

  if (loading) return <div>Loading medicine listings...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Medicine Listings</h2>
      
      {/* Filters */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Search medicines..."
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        
        <select 
          value={filters.status} 
          onChange={(e) => handleFilterChange('status', e.target.value)}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          <option value="">All Status</option>
          <option value="available">Available</option>
          <option value="claimed">Claimed</option>
          <option value="expired">Expired</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {/* Medicine Listings */}
      <div style={{ display: 'grid', gap: '15px' }}>
        {listings.map((medicine) => (
          <div key={medicine.id} style={{ 
            border: '1px solid #ccc', 
            padding: '20px', 
            borderRadius: '8px',
            backgroundColor: '#f8f9fa'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>
                  {medicine.name}
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '14px' }}>
                  <div>
                    <strong>Brand:</strong> {medicine.brand || 'N/A'}
                  </div>
                  <div>
                    <strong>Quantity:</strong> {medicine.quantity}
                  </div>
                  <div>
                    <strong>Expiry Date:</strong> {new Date(medicine.expiry_date).toLocaleDateString()}
                  </div>
                  <div>
                    <strong>Condition:</strong> {medicine.condition || 'Good'}
                  </div>
                  <div>
                    <strong>Batch Number:</strong> {medicine.batch_number || 'N/A'}
                  </div>
                  <div>
                    <strong>Donor:</strong> {medicine.profiles?.name || 'Unknown'}
                  </div>
                </div>
                
                {medicine.barcode && (
                  <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
                    <strong>Barcode:</strong> {medicine.barcode}
                  </div>
                )}
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-end' }}>
                <div style={{ 
                  padding: '4px 12px', 
                  borderRadius: '20px', 
                  backgroundColor: getStatusColor(medicine.status),
                  color: 'white',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  {medicine.status.toUpperCase()}
                </div>
                
                <div style={{ display: 'flex', gap: '8px' }}>
                  <select 
                    value={medicine.status}
                    onChange={(e) => handleStatusChange(medicine.id, e.target.value)}
                    style={{ 
                      padding: '4px 8px', 
                      borderRadius: '4px', 
                      border: '1px solid #ccc',
                      fontSize: '12px'
                    }}
                  >
                    <option value="available">Available</option>
                    <option value="claimed">Claimed</option>
                    <option value="expired">Expired</option>
                    <option value="pending">Pending</option>
                  </select>
                  
                  <button 
                    onClick={() => handleDeleteMedicine(medicine.id)}
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
            </div>
            
            <div style={{ marginTop: '15px', fontSize: '12px', color: '#666' }}>
              <strong>Added:</strong> {new Date(medicine.created_at).toLocaleString()}
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

export default ListingsPage;