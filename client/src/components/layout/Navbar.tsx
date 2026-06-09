import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Sparkles, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../../features/auth/useAuth';

export const Navbar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard': return 'Bento Eco-Dashboard';
      case '/calculator': return 'Carbon Footprint Calculator';
      case '/history': return 'Calculations Log & Analytics';
      case '/tips': return 'Actionable Reduction Tips';
      case '/login': return 'Authenticate';
      case '/register': return 'Create Account';
      default: return 'Carbon Assistant';
    }
  };

  const getGreeting = () => {
    if (!user) return 'Welcome! Track & offset your impact today.';
    const hours = new Date().getHours();
    let timeGreeting = 'Good evening';
    if (hours < 12) timeGreeting = 'Good morning';
    else if (hours < 18) timeGreeting = 'Good afternoon';
    return `${timeGreeting}, ${user.name}!`;
  };

  return (
    <header
      style={{
        height: 'var(--navbar-height)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px',
        borderBottom: '1px solid var(--border-glass)',
        background: 'rgba(8, 8, 12, 0.4)',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 90
      }}
    >
      <div>
        <h1
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '22px',
            fontWeight: 700,
            margin: 0,
            letterSpacing: '-0.3px',
            color: 'var(--text-primary)',
            textAlign: 'left'
          }}
        >
          {getPageTitle()}
        </h1>
        <p
          style={{
            fontSize: '13px',
            color: 'var(--text-secondary)',
            margin: '2px 0 0',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            textAlign: 'left'
          }}
        >
          <Sparkles size={12} className="text-emerald" style={{ color: 'var(--accent-emerald)' }} />
          {getGreeting()}
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {!user && (
          <div style={{ display: 'flex', gap: '12px' }}>
            <Link
              to="/login"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '14px',
                fontFamily: 'var(--font-heading)',
                fontWeight: 500,
                color: 'var(--text-primary)',
                padding: '8px 14px',
                borderRadius: '8px',
                border: '1px solid var(--border-glass)',
                background: 'var(--bg-glass)',
                transition: 'all var(--transition-fast)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--bg-glass-hover)';
                e.currentTarget.style.borderColor = 'var(--border-glass-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--bg-glass)';
                e.currentTarget.style.borderColor = 'var(--border-glass)';
              }}
            >
              <LogIn size={16} />
              Sign In
            </Link>
            <Link
              to="/register"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '14px',
                fontFamily: 'var(--font-heading)',
                fontWeight: 500,
                color: '#042f2e',
                background: 'linear-gradient(135deg, var(--accent-teal), var(--accent-emerald))',
                padding: '8px 14px',
                borderRadius: '8px',
                transition: 'all var(--transition-fast)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = 'var(--glow-emerald)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'none';
              }}
            >
              <UserPlus size={16} />
              Register
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
