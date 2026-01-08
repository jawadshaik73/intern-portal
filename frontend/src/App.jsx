import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import StudentDashboard from './pages/StudentDashboard';
import EmployerDashboard from './pages/EmployerDashboard';
import InternshipList from './pages/InternshipList';
import InternshipDetail from './pages/InternshipDetail';
import Home from './pages/Home';
import './App.css';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }
  return children;
};

// Redirect based on role
const DashboardParams = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (user.role === 'employer') return <Navigate to="/employer-dashboard" />;
  if (user.role === 'student') return <Navigate to="/student-dashboard" />;
  return <Navigate to="/" />;
};

const Navbar = () => {
  const { user, logout } = useAuth();
  return (
    <nav className="navbar">
      <div className="logo"><Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>InternPortal</Link></div>
      <div className="nav-links">
        <Link to="/internships" className="nav-link">Internships</Link>
        {user ? (
          <>
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <button onClick={logout} className="btn-logout">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link" style={{ marginRight: '10px' }}>Login</Link>
            <Link to="/signup" className="btn-primary" style={{ width: 'auto', display: 'inline-block' }}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/internships" element={<InternshipList />} />
            <Route path="/internship/:id" element={<InternshipDetail />} />

            <Route path="/dashboard" element={<DashboardParams />} />
            <Route path="/student-dashboard" element={<PrivateRoute allowedRoles={['student']}><StudentDashboard /></PrivateRoute>} />
            <Route path="/employer-dashboard" element={<PrivateRoute allowedRoles={['employer']}><EmployerDashboard /></PrivateRoute>} />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;