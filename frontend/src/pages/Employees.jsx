import { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Row, Col, Badge } from 'react-bootstrap';
import LoadingSpinner from '../components/common/LoadingSpinner';
import AlertMessage from '../components/common/AlertMessage';
import { useAuth } from '../context/AuthContext';
import { employeeApi, hrApi } from '../api/services';
import { formatCurrency, GENDERS, getErrorMessage } from '../utils/helpers';

const emptyForm = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  phone: '',
  gender: 'MALE',
  dateOfBirth: '',
  address: '',
  departmentId: '',
  designationId: '',
  salary: '',
  joiningDate: '',
  experience: '',
  qualification: '',
  bankName: '',
  bankAccountNumber: '',
  bankIfsc: '',
  emergencyContactName: '',
  emergencyContactPhone: '',
  profilePicture: '',
};

export default function Employees() {

  const { user } = useAuth();

  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);

  const companyId = user.companyId;

  const load = async () => {

    setLoading(true);

    try {

      if (user.role === "ADMIN") {

        const data = await employeeApi.getAll();
        setEmployees(data);

      } else if (companyId) {

        const [empData, depts, desigs] = await Promise.all([
          employeeApi.getByCompany(companyId, {
            page,
            size: 20,
            search: search || undefined,
          }),
          hrApi.getDepartments(companyId),
          hrApi.getDesignations(companyId),
        ]);

        setEmployees(empData.content || empData);
        setDepartments(depts);
        setDesignations(desigs);
      }

    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [companyId, page, search]);

  const openCreate = () => {
    setForm({
      ...emptyForm,
      companyId,
    });
    setShowModal(true);
  };

 const handleCreate = async () => {
  try {

    await employeeApi.create({
      ...form,

      companyId,

      departmentId: form.departmentId
        ? Number(form.departmentId)
        : null,

      designationId: form.designationId
        ? Number(form.designationId)
        : null,

      salary: form.salary
        ? Number(form.salary)
        : 0,

      joiningDate: form.joiningDate || null,
      dateOfBirth: form.dateOfBirth || null,

      address: form.address,
      experience: form.experience,
      qualification: form.qualification,

      bankName: form.bankName,
      bankAccountNumber: form.bankAccountNumber,
      bankIfsc: form.bankIfsc,

      emergencyContactName: form.emergencyContactName,
      emergencyContactPhone: form.emergencyContactPhone,

      profilePicture: form.profilePicture,
    });

    setShowModal(false);
    setForm(emptyForm);
    load();

  } catch (err) {
    setError(getErrorMessage(err));
  }
};

  const handleDelete = async (id) => {

    if (!window.confirm("Deactivate this employee?")) return;

    try {

      await employeeApi.delete(id);

      load();

    } catch (err) {

      setError(getErrorMessage(err));

    }

  };

  const list =
    Array.isArray(employees)
      ? employees
      : employees.content || [];

  return (

    <div>

      <div className="page-header d-flex justify-content-between align-items-start">

        <div>
          <h1>Employees</h1>
          <p>Manage employee records</p>
        </div>

        {user.role !== "ADMIN" && companyId && (
          <Button onClick={openCreate}>
            + Add Employee
          </Button>
        )}

      </div>

      <AlertMessage
        variant="danger"
        message={error}
        onClose={() => setError("")}
      />

      {companyId && (

        <Form.Control

          className="mb-3"

          placeholder="Search Employees"

          value={search}

          onChange={(e) => {

            setSearch(e.target.value);

            setPage(0);

          }}

          style={{ maxWidth: 350 }}

        />

      )}

      {loading ? (

        <LoadingSpinner />

      ) : (

        <div className="content-card">

          <Table hover responsive>

            <thead>

              <tr>

                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Salary</th>
                <th>Status</th>
                <th>Action</th>

              </tr>

            </thead>

            <tbody>

              {list.map((emp) => (

                <tr key={emp.id}>

                  <td>{emp.employeeId}</td>

                  <td>
                    {emp.firstName} {emp.lastName}
                  </td>

                  <td>{emp.email}</td>

                  <td>{emp.departmentName || "-"}</td>

                  <td>{emp.designationTitle || "-"}</td>

                  <td>{formatCurrency(emp.salary)}</td>

                  <td>

                    <Badge bg={emp.active ? "success" : "secondary"}>

                      {emp.active ? "Active" : "Inactive"}

                    </Badge>

                  </td>

                  <td>

                    {user.role !== "ADMIN" && (

                      <Button

                        size="sm"

                        variant="outline-danger"

                        onClick={() => handleDelete(emp.id)}

                      >

                        Deactivate

                      </Button>

                    )}

                  </td>

                </tr>

              ))}

            </tbody>

          </Table>

        </div>

      )}

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="xl"
      >

        <Modal.Header closeButton>

          <Modal.Title>

            Add Employee

          </Modal.Title>

        </Modal.Header>

        <Modal.Body>
          {/* Personal Information */}
<Row>
  <Col md={6}>
    <Form.Group className="mb-3">
      <Form.Label>First Name *</Form.Label>
      <Form.Control
        value={form.firstName}
        onChange={(e) => setForm({ ...form, firstName: e.target.value })}
      />
    </Form.Group>
  </Col>

  <Col md={6}>
    <Form.Group className="mb-3">
      <Form.Label>Last Name *</Form.Label>
      <Form.Control
        value={form.lastName}
        onChange={(e) => setForm({ ...form, lastName: e.target.value })}
      />
    </Form.Group>
  </Col>
</Row>

<Row>
  <Col md={6}>
    <Form.Group className="mb-3">
      <Form.Label>Email *</Form.Label>
      <Form.Control
        type="email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
    </Form.Group>
  </Col>

  <Col md={6}>
    <Form.Group className="mb-3">
      <Form.Label>Password *</Form.Label>
      <Form.Control
        type="password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
    </Form.Group>
  </Col>
</Row>

<Row>
  <Col md={6}>
    <Form.Group className="mb-3">
      <Form.Label>Phone</Form.Label>
      <Form.Control
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
      />
    </Form.Group>
  </Col>

  <Col md={6}>
    <Form.Group className="mb-3">
      <Form.Label>Gender</Form.Label>
      <Form.Select
        value={form.gender}
        onChange={(e) => setForm({ ...form, gender: e.target.value })}
      >
        {GENDERS.map((g) => (
          <option key={g} value={g}>
            {g}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  </Col>
</Row>

<Row>
  <Col md={6}>
    <Form.Group className="mb-3">
      <Form.Label>Date of Birth</Form.Label>
      <Form.Control
        type="date"
        value={form.dateOfBirth}
        onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
      />
    </Form.Group>
  </Col>

  <Col md={6}>
    <Form.Group className="mb-3">
      <Form.Label>Joining Date</Form.Label>
      <Form.Control
        type="date"
        value={form.joiningDate}
        onChange={(e) => setForm({ ...form, joiningDate: e.target.value })}
      />
    </Form.Group>
  </Col>
</Row>

<Row>
  <Col md={12}>
    <Form.Group className="mb-3">
      <Form.Label>Address</Form.Label>
      <Form.Control
        as="textarea"
        rows={3}
        value={form.address}
        onChange={(e) => setForm({ ...form, address: e.target.value })}
      />
    </Form.Group>
  </Col>
</Row>

<hr />

<h5 className="mb-3">Job Details</h5>

<Row>
  <Col md={4}>
    <Form.Group className="mb-3">
      <Form.Label>Department</Form.Label>
      <Form.Select
        value={form.departmentId}
        onChange={(e) =>
          setForm({ ...form, departmentId: e.target.value })
        }
      >
        <option value="">Select Department</option>

        {departments.map((dept) => (
          <option key={dept.id} value={dept.id}>
            {dept.name}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  </Col>

  <Col md={4}>
    <Form.Group className="mb-3">
      <Form.Label>Designation</Form.Label>
      <Form.Select
        value={form.designationId}
        onChange={(e) =>
          setForm({ ...form, designationId: e.target.value })
        }
      >
        <option value="">Select Designation</option>

        {designations.map((desig) => (
          <option key={desig.id} value={desig.id}>
            {desig.title}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  </Col>

  <Col md={4}>
    <Form.Group className="mb-3">
      <Form.Label>Salary</Form.Label>
      <Form.Control
        type="number"
        value={form.salary}
        onChange={(e) => setForm({ ...form, salary: e.target.value })}
      />
    </Form.Group>
  </Col>
</Row>

<Row>
  <Col md={6}>
    <Form.Group className="mb-3">
      <Form.Label>Experience</Form.Label>
      <Form.Control
        placeholder="e.g. 3 Years"
        value={form.experience}
        onChange={(e) =>
          setForm({ ...form, experience: e.target.value })
        }
      />
    </Form.Group>
  </Col>

  <Col md={6}>
    <Form.Group className="mb-3">
      <Form.Label>Qualification</Form.Label>
      <Form.Control
        placeholder="e.g. B.Tech"
        value={form.qualification}
        onChange={(e) =>
          setForm({ ...form, qualification: e.target.value })
        }
      />
    </Form.Group>
  </Col>
</Row>

<hr />

<h5 className="mb-3">Bank Details</h5>

<Row>
  <Col md={4}>
    <Form.Group className="mb-3">
      <Form.Label>Bank Name</Form.Label>
      <Form.Control
        value={form.bankName}
        onChange={(e) =>
          setForm({ ...form, bankName: e.target.value })
        }
      />
    </Form.Group>
  </Col>

  <Col md={4}>
    <Form.Group className="mb-3">
      <Form.Label>Account Number</Form.Label>
      <Form.Control
        value={form.bankAccountNumber}
        onChange={(e) =>
          setForm({
            ...form,
            bankAccountNumber: e.target.value,
          })
        }
      />
    </Form.Group>
  </Col>

  <Col md={4}>
    <Form.Group className="mb-3">
      <Form.Label>IFSC Code</Form.Label>
      <Form.Control
        value={form.bankIfsc}
        onChange={(e) =>
          setForm({
            ...form,
            bankIfsc: e.target.value,
          })
        }
      />
    </Form.Group>
  </Col>
</Row>

<hr />

<h5 className="mb-3">Emergency Contact</h5>

<Row>
  <Col md={6}>
    <Form.Group className="mb-3">
      <Form.Label>Emergency Contact Name</Form.Label>
      <Form.Control
        value={form.emergencyContactName}
        onChange={(e) =>
          setForm({
            ...form,
            emergencyContactName: e.target.value,
          })
        }
      />
    </Form.Group>
  </Col>

  <Col md={6}>
    <Form.Group className="mb-3">
      <Form.Label>Emergency Contact Phone</Form.Label>
      <Form.Control
        value={form.emergencyContactPhone}
        onChange={(e) =>
          setForm({
            ...form,
            emergencyContactPhone: e.target.value,
          })
        }
      />
    </Form.Group>
  </Col>
</Row>

<Row>
  <Col md={12}>
    <Form.Group className="mb-3">
      <Form.Label>Profile Picture URL</Form.Label>
      <Form.Control
        value={form.profilePicture}
        onChange={(e) =>
          setForm({
            ...form,
            profilePicture: e.target.value,
          })
        }
      />
    </Form.Group>
  </Col>
</Row>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowModal(false)}
          >
            Cancel
          </Button>

          <Button
            variant="primary"
            onClick={handleCreate}
          >
            Create Employee
          </Button>
        </Modal.Footer>

      </Modal>

    </div>
  );
}