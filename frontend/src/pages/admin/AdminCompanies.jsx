import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Building2, Globe, MapPin } from 'lucide-react';

const AdminCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const res = await api.get('/admin/companies');
      setCompanies(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (companyId, newStatus) => {
    setUpdatingId(companyId);
    try {
      const res = await api.put(`/admin/companies/${companyId}/status`, { status: newStatus });
      setCompanies(companies.map((c) => (c.id === companyId ? res.data : c)));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update company status.');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '3rem' }}>Loading platform companies...</div>;

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Company Management</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>
          Review registered companies and change company status (PENDING, ACTIVE, SUSPENDED).
        </p>
      </div>

      <div className="glass-card">
        {companies.length === 0 ? (
          <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '2rem' }}>No companies registered yet.</p>
        ) : (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Company ID</th>
                  <th>Company Name</th>
                  <th>Contact Email</th>
                  <th>Location & Website</th>
                  <th>Created Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((c) => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 700 }}>#{c.id}</td>
                    <td style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{c.name}</td>
                    <td>{c.email || 'N/A'}</td>
                    <td>
                      <div>{c.location || 'N/A'}</div>
                      {c.website && (
                        <a href={c.website} target="_blank" rel="noreferrer" style={{ fontSize: '0.8rem' }}>
                          {c.website}
                        </a>
                      )}
                    </td>
                    <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge badge-${c.status.toLowerCase()}`}>{c.status}</span>
                    </td>
                    <td>
                      <select
                        className="form-select"
                        value={c.status}
                        onChange={(e) => handleStatusChange(c.id, e.target.value)}
                        disabled={updatingId === c.id}
                        style={{ padding: '0.4rem 0.6rem', fontSize: '0.85rem', width: 'auto' }}
                      >
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="PENDING">PENDING</option>
                        <option value="SUSPENDED">SUSPENDED</option>
                      </select>
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

export default AdminCompanies;
