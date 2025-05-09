import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UsersPage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/users`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .then((res) => setUsers(res.data))
      .catch((err) => console.error('Failed to fetch users', err));
  }, []);

  return (
    <div>
      <h2>Registered Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user._id || user.id}>{user.name} - {user.email}</li>
        ))}
      </ul>
    </div>
  );
};

export default UsersPage;
