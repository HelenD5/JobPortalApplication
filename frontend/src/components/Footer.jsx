import React from 'react';

const Footer = () => {
  return (
    <footer style={{
      borderTop: '1px solid var(--color-border)',
      background: '#0a0d16',
      padding: '1.5rem 0',
      textAlign: 'center',
      marginTop: 'auto',
      color: 'var(--color-text-dim)',
      fontSize: '0.875rem'
    }}>
      <div className="main-content" style={{ padding: '0 1.5rem' }}>
        <p>© {new Date().getFullYear()} JobPortal. Multi-Company Enterprise Career Platform. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
