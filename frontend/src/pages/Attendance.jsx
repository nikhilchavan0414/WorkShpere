import { useEffect, useState } from 'react';
import { Table, Button, Badge, Form } from 'react-bootstrap';
import LoadingSpinner from '../components/common/LoadingSpinner';
import AlertMessage from '../components/common/AlertMessage';
import { useAuth } from '../context/AuthContext';
import { attendanceApi } from '../api/services';
import { formatDate, formatTime, getErrorMessage } from '../utils/helpers';

export default function Attendance() {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const isEmployee = user.role === 'EMPLOYEE';
  const employeeId = user.employeeId;
  const companyId = user.companyId;

  const load = async () => {
    setLoading(true);
    try {
      if (isEmployee && employeeId) {
        const data = await attendanceApi.getByEmployee(employeeId, { month, year });
        setRecords(data);
      } else if (companyId) {
        const data = await attendanceApi.getByCompany(companyId, { month, year });
        setRecords(data);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [employeeId, companyId, month, year]);

  const handleCheckIn = async () => {
    try {
      await attendanceApi.checkIn(employeeId);
      setSuccess('Checked in successfully');
      load();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleCheckOut = async () => {
    try {
      await attendanceApi.checkOut(employeeId);
      setSuccess('Checked out successfully');
      load();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const statusColor = { PRESENT: 'success', ABSENT: 'danger', LATE: 'warning', HALF_DAY: 'info', ON_LEAVE: 'secondary' };

  return (
    <div>
      <div className="page-header d-flex justify-content-between align-items-start">
        <div>
          <h1>Attendance</h1>
          <p>{isEmployee ? 'Track your daily attendance' : 'View company attendance records'}</p>
        </div>
        {isEmployee && employeeId && (
          <div className="d-flex gap-2">
            <Button variant="success" onClick={handleCheckIn}>Check In</Button>
            <Button variant="warning" onClick={handleCheckOut}>Check Out</Button>
          </div>
        )}
      </div>

      <AlertMessage variant="danger" message={error} onClose={() => setError('')} />
      <AlertMessage variant="success" message={success} onClose={() => setSuccess('')} />

      <div className="d-flex gap-2 mb-3">
        <Form.Select style={{ maxWidth: 140 }} value={month} onChange={(e) => setMonth(Number(e.target.value))}>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>{new Date(2000, i).toLocaleString('default', { month: 'long' })}</option>
          ))}
        </Form.Select>
        <Form.Control
          type="number"
          style={{ maxWidth: 100 }}
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
        />
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="content-card">
          <Table hover className="mb-0">
            <thead>
              <tr>
                {!isEmployee && <th>Employee</th>}
                <th>Date</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Hours</th>
                <th>Status</th>
                <th>Late</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r.id}>
                  {!isEmployee && <td>{r.employeeName}</td>}
                  <td>{formatDate(r.attendanceDate)}</td>
                  <td>{formatTime(r.checkIn)}</td>
                  <td>{formatTime(r.checkOut)}</td>
                  <td>{r.workingHours ?? '-'}</td>
                  <td><Badge bg={statusColor[r.status] || 'secondary'}>{r.status}</Badge></td>
                  <td>{r.lateEntry ? 'Yes' : 'No'}</td>
                </tr>
              ))}
              {records.length === 0 && (
                <tr><td colSpan={isEmployee ? 6 : 7} className="text-center text-muted py-4">No attendance records</td></tr>
              )}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
}
