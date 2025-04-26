import { Route, Routes } from "react-router-dom";

import Register from "./register/Register";
import LandingPage from "./components/LandingPage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import FindPage from "./find/FindPage";
import AdminLogin from "./Admin/AdminLogin";
import AdminDashboard from "./Admin/AdminDashboard";
import AdminSignUp from "./Admin/AdminSignup";
import ProtectedRoute from "./Admin/ProtectedRoute";

const App = () => {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/search" element={<FindPage />} />
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
  );
};
export default App;
