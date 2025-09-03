import React from 'react';
import { ErrorBoundaryProps, ErrorBoundaryState } from '@/types';

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <div 
          className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800"
          role="alert"
          aria-live="assertive"
        >
          <h2 className="font-bold mb-2">Something went wrong</h2>
          <p className="mb-2">
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="mt-2 px-4 py-2 bg-red-100 hover:bg-red-200 rounded text-red-800 text-sm"
            aria-label="Try again"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Higher Order Component for functional components
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  FallbackComponent?: React.ComponentType<{ error?: Error }>,
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
) => {
  return (props: P) => (
    <ErrorBoundary
      fallback={
        FallbackComponent ? (
          <FallbackComponent />
        ) : undefined
      }
      onError={onError}
    >
      <Component {...props} />
    </ErrorBoundary>
  );
};
