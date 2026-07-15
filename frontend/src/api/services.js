import api from './axios';

const unwrap = (res) => res.data.data;

export const authApi = {
  login: (data) => api.post('/auth/login', data).then(unwrap),
  register: (data) => api.post('/auth/register', data).then(unwrap),
  changePassword: (data) => api.post('/auth/change-password', data).then(unwrap),
  forgotPassword: (data) => api.post('/auth/forgot-password', data).then(unwrap),
  resetPassword: (data) => api.post('/auth/reset-password', data).then(unwrap),
};

export const dashboardApi = {
  get: () => api.get('/dashboard').then(unwrap),
};

export const notificationApi = {
  getAll: () => api.get('/notifications').then(unwrap),
  markRead: (id) => api.put(`/notifications/${id}/read`).then(unwrap),
};

export const companyApi = {
  register: (data) => api.post('/companies/register', data).then(unwrap),
  getAll: () => api.get('/companies').then(unwrap),
  getById: (id) => api.get(`/companies/${id}`).then(unwrap),
  update: (id, data) => api.put(`/companies/${id}`, data).then(unwrap),
  delete: (id) => api.delete(`/companies/${id}`).then(unwrap),
};

export const hrApi = {
  createManager: (data) => api.post('/hr/managers', data).then(unwrap),
  getManagers: () => api.get('/hr/managers').then(unwrap),
  getManagersByCompany: (companyId) => api.get(`/hr/managers/company/${companyId}`).then(unwrap),
  deleteManager: (id) => api.delete(`/hr/managers/${id}`).then(unwrap),
  createDepartment: (data) => api.post('/hr/departments', data).then(unwrap),
  getDepartments: (companyId) => api.get(`/hr/departments/company/${companyId}`).then(unwrap),
  updateDepartment: (id, data) => api.put(`/hr/departments/${id}`, data).then(unwrap),
  deleteDepartment: (id) => api.delete(`/hr/departments/${id}`).then(unwrap),
  createDesignation: (data) => api.post('/hr/designations', data).then(unwrap),
  getDesignations: (companyId) => api.get(`/hr/designations/company/${companyId}`).then(unwrap),
  updateDesignation: (id, data) => api.put(`/hr/designations/${id}`, data).then(unwrap),
  deleteDesignation: (id) => api.delete(`/hr/designations/${id}`).then(unwrap),
};

export const employeeApi = {
  create: (data) => api.post('/employees', data).then(unwrap),
  getAll: () => api.get('/employees').then(unwrap),
  getByCompany: (companyId, params) => api.get(`/employees/company/${companyId}`, { params }).then(unwrap),
  getById: (id) => api.get(`/employees/${id}`).then(unwrap),
  getProfile: (userId) => api.get('/employees/profile/me', { params: { userId } }).then(unwrap),
  update: (id, data) => api.put(`/employees/${id}`, data).then(unwrap),
  delete: (id) => api.delete(`/employees/${id}`).then(unwrap),
};

export const attendanceApi = {
  checkIn: (employeeId) => api.post(`/attendance/check-in/${employeeId}`).then(unwrap),
  checkOut: (employeeId) => api.post(`/attendance/check-out/${employeeId}`).then(unwrap),
  getByEmployee: (employeeId, params) => api.get(`/attendance/employee/${employeeId}`, { params }).then(unwrap),
  getByCompany: (companyId, params) => api.get(`/attendance/company/${companyId}`, { params }).then(unwrap),
};

export const leaveApi = {
  apply: (data) => api.post('/leaves/apply', data).then(unwrap),
  approve: (id) => api.put(`/leaves/${id}/approve`).then(unwrap),
  reject: (id, reason) => api.put(`/leaves/${id}/reject`, { reason }).then(unwrap),
  getByEmployee: (employeeId) => api.get(`/leaves/employee/${employeeId}`).then(unwrap),
  getByCompany: (companyId) => api.get(`/leaves/company/${companyId}`).then(unwrap),
  getPending: () => api.get('/leaves/pending').then(unwrap),
  getBalance: (employeeId, year) => api.get(`/leaves/balance/${employeeId}`, { params: { year } }).then(unwrap),
};

export const payrollApi = {
  create: (data) => api.post('/payroll', data).then(unwrap),
  generatePayslip: (payrollId) => api.post(`/payroll/${payrollId}/payslip`).then(unwrap),
  getByEmployee: (employeeId) => api.get(`/payroll/employee/${employeeId}`).then(unwrap),
  getPayslips: (employeeId) => api.get(`/payroll/payslips/employee/${employeeId}`).then(unwrap),
  getByMonthYear: (month, year) => api.get(`/payroll/month/${month}/year/${year}`).then(unwrap),
  downloadPayslip: (payslipNumber) => `/api/payroll/payslip/download/${payslipNumber}`,
};

export const holidayApi = {
  create: (data) => api.post('/holidays', data).then(unwrap),
  getByCompany: (companyId) => api.get(`/holidays/company/${companyId}`).then(unwrap),
  getUpcoming: (companyId) => api.get(`/holidays/company/${companyId}/upcoming`).then(unwrap),
  update: (id, data) => api.put(`/holidays/${id}`, data).then(unwrap),
  delete: (id) => api.delete(`/holidays/${id}`).then(unwrap),
};
