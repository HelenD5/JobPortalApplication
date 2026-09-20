# JobPortalApplication - Multi-Company Enterprise Job Portal

A robust, enterprise-grade multi-company Job Portal application built with **Spring Boot 4.1.1** (Java 17), **MySQL**, **Spring Security** with **JWT**, and a modern **React + Vite** frontend.

---

## ≡ƒÜÇ Key Features

### ≡ƒÅó Strict Multi-Company Isolation
- Recruiters belong to exactly one company.
- Company A recruiters can **NEVER** access, view, or modify Company B's jobs, applicants, applications, or PDF resumes.

### ≡ƒæñ Role-Based Authorization
1. **APPLICANT**:
   - Register, login, view/edit professional profile (skills, education, experience).
   - Upload & replace PDF resumes (stored securely in `uploads/resumes/`).
   - Search & filter published jobs by skill keywords, location, employment type, and experience.
   - Apply to jobs with selected PDF resume.
   - View application statuses (`APPLIED`, `UNDER_REVIEW`, `SHORTLISTED`, `INTERVIEW`, `SELECTED`, `REJECTED`).
   - **Privacy Policy**: Applicants **NEVER** see their resume matching score.
2. **RECRUITER**:
   - Manage company profile.
   - Create, edit, publish, close, and delete jobs for their company.
   - View candidate applicants ranked automatically by skill-matching score.
   - Download applicant PDF resumes.
   - Update candidate application status.
3. **ADMIN**:
   - System administrator overview (dashboard metrics: total users, companies, jobs, active jobs, applications).
   - Manage companies (`ACTIVE`, `PENDING`, `SUSPENDED`).
   - View platform users and audit all platform job postings.
   - *Public admin registration is strictly disabled; initial admin is seeded on application startup.*

---

## ≡ƒ¢á∩╕Å Tech Stack

### Backend:
- **Java 17** & **Spring Boot 4.1.1**
- **Spring WebMVC** & **Spring Data JPA / Hibernate**
- **Spring Security** & **JJW T (0.12.5)**
- **MySQL Connector/J**
- **Lombok**
- **Maven**

### Frontend:
- **React 18** & **Vite**
- **JavaScript (ES6+)**
- **React Router DOM v6**
- **Axios** (with JWT request interceptor & 401 response auto-logout)
- **Lucide React** & Vanilla CSS Design System

---

## ≡ƒôè Database Schema & Entities

Database Name: `job_portal`

1. `users`: `id`, `name`, `email` (unique), `password` (BCrypt), `role` (`APPLICANT`, `RECRUITER`, `ADMIN`), `company_id` (FK), `phone`, `location`, `skills`, `education`, `experience`, `created_at`.
2. `companies`: `id`, `name`, `email`, `description`, `website`, `location`, `logo`, `status` (`PENDING`, `ACTIVE`, `SUSPENDED`), `created_at`.
3. `jobs`: `id`, `company_id` (FK), `created_by_user_id` (FK), `title`, `description`, `required_skills`, `location`, `experience`, `salary`, `employment_type` (`FULL_TIME`, `PART_TIME`, `INTERNSHIP`, `CONTRACT`), `deadline`, `status` (`DRAFT`, `PUBLISHED`, `CLOSED`), `created_at`.
4. `resumes`: `id`, `applicant_id` (FK), `file_name`, `file_path`, `uploaded_at`.
5. `applications`: `id`, `job_id` (FK), `applicant_id` (FK), `resume_id` (FK), `score` (Double %), `status` (`APPLIED`, `UNDER_REVIEW`, `SHORTLISTED`, `INTERVIEW`, `SELECTED`, `REJECTED`), `applied_at`, `updated_at`.

---

## Environment Variables

Configure these environment variables before running the application:

```text
DB_URL=jdbc:mysql://localhost:3306/job_portal
DB_USERNAME=your_mysql_username
DB_PASSWORD=your_mysql_password

ADMIN_USERNAME=admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_admin_password

JWT_SECRET=your_jwt_secret

## ≡ƒæÑ Seeded Demo Credentials

The application includes seeded demo accounts for local development.

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@jobportal.com` | Configure locally |
| **Recruiter** | `recruiter@techcorp.com` | Configure locally |
| **Applicant** | `applicant@example.com` | Configure locally |

---

## ≡ƒÆ╗ How to Run the Application

### 1. Start Spring Boot Backend
Ensure MySQL service is running on `localhost:3306` with database `job_portal`.

Run from project root directory:
```bash
# Using Maven Wrapper (Windows)
.\mvnw.cmd spring-boot:run
```
The backend API will run at `http://localhost:8080`.

### 2. Start React Frontend
Navigate into `frontend/` directory and run:
```bash
cd frontend
npm run dev
```
The React development server will start at `http://localhost:5173`.

---

## ≡ƒîÉ Main API Endpoints Summary

### Authentication
- `POST /api/auth/register` - Register new Applicant or Recruiter
- `POST /api/auth/login` - Authenticate and return JWT token

### Jobs
- `GET /api/jobs` - Search and filter published jobs (Public)
- `GET /api/jobs/{id}` - Get job details (Public)
- `POST /api/jobs` - Create job (Recruiter)
- `PUT /api/jobs/{id}` - Edit job (Recruiter / Admin)
- `DELETE /api/jobs/{id}` - Delete job (Recruiter / Admin)

### Applications
- `POST /api/applications` - Apply to job with resume
- `GET /api/applications/my` - View my applications (Applicant - NO SCORE)
- `GET /api/jobs/{jobId}/applications` - View job applicants (Recruiter - WITH SCORE)
- `PUT /api/applications/{id}/status` - Update candidate status (Recruiter)

### Resumes
- `POST /api/resumes` - Upload PDF resume (Applicant)
- `GET /api/resumes/my` - View uploaded resumes (Applicant)
- `GET /api/resumes/{id}/download` - Download PDF resume (Authorized Recruiter / Owner)

### Admin
- `GET /api/admin/dashboard` - Platform statistics
- `GET /api/admin/companies` - Manage companies
- `PUT /api/admin/companies/{id}/status` - Update company status
- `GET /api/admin/users` - View platform users
- `GET /api/admin/jobs` - View all jobs
