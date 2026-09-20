import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { FileText, Clock, Award, UserCheck, CheckCircle2, ChevronRight } from 'lucide-react';

const ApplicantDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/dashboard/applicant');
      setData(res.data);
    } catch (err) {
      console.error('Failed to load applicant dashboard', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '3rem' }}>Loading dashboard...</div>;

  return (
    <div>
      {/* Welcome Banner */}
      <div className="glass-card" style={{ marginBottom: '2rem', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(19, 27, 46, 0.8))' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, marginBottom: '0.5rem' }}>Welcome back, {user?.name}!</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>
          Track your job applications, profile status, and interview schedule in real time.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon"><FileText size={24} /></div>
          <div className="stat-info">
            <div className="stat-value">{data?.totalApplications || 0}</div>
            <div className="stat-label">Total Applications</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--color-warning-bg)', color: 'var(--color-warning)' }}>
            <Clock size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{data?.underReviewCount || 0}</div>
            <div className="stat-label">Under Review</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc' }}>
            <Award size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{data?.shortlistedCount || 0}</div>
            <div className="stat-label">Shortlisted</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(236, 72, 153, 0.15)', color: '#f472b6' }}>
            <UserCheck size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{data?.interviewCount || 0}</div>
            <div className="stat-label">Interviews</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--color-success-bg)', color: 'var(--color-success)' }}>
            <CheckCircle2 size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{data?.selectedCount || 0}</div>
            <div className="stat-label">Selected</div>
          </div>
        </div>
      </div>

      {/* Recent Applications Table */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Recent Applications</h3>
          <Link to="/applicant/applications" className="btn btn-sm btn-secondary">
            View All Applications <ChevronRight size={16} />
          </Link>
        </div>

        {data?.recentApplications?.length === 0 ? (
          <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '2rem' }}>You haven't submitted any job applications yet.</p>
        ) : (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Company</th>
                  <th>Location</th>
                  <th>Applied On</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data?.recentApplications?.map((app) => (
                  <tr key={app.id}>
                    <td style={{ fontWeight: 600 }}>{app.jobTitle}</td>
                    <td>{app.companyName}</td>
                    <td>{app.location || 'N/A'}</td>
                    <td>{new Date(app.appliedAt).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge badge-${app.status.toLowerCase()}`}>
                        {app.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicantDashboard;
