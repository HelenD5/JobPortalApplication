import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Building2, Users, Search, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

const Home = () => {
  return (
    <div>
      {/* Hero Banner */}
      <div style={{
        padding: '4rem 2rem',
        borderRadius: 'var(--radius-xl)',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(6, 182, 212, 0.08) 100%)',
        border: '1px solid var(--color-border)',
        textAlign: 'center',
        marginBottom: '3rem'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.35rem 1rem',
          borderRadius: '9999px',
          background: 'var(--color-primary-light)',
          color: 'var(--color-primary)',
          fontSize: '0.85rem',
          fontWeight: 700,
          marginBottom: '1.25rem'
        }}>
          <Zap size={16} /> Next-Gen Multi-Company Enterprise Job Portal
        </div>
        
        <h1 style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1.15, marginBottom: '1.25rem', color: '#fff' }}>
          Connect with Top Companies & <br />
          <span style={{ background: 'linear-gradient(135deg, #818cf8, #38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Elevate Your Career
          </span>
        </h1>
        
        <p style={{ fontSize: '1.15rem', color: 'var(--color-text-muted)', maxWidth: '700px', margin: '0 auto 2rem' }}>
          Discover thousands of active tech opportunities across verified companies. Upload your resume and apply instantly with zero friction.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <Link to="/jobs" className="btn btn-primary" style={{ padding: '0.85rem 1.75rem', fontSize: '1rem' }}>
            <Search size={18} /> Explore Published Jobs
          </Link>
          <Link to="/register" className="btn btn-secondary" style={{ padding: '0.85rem 1.75rem', fontSize: '1rem' }}>
            Join as Recruiter / Applicant <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="glass-card">
          <div className="stat-icon" style={{ marginBottom: '1rem' }}><Building2 size={24} /></div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Multi-Company Isolation</h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.925rem' }}>
            Enterprise strict security ensures Company A recruiters never see Company B's jobs, applicants, or resumes.
          </p>
        </div>

        <div className="glass-card">
          <div className="stat-icon" style={{ marginBottom: '1rem' }}><Zap size={24} /></div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Automated Skill Matching</h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.925rem' }}>
            Instant skill-based resume matching score calculation for recruiters to rank top talent efficiently.
          </p>
        </div>

        <div className="glass-card">
          <div className="stat-icon" style={{ marginBottom: '1rem' }}><ShieldCheck size={24} /></div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Role-Based Access</h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.925rem' }}>
            Dedicated portals for Applicants, Recruiters, and Platform Administrators with complete privacy controls.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
