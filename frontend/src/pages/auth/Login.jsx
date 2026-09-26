import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import AlertMessage from '../../components/common/AlertMessage';
import { useAuth } from '../../context/AuthContext';
import { getErrorMessage } from '../../utils/helpers';
import bgImage from "../../assets/loginnn.png";

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form);
      navigate(from, { replace: true });
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
      <div className="auth-overlay"></div>  
      <div className="auth-card">
        <div className="auth-brand">
          <h1>WorkSphere</h1>
          <p>Human Resource Management System</p>
    
        </div>

        <AlertMessage variant="danger" message={error} onClose={() => setError('')} />

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
    <Form.Label>Username</Form.Label>
    <Form.Control
      type="text"
      placeholder="Enter your username"
      value={form.username}
      onChange={(e) => setForm({ ...form, username: e.target.value })}
      required
      autoFocus
    />
  </Form.Group>

  <Form.Group className="mb-3">
    <Form.Label>Password</Form.Label>
    <Form.Control
      type="password"
      placeholder="Enter your password"
      value={form.password}
      onChange={(e) => setForm({ ...form, password: e.target.value })}
      required
    />
  </Form.Group>
          <Button type="submit" variant="primary" className="w-100 mb-3" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </Form>

        <div className="text-center fs-5">
  <Link to="/forgot-password">Forgot password?</Link>
  <span className="mx-3">|</span>
  <Link to="/company-register">Register company</Link>
</div>
        {/* <div className="demo-box">
    <strong>Demo Credentials</strong>
    <br />
    Username: admin | Password: admin123
</div> */}
      </div>
    </div>
  );
}
