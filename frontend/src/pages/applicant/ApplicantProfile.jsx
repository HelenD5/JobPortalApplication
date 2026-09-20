import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { User, Phone, MapPin, Code, GraduationCap, Briefcase, Save, CheckCircle2, AlertCircle } from 'lucide-react';

const ApplicantProfile = () => {
  const { user, updateUserProfile } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [skills, setSkills] = useState('');
  const [education, setEducation] = useState('');
  const [experience, setExperience] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/users/profile');
      setName(res.data.name || '');
      setEmail(res.data.email || '');
      setPhone(res.data.phone || '');
      setLocation(res.data.location || '');
      setSkills(res.data.skills || '');
      setEducation(res.data.education || '');
      setExperience(res.data.experience || '');
    } catch (err) {
      console.error(err);
      setError('Failed to load user profile.');
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
      const res = await api.put('/users/profile', {
        name,
        phone,
        location,
        skills,
        education,
        experience
      });
      updateUserProfile({ name: res.data.name });
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '3rem' }}>Loading profile...</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="glass-card">
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <User size={24} color="var(--color-primary)" /> My Professional Profile
        </h2>

        {success && <div className="alert alert-success"><CheckCircle2 size={18} /> {success}</div>}
        {error && <div className="alert alert-error"><AlertCircle size={18} /> {error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address (Read-only)</label>
              <input
                type="email"
                className="form-input"
                value={email}
                disabled
                style={{ opacity: 0.6, cursor: 'not-allowed' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label"><Phone size={14} /> Phone Number</label>
              <input
                type="text"
                className="form-input"
                placeholder="+1 555-0123"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label"><MapPin size={14} /> Location</label>
              <input
                type="text"
                className="form-input"
                placeholder="City, Country"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label"><Code size={14} /> Skills (Comma-separated for resume matching)</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Java, Spring Boot, MySQL, React, JavaScript, REST API"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              required
            />
            <small style={{ color: 'var(--color-text-dim)', fontSize: '0.8rem', marginTop: '0.2rem' }}>
              * Make sure your skills are separated by commas so automated resume matching can score your job applications correctly.
            </small>
          </div>

          <div className="form-group">
            <label className="form-label"><GraduationCap size={14} /> Education</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. B.S. in Computer Science - State University"
              value={education}
              onChange={(e) => setEducation(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label"><Briefcase size={14} /> Experience Summary</label>
            <textarea
              className="form-textarea"
              placeholder="Describe your work experience..."
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              <Save size={18} /> {saving ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicantProfile;
