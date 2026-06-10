import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Calculator,
  History,
  Lightbulb,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Leaf,
  Bot
} from 'lucide-react';
// We will build useAuth shortly in src/features/auth/useAuth
import { useAuth } from '../../features/auth/useAuth';

export const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, logout } = useAuth();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Calculator', path: '/calculator', icon: <Calculator size={20} /> },
    { name: 'History', path: '/history', icon: <History size={20} /> },
    { name: 'Reduction Tips', path: '/tips', icon: <Lightbulb size={20} /> },
    { name: 'AI Assistant', path: '/chat', icon: <Bot size={20} /> },
  ];

  return (
    <aside
      style={{
        width: isCollapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 100,
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border-glass)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width var(--transition-normal)',
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          height: 'var(--navbar-height)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between',
          padding: '0 20px',
          borderBottom: '1px solid var(--border-glass)'
        }}
      >
        {!isCollapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-emerald)' }}>
            <Leaf size={24} style={{ fill: 'currentColor' }} />
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '18px', letterSpacing: '0.5px', color: 'var(--text-primary)' }}>
              CARBON
            </span>
          </div>
        )}
        {isCollapsed && (
          <div style={{ color: 'var(--accent-emerald)' }}>
            <Leaf size={24} style={{ fill: 'currentColor' }} />
          </div>
        )}
        <button
          onClick={toggleSidebar}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '28px',
            height: '28px',
            borderRadius: '6px',
            background: 'var(--bg-glass)',
            border: '1px solid var(--border-glass)',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-glass-hover)';
            e.currentTarget.style.color = 'var(--text-primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-glass)';
            e.currentTarget.style.color = 'var(--text-secondary)';
          }}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav style={{ flexGrow: 1, padding: '24px 12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            style={({ isActive }: { isActive: boolean }) => ({
              display: 'flex',
              alignItems: 'center',
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
              background: isActive ? 'var(--bg-glass-active)' : 'transparent',
              border: isActive ? '1px solid var(--border-glass-hover)' : '1px solid transparent',
              transition: 'all var(--transition-fast)',
              position: 'relative'
            })}
            className={({ isActive }: { isActive: boolean }) => isActive ? 'glass-glow-emerald' : ''}
          >
            <span style={{ display: 'flex', flexShrink: 0 }}>{item.icon}</span>
            {!isCollapsed && (
              <span style={{ fontSize: '15px', fontFamily: 'var(--font-heading)', fontWeight: 500 }}>
                {item.name}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Session Info / Logout */}
      {user && (
        <div
          style={{
            padding: '16px 12px',
            borderTop: '1px solid var(--border-glass)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}
        >
          {!isCollapsed && (
            <div style={{ display: 'flex', flexDirection: 'column', padding: '0 8px' }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.name}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.email}
              </span>
            </div>
          )}

          <button
            onClick={logout}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              gap: '12px',
              padding: '12px 16px',
              width: '100%',
              borderRadius: 'var(--radius-md)',
              color: 'var(--accent-rose)',
              background: 'rgba(244, 63, 94, 0.04)',
              border: '1px solid rgba(244, 63, 94, 0.1)',
              transition: 'all var(--transition-normal)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(244, 63, 94, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(244, 63, 94, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(244, 63, 94, 0.04)';
              e.currentTarget.style.borderColor = 'rgba(244, 63, 94, 0.1)';
            }}
          >
            <LogOut size={20} />
            {!isCollapsed && (
              <span style={{ fontSize: '15px', fontFamily: 'var(--font-heading)', fontWeight: 500 }}>
                Sign Out
              </span>
            )}
          </button>
        </div>
      )}
    </aside>
  );
};