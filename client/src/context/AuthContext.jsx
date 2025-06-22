import { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

export const AuthContext = createContext(null);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token"));

  const apiUrl = import.meta.env.VITE_API_URL;

  // Check if user is authenticated on app load
  useEffect(() => {
    if (token) {
      // You could verify the token here if needed
      const userData = JSON.parse(localStorage.getItem("user") || "null");
      setUser(userData);
    }
    setLoading(false);
  }, [token]);

  const register = async (userData) => {
    try {
      const response = await fetch(`${apiUrl}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        toast.success("Registration successful!");
        return { success: true };
      } else {
        toast.error(data.error || "Registration failed");
        return { success: false, error: data.error };
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
      return { success: false, error: "Network error" };
    }
  };

  const login = async (credentials) => {
    try {
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        toast.success("Login successful!");
        return { success: true };
      } else {
        toast.error(data.error || "Login failed");
        return { success: false, error: data.error };
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
      return { success: false, error: "Network error" };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    toast.success("Logged out successfully");
  };

  const value = {
    user,
    token,
    loading,
    register,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 