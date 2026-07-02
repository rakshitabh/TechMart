import React, { Component } from 'react';
import { ShieldAlert, RefreshCw } from 'lucide-react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught rendering error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center p-6 text-center text-left">
          <div className="max-w-md w-full bg-white dark:bg-slate-800 p-8 rounded-3xl border border-gray-100 dark:border-slate-700/60 shadow-2xl space-y-6">
            <div className="mx-auto bg-rose-500/10 text-rose-500 p-3 rounded-2xl w-fit flex items-center justify-center">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">Something went wrong</h2>
              <p className="text-sm text-gray-500 dark:text-slate-400">
                An unexpected rendering error occurred. Please refresh or try again.
              </p>
            </div>
            {this.state.error && (
              <div className="p-4 bg-gray-50 dark:bg-slate-750/30 rounded-2xl text-[11px] text-gray-400 font-mono text-left max-h-32 overflow-y-auto border border-gray-150 dark:border-slate-700">
                {this.state.error.toString()}
              </div>
            )}
            <button
              onClick={this.handleReset}
              className="w-full flex items-center justify-center py-2.5 px-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold shadow-md shadow-brand-500/10 hover:scale-[1.01] active:scale-[0.99] transition-all text-sm"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
