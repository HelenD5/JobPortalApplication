import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { UserPlus, AlertCircle, Building, User } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const [role, setRole] = useState('APPLICANT');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Applicant fields
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [skills, setSkills] = useState('');
  const [education, setEducation] = useState('');
  const [experience, setExperience] = useState('');

  // Recruiter fields
  const [companyName, setCompanyName] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [companyLocation, setCompanyLocation] = useState('');
  const [companyDescription, setCompanyDescription] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        name,
        email,
        password,
        role,
        ...(role === 'APPLICANT' ? { phone, location, skills, education, experience } : {
          companyName,
          companyEmail,
          companyWebsite,
          companyLocation,
          companyDescription,
          phone,
          location
        })
      };

      const res = await api.post('/auth/register', payload);
      loginUser(res.data);

      if (role === 'APPLICANT') navigate('/applicant/dashboard');
      else if (role === 'RECRUITER') navigate('/recruiter/dashboard');
      else navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '650px', margin: '2rem auto' }}>
      <div className="glass-card">
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>Create Your Account</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
            Choose your account role and join the multi-company job platform.
          </p>
        </div>

        {/* Role Toggle */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.75rem' }}>
          <button
            type="button"
            className={`btn ${role === 'APPLICANT' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setRole('APPLICANT')}
            style={{ padding: '0.85rem' }}
          >
            <User size={18} /> I am a Job Applicant
          </button>
          <button
            type="button"
            className={`btn ${role === 'RECRUITER' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setRole('RECRUITER')}
            style={{ padding: '0.85rem' }}
          >
            <Building size={18} /> I am a Recruiter
          </button>
        </div>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                className="form-input"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                className="form-input"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Password *</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                className="form-input"
                placeholder="+1 555-0199"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Location</label>
            <input
              type="text"
              className="form-input"
              placeholder="City, Country"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          {/* Applicant Specific Fields */}
          {role === 'APPLICANT' && (
            <>
              <div className="form-group">
                <label className="form-label">Skills (Comma-separated) *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Java, Spring Boot, MySQL, React"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Education</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. B.S. in Computer Science"
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Experience Summary</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. 3 years in Web Dev"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                  />
                </div>
              </div>
            </>
          )}

          {/* Recruiter Specific Fields */}
          {role === 'RECRUITER' && (
            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem', marginTop: '1rem' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-primary)' }}>
                Company Information
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Company Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. TechCorp Solutions"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Company Email</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="hr@techcorp.com"
                    value={companyEmail}
                    onChange={(e) => setCompanyEmail(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Company Website</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="https://techcorp.com"
                    value={companyWebsite}
                    onChange={(e) => setCompanyWebsite(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Company Location</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="San Francisco, CA"
                    value={companyLocation}
                    onChange={(e) => setCompanyLocation(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Company Description</label>
                <textarea
                  className="form-textarea"
                  placeholder="Briefly describe your company..."
                  value={companyDescription}
                  onChange={(e) => setCompanyDescription(e.target.value)}
                />
              </div>
            </div>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem' }} disabled={loading}>
            <UserPlus size={18} /> {loading ? 'Registering...' : 'Register Account'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
          Already have an account? <Link to="/login">Sign in here</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
