import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '400px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px'
          }}
        >
          <GlassCard
            glowColor="rose"
            style={{
              maxWidth: '500px',
              width: '100%',
              padding: '32px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: '16px'
            }}
          >
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: 'rgba(244, 63, 94, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-rose)'
              }}
            >
              <AlertTriangle size={32} />
            </div>
            
            <h2 style={{ fontSize: '22px', fontFamily: 'var(--font-heading)', margin: 0 }}>
              Something went wrong
            </h2>
            
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              An unexpected error occurred in the application view. Our technical team has been notified.
            </p>
            
            {this.state.error && (
              <pre
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: 'rgba(0,0,0,0.2)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '12px',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--accent-rose)',
                  textAlign: 'left',
                  overflowX: 'auto',
                  border: '1px solid rgba(244, 63, 94, 0.1)'
                }}
              >
                {this.state.error.message}
              </pre>
            )}

            <Button variant="primary" onClick={this.handleRetry}>
              Reload Application
            </Button>
          </GlassCard>
        </div>
      );
    }

    return this.props.children;
  }
}
