import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import "./index.css";
import "./App.css";
import "./theme.css";
import { ToastContainer } from "react-toastify";
import { ThemeProvider, useTheme } from "./ThemeProvider";

import ProtectedRoute from "./components/ProtectedRoute";

// Auth Pages
import Login from "./auth/login";
import Forgot from "./auth/forgotpassword";

// Common Pages
import Unauthorized from "./pages/Unauthorized";

// Physio Dashboard
import Navbar from "./dashboard/physio/components/navbar";
import Sidebar from "./dashboard/physio/components/sidebar";
import Footer from "./dashboard/physio/components/Footer";
import Profile from "./dashboard/physio/profile";
import Assign from "./dashboard/physio/assign";
import ClientManagement from "./dashboard/physio/clientManagement";
import Report from "./dashboard/physio/report";
import UserDetails from "./dashboard/physio/userDetails";
import Physioo from "./dashboard/physio/physioo";
import PhysiosAppointments from "./dashboard/physio/PhysiosAppointments";
import PhysioPasswordRequest from "./dashboard/physio/pages/PhysioPasswordRequest";
// Diet Dashboard
import DietNavbar from "./dashboard/diet/components/diet_navbar";
import DietSidebar from "./dashboard/diet/components/diet_sidebar";
import DietFooter from "./dashboard/diet/components/diet_footer";
import DietProfile from "./dashboard/diet/diet_profile";
import DietAssign from "./dashboard/diet/diet_assign";
import DietClientManagement from "./dashboard/diet/diet_clientmanagement";
import DietReport from "./dashboard/diet/diet_report";
import DietUserDetails from "./dashboard/diet/diet_userdetails";
import DietPhysioo from "./dashboard/diet/diet_physioo";
import DietitiansAppointments from "./dashboard/diet/DietitiansAppointments"; 
import DietPasswordRequest from "./dashboard/diet/pages/DietPasswordRequest";
// Doctor Dashboard
import DoctorNavbar from "./dashboard/doctor/components/doctor_navbar";
import DoctorSidebar from "./dashboard/doctor/components/doctor_sidebar";
import DoctorFooter from "./dashboard/doctor/components/doctor_footer";
import DoctorProfile from "./dashboard/doctor/doctor_profile";
import DoctorAssignDecision from "./dashboard/doctor/DoctorAssignDecision ";
import DoctorClientManagement from "./dashboard/doctor/doctor_clientmanagement";
import DoctorReport from "./dashboard/doctor/doctor_report";
import DoctorUserDetails from "./dashboard/doctor/doctor_userdetails";
import DoctorPhysioo from "./dashboard/doctor/doctor_physioo";
import DoctorUpcomingAppointments from "./dashboard/doctor/DoctorUpcomingAppointments ";
import DoctorAssignmentDashboard from "./dashboard/doctor/DoctorAssignmentDashboard";
import DoctorsAppointments from "./dashboard/doctor/DoctorsAppointments";
import DoctorPasswordRequest from "./dashboard/doctor/pages/DoctorPasswordRequest";
// 🆕 Master Admin Dashboard
import MasterAdminNavbar from "./dashboard/master_admin/components/master_admin_navbar";
import MasterAdminSidebar from "./dashboard/master_admin/components/master_admin_sidebar";
import MasterAdminFooter from "./dashboard/master_admin/components/master_admin_footer";
import MasterAdminDashboard from "./dashboard/master_admin/master_admin_dashboard";
import UserManagement from "./dashboard/master_admin/UserManagement";
import SystemOverview from "./dashboard/master_admin/SystemOverview";
import PatientJourney from "./dashboard/master_admin/PatientJourney";
import AllReports from "./dashboard/master_admin/AllReports";
import ActivityLogs from "./dashboard/master_admin/ActivityLogs";
import SecurityControls from "./dashboard/master_admin/SecurityControls";
import Services from "./dashboard/master_admin/Services";
import AdminBlogSection from "./dashboard/master_admin/AdminBlogSection";

import AppointmentsContainer from "./dashboard/master_admin/AppointmentsContainer";
import CounselorAppointments from "./dashboard/master_admin/CounselorAppointments";
import DoctorAppointments from "./dashboard/master_admin/DoctorAppointments";
import DietitianAppointments from "./dashboard/master_admin/DietitianAppointments";
import PhysioAppointments from "./dashboard/master_admin/PhysioAppointments";
import PhlebotomistAppointments from "./dashboard/master_admin/PhlebotomistAppointments";
import AdminPasswordRequests from "./dashboard/master_admin/AdminPasswordRequests";

// Counselor Dashboard
import CounselorNavbar from "./dashboard/counselor/components/counselor_navbar";
import CounselorSidebar from "./dashboard/counselor/components/counselor_sidebar";
import CounselorFooter from "./dashboard/counselor/components/counselor_footer";
import CounselorDashboard from "./dashboard/counselor/CounselorDashboard";
import CounselorsAppointments from "./dashboard/counselor/CounselorsAppointments";
import CounselorCompletedAppointments from "./dashboard/counselor/CounselorCompletedAppointments";
import CounselorPasswordRequest from "./dashboard/counselor/pages/CounselorPasswordRequest";
// Layouts
const AuthLayout = () => {
  const { theme } = useTheme();
  return (
    <div className={`app ${theme}`}>
      <div className="auth-content">
        <Outlet />
      </div>
    </div>
  );
};

const PhysioDashboardLayout = () => {
  const { theme } = useTheme();
  return (
    <ProtectedRoute allowedRoles={["physio"]}>
      <div className={`app ${theme}`}>
        <Navbar />
        <div className="dashboard-layout">
          <Sidebar />
          <div className="dashboard-main">
            <Outlet />
            <Footer />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

const DietDashboardLayout = () => {
  const { theme } = useTheme();
  return (
    <ProtectedRoute allowedRoles={["dietitian"]}>
      <div className={`app ${theme}`}>
        <DietNavbar />
        <div className="dashboard-layout">
          <DietSidebar />
          <div className="dashboard-main">
            <Outlet />
            <DietFooter />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

const DoctorDashboardLayout = () => {
  const { theme } = useTheme();
  return (
    <ProtectedRoute allowedRoles={["doctor"]}>
      <div className={`app ${theme}`}>
        <DoctorNavbar />
        <div className="dashboard-layout">
          <DoctorSidebar />
          <div className="dashboard-main">
            <Outlet />
            <DoctorFooter />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

const MasterAdminDashboardLayout = () => {
  const { theme } = useTheme();
  return (
    <ProtectedRoute allowedRoles={["masteradmin"]}>
      <div className={`app ${theme}`}>
        <MasterAdminNavbar />
        <div className="dashboard-layout">
          <MasterAdminSidebar />
          <div className="dashboard-main">
            <Outlet />
            <MasterAdminFooter />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

const CounselorDashboardLayout = () => {
  const { theme } = useTheme();
  return (
    <ProtectedRoute allowedRoles={["counselor"]}>
      <div className={`app ${theme}`}>
        <CounselorNavbar />
        <div className="dashboard-layout">
          <CounselorSidebar />
          <div className="dashboard-main">
            <Outlet />
            <CounselorFooter />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <ToastContainer position="top-center" autoClose={2000} />
        <Routes>
          {/* Auth */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/forgotpassword" element={<Forgot />} />
          </Route>

          {/* Unauthorized */}
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Physio */}
          <Route element={<PhysioDashboardLayout />}>
            <Route path="/" element={<Navigate to="/profile" replace />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/assign" element={<Assign />} />
            <Route path="/clients" element={<ClientManagement />} />
            <Route path="/reports" element={<Report />} />
            <Route path="/user" element={<UserDetails />} />
            <Route path="/physio" element={<Physioo />} />
            <Route path="/user-details/:userId" element={<UserDetails />} />
            <Route path="/user/:id/report" element={<Report />} />
            <Route path="PhysiosAppointments" element={<PhysiosAppointments />} />
            <Route path="PhysioPasswordRequest" element={<PhysioPasswordRequest />} />
          </Route>

          {/* Diet */}
          <Route path="/diet" element={<DietDashboardLayout />}>
            <Route path="diet_profile" element={<DietProfile />} />
            <Route path="diet_assign" element={<DietAssign />} />
            <Route path="diet_clients" element={<DietClientManagement />} />
            <Route path="diet_reports" element={<DietReport />} />
            <Route path="user" element={<DietUserDetails />} />
            <Route path="diet_physio" element={<DietPhysioo />} />
            <Route path="user-details/:userId" element={<DietUserDetails />} />
            <Route path="user/:id/report" element={<DietReport />} />
            <Route path="DietitiansAppointments" element={<DietitiansAppointments />} />
            <Route path="DietPasswordRequest" element={<DietPasswordRequest />} />
          </Route>

          {/* Doctor */}
          <Route path="/doctor" element={<DoctorDashboardLayout />}>
            <Route index element={<Navigate to="profile" replace />} />
            <Route path="doctor_profile" element={<DoctorProfile />} />
            <Route
              path="DoctorAssignDecision"
              element={<DoctorAssignDecision />}
            />
            <Route path="doctor_clients" element={<DoctorClientManagement />} />
            <Route path="doctor_reports" element={<DoctorReport />} />
            <Route path="user" element={<DoctorUserDetails />} />
            <Route path="doctor_physioo" element={<DoctorPhysioo />} />
            <Route path="user/:id/report" element={<DoctorReport />} />
            <Route path="DoctorsAppointments" element={<DoctorsAppointments />} />
            <Route
              path="user-details/:userId"
              element={<DoctorUserDetails />}
            />
            <Route
              path="DoctorUpcomingAppointments"
              element={<DoctorUpcomingAppointments />}
            />
            <Route
              path="DoctorAssignmentDashboard"
              element={<DoctorAssignmentDashboard />}
            />
            <Route path="DoctorPasswordRequest" element={<DoctorPasswordRequest />} />
          </Route>

          {/* 🆕 Master Admin */}
          <Route path="/masteradmin" element={<MasterAdminDashboardLayout />}>
            <Route index element={<MasterAdminDashboard />} />
            <Route path="UserManagement" element={<UserManagement />} />
            <Route path="SystemOverview" element={<SystemOverview />} />
            <Route path="PatientJourney" element={<PatientJourney />} />
            <Route path="AllReports" element={<AllReports />} />
            <Route path="ActivityLogs" element={<ActivityLogs />} />
            <Route path="SecurityControls" element={<SecurityControls />} />
            <Route path="Services" element={<Services />} />
            <Route path="AdminBlogSection" element={<AdminBlogSection />} />
            {/* appointment */}
            <Route path="appointments" element={<AppointmentsContainer />} />
            <Route
              path="appointments/counselor"
              element={<CounselorAppointments />}
            />
            <Route
              path="appointments/doctor"
              element={<DoctorAppointments />}
            />
            <Route path="appointments/dietitian" element={<DietitianAppointments />} />
            <Route path="appointments/physio" element={<PhysioAppointments />} />
          <Route path="appointments/phlebotomist" element={<PhlebotomistAppointments />} />
            <Route path="AdminPasswordRequests" element={<AdminPasswordRequests />} />
          </Route>
         
         <Route path="/counselor" element={<CounselorDashboardLayout />}>
            <Route index element={<CounselorDashboard />} />
            <Route path="CounselorsAppointments" element={<CounselorsAppointments />} />
            <Route path="CounselorCompletedAppointments" element={<CounselorCompletedAppointments />} />
            <Route path="CounselorPasswordRequest" element={<CounselorPasswordRequest />} />
          </Route>


        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
