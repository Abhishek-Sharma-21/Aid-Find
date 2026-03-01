import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

const LandingPage = lazy(() => import("./components/LandingPage"));
import Header from "./components/Header"; // keep header sync
import Footer from "./components/Footer"; // keep footer sync
const FindPage = lazy(() => import("./find/FindPage"));
const AdminLogin = lazy(() => import("./Admin/AdminLogin"));
const AdminDashboard = lazy(() => import("./Admin/AdminDashboard"));
const AdminSignUp = lazy(() => import("./Admin/AdminSignup"));
import ProtectedRoute from "./Admin/ProtectedRoute";

// New auth components
import { AuthProvider } from "./context/AuthContext";
const Login = lazy(() => import("./components/auth/Login"));
const UserRegister = lazy(() => import("./components/auth/Register"));
const Dashboard = lazy(() => import("./components/auth/Dashboard"));
import UserProtectedRoute from "./components/auth/ProtectedRoute";
const RequestAidForm = lazy(() => import("./components/requests/RequestAidForm"));
const MyRequests = lazy(() => import("./components/requests/MyRequests"));
const EngagedRequests = lazy(() => import("./components/requests/EngagedRequests"));

// loading spinner fallback for suspense
const PageLoader = () => (
  <div className="flex justify-center items-center py-20 min-h-[50vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ffb441]"></div>
  </div>
);

const App = () => {
  return (
    <AuthProvider>
    <div>
        <Toaster position="top-right" />
      <Header />
      <Suspense fallback={<PageLoader />}>
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
      </Suspense>
      <Footer />
    </div>
    </AuthProvider>
  );
};
export default App;
