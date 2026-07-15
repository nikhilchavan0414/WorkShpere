import { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Badge } from 'react-bootstrap';
import LoadingSpinner from '../components/common/LoadingSpinner';
import AlertMessage from '../components/common/AlertMessage';
import { useAuth } from '../context/AuthContext';
import { holidayApi, companyApi } from '../api/services';
import { formatDate, getErrorMessage } from '../utils/helpers';

export default function Holidays() {
  const { user } = useAuth();
  const [holidays, setHolidays] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState(user.companyId || '');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', holidayDate: '', description: '' });

  const isAdmin = user.role === 'ADMIN';
  const canManage = ['ADMIN', 'COMPANY', 'HR'].includes(user.role);
  const activeCompanyId = user.companyId || (selectedCompanyId ? Number(selectedCompanyId) : null);

  useEffect(() => {
    if (isAdmin) {
      companyApi.getAll().then(setCompanies).catch(() => {});
    }
  }, [isAdmin]);

  const load = async () => {
    if (!activeCompanyId) {
      setHolidays([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await holidayApi.getByCompany(activeCompanyId);
      setHolidays(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [activeCompanyId]);

  const openCreate = () => {
    setForm({ name: '', holidayDate: '', description: '' });
    setShowModal(true);
  };

  const handleCreate = async () => {
    try {
      await holidayApi.create({ ...form, companyId: activeCompanyId });
      setShowModal(false);
      load();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this holiday?')) return;
    try {
      await holidayApi.delete(id);
      load();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div>
      <div className="page-header d-flex justify-content-between align-items-start">
        <div>
          <h1>Holidays</h1>
          <p>{canManage ? 'Manage company holiday calendar' : 'View upcoming holidays'}</p>
        </div>
        {canManage && activeCompanyId && (
          <Button variant="primary" onClick={openCreate}>+ Add Holiday</Button>
        )}
      </div>

      <AlertMessage variant="danger" message={error} onClose={() => setError('')} />

      {isAdmin && (
        <Form.Select
          className="mb-3"
          style={{ maxWidth: 320 }}
          value={selectedCompanyId}
          onChange={(e) => setSelectedCompanyId(e.target.value)}
        >
          <option value="">Select company</option>
          {companies.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </Form.Select>
      )}

      {!activeCompanyId ? (
        <AlertMessage variant="info" message={isAdmin ? 'Select a company to view holidays.' : 'Company context not available. Please re-login.'} />
      ) : loading ? (
        <LoadingSpinner />
      ) : (
        <div className="content-card">
          <Table hover className="mb-0">
            <thead>
              <tr>
                <th>Name</th>
                <th>Date</th>
                <th>Description</th>
                {isAdmin && <th>Company</th>}
                {canManage && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {holidays.map((h) => (
                <tr key={h.id}>
                  <td><strong>{h.name}</strong></td>
                  <td><Badge bg="primary">{formatDate(h.holidayDate)}</Badge></td>
                  <td>{h.description || '-'}</td>
                  {isAdmin && <td>{h.companyName || '-'}</td>}
                  {canManage && (
                    <td>
                      <Button size="sm" variant="outline-danger" onClick={() => handleDelete(h.id)}>
                        Delete
                      </Button>
                    </td>
                  )}
                </tr>
              ))}
              {holidays.length === 0 && (
                <tr>
                  <td colSpan={canManage ? (isAdmin ? 5 : 4) : (isAdmin ? 4 : 3)} className="text-center text-muted py-4">
                    No holidays found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton><Modal.Title>Add Holiday</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-2">
            <Form.Label>Name *</Form.Label>
            <Form.Control value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Date *</Form.Label>
            <Form.Control type="date" value={form.holidayDate} onChange={(e) => setForm({ ...form, holidayDate: e.target.value })} />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
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
