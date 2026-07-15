import { useEffect, useState } from 'react';
import { Row, Col, Card, ListGroup, Badge } from 'react-bootstrap';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import StatCard from '../components/common/StatCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import AlertMessage from '../components/common/AlertMessage';
import { useAuth } from '../context/AuthContext';
import { dashboardApi } from '../api/services';
import { formatCurrency, formatDate, getErrorMessage } from '../utils/helpers';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardApi.get()
      .then(setData)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <AlertMessage variant="danger" message={error} />;

  const isAdmin = user.role === 'ADMIN';
  const isEmployee = user.role === 'EMPLOYEE';

  const attendanceChartData = {
    labels: data.attendanceChart?.map((d) => d.label?.slice(5)) || [],
    datasets: [{
      label: 'Attendance',
      data: data.attendanceChart?.map((d) => d.value) || [],
      backgroundColor: '#2563eb',
      borderRadius: 4,
    }],
  };

  const leaveChartData = {
    labels: data.leaveChart?.map((d) => d.label) || [],
    datasets: [{
      data: data.leaveChart?.map((d) => d.value) || [],
      backgroundColor: ['#f59e0b', '#22c55e', '#ef4444'],
    }],
  };

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Overview for {user.role.toLowerCase()} role</p>
      </div>

      {!isEmployee &&  (
        <Row className="g-3 mb-4">
          {isAdmin && (
            <Col md={6} lg={3}>
              <StatCard label="Companies" value={data.totalCompanies} icon="🏢" color="primary" />
            </Col>
          )}
          <Col md={6} lg={3}>
            <StatCard label="Employees" value={data.totalEmployees} icon="👥" color="success" />
          </Col>
          <Col md={6} lg={3}>
            <StatCard label="Today's Attendance" value={data.todayAttendance} icon="🕐" color="info" />
          </Col>
          <Col md={6} lg={3}>
            <StatCard label="Pending Leaves" value={data.pendingLeaveRequests} icon="📅" color="warning" />
          </Col>
          {!isAdmin && (
            <>
              <Col md={6} lg={3}>
                <StatCard label="Departments" value={data.totalDepartments} icon="🏛️" color="primary" />
              </Col>
              <Col md={6} lg={3}>
                <StatCard label="HR Managers" value={data.totalHr} icon="🧑‍💼" color="info" />
              </Col>
            </>
          )}
          {data.monthlyPayroll != null && (
            <Col md={6} lg={3}>
              <StatCard label="Monthly Payroll" value={formatCurrency(data.monthlyPayroll)} icon="💰" color="success" />
            </Col>
          )}
        </Row>
      )}

      <Row className="g-3">
        {data.attendanceChart?.length > 0 && (
          <Col lg={7}>
            <Card className="content-card h-100">
              <Card.Header>Attendance (Last 7 Days)</Card.Header>
              <Card.Body>
                <Bar data={attendanceChartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
              </Card.Body>
            </Card>
          </Col>
        )}
        {data.leaveChart?.length > 0 && (
          <Col lg={5}>
            <Card className="content-card h-100">
              <Card.Header>Leave Status</Card.Header>
              <Card.Body className="d-flex justify-content-center">
                <div style={{ maxWidth: 260 }}>
                  <Doughnut data={leaveChartData} />
                </div>
              </Card.Body>
            </Card>
          </Col>
        )}
        {data.upcomingHolidays?.length > 0 && (
          <Col md={6}>
            <Card className="content-card">
              <Card.Header>Upcoming Holidays</Card.Header>
              <ListGroup variant="flush">
                {data.upcomingHolidays.map((h) => (
                  <ListGroup.Item key={h.id} className="d-flex justify-content-between">
                    <span>{h.name}</span>
                    <Badge bg="primary">{formatDate(h.holidayDate)}</Badge>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card>
          </Col>
        )}
        {data.recentNotifications?.length > 0 && (
          <Col md={6}>
            <Card className="content-card">
              <Card.Header>Recent Notifications</Card.Header>
              <ListGroup variant="flush">
                {data.recentNotifications.map((n) => (
                  <ListGroup.Item key={n.id}>
                    <strong>{n.title}</strong>
                    <div className="small text-muted">{n.message}</div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card>
          </Col>
        )}
      </Row>
    </div>
  );
}
