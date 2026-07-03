import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Enterprise Dashboard Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="card p-8 text-center max-w-md mx-auto mt-10">
            <div className="text-2xl mb-2">⚠️</div>
            <div className="font-semibold text-lg mb-2">Something went wrong</div>
            <p className="text-sm text-slate-600 mb-4">
              The dashboard encountered an unexpected error. All data remains safe.
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="px-4 py-2 bg-emerald-700 text-white rounded-2xl text-sm font-medium"
            >
              Try Again
            </button>
            {this.state.error && (
              <div className="mt-4 text-[10px] text-left bg-slate-50 p-2 rounded text-slate-500 font-mono overflow-auto">
                {this.state.error.message}
              </div>
            )}
          </div>
        )
      );
    }

    return this.props.children;
  }
}
