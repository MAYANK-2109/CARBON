import React, { useRef, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

/**
 * @interface ChatComposerProps
 * @description Properties for the ChatComposer component.
 */
interface ChatComposerProps {
  /** The current input string */
  input: string;
  /** Callback fired when input changes */
  onInputChange: (value: string) => void;
  /** Callback fired when the user sends a message */
  onSend: () => void;
  /** Whether the chat is currently waiting on a response */
  loading: boolean;
}

/**
 * @component ChatComposer
 * @description Renders the input text area and send button for the chat interface.
 */
export const ChatComposer: React.FC<ChatComposerProps> = React.memo(({ input, onInputChange, onSend, loading }) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-grow textarea height
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [input]);

  // Focus input when loading finishes
  useEffect(() => {
    if (!loading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [loading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSend();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div style={{
      padding: '16px 24px',
      borderTop: '1px solid var(--border-glass)',
      background: 'var(--bg-glass)',
      backdropFilter: 'blur(8px)',
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: '12px',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-glass)',
            borderRadius: '16px',
            padding: '8px 12px',
          }}
        >
          <label htmlFor="chat-input" className="sr-only">Type your message</label>
          <textarea
            id="chat-input"
            ref={inputRef}
            rows={1}
            value={input}
            onChange={e => onInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your carbon score or say 'log 100 miles by train'..."
            style={{
              flex: 1,
              resize: 'none',
              maxHeight: '160px',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              padding: '8px 6px',
              fontSize: '0.9rem',
              outline: 'none',
            }}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            style={{
              background: 'var(--accent-emerald)',
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: (loading || !input.trim()) ? 'not-allowed' : 'pointer',
              opacity: (loading || !input.trim()) ? 0.6 : 1,
              transition: 'all var(--transition-fast)',
            }}
            aria-label="Send message"
          >
            <ArrowUp size={18} aria-hidden="true" />
          </button>
        </form>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '8px' }}>
          Powered by Gemini AI · Grounded in your calculation history
        </div>
      </div>
    </div>
  );
});

ChatComposer.displayName = 'ChatComposer';
