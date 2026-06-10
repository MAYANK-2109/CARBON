import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../features/auth/useAuth';
import { sendMessage } from '../../features/chat/chat.api';
import type { ChatMessage } from '../../features/chat/chat.api';
import { useToast } from '../../components/feedback/Toast';
import { api } from '../../lib/api';

import { ChatHeader } from './components/ChatHeader';
import { ChatSuggestions } from './components/ChatSuggestions';
import { ChatMessageList } from './components/ChatMessageList';
import { ChatComposer } from './components/ChatComposer';

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

/**
 * @component ChatPage
 * @description Main container for the AI chat interface. Handles state and API interactions.
 */
export const ChatPage: React.FC = React.memo(() => {
  const { user, isAuthenticated, refreshProfile } = useAuth();
  const { success: showSuccessToast, error: showErrorToast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const executeLogActivity = useCallback(async (payload: { category: string; data: Record<string, unknown> }) => {
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
        showSuccessToast(`Logged activity successfully: ${payload.category.toUpperCase()}`, 'Carbon Footprint Updated');
        if (isAuthenticated) refreshProfile();
      }
    } catch (err: unknown) {
      const error = err as Error;
      console.error('Auto-logging activity failed:', error);
      showErrorToast(`Failed to automatically log activity from chat: ${error.message || error}`);
    }
  }, [isAuthenticated, refreshProfile, showErrorToast, showSuccessToast]);

  const handleSend = useCallback(async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || loading) return;

    const userMessage: ChatMessage = { role: 'user', content: trimmed };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await sendMessage(user?.id, [...messages, userMessage]);
      const { clean, payloads } = extractLogMarkers(response.reply);

      setMessages(prev => [...prev, { role: 'assistant', content: clean }]);

      for (const payloadStr of payloads) {
        try {
          const parsed = JSON.parse(payloadStr);
          if (parsed?.category && parsed?.data) {
            await executeLogActivity(parsed);
          }
        } catch (e) {
          console.error('Error parsing LOG_ACTIVITY JSON:', e);
          showErrorToast('Failed to parse activity data suggested by assistant.');
        }
      }
    } catch (err: unknown) {
      const error = err as Error;
      showErrorToast(error.message || 'Sorry, something went wrong with the AI assistant.');
    } finally {
      setLoading(false);
    }
  }, [loading, messages, user?.id, executeLogActivity, showErrorToast]);

  const handleSendFromInput = useCallback(() => {
    handleSend(input);
  }, [input, handleSend]);

  const handleReset = useCallback(() => {
    setMessages([]);
    showSuccessToast('Chat history cleared.');
  }, [showSuccessToast]);

  const hasMessages = messages.length > 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <ChatHeader hasMessages={hasMessages} onReset={handleReset} />

      <div
        ref={logRef}
        id="chat-scroll"
        style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}
      >
        {!hasMessages ? (
          <ChatSuggestions onSelect={handleSend} />
        ) : (
          <ChatMessageList messages={messages} loading={loading} />
        )}
      </div>

      <ChatComposer 
        input={input} 
        onInputChange={setInput} 
        onSend={handleSendFromInput} 
        loading={loading} 
      />
    </div>
  );
});

ChatPage.displayName = 'ChatPage';
