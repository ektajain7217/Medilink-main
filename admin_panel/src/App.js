import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import UsersPage from './pages/UsersPage';
import ListingsPage from './pages/ListingsPage';
import LogsPage from './pages/LogsPage';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Navigate to="/dashboard" />
            ) : (
              <LoginPage onLogin={() => setIsLoggedIn(true)} />
            )
          }
        />
        <Route
          path="/dashboard"
          element={isLoggedIn ? <DashboardPage /> : <Navigate to="/" />}
        />
        <Route
          path="/users"
          element={isLoggedIn ? <UsersPage /> : <Navigate to="/" />}
        />
        <Route
          path="/listings"
          element={isLoggedIn ? <ListingsPage /> : <Navigate to="/" />}
        />
        <Route
          path="/logs"
          element={isLoggedIn ? <LogsPage /> : <Navigate to="/" />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

