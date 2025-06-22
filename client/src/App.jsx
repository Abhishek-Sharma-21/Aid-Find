import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import LandingPage from "./components/LandingPage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import FindPage from "./find/FindPage";
import AdminLogin from "./Admin/AdminLogin";
import AdminDashboard from "./Admin/AdminDashboard";
import AdminSignUp from "./Admin/AdminSignup";
import ProtectedRoute from "./Admin/ProtectedRoute";

// New auth components
import { AuthProvider } from "./context/AuthContext";
import Login from "./components/auth/Login";
import UserRegister from "./components/auth/Register";
import Dashboard from "./components/auth/Dashboard";
import UserProtectedRoute from "./components/auth/ProtectedRoute";
import RequestAidForm from "./components/requests/RequestAidForm";
import MyRequests from "./components/requests/MyRequests";
import EngagedRequests from "./components/requests/EngagedRequests";

const App = () => {
  return (
    <AuthProvider>
    <div>
        <Toaster position="top-right" />
      <Header />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/search" element={<FindPage />} />
          
          {/* New auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/user-register" element={<UserRegister />} />
          <Route 
            path="/dashboard" 
            element={
              <UserProtectedRoute>
                <Dashboard />
              </UserProtectedRoute>
            } 
          />
          <Route
            path="/request-aid"
            element={
              <UserProtectedRoute>
                <RequestAidForm />
              </UserProtectedRoute>
            }
          />
          <Route
            path="/my-requests"
            element={
              <UserProtectedRoute>
                <MyRequests />
              </UserProtectedRoute>
            }
          />
          <Route
            path="/engaged-requests"
            element={
              <UserProtectedRoute>
                <EngagedRequests />
              </UserProtectedRoute>
            }
          />
          
          {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/signup" element={<AdminSignUp />} />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer />
    </div>
    </AuthProvider>
  );
};
export default App;
