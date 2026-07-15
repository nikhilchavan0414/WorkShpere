import { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Tabs, Tab } from 'react-bootstrap';
import LoadingSpinner from '../components/common/LoadingSpinner';
import AlertMessage from '../components/common/AlertMessage';
import { useAuth } from '../context/AuthContext';
import { hrApi } from '../api/services';
import { getErrorMessage } from '../utils/helpers';

export default function Departments() {
  const { user } = useAuth();
  const companyId = user.companyId;
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeptModal, setShowDeptModal] = useState(false);
  const [showDesigModal, setShowDesigModal] = useState(false);
  const [deptForm, setDeptForm] = useState({ name: '', description: '' });
  const [desigForm, setDesigForm] = useState({ title: '', description: '' });

  const load = async () => {
    if (!companyId) { setLoading(false); return; }
    setLoading(true);
    try {
      const [depts, desigs] = await Promise.all([
        hrApi.getDepartments(companyId),
        hrApi.getDesignations(companyId),
      ]);
      setDepartments(depts);
      setDesignations(desigs);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [companyId]);

  const createDept = async () => {
    try {
      await hrApi.createDepartment({ ...deptForm, companyId });
      setShowDeptModal(false);
      setDeptForm({ name: '', description: '' });
      load();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const createDesig = async () => {
    try {
      await hrApi.createDesignation({ ...desigForm, companyId });
      setShowDesigModal(false);
      setDesigForm({ title: '', description: '' });
      load();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const deleteDept = async (id) => {
    if (!window.confirm('Delete this department?')) return;
    try {
      await hrApi.deleteDepartment(id);
      load();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const deleteDesig = async (id) => {
    if (!window.confirm('Delete this designation?')) return;
    try {
      await hrApi.deleteDesignation(id);
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
      <div className="page-header">
        <h1>Departments & Designations</h1>
        <p>Organize your company structure</p>
      </div>

      <AlertMessage variant="danger" message={error} onClose={() => setError('')} />

      <Tabs defaultActiveKey="departments" className="mb-3">
        <Tab eventKey="departments" title="Departments">
          <div className="d-flex justify-content-end mb-3">
            <Button variant="primary" size="sm" onClick={() => setShowDeptModal(true)}>+ Add Department</Button>
          </div>
          <div className="content-card">
            <Table hover className="mb-0">
              <thead><tr><th>Name</th><th>Description</th><th>Actions</th></tr></thead>
              <tbody>
                {departments.map((d) => (
                  <tr key={d.id}>
                    <td><strong>{d.name}</strong></td>
                    <td>{d.description || '-'}</td>
                    <td><Button size="sm" variant="outline-danger" onClick={() => deleteDept(d.id)}>Delete</Button></td>
                  </tr>
                ))}
                {departments.length === 0 && <tr><td colSpan={3} className="text-center text-muted py-3">No departments</td></tr>}
              </tbody>
            </Table>
          </div>
        </Tab>
        <Tab eventKey="designations" title="Designations">
          <div className="d-flex justify-content-end mb-3">
            <Button variant="primary" size="sm" onClick={() => setShowDesigModal(true)}>+ Add Designation</Button>
          </div>
          <div className="content-card">
            <Table hover className="mb-0">
              <thead><tr><th>Title</th><th>Description</th><th>Actions</th></tr></thead>
              <tbody>
                {designations.map((d) => (
                  <tr key={d.id}>
                    <td><strong>{d.title}</strong></td>
                    <td>{d.description || '-'}</td>
                    <td><Button size="sm" variant="outline-danger" onClick={() => deleteDesig(d.id)}>Delete</Button></td>
                  </tr>
                ))}
                {designations.length === 0 && <tr><td colSpan={3} className="text-center text-muted py-3">No designations</td></tr>}
              </tbody>
            </Table>
          </div>
        </Tab>
      </Tabs>

      <Modal show={showDeptModal} onHide={() => setShowDeptModal(false)}>
        <Modal.Header closeButton><Modal.Title>Add Department</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-2">
            <Form.Label>Name *</Form.Label>
            <Form.Control value={deptForm.name} onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })} />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Description</Form.Label>
            <Form.Control value={deptForm.description} onChange={(e) => setDeptForm({ ...deptForm, description: e.target.value })} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeptModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={createDept}>Create</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDesigModal} onHide={() => setShowDesigModal(false)}>
        <Modal.Header closeButton><Modal.Title>Add Designation</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-2">
            <Form.Label>Title *</Form.Label>
            <Form.Control value={desigForm.title} onChange={(e) => setDesigForm({ ...desigForm, title: e.target.value })} />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Description</Form.Label>
            <Form.Control value={desigForm.description} onChange={(e) => setDesigForm({ ...desigForm, description: e.target.value })} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDesigModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={createDesig}>Create</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
