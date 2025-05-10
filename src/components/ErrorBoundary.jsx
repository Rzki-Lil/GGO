import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 m-4 text-white bg-red-900 border border-red-500 rounded-lg">
          <h2 className="mb-2 text-xl font-bold">Terjadi kesalahan</h2>
          <p className="mb-2">Silakan muat ulang halaman.</p>
          <details className="p-2 mt-2 text-sm bg-red-800 rounded">
            <summary className="cursor-pointer">Detail teknis</summary>
            <pre className="mt-2 overflow-auto text-xs whitespace-pre-wrap">
              {this.state.error && this.state.error.toString()}
            </pre>
            <pre className="mt-2 overflow-auto text-xs whitespace-pre-wrap">
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </pre>
          </details>
          <button
            className="px-4 py-2 mt-4 font-bold text-white bg-red-700 rounded hover:bg-red-600"
            onClick={() => window.location.reload()}
          >
            Muat Ulang
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
