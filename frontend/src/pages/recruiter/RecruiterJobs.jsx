import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { Briefcase, Plus, Users, Edit, Trash2, Calendar, MapPin } from 'lucide-react';

const RecruiterJobs = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.companyId) {
      fetchCompanyJobs();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchCompanyJobs = async () => {
    try {
      const res = await api.get(`/jobs/company/${user.companyId}`);
      setJobs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job posting?')) return;
    try {
      await api.delete(`/jobs/${jobId}`);
      setJobs(jobs.filter((j) => j.id !== jobId));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete job.');
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '3rem' }}>Loading company jobs...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Company Job Postings</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>
            Create and manage positions for {user?.companyName || 'your company'}.
          </p>
        </div>
        <Link to="/recruiter/jobs/create" className="btn btn-primary">
          <Plus size={18} /> Post New Job
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
          <Briefcase size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
          <h3>No jobs posted yet</h3>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>Click below to create your first company job posting.</p>
          <Link to="/recruiter/jobs/create" className="btn btn-primary">
            <Plus size={18} /> Post New Job
          </Link>
        </div>
      ) : (
        <div className="glass-card">
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Employment Type</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Deadline</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((j) => (
                  <tr key={j.id}>
                    <td style={{ fontWeight: 700 }}>{j.title}</td>
                    <td>{j.employmentType}</td>
                    <td>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--color-text-muted)' }}>
                        <MapPin size={14} /> {j.location || 'N/A'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge badge-${j.status.toLowerCase()}`}>{j.status}</span>
                    </td>
                    <td>{j.deadline || 'No deadline'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Link to={`/recruiter/jobs/${j.id}/applicants`} className="btn btn-sm btn-primary">
                          <Users size={14} /> Applicants
                        </Link>
                        <Link to={`/recruiter/jobs/${j.id}/edit`} className="btn btn-sm btn-secondary">
                          <Edit size={14} /> Edit
                        </Link>
                        <button onClick={() => handleDelete(j.id)} className="btn btn-sm btn-danger">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruiterJobs;
