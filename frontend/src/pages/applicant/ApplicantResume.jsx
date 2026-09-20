import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Upload, FileText, CheckCircle2, AlertCircle, Download } from 'lucide-react';

const ApplicantResume = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const res = await api.get('/resumes/my');
      setResumes(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (!selectedFile.name.toLowerCase().endsWith('.pdf')) {
        setError('Only PDF files are allowed for resume upload.');
        setFile(null);
        return;
      }
      setError('');
      setFile(selectedFile);
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a PDF file.');
      return;
    }

    setUploading(true);
    setSuccess('');
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      await api.post('/resumes', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccess('Resume uploaded successfully!');
      setFile(null);
      fetchResumes();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload PDF resume.');
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (resumeId, fileName) => {
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
      alert('Failed to download resume.');
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '3rem' }}>Loading resumes...</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="glass-card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <FileText size={24} color="var(--color-primary)" /> My PDF Resumes
        </h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
          Upload or replace your PDF resume. Job recruiters will view and download your resume when you apply for positions.
        </p>

        {success && <div className="alert alert-success"><CheckCircle2 size={18} /> {success}</div>}
        {error && <div className="alert alert-error"><AlertCircle size={18} /> {error}</div>}

        <form onSubmit={handleUploadSubmit} style={{ background: '#0d1424', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px dashed var(--color-border)' }}>
          <div className="form-group">
            <label className="form-label">Select PDF Resume File (.pdf only)</label>
            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              className="form-input"
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <button type="submit" className="btn btn-primary" disabled={uploading || !file}>
              <Upload size={18} /> {uploading ? 'Uploading PDF...' : 'Upload PDF Resume'}
            </button>
          </div>
        </form>
      </div>

      <div className="glass-card">
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Uploaded Resume History</h3>

        {resumes.length === 0 ? (
          <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '1.5rem' }}>No resumes uploaded yet.</p>
        ) : (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Filename</th>
                  <th>Uploaded Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {resumes.map((r) => (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FileText size={18} color="var(--color-primary)" /> {r.fileName}
                    </td>
                    <td>{new Date(r.uploadedAt).toLocaleString()}</td>
                    <td>
                      <button onClick={() => handleDownload(r.id, r.fileName)} className="btn btn-sm btn-secondary">
                        <Download size={14} /> Download PDF
                      </button>
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

export default ApplicantResume;
