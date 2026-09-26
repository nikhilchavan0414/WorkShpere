import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import AlertMessage from '../../components/common/AlertMessage';
import { authApi } from '../../api/services';
import { getErrorMessage } from '../../utils/helpers';
import bgImage from "../../assets/loginnn.png";

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const resetToken = await authApi.forgotPassword({ email });
      setToken(resetToken);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="auth-page"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
      }}
    >
      <div className="auth-card">
        <div className="auth-brand">
          {/* <div className="auth-logo">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2C8.686 2 6 4.686 6 8c0 3.314 2.686 6 6 6s6-2.686 6-6c0-3.314-2.686-6-6-6zm0 10c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4zm0 2c-3.33 0-10 1.668-10 5v1h20v-1c0-3.332-6.67-5-10-5z" fill="currentColor" />
            </svg>
          </div> */}
          <h1>Forgot Password</h1>
          <p>Enter your email to get a reset token</p>
        </div>

        <AlertMessage variant="danger" message={error} onClose={() => setError('')} />

        {token ? (
          <div>
            <AlertMessage
              variant="success"
              message="Reset token generated. Use it on the reset password page."
            />
            <div className="p-3 bg-light rounded mb-3">
              <small className="text-muted d-block mb-1">Your reset token:</small>
              <code className="small">{token}</code>
            </div>
            <Button
              variant="primary"
              className="w-100"
              onClick={() => navigate('/reset-password', { state: { token } })}
            >
              Go to Reset Password
            </Button>
          </div>
        ) : (
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Button type="submit" variant="primary" className="w-100 mb-3" disabled={loading}>
              {loading ? 'Sending...' : 'Get Reset Token'}
            </Button>
          </Form>
        )}

        <div className="text-center small">
          <Link to="/login">Back to login</Link>
        </div>
      </div>
    </div>
  );
}
