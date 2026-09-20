import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';
import Login from './pages/Login';
import Register from './pages/Register';

// Applicant Pages
import ApplicantDashboard from './pages/applicant/ApplicantDashboard';
import ApplicantProfile from './pages/applicant/ApplicantProfile';
import ApplicantResume from './pages/applicant/ApplicantResume';
import ApplicantApplications from './pages/applicant/ApplicantApplications';

// Recruiter Pages
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard';
import RecruiterCompany from './pages/recruiter/RecruiterCompany';
import RecruiterJobs from './pages/recruiter/RecruiterJobs';
import RecruiterCreateEditJob from './pages/recruiter/RecruiterCreateEditJob';
import RecruiterJobApplicants from './pages/recruiter/RecruiterJobApplicants';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCompanies from './pages/admin/AdminCompanies';
import AdminUsers from './pages/admin/AdminUsers';
import AdminJobs from './pages/admin/AdminJobs';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/jobs/:id" element={<JobDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Applicant Protected Routes */}
              <Route
                path="/applicant/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['APPLICANT']}>
                    <ApplicantDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/applicant/profile"
                element={
                  <ProtectedRoute allowedRoles={['APPLICANT']}>
                    <ApplicantProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/applicant/resume"
                element={
                  <ProtectedRoute allowedRoles={['APPLICANT']}>
                    <ApplicantResume />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/applicant/applications"
                element={
                  <ProtectedRoute allowedRoles={['APPLICANT']}>
                    <ApplicantApplications />
                  </ProtectedRoute>
                }
              />

              {/* Recruiter Protected Routes */}
              <Route
                path="/recruiter/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['RECRUITER']}>
                    <RecruiterDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/recruiter/company"
                element={
                  <ProtectedRoute allowedRoles={['RECRUITER']}>
                    <RecruiterCompany />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/recruiter/jobs"
                element={
                  <ProtectedRoute allowedRoles={['RECRUITER']}>
                    <RecruiterJobs />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/recruiter/jobs/create"
                element={
                  <ProtectedRoute allowedRoles={['RECRUITER']}>
                    <RecruiterCreateEditJob />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/recruiter/jobs/:id/edit"
                element={
                  <ProtectedRoute allowedRoles={['RECRUITER']}>
                    <RecruiterCreateEditJob />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/recruiter/jobs/:id/applicants"
                element={
                  <ProtectedRoute allowedRoles={['RECRUITER']}>
                    <RecruiterJobApplicants />
                  </ProtectedRoute>
                }
              />

              {/* Admin Protected Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/companies"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminCompanies />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminUsers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/jobs"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminJobs />
                  </ProtectedRoute>
                }
              />

              {/* Fallback Catch-All Route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
