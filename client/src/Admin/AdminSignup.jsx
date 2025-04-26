import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  // const navigate = useNavigate();

  const handleSignup = async () => {
    if (!username || !password) {
      setError("Both username and password are required");
      return;
    }

    // Make a POST request to your backend for user registration
    try {
      const response = await fetch("http://localhost:3000/api/admin/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();
      if (response.ok) {
        localStorage.setItem("token", result.token);
        navigate("/admin-dashboard"); // Redirect to login page on successful sign-up
      } else {
        setError(result.error || "Failed to sign up");
      }
    } catch (error) {
      console.log(error);

      setError("Error connecting to server");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-4">Sign Up</h2>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
          <button
            type="button"
            onClick={handleSignup}
            className="w-full py-2 bg-[#ffb441] text-white font-semibold rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Sign Up
          </button>
        </form>
        <div className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/admin/login"
            className="text-indigo-600 hover:underline font-medium"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
