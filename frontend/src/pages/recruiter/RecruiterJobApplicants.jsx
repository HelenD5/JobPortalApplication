import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';
import { Users, Download, ArrowLeft, Award, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

const RecruiterJobApplicants = () => {
  const { id: jobId } = useParams();
  const [job, setJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchJobAndApplicants();
  }, [jobId]);

  const fetchJobAndApplicants = async () => {
    try {
      const [jobRes, appsRes] = await Promise.all([
        api.get(`/jobs/${jobId}`),
        api.get(`/jobs/${jobId}/applications`)
      ]);
      setJob(jobRes.data);
      setApplicants(appsRes.data);
    } catch (err) {
      console.error('Failed to load job applicants', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    setUpdatingId(applicationId);
    try {
      const res = await api.put(`/applications/${applicationId}/status`, { status: newStatus });
      setApplicants(applicants.map((a) => (a.id === applicationId ? res.data : a)));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update candidate status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDownloadResume = async (resumeId, fileName) => {
    try {
      const res = await api.get(`/resumes/${resumeId}/download`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName || 'resume.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Failed to download applicant resume.');
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '3rem' }}>Loading candidate applicants...</div>;

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <Link to="/recruiter/jobs" className="btn btn-sm btn-secondary" style={{ marginBottom: '1rem' }}>
          <ArrowLeft size={16} /> Back to Company Jobs
        </Link>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.4rem' }}>
          Candidates for: {job?.title}
        </h1>
        <p style={{ color: 'var(--color-text-muted)' }}>
          Required Skills: <strong style={{ color: 'var(--color-primary)' }}>{job?.requiredSkills}</strong>
        </p>
      </div>

      {applicants.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
          <Users size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
          <h3>No applications submitted for this job yet</h3>
          <p style={{ color: 'var(--color-text-muted)' }}>Candidates who apply will appear ranked here by skill match score.</p>
        </div>
      ) : (
        <div className="glass-card">
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Applicant</th>
                  <th>Skills & Contact</th>
                  <th>Matching Score</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applicants.map((app, index) => (
                  <tr key={app.id}>
                    <td style={{ fontWeight: 800, fontSize: '1.1rem', color: index === 0 ? 'var(--color-warning)' : 'var(--color-text-muted)' }}>
                      #{index + 1}
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, fontSize: '1rem' }}>{app.applicantName}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{app.applicantEmail}</div>
                      {app.applicantPhone && <div style={{ fontSize: '0.8rem', color: 'var(--color-text-dim)' }}>Phone: {app.applicantPhone}</div>}
                    </td>
                    <td>
                      <div style={{ fontSize: '0.85rem', color: 'var(--color-text)' }}>
                        {app.applicantSkills || 'No skills listed in profile'}
                      </div>
                      {app.applicantEducation && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                          Edu: {app.applicantEducation}
                        </div>
                      )}
                    </td>
                    <td>
                      <span className={`score-badge ${app.score >= 70 ? 'score-high' : app.score >= 40 ? 'score-medium' : 'score-low'}`}>
                        {app.score}% Match
                      </span>
                    </td>
                    <td>
                      <select
                        className="form-select"
                        value={app.status}
                        onChange={(e) => handleStatusChange(app.id, e.target.value)}
                        disabled={updatingId === app.id}
                        style={{ padding: '0.4rem 0.6rem', fontSize: '0.85rem', width: 'auto' }}
                      >
                        <option value="APPLIED">APPLIED</option>
                        <option value="UNDER_REVIEW">UNDER REVIEW</option>
                        <option value="SHORTLISTED">SHORTLISTED</option>
                        <option value="INTERVIEW">INTERVIEW</option>
                        <option value="SELECTED">SELECTED</option>
                        <option value="REJECTED">REJECTED</option>
                      </select>
                    </td>
                    <td>
                      <button
                        onClick={() => handleDownloadResume(app.resumeId, app.resumeFileName)}
                        className="btn btn-sm btn-primary"
                      >
                        <Download size={14} /> Resume PDF
                      </button>
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

export default RecruiterJobApplicants;
