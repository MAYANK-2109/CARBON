import React, { useState, useEffect } from 'react';
import { useAuth } from '../../features/auth/useAuth';
import { sendMessage } from '../../features/chat/chat.api'; // we will create this API helper

export const ChatPage: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { role: 'user' as const, content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    try {
      const response = await sendMessage(user?.userId, [...messages, userMessage]);
      const assistantMessage = { role: 'assistant' as const, content: response.reply };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Chat error', err);
      // show error message as assistant reply
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, something went wrong.' }]);
    } finally {
      setLoading(false);
    }
  };

  // Auto scroll to bottom on new message
  useEffect(() => {
    const el = document.getElementById('chat-scroll');
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  return (
    <div className="chat-page" style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      background: 'var(--bg-primary)',
      color: 'var(--text-primary)',
    }}>
      <header style={{
        padding: '20px',
        borderBottom: '1px solid var(--border-glass)',
        background: 'var(--bg-glass)',
        fontSize: '1.5rem',
        fontFamily: 'var(--font-heading)',
        fontWeight: 700,
        textAlign: 'center',
      }}>AI Sustainability Assistant</header>
      <div id="chat-scroll" style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{
            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
            maxWidth: '70%',
            background: msg.role === 'user' ? 'var(--bg-glass)' : 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            padding: '12px 16px',
            borderRadius: '12px',
            boxShadow: 'var(--shadow-sm)',
          }}>
            {msg.content}
          </div>
        ))}
        {loading && (
          <div style={{ alignSelf: 'flex-start', color: 'var(--text-muted)' }}>🤖 typing…</div>
        )}
      </div>
      <div style={{
        padding: '12px',
        borderTop: '1px solid var(--border-glass)',
        background: 'var(--bg-glass)',
        display: 'flex',
        gap: '8px',
      }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
          placeholder="Ask how to reduce your footprint…"
          style={{
            flex: 1,
            padding: '8px 12px',
            border: '1px solid var(--border-glass)',
            borderRadius: '8px',
            background: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
          }}
        />
        <button
          onClick={handleSend}
          disabled={loading}
          style={{
            padding: '8px 16px',
            background: 'var(--accent-emerald)',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >Send</button>
      </div>
    </div>
  );
};
