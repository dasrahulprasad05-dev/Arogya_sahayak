import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class RouteErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught route error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-8 border border-destructive/20 bg-destructive/5 rounded-2xl text-center max-w-md mx-auto my-12">
          <h2 className="text-lg font-bold text-destructive mb-2">Could not load this page</h2>
          <p className="text-sm text-muted-foreground mb-6">
            There was a loading error. This can happen if you are offline or the page bundle failed to download.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 bg-primary text-white font-semibold rounded-xl text-sm transition-all hover:bg-primary/95 shadow-md shadow-primary/10 touch-target"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default RouteErrorBoundary;
