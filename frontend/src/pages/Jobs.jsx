import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { Search, MapPin, Briefcase, Calendar, DollarSign, Building } from 'lucide-react';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [employmentType, setEmploymentType] = useState('');
  const [experience, setExperience] = useState('');

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (location) params.location = location;
      if (employmentType) params.employmentType = employmentType;
      if (experience) params.experience = experience;

      const res = await api.get('/jobs', { params });
      setJobs(res.data);
    } catch (err) {
      console.error('Failed to fetch jobs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Browse Published Opportunities</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>Find your next career move among active verified company job postings.</p>
      </div>

      {/* Filter Form */}
      <div className="glass-card" style={{ marginBottom: '2rem' }}>
        <form onSubmit={handleFilterSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'end' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Search Title / Skill</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Java, React, Developer"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Location</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. San Francisco, Remote"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Employment Type</label>
            <select
              className="form-select"
              value={employmentType}
              onChange={(e) => setEmploymentType(e.target.value)}
            >
              <option value="">All Types</option>
              <option value="FULL_TIME">Full Time</option>
              <option value="PART_TIME">Part Time</option>
              <option value="INTERNSHIP">Internship</option>
              <option value="CONTRACT">Contract</option>
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Experience</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. 2 Years"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            <Search size={16} /> Filter Jobs
          </button>
        </form>
      </div>

      {/* Job List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>Loading jobs...</div>
      ) : jobs.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
          <Briefcase size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
          <h3>No published jobs found</h3>
          <p style={{ color: 'var(--color-text-muted)' }}>Try adjusting your search or filter options.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1.25rem' }}>
          {jobs.map((job) => (
            <div key={job.id} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
                  <span className="badge badge-published">{job.employmentType}</span>
                  <span style={{ fontSize: '0.875rem', color: 'var(--color-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Building size={14} /> {job.companyName}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  <Link to={`/jobs/${job.id}`} style={{ color: '#fff' }}>{job.title}</Link>
                </h3>
                <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><MapPin size={14} /> {job.location || 'Not specified'}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Briefcase size={14} /> {job.experience || 'Flexible'}</span>
                  {job.salary && <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><DollarSign size={14} /> {job.salary}</span>}
                  {job.deadline && <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Calendar size={14} /> Deadline: {job.deadline}</span>}
                </div>
                {job.requiredSkills && (
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {job.requiredSkills.split(',').map((skill, idx) => (
                      <span key={idx} style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid var(--color-border)',
                        padding: '0.15rem 0.5rem',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.775rem',
                        color: 'var(--color-text-muted)'
                      }}>
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <Link to={`/jobs/${job.id}`} className="btn btn-primary">
                  View Details & Apply
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Jobs;
