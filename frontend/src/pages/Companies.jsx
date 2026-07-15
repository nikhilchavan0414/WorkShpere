import { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Badge } from 'react-bootstrap';
import LoadingSpinner from '../components/common/LoadingSpinner';
import AlertMessage from '../components/common/AlertMessage';
import { companyApi } from '../api/services';
import { formatDate, getErrorMessage } from '../utils/helpers';

export default function Companies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', city: '', state: '', country: 'India' });

  const load = () => {
    setLoading(true);
    companyApi.getAll()
      .then(setCompanies)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openEdit = (company) => {
    setEditId(company.id);
    setForm({
      name: company.name,
      email: company.email,
      phone: company.phone || '',
      city: company.city || '',
      state: company.state || '',
      country: company.country || 'India',
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      await companyApi.update(editId, form);
      setShowModal(false);
      load();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deactivate this company?')) return;
    try {
      await companyApi.delete(id);
      load();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="page-header">
        <h1>Companies</h1>
        <p>Manage registered organizations</p>
      </div>

      <AlertMessage variant="danger" message={error} onClose={() => setError('')} />

      <div className="content-card">
        <div className="table-responsive">
          <Table hover className="mb-0">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>City</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((c) => (
                <tr key={c.id}>
                  <td><strong>{c.name}</strong></td>
                  <td>{c.email}</td>
                  <td>{c.phone || '-'}</td>
                  <td>{c.city || '-'}</td>
                  <td><Badge bg={c.active ? 'success' : 'secondary'}>{c.active ? 'Active' : 'Inactive'}</Badge></td>
                  <td>{formatDate(c.createdAt)}</td>
                  <td>
                    <Button size="sm" variant="outline-primary" className="me-1" onClick={() => openEdit(c)}>Edit</Button>
                    <Button size="sm" variant="outline-danger" onClick={() => handleDelete(c.id)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton><Modal.Title>Edit Company</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-2">
            <Form.Label>Name</Form.Label>
            <Form.Control value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Email</Form.Label>
            <Form.Control value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Phone</Form.Label>
            <Form.Control value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>Save</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
