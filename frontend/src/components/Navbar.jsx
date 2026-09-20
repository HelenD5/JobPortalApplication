import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, User, FileText, Building, LayoutDashboard, LogOut, Search, ShieldCheck } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logoutUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav style={{
      background: 'rgba(13, 20, 36, 0.9)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--color-border)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0.9rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#fff', fontSize: '1.25rem', fontWeight: 800 }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Briefcase size={20} color="#fff" />
          </div>
          <span>Job<span style={{ color: 'var(--color-primary)' }}>Portal</span></span>
        </Link>

        {/* Navigation Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          {!isAuthenticated && (
            <>
              <Link to="/" className={`btn btn-secondary ${isActive('/')}`}>Home</Link>
              <Link to="/jobs" className={`btn btn-secondary ${isActive('/jobs')}`}><Search size={16} /> Browse Jobs</Link>
              <Link to="/login" className="btn btn-outline">Login</Link>
              <Link to="/register" className="btn btn-primary">Register</Link>
            </>
          )}

          {isAuthenticated && user?.role === 'APPLICANT' && (
            <>
              <Link to="/applicant/dashboard" className={`btn btn-secondary ${isActive('/applicant/dashboard')}`}>
                <LayoutDashboard size={16} /> Dashboard
              </Link>
              <Link to="/jobs" className={`btn btn-secondary ${isActive('/jobs')}`}>
                <Search size={16} /> Jobs
              </Link>
              <Link to="/applicant/applications" className={`btn btn-secondary ${isActive('/applicant/applications')}`}>
                <FileText size={16} /> My Applications
              </Link>
              <Link to="/applicant/resume" className={`btn btn-secondary ${isActive('/applicant/resume')}`}>
                <FileText size={16} /> My Resume
              </Link>
              <Link to="/applicant/profile" className={`btn btn-secondary ${isActive('/applicant/profile')}`}>
                <User size={16} /> Profile
              </Link>
              <button onClick={handleLogout} className="btn btn-outline" style={{ borderColor: 'var(--color-danger)', color: 'var(--color-danger)' }}>
                <LogOut size={16} /> Logout
              </button>
            </>
          )}

          {isAuthenticated && user?.role === 'RECRUITER' && (
            <>
              <Link to="/recruiter/dashboard" className={`btn btn-secondary ${isActive('/recruiter/dashboard')}`}>
                <LayoutDashboard size={16} /> Dashboard
              </Link>
              <Link to="/recruiter/company" className={`btn btn-secondary ${isActive('/recruiter/company')}`}>
                <Building size={16} /> Company
              </Link>
              <Link to="/recruiter/jobs" className={`btn btn-secondary ${isActive('/recruiter/jobs')}`}>
                <Briefcase size={16} /> My Jobs
              </Link>
              <button onClick={handleLogout} className="btn btn-outline" style={{ borderColor: 'var(--color-danger)', color: 'var(--color-danger)' }}>
                <LogOut size={16} /> Logout
              </button>
            </>
          )}

          {isAuthenticated && user?.role === 'ADMIN' && (
            <>
              <Link to="/admin/dashboard" className={`btn btn-secondary ${isActive('/admin/dashboard')}`}>
                <LayoutDashboard size={16} /> Dashboard
              </Link>
              <Link to="/admin/companies" className={`btn btn-secondary ${isActive('/admin/companies')}`}>
                <Building size={16} /> Companies
              </Link>
              <Link to="/admin/users" className={`btn btn-secondary ${isActive('/admin/users')}`}>
                <User size={16} /> Users
              </Link>
              <Link to="/admin/jobs" className={`btn btn-secondary ${isActive('/admin/jobs')}`}>
                <ShieldCheck size={16} /> Jobs
              </Link>
              <button onClick={handleLogout} className="btn btn-outline" style={{ borderColor: 'var(--color-danger)', color: 'var(--color-danger)' }}>
                <LogOut size={16} /> Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
