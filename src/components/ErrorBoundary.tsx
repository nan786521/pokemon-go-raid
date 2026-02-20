import { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';

interface Props { children: ReactNode; }
interface State { hasError: boolean; }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() { return { hasError: true }; }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="text-center">
            <div className="text-5xl">😵</div>
            <h2 className="mt-3 text-lg font-bold text-gray-900 dark:text-white">發生錯誤</h2>
            <p className="mt-1 text-sm text-gray-500">請重新整理頁面</p>
            <button
              onClick={() => location.reload()}
              className="mt-4 rounded-full bg-red-500 px-6 py-2 text-sm font-bold text-white transition hover:bg-red-600"
            >
              重新整理
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
