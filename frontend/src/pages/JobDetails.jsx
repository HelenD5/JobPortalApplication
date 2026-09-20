import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Building, MapPin, Briefcase, Calendar, DollarSign, CheckCircle2, AlertCircle, FileText, Upload } from 'lucide-react';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyLoading, setApplyLoading] = useState(false);
  const [applyError, setApplyError] = useState('');
  const [applySuccess, setApplySuccess] = useState('');

  useEffect(() => {
    fetchJobDetails();
    if (isAuthenticated && user?.role === 'APPLICANT') {
      fetchMyResumes();
    }
  }, [id, isAuthenticated, user]);

  const fetchJobDetails = async () => {
    try {
      const res = await api.get(`/jobs/${id}`);
      setJob(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyResumes = async () => {
    try {
      const res = await api.get('/resumes/my');
      setResumes(res.data);
      if (res.data.length > 0) {
        setSelectedResumeId(res.data[0].id);
      }
    } catch (err) {
      console.error('Failed to fetch resumes', err);
    }
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    setApplyError('');
    setApplySuccess('');
    setApplyLoading(true);

    if (!selectedResumeId) {
      setApplyError('Please select or upload a resume to apply.');
      setApplyLoading(false);
      return;
    }

    try {
      await api.post('/applications', {
        jobId: job.id,
        resumeId: Number(selectedResumeId)
      });
      setApplySuccess('Application submitted successfully!');
      setTimeout(() => {
        setShowApplyModal(false);
        navigate('/applicant/applications');
      }, 1500);
    } catch (err) {
      setApplyError(err.response?.data?.message || 'Failed to submit application.');
    } finally {
      setApplyLoading(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '3rem' }}>Loading job details...</div>;
  if (!job) return <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>Job not found</div>;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div className="glass-card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <span className="badge badge-published">{job.employmentType}</span>
              <span style={{ fontSize: '0.9rem', color: 'var(--color-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Building size={16} /> {job.companyName}
              </span>
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>{job.title}</h1>
            <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><MapPin size={16} /> {job.location || 'Not specified'}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Briefcase size={16} /> {job.experience || 'Flexible'}</span>
              {job.salary && <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><DollarSign size={16} /> {job.salary}</span>}
              {job.deadline && <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Calendar size={16} /> Deadline: {job.deadline}</span>}
            </div>
          </div>

          <div>
            {!isAuthenticated ? (
              <Link to="/login" className="btn btn-primary">
                Login to Apply
              </Link>
            ) : user?.role === 'APPLICANT' ? (
              <button onClick={() => setShowApplyModal(true)} className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }}>
                <CheckCircle2 size={18} /> Apply for this Position
              </button>
            ) : (
              <span className="badge badge-under_review">Logged in as {user?.role}</span>
            )}
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.75rem' }}>Required Skills</h3>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {job.requiredSkills ? job.requiredSkills.split(',').map((skill, idx) => (
              <span key={idx} style={{
                background: 'var(--color-primary-light)',
                color: 'var(--color-primary)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                padding: '0.3rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem',
                fontWeight: 600
              }}>
                {skill.trim()}
              </span>
            )) : <span>None specified</span>}
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.75rem' }}>Job Description</h3>
          <div style={{ color: 'var(--color-text-muted)', whiteSpace: 'pre-line', lineHeight: 1.7 }}>
            {job.description}
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Apply for {job.title}</h3>
              <button onClick={() => setShowApplyModal(false)} className="close-btn">✕</button>
            </div>

            {applyError && <div className="alert alert-error"><AlertCircle size={18} /> {applyError}</div>}
            {applySuccess && <div className="alert alert-success"><CheckCircle2 size={18} /> {applySuccess}</div>}

            <form onSubmit={handleApplySubmit}>
              <div className="form-group">
                <label className="form-label">Select PDF Resume</label>
                {resumes.length === 0 ? (
                  <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--color-danger)', borderRadius: 'var(--radius-md)', color: '#fca5a5', marginBottom: '1rem' }}>
                    <p style={{ marginBottom: '0.5rem' }}>You have not uploaded any PDF resume yet!</p>
                    <Link to="/applicant/resume" className="btn btn-sm btn-primary">
                      <Upload size={14} /> Upload Resume First
                    </Link>
                  </div>
                ) : (
                  <select
                    className="form-select"
                    value={selectedResumeId}
                    onChange={(e) => setSelectedResumeId(e.target.value)}
                    required
                  >
                    {resumes.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.fileName} (Uploaded: {new Date(r.uploadedAt).toLocaleDateString()})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setShowApplyModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={applyLoading || resumes.length === 0}>
                  {applyLoading ? 'Submitting...' : 'Confirm Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetails;
