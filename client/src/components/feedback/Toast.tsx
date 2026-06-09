import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertTriangle, Info, AlertOctagon } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

interface ToastContextType {
  toast: (message: Omit<ToastMessage, 'id'>) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(({ type, title, message, duration = 4000 }: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, title, message, duration }]);
    
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, [removeToast]);

  const success = useCallback((message: string, title?: string) => toast({ type: 'success', title, message }), [toast]);
  const error = useCallback((message: string, title?: string) => toast({ type: 'error', title, message }), [toast]);
  const warning = useCallback((message: string, title?: string) => toast({ type: 'warning', title, message }), [toast]);
  const info = useCallback((message: string, title?: string) => toast({ type: 'info', title, message }), [toast]);

  return (
    <ToastContext.Provider value={{ toast, success, error, warning, info }}>
      {children}
      
      {/* Toast Portal Container */}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          maxWidth: '400px',
          width: '100%',
        }}
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className="glass-panel"
            style={{
              padding: '16px',
              display: 'flex',
              gap: '12px',
              alignItems: 'flex-start',
              animation: 'slideUp var(--transition-normal) forwards',
              boxShadow: 'var(--shadow-lg)',
              borderLeft: `4px solid ${
                t.type === 'success'
                  ? 'var(--accent-emerald)'
                  : t.type === 'error'
                  ? 'var(--accent-rose)'
                  : t.type === 'warning'
                  ? 'var(--accent-amber)'
                  : 'var(--accent-sky)'
              }`,
              background: 'rgba(15, 16, 22, 0.9)',
              backdropFilter: 'blur(8px)'
            }}
          >
            <div style={{ flexShrink: 0 }}>
              {t.type === 'success' && <CheckCircle size={20} style={{ color: 'var(--accent-emerald)' }} />}
              {t.type === 'error' && <AlertOctagon size={20} style={{ color: 'var(--accent-rose)' }} />}
              {t.type === 'warning' && <AlertTriangle size={20} style={{ color: 'var(--accent-amber)' }} />}
              {t.type === 'info' && <Info size={20} style={{ color: 'var(--accent-sky)' }} />}
            </div>
            
            <div style={{ flexGrow: 1 }}>
              {t.title && (
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px', textAlign: 'left' }}>
                  {t.title}
                </div>
              )}
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'left' }}>
                {t.message}
              </div>
            </div>

            <button
              onClick={() => removeToast(t.id)}
              style={{
                flexShrink: 0,
                color: 'var(--text-muted)',
                cursor: 'pointer',
                transition: 'color var(--transition-fast)',
                display: 'flex'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
