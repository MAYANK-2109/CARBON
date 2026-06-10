import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../features/auth/useAuth';
import { sendMessage } from '../../features/chat/chat.api';
import type { ChatMessage } from '../../features/chat/chat.api';
import { useToast } from '../../components/feedback/Toast';
import { Markdown } from '../../components/ui/Markdown';
import { api } from '../../lib/api';
import {
  ArrowUp,
  RotateCcw,
  Route,
  Salad,
  Target,
  TrendingDown,
  Sparkles,
} from 'lucide-react';

const SUGGESTIONS = [
  { icon: TrendingDown, text: "What's driving my emissions the most?" },
  { icon: Route, text: "Give me three concrete ways to cut my footprint." },
  { icon: Target, text: "Am I on track for a sustainable lifestyle?" },
  { icon: Salad, text: "How much could diet changes save me?" },
];

const LOG_ACTIVITY_RE = /\[LOG_ACTIVITY:(\{[^}]+\})\]/g;

function extractLogMarkers(text: string): {
  clean: string;
  payloads: string[];
} {
  const payloads: string[] = [];
  const clean = text.replace(LOG_ACTIVITY_RE, (_, json: string) => {
    payloads.push(json);
    return '';
  }).trim();
  return { clean, payloads };
}

export const ChatPage: React.FC = () => {
  const { user, isAuthenticated, refreshProfile } = useAuth();
  const { success: showSuccessToast, error: showErrorToast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Keep newest content in view as it updates.
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // Auto-grow textarea height
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [input]);

  const executeLogActivity = async (payload: { category: string; data: Record<string, unknown> }) => {
    try {
      let endpoint = '';
      if (payload.category === 'travel') {
        endpoint = '/calculate/travel';
      } else if (payload.category === 'energy') {
        endpoint = '/calculate/energy';
      } else if (payload.category === 'diet') {
        endpoint = '/calculate/diet';
      } else {
        showErrorToast(`Assistant tried to log unknown activity category: ${payload.category}`);
        return;
      }

      const res = await api.post<{ success: boolean; data: unknown }>(endpoint, payload.data);
      if (res.data.success) {
        showSuccessToast(
          `Logged activity successfully: ${payload.category.toUpperCase()}`,
          'Carbon Footprint Updated'
        );
        if (isAuthenticated) refreshProfile();
      }
    } catch (err: unknown) {
      const error = err as Error;
      console.error('Auto-logging activity failed:', error);
      showErrorToast(`Failed to automatically log activity from chat: ${error.message || error}`);
    }
  };

  const handleSend = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || loading) return;

    const userMessage: ChatMessage = { role: 'user', content: trimmed };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await sendMessage(user?.id, [...messages, userMessage]);
      const rawReply = response.reply;

      // Extract activity log payloads
      const { clean, payloads } = extractLogMarkers(rawReply);

      // Append assistant reply to the screen
      const assistantMessage: ChatMessage = { role: 'assistant', content: clean };
      setMessages(prev => [...prev, assistantMessage]);

      // Fire off auto-logging calculations
      for (const payloadStr of payloads) {
        try {
          const parsed = JSON.parse(payloadStr);
          if (parsed && parsed.category && parsed.data) {
            await executeLogActivity(parsed);
          }
        } catch (e) {
          console.error('Error parsing LOG_ACTIVITY JSON:', e);
          showErrorToast('Failed to parse activity data suggested by assistant.');
        }
      }
    } catch (err: unknown) {
      const error = err as Error;
      console.error('Chat error', error);
      showErrorToast(error.message || 'Sorry, something went wrong with the AI assistant.');
    } finally {
      setLoading(false);
      // Refocus input
      inputRef.current?.focus();
    }
  };

  const handleReset = () => {
    setMessages([]);
    showSuccessToast('Chat history cleared.');
  };

  const hasMessages = messages.length > 0;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      background: 'var(--bg-primary)',
      color: 'var(--text-primary)',
    }}>
      {/* Header */}
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
          <Sparkles size={18} style={{ color: 'var(--accent-emerald)' }} />
          <span>AI Sustainability Assistant</span>
        </div>
        {hasMessages && (
          <button
            onClick={handleReset}
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
          >
            <RotateCcw size={14} />
            <span>Reset</span>
          </button>
        )}
      </header>

      {/* Message Area / Suggested Templates */}
      <div
        ref={logRef}
        id="chat-scroll"
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        {!hasMessages ? (
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
                  onClick={() => handleSend(text)}
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
                  <Icon size={16} style={{ color: 'var(--accent-emerald)', flexShrink: 0 }} />
                  <span>{text}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
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
              <div style={{
                alignSelf: 'flex-start',
                background: 'var(--bg-secondary)',
                padding: '12px 18px',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: 'var(--text-muted)',
                fontSize: '0.9rem',
              }}>
                <span className="typing-dot" style={{ width: '6px', height: '6px', backgroundColor: 'var(--text-muted)', borderRadius: '50%', display: 'inline-block', animation: 'pulse 1.2s infinite' }}></span>
                <span>Typing...</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input composer area */}
      <div style={{
        padding: '16px 24px',
        borderTop: '1px solid var(--border-glass)',
        background: 'var(--bg-glass)',
        backdropFilter: 'blur(8px)',
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
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
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(input);
                }
              }}
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
            >
              <ArrowUp size={18} />
            </button>
          </form>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '8px' }}>
            Powered by Gemini AI · Grounded in your calculation history
          </div>
        </div>
      </div>
    </div>
  );
};
