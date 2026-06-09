import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // ESC key listener to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getSizeWidth = () => {
    switch (size) {
      case 'sm': return '400px';
      case 'lg': return '800px';
      case 'md':
      default:
        return '600px';
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(5, 5, 8, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: 'fadeIn var(--transition-normal) forwards'
      }}
      onClick={(e) => {
        // Close if click outside card
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
          onClose();
        }
      }}
    >
      <div
        ref={modalRef}
        style={{
          width: '100%',
          maxWidth: getSizeWidth(),
        }}
      >
        <GlassCard
          glowColor="none"
          className="anim-slide-up"
          style={{
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            background: 'var(--bg-secondary)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-glass)', paddingBottom: '16px' }}>
            {title && (
              <h2 id="modal-title" style={{ fontSize: '20px', fontFamily: 'var(--font-heading)', margin: 0 }}>
                {title}
              </h2>
            )}
            <button
              onClick={onClose}
              aria-label="Close modal"
              style={{
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'color var(--transition-fast)',
                display: 'flex'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
            >
              <X size={20} />
            </button>
          </div>
          
          <div style={{ maxHeight: '70vh', overflowY: 'auto', paddingRight: '4px' }}>
            {children}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
