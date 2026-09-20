import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { Briefcase, FileText, Award, UserCheck, CheckCircle2, XCircle, Plus, ChevronRight } from 'lucide-react';

const RecruiterDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/dashboard/recruiter');
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '3rem' }}>Loading recruiter dashboard...</div>;

  return (
    <div>
      <div className="glass-card" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, marginBottom: '0.4rem' }}>
            {user?.companyName ? `${user.companyName} Recruitment Portal` : 'Recruiter Dashboard'}
          </h1>
          <p style={{ color: 'var(--color-text-muted)' }}>
            Manage company job postings, review applicant resume scores, and update candidate application statuses.
          </p>
        </div>
        <div>
          <Link to="/recruiter/jobs/create" className="btn btn-primary">
            <Plus size={18} /> Post New Job
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon"><Briefcase size={24} /></div>
          <div className="stat-info">
            <div className="stat-value">{data?.activeJobs || 0}</div>
            <div className="stat-label">Active Jobs</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--color-info-bg)', color: 'var(--color-info)' }}>
            <FileText size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{data?.totalApplications || 0}</div>
            <div className="stat-label">Total Applications</div>
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

      {/* Recent Applications Table (WITH SCORE) */}
      <div className="glass-card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Recent Company Applicants</h3>
          <Link to="/recruiter/jobs" className="btn btn-sm btn-secondary">
            View All Company Jobs <ChevronRight size={16} />
          </Link>
        </div>

        {data?.recentApplications?.length === 0 ? (
          <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '2rem' }}>No job applications received yet.</p>
        ) : (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Applicant</th>
                  <th>Job Title</th>
                  <th>Resume Score</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data?.recentApplications?.map((app) => (
                  <tr key={app.id}>
                    <td>
                      <div style={{ fontWeight: 700 }}>{app.applicantName}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{app.applicantEmail}</div>
                    </td>
                    <td>{app.jobTitle}</td>
                    <td>
                      <span className={`score-badge ${app.score >= 70 ? 'score-high' : app.score >= 40 ? 'score-medium' : 'score-low'}`}>
                        {app.score}% Match
                      </span>
                    </td>
                    <td>
                      <span className={`badge badge-${app.status.toLowerCase()}`}>
                        {app.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      <Link to={`/recruiter/jobs/${app.jobId}/applicants`} className="btn btn-sm btn-secondary">
                        Manage Candidate
                      </Link>
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

export default RecruiterDashboard;
