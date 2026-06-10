import React from 'react';
import { Sparkles, RotateCcw } from 'lucide-react';

/**
 * @interface ChatHeaderProps
 * @description Properties for the ChatHeader component.
 */
interface ChatHeaderProps {
  /** Whether the chat has any messages to display the reset button */
  hasMessages: boolean;
  /** Callback fired when the reset button is clicked */
  onReset: () => void;
}

/**
 * @component ChatHeader
 * @description Renders the sticky header for the Chat interface, including a reset button.
 */
export const ChatHeader: React.FC<ChatHeaderProps> = React.memo(({ hasMessages, onReset }) => {
  return (
    <header style={{
      padding: '16px 24px',
      borderBottom: '1px solid var(--border-glass)',
      background: 'var(--bg-glass)',
      backdropFilter: 'blur(8px)',
      fontSize: '1.25rem',
      fontFamily: 'var(--font-heading)',
      fontWeight: 700,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Sparkles size={18} style={{ color: 'var(--accent-emerald)' }} aria-hidden="true" />
        <span>AI Sustainability Assistant</span>
      </div>
      {hasMessages && (
        <button
          onClick={onReset}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.85rem',
            transition: 'color var(--transition-fast)'
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
          title="Reset conversation"
          aria-label="Reset conversation"
        >
          <RotateCcw size={14} aria-hidden="true" />
          <span>Reset</span>
        </button>
      )}
    </header>
  );
});

ChatHeader.displayName = 'ChatHeader';
