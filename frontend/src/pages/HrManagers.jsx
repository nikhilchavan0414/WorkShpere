import { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Row, Col, Badge } from 'react-bootstrap';
import LoadingSpinner from '../components/common/LoadingSpinner';
import AlertMessage from '../components/common/AlertMessage';
import { useAuth } from '../context/AuthContext';
import { hrApi } from '../api/services';
import { formatDate, getErrorMessage } from '../utils/helpers';

export default function HrManagers() {
  const { user } = useAuth();
  const companyId = user.companyId;
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', username: '', password: '', hrCode: '',
  });

  const load = () => {
    if (!companyId) { setLoading(false); return; }
    setLoading(true);
    hrApi.getManagersByCompany(companyId)
      .then(setManagers)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(load, [companyId]);

  const handleCreate = async () => {
    try {
      await hrApi.createManager({ ...form, companyId });
      setShowModal(false);
      setForm({ firstName: '', lastName: '', email: '', phone: '', username: '', password: '', hrCode: ''  });
      load();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this HR manager?')) return;
    try {
      await hrApi.deleteManager(id);
      load();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  if (!companyId) {
    return <AlertMessage variant="warning" message="Company context not available. Please re-login." />;
  }

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="page-header d-flex justify-content-between align-items-start">
        <div>
          <h1>HR Managers</h1>
          <p>Manage HR staff for your company</p>
        </div>
        <Button variant="primary" onClick={() => setShowModal(true)}>+ Add HR Manager</Button>
      </div>

      <AlertMessage variant="danger" message={error} onClose={() => setError('')} />

      <div className="content-card">
        <Table hover className="mb-0">
          <thead>
            <tr>
              
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {managers.map((m) => (
              <tr key={m.id}>
                
                <td><strong>{m.firstName} {m.lastName}</strong></td>
                <td>{m.email}</td>
                <td>{m.phone || '-'}</td>
                <td><Badge bg={m.active ? 'success' : 'secondary'}>{m.active ? 'Active' : 'Inactive'}</Badge></td>
                <td><Button size="sm" variant="outline-danger" onClick={() => handleDelete(m.id)}>Remove</Button></td>
              </tr>
            ))}
            {managers.length === 0 && <tr><td colSpan={6} className="text-center text-muted py-4">No HR managers</td></tr>}
          </tbody>
        </Table>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton><Modal.Title>Add HR Manager</Modal.Title></Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-2">
                <Form.Label>First Name *</Form.Label>
                <Form.Control value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-2">
                <Form.Label>Last Name *</Form.Label>
                <Form.Control value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-2">
            <Form.Label>Email *</Form.Label>
            <Form.Control type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Phone *</Form.Label>
            <Form.Control type="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </Form.Group>
          
          <Row>
            <Col md={6}>
              <Form.Group className="mb-2">
                <Form.Label>Username *</Form.Label>
                <Form.Control value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-2">
                <Form.Label>Password *</Form.Label>
                <Form.Control type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-2">
            <Form.Label>HR Code *</Form.Label>
            <Form.Control type="text" value={form.hrCode} onChange={(e) => setForm({ ...form, hrCode: e.target.value })} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleCreate}>Create</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
