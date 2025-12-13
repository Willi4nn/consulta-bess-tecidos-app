import PropTypes from 'prop-types';
import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    const { hasError, error } = this.state;
    const { children, showDetails } = this.props;

    if (!hasError) return children;

    return (
      <div className="error-boundary">
        <div className="error-boundary-card">
          <h1>Algo deu errado</h1>
          <p>Ocorreu um erro inesperado. Tente recarregar a página.</p>
          {showDetails && error && (
            <details className="error-boundary-details">
              <summary>Detalhes do erro</summary>
              <pre>{error.toString()}</pre>
            </details>
          )}
          <button className="btn btn-primary" onClick={this.handleReset}>
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  showDetails: PropTypes.bool,
};

ErrorBoundary.defaultProps = {
  showDetails: import.meta.env.DEV,
};

export default ErrorBoundary;
