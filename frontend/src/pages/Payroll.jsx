import { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Row, Col, Badge } from 'react-bootstrap';
import LoadingSpinner from '../components/common/LoadingSpinner';
import AlertMessage from '../components/common/AlertMessage';
import { useAuth } from '../context/AuthContext';
import { payrollApi, employeeApi } from '../api/services';
import { formatCurrency, MONTHS, getErrorMessage } from '../utils/helpers';

export default function Payroll() {
  const { user } = useAuth();
  const [payrolls, setPayrolls] = useState([]);
  const [payslips, setPayslips] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    employeeId: '', month: new Date().getMonth() + 1, year: new Date().getFullYear(), basicSalary: '',
  });

  const isEmployee = user.role === 'EMPLOYEE';
  const employeeId = user.employeeId;
  const companyId = user.companyId;
  const canManage = ['ADMIN', 'COMPANY', 'HR'].includes(user.role);

  const load = async () => {
    setLoading(true);
    try {
      if (isEmployee && employeeId) {
        const [payData, slipData] = await Promise.all([
          payrollApi.getByEmployee(employeeId),
          payrollApi.getPayslips(employeeId),
        ]);
        setPayrolls(payData);
        setPayslips(slipData);
      } else if (canManage) {
        const data = await payrollApi.getByMonthYear(form.month, form.year);
        setPayrolls(data);
        if (companyId) {
          const empData = await employeeApi.getByCompany(companyId, { page: 0, size: 100 });
          setEmployees(empData.content || empData);
        }
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [employeeId, companyId]);

  const handleCreate = async () => {
    try {
      await payrollApi.create({
        employeeId: Number(form.employeeId),
        month: Number(form.month),
        year: Number(form.year),
        basicSalary: Number(form.basicSalary),
      });
      setShowModal(false);
      load();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleGeneratePayslip = async (payrollId) => {
    try {
      await payrollApi.generatePayslip(payrollId);
      load();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const downloadPayslip = (payslipNumber) => {
    const token = localStorage.getItem('token');
    window.open(`${payrollApi.downloadPayslip(payslipNumber)}?token=${token}`, '_blank');
  };

  const empList = Array.isArray(employees) ? employees : employees.content || [];

  return (
    <div>
      <div className="page-header d-flex justify-content-between align-items-start">
        <div>
          <h1>Payroll</h1>
          <p>{isEmployee ? 'View your salary and payslips' : 'Process employee payroll'}</p>
        </div>
        {canManage && companyId && (
          <Button variant="primary" onClick={() => setShowModal(true)}>+ Create Payroll</Button>
        )}
      </div>

      <AlertMessage variant="danger" message={error} onClose={() => setError('')} />

      {loading ? <LoadingSpinner /> : (
        <>
          <div className="content-card mb-4">
            <div className="card-header">Payroll Records</div>
            <Table hover className="mb-0">
              <thead>
                <tr>
                  {!isEmployee && <th>Employee</th>}
                  <th>Month</th>
                  <th>Year</th>
                  <th>Basic</th>
                  <th>Gross</th>
                  <th>Net</th>
                  <th>Status</th>
                  {canManage && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {payrolls.map((p) => (
                  <tr key={p.id}>
                    {!isEmployee && <td>{p.employeeName}</td>}
                    <td>{MONTHS[p.month - 1]}</td>
                    <td>{p.year}</td>
                    <td>{formatCurrency(p.basicSalary)}</td>
                    <td>{formatCurrency(p.grossSalary)}</td>
                    <td>{formatCurrency(p.netSalary)}</td>
                    <td><Badge bg={p.status === 'PAID' ? 'success' : 'warning'}>{p.status}</Badge></td>
                    {canManage && (
                      <td>
                        <Button size="sm" variant="outline-primary" onClick={() => handleGeneratePayslip(p.id)}>
                          Generate Payslip
                        </Button>
                      </td>
                    )}
                  </tr>
                ))}
                {payrolls.length === 0 && (
                  <tr><td colSpan={canManage ? 8 : 6} className="text-center text-muted py-4">No payroll records</td></tr>
                )}
              </tbody>
            </Table>
          </div>

          {(isEmployee || payslips.length > 0) && (
            <div className="content-card">
              <div className="card-header">Payslips</div>
              <Table hover className="mb-0">
                <thead>
                  <tr>
                    <th>Number</th>
                    <th>Month</th>
                    <th>Year</th>
                    <th>Generated</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {payslips.map((s) => (
                    <tr key={s.id}>
                      <td>{s.payslipNumber}</td>
                      <td>{MONTHS[s.month - 1]}</td>
                      <td>{s.year}</td>
                      <td>{new Date(s.generatedAt).toLocaleDateString()}</td>
                      <td>
                        <Button size="sm" variant="outline-primary" onClick={() => downloadPayslip(s.payslipNumber)}>
                          Download PDF
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {payslips.length === 0 && (
                    <tr><td colSpan={5} className="text-center text-muted py-4">No payslips</td></tr>
                  )}
                </tbody>
              </Table>
            </div>
          )}
        </>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton><Modal.Title>Create Payroll</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-2">
            <Form.Label>Employee *</Form.Label>
            <Form.Select value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })}>
              <option value="">Select employee</option>
              {empList.map((e) => (
                <option key={e.id} value={e.id}>{e.firstName} {e.lastName}</option>
              ))}
            </Form.Select>
          </Form.Group>
          <Row>
            <Col md={4}>
              <Form.Group className="mb-2">
                <Form.Label>Month</Form.Label>
                <Form.Select value={form.month} onChange={(e) => setForm({ ...form, month: e.target.value })}>
                  {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-2">
                <Form.Label>Year</Form.Label>
                <Form.Control type="number" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-2">
                <Form.Label>Basic Salary *</Form.Label>
                <Form.Control type="number" value={form.basicSalary} onChange={(e) => setForm({ ...form, basicSalary: e.target.value })} />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleCreate}>Create</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
