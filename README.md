# HRMS — Human Resource Management System

Full-stack HR management application with role-based access for Admin, Company, HR, and Employee users.

## Tech Stack

| Layer | Stack |
|-------|-------|
| Backend | Java 17, Spring Boot 3.2, Spring Security, JWT, JPA, MySQL |
| Frontend | React 19, Vite, React Router, Bootstrap, Chart.js, Axios |
| Database | MySQL 8 |

## Prerequisites

- Java 17+
- Maven 3.8+
- Node.js 18+
- MySQL 8 running on `localhost:3306`

## Database Setup

```sql
CREATE DATABASE hrms_db;
```

Then run the schema script:

```bash
mysql -u root -p hrms_db < database/schema.sql
```

Or let Spring Boot auto-create tables (`spring.jpa.hibernate.ddl-auto=update`).

Default DB credentials in `backend/src/main/resources/application.properties`:
- URL: `jdbc:mysql://localhost:3306/hrms_db`
- Username: `root`
- Password: `root`

## Running the Application

**Backend** (port 8080):

```bash
cd backend
mvn spring-boot:run
```

**Frontend** (port 5173):

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

## Default Login

| Username | Password | Role |
|----------|----------|------|
| admin | admin123 | ADMIN |

## Features

- **Authentication** — Login, company registration, password reset
- **Company Management** — Register and manage organizations (Admin)
- **HR Managers** — Assign HR staff per company
- **Departments & Designations** — Organizational structure
- **Employee Management** — CRUD with leave balance initialization
- **Attendance** — Check-in/out with late detection
- **Leave Management** — Apply, approve, reject with balance tracking
- **Payroll** — Salary processing and PDF payslip generation
- **Holidays** — Company holiday calendar
- **Dashboard** — Role-aware stats and charts
- **Notifications** — In-app notification feed

## Project Structure

```
HR/
├── backend/          Spring Boot REST API
├── frontend/         React SPA
├── database/         MySQL schema + seed data
└── README.md
```

## API Base URL

- Development: `http://localhost:8080/api` (proxied via Vite in dev)
- All responses use `{ success, message, data }` wrapper format
