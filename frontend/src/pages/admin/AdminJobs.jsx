import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Briefcase, Building, MapPin, Calendar } from 'lucide-react';

const AdminJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await api.get('/admin/jobs');
      setJobs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '3rem' }}>Loading platform jobs...</div>;

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>All Platform Job Postings</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>
          Comprehensive view of all job opportunities across companies.
        </p>
      </div>

      <div className="glass-card">
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Job ID</th>
                <th>Title</th>
                <th>Company</th>
                <th>Type</th>
                <th>Required Skills</th>
                <th>Status</th>
                <th>Created Date</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((j) => (
                <tr key={j.id}>
                  <td style={{ fontWeight: 700 }}>#{j.id}</td>
                  <td style={{ fontWeight: 700 }}>{j.title}</td>
                  <td>
                    <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
                      {j.companyName}
                    </span>
                  </td>
                  <td>{j.employmentType}</td>
                  <td style={{ fontSize: '0.85rem' }}>{j.requiredSkills}</td>
                  <td>
                    <span className={`badge badge-${j.status.toLowerCase()}`}>{j.status}</span>
                  </td>
                  <td>{new Date(j.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminJobs;
