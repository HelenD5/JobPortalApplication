import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { Building, Globe, MapPin, Mail, Save, CheckCircle2, AlertCircle } from 'lucide-react';

const RecruiterCompany = () => {
  const { user, updateUserProfile } = useAuth();
  const [companyId, setCompanyId] = useState(user?.companyId);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.companyId) {
      fetchCompany(user.companyId);
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchCompany = async (id) => {
    try {
      const res = await api.get(`/companies/${id}`);
      setName(res.data.name || '');
      setEmail(res.data.email || '');
      setWebsite(res.data.website || '');
      setLocation(res.data.location || '');
      setDescription(res.data.description || '');
      setStatus(res.data.status || '');
    } catch (err) {
      console.error(err);
      setError('Failed to fetch company details.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess('');
    setError('');

    try {
      const res = await api.put(`/companies/${companyId}`, {
        name,
        email,
        website,
        location,
        description,
      });
      updateUserProfile({ companyName: res.data.name });
      setSuccess('Company profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update company profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '3rem' }}>Loading company details...</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Building size={24} color="var(--color-primary)" /> Company Profile
          </h2>
          {status && <span className={`badge badge-${status.toLowerCase()}`}>{status}</span>}
        </div>

        {success && <div className="alert alert-success"><CheckCircle2 size={18} /> {success}</div>}
        {error && <div className="alert alert-error"><AlertCircle size={18} /> {error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Company Name *</label>
              <input
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label"><Mail size={14} /> Corporate Email</label>
              <input
                type="email"
                className="form-input"
                placeholder="contact@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label"><Globe size={14} /> Website URL</label>
              <input
                type="text"
                className="form-input"
                placeholder="https://example.com"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label"><MapPin size={14} /> Headquarters Location</label>
              <input
                type="text"
                className="form-input"
                placeholder="San Francisco, CA"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Company Overview / Description</label>
            <textarea
              className="form-textarea"
              placeholder="Tell applicants about your company's mission and culture..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              <Save size={18} /> {saving ? 'Saving...' : 'Save Company Details'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecruiterCompany;
