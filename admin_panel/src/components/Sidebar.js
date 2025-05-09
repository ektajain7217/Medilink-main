import { Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <div className="sidebar">
      <h2>MediLinks</h2>
      <nav>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/users">Users</Link>
        <Link to="/listings">Listings</Link>
        <Link to="/logs">Logs</Link>
        <Link to="/">Logout</Link>
      </nav>
    </div>
  );
}
