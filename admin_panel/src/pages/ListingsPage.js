import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ListingsPage = () => {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/medicines`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .then((res) => setListings(res.data))
      .catch((err) => console.error('Failed to fetch listings', err));
  }, []);

  return (
    <div>
      <h2>Medicine Listings</h2>
      <ul>
        {listings.map((med) => (
          <li key={med._id || med.id}>{med.name} - {med.expiryDate}</li>
        ))}
      </ul>
    </div>
  );
};

export default ListingsPage;
