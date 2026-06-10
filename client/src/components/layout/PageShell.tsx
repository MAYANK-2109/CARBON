import React from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { useAuth } from '../../features/auth/useAuth';

interface PageShellProps {
  children: React.ReactNode;
}

export const PageShell: React.FC<PageShellProps> = ({ children }) => {
  const { user } = useAuth();

  return (
    <div 
      style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}
      role="application"
      aria-label="Application shell"
    >
      {/* Skip link for accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {user && <Sidebar />}

      <div
        style={{
          flexGrow: 1,
          marginLeft: user ? 'var(--sidebar-width)' : 0,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0, // Prevent flex items from overflowing
          transition: 'margin-left var(--transition-normal)'
        }}
      >
        <Navbar />
        
        <main
          id="main-content"
          className="anim-fade-in"
          style={{
            flexGrow: 1,
            padding: '32px',
            maxWidth: '1400px',
            width: '100%',
            margin: '0 auto',
            boxSizing: 'border-box'
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
};
