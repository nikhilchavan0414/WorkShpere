import { useEffect, useState } from 'react';
import { Card, Form, Button, Row, Col, Badge } from 'react-bootstrap';
import LoadingSpinner from '../components/common/LoadingSpinner';
import AlertMessage from '../components/common/AlertMessage';
import { useAuth } from '../context/AuthContext';
import { employeeApi } from '../api/services';
import { formatCurrency, formatDate, getErrorMessage } from '../utils/helpers';

export default function Profile() {
  const { user, refreshContext } = useAuth();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    employeeApi.getProfile(user.userId)
      .then((data) => {
        setProfile(data);
        setForm({
          phone: data.phone || '',
          address: data.address || '',
          experience: data.experience || '',
          qualification: data.qualification || '',
          bankName: data.bankName || '',
          bankAccountNumber: data.bankAccountNumber || '',
          bankIfsc: data.bankIfsc || '',
          emergencyContactName: data.emergencyContactName || '',
          emergencyContactPhone: data.emergencyContactPhone || '',
        });
      })
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [user.userId]);

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);
    try {
      await employeeApi.update(profile.id, {
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        companyId: profile.companyId,
        departmentId: profile.departmentId,
        designationId: profile.designationId,
        ...form,
      });
      setSuccess('Profile updated successfully');
      await refreshContext();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!profile) return <AlertMessage variant="danger" message={error || 'Profile not found'} />;

  return (
    <div>
      <div className="page-header">
        <h1>My Profile</h1>
        <p>View and update your personal information</p>
      </div>

      <AlertMessage variant="danger" message={error} onClose={() => setError('')} />
      <AlertMessage variant="success" message={success} onClose={() => setSuccess('')} />

      <Row className="g-3">
        <Col lg={4}>
          <Card className="content-card h-100">
            <Card.Header>Employee Details</Card.Header>
            <Card.Body>
              <h5 className="mb-1">{profile.firstName} {profile.lastName}</h5>
              <p className="text-muted mb-3">{profile.email}</p>
              <div className="small mb-2"><strong>Employee ID:</strong> {profile.employeeId}</div>
              <div className="small mb-2"><strong>Company:</strong> {profile.companyName || '-'}</div>
              <div className="small mb-2"><strong>Department:</strong> {profile.departmentName || '-'}</div>
              <div className="small mb-2"><strong>Designation:</strong> {profile.designationTitle || '-'}</div>
              <div className="small mb-2"><strong>Salary:</strong> {formatCurrency(profile.salary)}</div>
              <div className="small mb-2"><strong>Joined:</strong> {formatDate(profile.joiningDate)}</div>
              <Badge bg={profile.active ? 'success' : 'secondary'}>{profile.active ? 'Active' : 'Inactive'}</Badge>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={8}>
          <Card className="content-card">
            <Card.Header>Editable Information</Card.Header>
            <Card.Body>
              <Form onSubmit={handleSave}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Phone</Form.Label>
                      <Form.Control value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Qualification</Form.Label>
                      <Form.Control value={form.qualification} onChange={(e) => setForm({ ...form, qualification: e.target.value })} />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-3">
                  <Form.Label>Address</Form.Label>
                  <Form.Control value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Experience</Form.Label>
                  <Form.Control value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} />
                </Form.Group>

                <h6 className="mt-4 mb-3">Bank Details</h6>
                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Bank Name</Form.Label>
                      <Form.Control value={form.bankName} onChange={(e) => setForm({ ...form, bankName: e.target.value })} />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Account Number</Form.Label>
                      <Form.Control value={form.bankAccountNumber} onChange={(e) => setForm({ ...form, bankAccountNumber: e.target.value })} />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>IFSC</Form.Label>
                      <Form.Control value={form.bankIfsc} onChange={(e) => setForm({ ...form, bankIfsc: e.target.value })} />
                    </Form.Group>
                  </Col>
                </Row>

                <h6 className="mt-2 mb-3">Emergency Contact</h6>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Contact Name</Form.Label>
                      <Form.Control value={form.emergencyContactName} onChange={(e) => setForm({ ...form, emergencyContactName: e.target.value })} />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Contact Phone</Form.Label>
                      <Form.Control value={form.emergencyContactPhone} onChange={(e) => setForm({ ...form, emergencyContactPhone: e.target.value })} />
                    </Form.Group>
                  </Col>
                </Row>

                <Button type="submit" variant="primary" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
