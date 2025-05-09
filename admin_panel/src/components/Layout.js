import React from 'react';
import './Layout.css';
import { Link } from 'react-router-dom';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <aside className="sidebar">
        <h2>MediLinks</h2>
        <nav>
          <ul>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/users">Users</Link></li>
            <li><Link to="/listings">Listings</Link></li>
            <li><Link to="/logs">Logs</Link></li>
          </ul>
        </nav>
      </aside>
      <div className="main-content">
        <header className="navbar">
          <h3>Admin Panel</h3>
        </header>
        <div className="page-content">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
