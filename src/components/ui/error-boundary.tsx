import React, { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Error caught by ErrorBoundary:', error);
    console.error('Component stack:', errorInfo.componentStack);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-white">
          <h1 className="text-3xl font-bold mb-4">Something went wrong</h1>
          <div className="mb-6 max-w-xl">
            <p className="text-red-500 font-medium">Error: {this.state.error?.message || 'Unknown error'}</p>
            <p className="mt-2 text-gray-600">
              The application encountered an error. Please try refreshing the page or contact support if the problem persists.
            </p>
          </div>
          <div className="flex gap-4">
            <button 
              className="px-6 py-3 bg-blue-600 text-white rounded-md font-medium"
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </button>
            <a 
              href="/debug.html" 
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-md font-medium"
            >
              Diagnostic Mode
            </a>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 