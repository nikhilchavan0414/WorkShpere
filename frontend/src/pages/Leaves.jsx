import { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Row, Col, Badge, Card } from 'react-bootstrap';
import LoadingSpinner from '../components/common/LoadingSpinner';
import AlertMessage from '../components/common/AlertMessage';
import { useAuth } from '../context/AuthContext';
import { leaveApi } from '../api/services';
import { formatDate, LEAVE_TYPES, getErrorMessage } from '../utils/helpers';

export default function Leaves() {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ leaveType: 'CASUAL', startDate: '', endDate: '', reason: '' });

  const isEmployee = user.role === 'EMPLOYEE';
  const canApprove = ['ADMIN', 'COMPANY', 'HR'].includes(user.role);
  const employeeId = user.employeeId;
  const companyId = user.companyId;

  const load = async () => {
    setLoading(true);
    try {
      if (isEmployee && employeeId) {
        const [leaveData, balanceData] = await Promise.all([
          leaveApi.getByEmployee(employeeId),
          leaveApi.getBalance(employeeId, new Date().getFullYear()),
        ]);
        setLeaves(leaveData);
        setBalances(balanceData);
      } else if (canApprove) {
        const data = companyId
          ? await leaveApi.getByCompany(companyId)
          : await leaveApi.getPending();
        setLeaves(data);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [employeeId, companyId]);

  const handleApply = async () => {
    try {
      await leaveApi.apply({ ...form, employeeId });
      setShowModal(false);
      setForm({ leaveType: 'CASUAL', startDate: '', endDate: '', reason: '' });
      load();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleApprove = async (id) => {
    try {
      await leaveApi.approve(id);
      load();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt('Rejection reason:');
    if (!reason) return;
    try {
      await leaveApi.reject(id, reason);
      load();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const statusColor = { PENDING: 'warning', APPROVED: 'success', REJECTED: 'danger', CANCELLED: 'secondary' };

  return (
    <div>
      <div className="page-header d-flex justify-content-between align-items-start">
        <div>
          <h1>Leave Management</h1>
          <p>{isEmployee ? 'Apply and track your leaves' : 'Review and approve leave requests'}</p>
        </div>
        {isEmployee && (
          <Button variant="primary" onClick={() => setShowModal(true)}>Apply Leave</Button>
        )}
      </div>

      <AlertMessage variant="danger" message={error} onClose={() => setError('')} />

      {balances.length > 0 && (
        <Row className="g-3 mb-4">
          {balances.map((b) => (
            <Col md={4} lg={2} key={b.id}>
              <Card className="stat-card text-center">
                <Card.Body className="py-3">
                  <div className="small text-muted">{b.leaveType}</div>
                  <div className="fw-bold">{b.remainingDays}/{b.totalDays}</div>
                  <div className="small">remaining</div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {loading ? <LoadingSpinner /> : (
        <div className="content-card">
          <Table hover className="mb-0">
            <thead>
              <tr>
                {!isEmployee && <th>Employee</th>}
                <th>Type</th>
                <th>From</th>
                <th>To</th>
                <th>Days</th>
                <th>Reason</th>
                <th>Status</th>
                {canApprove && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {leaves.map((l) => (
                <tr key={l.id}>
                  {!isEmployee && <td>{l.employeeName}</td>}
                  <td>{l.leaveType}</td>
                  <td>{formatDate(l.startDate)}</td>
                  <td>{formatDate(l.endDate)}</td>
                  <td>{l.totalDays}</td>
                  <td>{l.reason || '-'}</td>
                  <td><Badge bg={statusColor[l.status]}>{l.status}</Badge></td>
                  {canApprove && (
                    <td>
                      {l.status === 'PENDING' && (
                        <>
                          <Button size="sm" variant="success" className="me-1" onClick={() => handleApprove(l.id)}>Approve</Button>
                          <Button size="sm" variant="danger" onClick={() => handleReject(l.id)}>Reject</Button>
                        </>
                      )}
                    </td>
                  )}
                </tr>
              ))}
              {leaves.length === 0 && (
                <tr><td colSpan={canApprove ? 8 : 6} className="text-center text-muted py-4">No leave records</td></tr>
              )}
            </tbody>
          </Table>
        </div>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton><Modal.Title>Apply Leave</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-2">
            <Form.Label>Leave Type</Form.Label>
            <Form.Select value={form.leaveType} onChange={(e) => setForm({ ...form, leaveType: e.target.value })}>
              {LEAVE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </Form.Select>
          </Form.Group>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-2">
                <Form.Label>Start Date</Form.Label>
                <Form.Control type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-2">
                <Form.Label>End Date</Form.Label>
                <Form.Control type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-2">
            <Form.Label>Reason</Form.Label>
            <Form.Control as="textarea" rows={2} value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleApply}>Submit</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
