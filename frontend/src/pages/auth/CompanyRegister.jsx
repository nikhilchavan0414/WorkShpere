import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import AlertMessage from '../../components/common/AlertMessage';
import { companyApi } from '../../api/services';
import { getErrorMessage } from '../../utils/helpers';
import bgImage from "../../assets/loginnn.png";

const initialForm = {
  name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  country: 'India',
  pincode: '',
  website: '',
  username: '',
  password: '',
};

export default function CompanyRegister() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const update = (field, value) => setForm({ ...form, [field]: value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await companyApi.register(form);
      setSuccess('Company registered successfully! You can now login.');
      setTimeout(() => navigate('/login'), 2500);
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
      <div className="auth-card" style={{ maxWidth: 560 }}>
        <div className="auth-brand">
          {/* <div className="auth-logo">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2C8.686 2 6 4.686 6 8c0 3.314 2.686 6 6 6s6-2.686 6-6c0-3.314-2.686-6-6-6zm0 10c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4zm0 2c-3.33 0-10 1.668-10 5v1h20v-1c0-3.332-6.67-5-10-5z" fill="currentColor" />
            </svg>
          </div> */}
          <h1>Register Company</h1>
          <p>Create your organization account</p>
        </div>

        <AlertMessage variant="danger" message={error} onClose={() => setError('')} />
        <AlertMessage variant="success" message={success} />

        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Company Name *</Form.Label>
                <Form.Control value={form.name} onChange={(e) => update('name', e.target.value)} required />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Email *</Form.Label>
                <Form.Control type="email" value={form.email} onChange={(e) => update('email', e.target.value)} required />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Username *</Form.Label>
                <Form.Control value={form.username} onChange={(e) => update('username', e.target.value)} required />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Password *</Form.Label>
                <Form.Control type="password" value={form.password} onChange={(e) => update('password', e.target.value)} required minLength={6} />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Phone</Form.Label>
                <Form.Control value={form.phone} onChange={(e) => update('phone', e.target.value)} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Website</Form.Label>
                <Form.Control value={form.website} onChange={(e) => update('website', e.target.value)} />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-3">
            <Form.Label>Address</Form.Label>
            <Form.Control value={form.address} onChange={(e) => update('address', e.target.value)} />
          </Form.Group>
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>City</Form.Label>
                <Form.Control value={form.city} onChange={(e) => update('city', e.target.value)} />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>State</Form.Label>
                <Form.Control value={form.state} onChange={(e) => update('state', e.target.value)} />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Pincode</Form.Label>
                <Form.Control value={form.pincode} onChange={(e) => update('pincode', e.target.value)} />
              </Form.Group>
            </Col>
          </Row>
          <Button type="submit" variant="primary" className="w-100 mb-3" disabled={loading}>
            {loading ? 'Registering...' : 'Register Company'}
          </Button>
        </Form>

        <div className="text-center small">
          <Link to="/login">Already have an account? Sign in</Link>
        </div>
      </div>
    </div>
  );
}
