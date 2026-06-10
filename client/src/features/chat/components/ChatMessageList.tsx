import React from 'react';
import type { ChatMessage } from '../../features/chat/chat.api';
import { Markdown } from '../../../components/ui/Markdown';

/**
 * @interface ChatMessageListProps
 * @description Properties for the ChatMessageList component.
 */
interface ChatMessageListProps {
  /** Array of chat messages */
  messages: ChatMessage[];
  /** Whether the AI is currently typing */
  loading: boolean;
}

/**
 * @component ChatMessageList
 * @description Renders a list of chat messages and a loading indicator.
 */
export const ChatMessageList: React.FC<ChatMessageListProps> = React.memo(({ messages, loading }) => {
  return (
    <div style={{ maxWidth: '800px', width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {messages.map((msg, idx) => (
        <div
          key={idx}
          style={{
            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
            maxWidth: '80%',
            background: msg.role === 'user' ? 'var(--bg-glass)' : 'var(--bg-secondary)',
            border: msg.role === 'user' ? '1px solid var(--border-glass)' : '1px solid transparent',
            color: 'var(--text-primary)',
            padding: '12px 18px',
            borderRadius: '16px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          {msg.role === 'assistant' ? (
            <Markdown content={msg.content} />
          ) : (
            <div style={{ textAlign: 'left', whiteSpace: 'pre-wrap' }}>{msg.content}</div>
          )}
        </div>
      ))}
      {loading && (
        <div 
          style={{
            alignSelf: 'flex-start',
            background: 'var(--bg-secondary)',
            padding: '12px 18px',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: 'var(--text-muted)',
            fontSize: '0.9rem',
          }}
          aria-live="polite"
        >
          <span className="typing-dot" style={{ width: '6px', height: '6px', backgroundColor: 'var(--text-muted)', borderRadius: '50%', display: 'inline-block', animation: 'pulse 1.2s infinite' }}></span>
          <span>Typing...</span>
        </div>
      )}
    </div>
  );
});

ChatMessageList.displayName = 'ChatMessageList';
