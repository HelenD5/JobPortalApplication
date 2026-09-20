import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { FileText, MapPin, Building, Calendar, Briefcase } from 'lucide-react';

const ApplicantApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await api.get('/applications/my');
      setApplications(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '3rem' }}>Loading applications...</div>;

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>My Job Applications</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>
          Review the status of your submitted job applications.
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
          <FileText size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
          <h3>No applications submitted yet</h3>
          <p style={{ color: 'var(--color-text-muted)' }}>Browse available jobs and apply today!</p>
        </div>
      ) : (
        <div className="glass-card">
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Company</th>
                  <th>Location</th>
                  <th>Resume Used</th>
                  <th>Applied On</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id}>
                    <td style={{ fontWeight: 700 }}>{app.jobTitle}</td>
                    <td>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-primary)', fontWeight: 600 }}>
                        <Building size={14} /> {app.companyName}
                      </span>
                    </td>
                    <td>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--color-text-muted)' }}>
                        <MapPin size={14} /> {app.location || 'N/A'}
                      </span>
                    </td>
                    <td>{app.resumeFileName}</td>
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
        </div>
      )}
    </div>
  );
};

export default ApplicantApplications;
