import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  onError: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    // This parameter is required by React but not used in this implementation
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('React Error Boundary caught an error:', error, errorInfo);
    this.props.onError(error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return null; // Let the parent handle the error display
    }

    return this.props.children;
  }
}
