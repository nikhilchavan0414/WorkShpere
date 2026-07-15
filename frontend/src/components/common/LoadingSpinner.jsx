import Spinner from 'react-bootstrap/Spinner';

export default function LoadingSpinner({ fullPage = false, text = 'Loading...' }) {
  if (fullPage) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-muted">{text}</p>
      </div>
    );
  }

  return (
    <div className="text-center py-5">
      <Spinner animation="border" variant="primary" size="sm" />
      <span className="ms-2 text-muted">{text}</span>
    </div>
  );
}
