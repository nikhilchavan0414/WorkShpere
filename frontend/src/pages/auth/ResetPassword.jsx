import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import AlertMessage from '../../components/common/AlertMessage';
import { authApi } from '../../api/services';
import { getErrorMessage } from '../../utils/helpers';
import bgImage from "../../assets/loginnn.png";

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    token: location.state?.token || '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.newPassword !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await authApi.resetPassword({ token: form.token, newPassword: form.newPassword });
      setSuccess('Password reset successful. You can now login.');
      setTimeout(() => navigate('/login'), 2000);
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
          <h1>Reset Password</h1>
          <p>Enter your reset token and new password</p>
        </div>

        <AlertMessage variant="danger" message={error} onClose={() => setError('')} />
        <AlertMessage variant="success" message={success} />

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Reset Token</Form.Label>
            <Form.Control
              value={form.token}
              onChange={(e) => setForm({ ...form, token: e.target.value })}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="password"
              value={form.newPassword}
              onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
              required
              minLength={6}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              required
            />
          </Form.Group>
          <Button type="submit" variant="primary" className="w-100 mb-3" disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </Button>
        </Form>

        <div className="text-center small">
          <Link to="/login">Back to login</Link>
        </div>
      </div>
    </div>
  );
}
