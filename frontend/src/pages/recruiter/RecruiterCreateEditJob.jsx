import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { Briefcase, Save, AlertCircle, ArrowLeft } from 'lucide-react';

const RecruiterCreateEditJob = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [requiredSkills, setRequiredSkills] = useState('');
  const [location, setLocation] = useState('');
  const [experience, setExperience] = useState('');
  const [salary, setSalary] = useState('');
  const [employmentType, setEmploymentType] = useState('FULL_TIME');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState('PUBLISHED');

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      fetchJob();
    }
  }, [id]);

  const fetchJob = async () => {
    try {
      const res = await api.get(`/jobs/${id}`);
      setTitle(res.data.title || '');
      setDescription(res.data.description || '');
      setRequiredSkills(res.data.requiredSkills || '');
      setLocation(res.data.location || '');
      setExperience(res.data.experience || '');
      setSalary(res.data.salary || '');
      setEmploymentType(res.data.employmentType || 'FULL_TIME');
      setDeadline(res.data.deadline || '');
      setStatus(res.data.status || 'PUBLISHED');
    } catch (err) {
      setError('Failed to load job for editing.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      title,
      description,
      requiredSkills,
      location,
      experience,
      salary,
      employmentType,
      deadline: deadline || null,
      status,
    };

    try {
      if (isEdit) {
        await api.put(`/jobs/${id}`, payload);
      } else {
        await api.post('/jobs', payload);
      }
      navigate('/recruiter/jobs');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save job posting.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '3rem' }}>Loading job details...</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <button onClick={() => navigate('/recruiter/jobs')} className="btn btn-sm btn-secondary">
            <ArrowLeft size={16} /> Back
          </button>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>
            {isEdit ? 'Edit Job Posting' : 'Create New Job Posting'}
          </h2>
        </div>

        {error && <div className="alert alert-error"><AlertCircle size={18} /> {error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Job Title *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Senior Java Backend Engineer"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Employment Type *</label>
              <select
                className="form-select"
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value)}
                required
              >
                <option value="FULL_TIME">Full Time</option>
                <option value="PART_TIME">Part Time</option>
                <option value="INTERNSHIP">Internship</option>
                <option value="CONTRACT">Contract</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Job Status *</label>
              <select
                className="form-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
              >
                <option value="PUBLISHED">Published (Accepting Applications)</option>
                <option value="DRAFT">Draft (Hidden)</option>
                <option value="CLOSED">Closed (No new applications)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Required Skills (Comma-separated for resume matching score calculation) *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Java, Spring Boot, MySQL, React"
              value={requiredSkills}
              onChange={(e) => setRequiredSkills(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Location</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. San Francisco / Remote"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Experience Required</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 3-5 Years"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Salary Range</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. $120,000 - $150,000"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Application Deadline Date</label>
            <input
              type="date"
              className="form-input"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Job Description *</label>
            <textarea
              className="form-textarea"
              placeholder="Detailed job responsibilities, qualifications, and benefits..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => navigate('/recruiter/jobs')} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              <Save size={18} /> {saving ? 'Saving Job...' : isEdit ? 'Update Job' : 'Publish Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecruiterCreateEditJob;
