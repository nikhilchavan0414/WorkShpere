import Alert from 'react-bootstrap/Alert';

export default function AlertMessage({ variant, message, onClose }) {
  if (!message) return null;
  return (
    <Alert variant={variant} dismissible={!!onClose} onClose={onClose} className="mb-3">
      {message}
    </Alert>
  );
}
