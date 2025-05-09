import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './DashboardPage.css'; // Optional external CSS for cleaner styling

import Layout from '../components/Layout';


const DashboardPage = () => {
  const [submissions, setSubmissions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;
 

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/ocr-submissions`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSubmissions(res.data);
        setFiltered(res.data);
      } catch (err) {
        console.error('Failed to fetch submissions', err);
      }
    };
   

    fetchSubmissions();
  }, []);
  

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setFiltered(
      submissions.filter((item) =>
        (item.title || '').toLowerCase().includes(term.toLowerCase()) ||
        (item.content || '').toLowerCase().includes(term.toLowerCase())
      )
    );
    setPage(1); // Reset to first page after search
  };

  const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  return (
    <div className="dashboard-container">
      <h2>OCR Submissions</h2>

      <input
        type="text"
        placeholder="Search submissions..."
        value={searchTerm}
        onChange={handleSearch}
        className="search-input"
      />

      <ul className="submissions-list">
        {paginated.map((item, idx) => (
          <li key={idx} className="submission-card">
            <strong>{item.title || 'Untitled'}</strong>
            <p>{item.content || 'No content available'}</p>
          </li>
        ))}
    return (
    <Layout>
      <h2>Dashboard</h2>
      <p>Welcome to the MediLinks Admin Dashboard.</p>
    </Layout>
  );
      </ul>

      <div className="pagination-controls">
        <button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}>
          Prev
        </button>
        <span>Page {page} of {totalPages}</span>
        <button onClick={() => setPage((p) => Math.min(p + 1, totalPages))} disabled={page === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;
