import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { Users, Building2, Briefcase, FileText, CheckCircle2, ShieldCheck, ChevronRight } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/dashboard');
      setStats(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '3rem' }}>Loading admin dashboard...</div>;

  return (
    <div>
      <div className="glass-card" style={{ marginBottom: '2rem', background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(19, 27, 46, 0.8))' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <ShieldCheck size={28} color="var(--color-accent)" /> Platform Administrator Dashboard
        </h1>
        <p style={{ color: 'var(--color-text-muted)' }}>
          System metrics overview and company management controls.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon"><Users size={24} /></div>
          <div className="stat-info">
            <div className="stat-value">{stats?.totalUsers || 0}</div>
            <div className="stat-label">Total Registered Users</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--color-info-bg)', color: 'var(--color-info)' }}>
            <Building2 size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats?.totalCompanies || 0}</div>
            <div className="stat-label">Total Companies</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc' }}>
            <Briefcase size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats?.totalJobs || 0}</div>
            <div className="stat-label">Total Jobs</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--color-success-bg)', color: 'var(--color-success)' }}>
            <CheckCircle2 size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats?.activeJobs || 0}</div>
            <div className="stat-label">Active Published Jobs</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(236, 72, 153, 0.15)', color: '#f472b6' }}>
            <FileText size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats?.totalApplications || 0}</div>
            <div className="stat-label">Total Applications</div>
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        <Link to="/admin/companies" className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.25rem', color: '#fff' }}>Company Oversight</h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Approve, activate or suspend platform companies</p>
          </div>
          <ChevronRight size={20} color="var(--color-primary)" />
        </Link>

        <Link to="/admin/users" className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.25rem', color: '#fff' }}>User Management</h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>View applicants, recruiters, and admins</p>
          </div>
          <ChevronRight size={20} color="var(--color-primary)" />
        </Link>

        <Link to="/admin/jobs" className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.25rem', color: '#fff' }}>All Platform Jobs</h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Audit job postings across companies</p>
          </div>
          <ChevronRight size={20} color="var(--color-primary)" />
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
