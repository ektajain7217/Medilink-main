import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LogsPage = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/logs`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .then((res) => setLogs(res.data))
      .catch((err) => console.error('Failed to fetch logs', err));
  }, []);

  return (
    <div>
      <h2>System Logs</h2>
      <ul>
        {logs.map((log) => (
          <li key={log._id || log.id}>{log.message} - {log.timestamp}</li>
        ))}
      </ul>
    </div>
  );
};

export default LogsPage;
