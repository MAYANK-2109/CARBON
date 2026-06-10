import React from 'react';
import { Route, Salad, Target, TrendingDown } from 'lucide-react';

const SUGGESTIONS = [
  { icon: TrendingDown, text: "What's driving my emissions the most?" },
  { icon: Route, text: "Give me three concrete ways to cut my footprint." },
  { icon: Target, text: "Am I on track for a sustainable lifestyle?" },
  { icon: Salad, text: "How much could diet changes save me?" },
];

/**
 * @interface ChatSuggestionsProps
 * @description Properties for the ChatSuggestions component.
 */
interface ChatSuggestionsProps {
  /** Callback fired when a suggestion is clicked */
  onSelect: (text: string) => void;
}

/**
 * @component ChatSuggestions
 * @description Renders a grid of suggested prompts for the AI assistant when the chat is empty.
 */
export const ChatSuggestions: React.FC<ChatSuggestionsProps> = React.memo(({ onSelect }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      gap: '24px',
      maxWidth: '600px',
      margin: '0 auto',
      textAlign: 'center',
    }}>
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
          How can I help with your footprint?
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Ask me to calculate your emissions, advice on savings, or even log travel and diet details directly.
        </p>
      </div>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '12px',
        width: '100%',
      }}>
        {SUGGESTIONS.map(({ icon: Icon, text }) => (
          <button
            key={text}
            type="button"
            onClick={() => onSelect(text)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '14px',
              borderRadius: '12px',
              border: '1px solid var(--border-glass)',
              background: 'var(--bg-secondary)',
              color: 'var(--text-secondary)',
              textAlign: 'left',
              fontSize: '0.875rem',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--accent-emerald)';
              e.currentTarget.style.color = 'var(--text-primary)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border-glass)';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
          >
            <Icon size={16} style={{ color: 'var(--accent-emerald)', flexShrink: 0 }} aria-hidden="true" />
            <span>{text}</span>
          </button>
        ))}
      </div>
    </div>
  );
});

ChatSuggestions.displayName = 'ChatSuggestions';
