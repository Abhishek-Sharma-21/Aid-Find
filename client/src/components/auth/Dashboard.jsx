import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { LogOut, User, Heart, Search, Plus, Handshake } from "lucide-react";
import { useState, useEffect } from "react";

const Dashboard = () => {
  const { user, logout, token } = useAuth();
  const [stats, setStats] = useState({
    requestsMade: 0,
    responsesReceived: 0,
    activeRequests: 0,
    donationsMade: 0,
    peopleHelped: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchStats = async () => {
      if (!token || !user) return;

      setLoadingStats(true);
      try {
        if (user.role === "Seeker") {
          const response = await fetch(`${apiUrl}/api/requests/my-requests`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.ok) {
            const myRequests = await response.json();
            setStats({
              requestsMade: myRequests.length,
              responsesReceived: myRequests.filter((r) => r.donatedBy).length,
              activeRequests: myRequests.filter((r) =>
                ["Pending", "In Progress"].includes(r.status)
              ).length,
              donationsMade: 0,
              peopleHelped: 0,
            });
          }
        } else if (user.role === "Donor") {
          const response = await fetch(`${apiUrl}/api/requests/engaged`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.ok) {
            const engagedRequests = await response.json();
            setStats({
              requestsMade: 0,
              responsesReceived: 0,
              activeRequests: 0,
              donationsMade: engagedRequests.length,
              peopleHelped: engagedRequests.filter(
                (r) => r.status === "Fulfilled"
              ).length,
            });
          }
        }
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, [token, user, apiUrl]);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#f0f0f0] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Please log in to access your dashboard
          </h2>
          <Link
            to="/login"
            className="bg-[#ffb441] text-white px-6 py-2 rounded-lg hover:bg-[#ffa726] transition"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f0f0]">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Aid Find</h1>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span>Welcome, {user.name}</span>
                <span className="bg-[#ffb441] text-white px-2 py-1 rounded-full text-xs">
                  {user.role}
                </span>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Info Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Your Profile
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="font-medium">{user.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Role</p>
              <p className="font-medium">{user.role}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Member Since</p>
              <p className="font-medium">
                {new Date(user.createdAt || Date.now()).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Role-specific Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {user.role === "Donor" ? (
            <>
              {/* Donor Actions */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Handshake className="w-6 h-6 text-green-500" />
                  <h3 className="text-lg font-semibold">My Engagements</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  View the requests you've offered to help and contact the requester.
                </p>
                <Link
                  to="/engaged-requests"
                  className="inline-flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                >
                  <Handshake className="w-4 h-4" />
                  <span>View Engagements</span>
                </Link>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Search className="w-6 h-6 text-blue-500" />
                  <h3 className="text-lg font-semibold">View Requests</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  See requests from people who need your help.
                </p>
                <Link
                  to="/search"
                  className="inline-flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                >
                  <Search className="w-4 h-4" />
                  <span>View Requests</span>
                </Link>
              </div>

            </>
          ) : (
            <>
              {/* Seeker Actions */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Search className="w-6 h-6 text-blue-500" />
                  <h3 className="text-lg font-semibold">Find Aid</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Search for donors who can provide the medical aid you need.
                </p>
                <Link
                  to="/search"
                  className="inline-flex items-center space-x-2 bg-[#ffb441] text-white px-4 py-2 rounded-lg hover:bg-[#ffa726] transition"
                >
                  <Search className="w-4 h-4" />
                  <span>Search Donors</span>
                </Link>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Plus className="w-6 h-6 text-green-500" />
                  <h3 className="text-lg font-semibold">Request Aid</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Create a new request for medical aid.
                </p>
                <Link
                  to="/request-aid"
                  className="inline-flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Request</span>
                </Link>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <User className="w-6 h-6 text-purple-500" />
                  <h3 className="text-lg font-semibold">My Requests</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Track your aid requests and responses.
                </p>
                <Link
                  to="/my-requests"
                  className="inline-flex items-center space-x-2 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition"
                >
                  <User className="w-4 h-4" />
                  <span>View Requests</span>
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Quick Stats */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Quick Stats
          </h3>
          {user.role === "Seeker" ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-[#ffb441]">{loadingStats ? "..." : stats.requestsMade}</p>
                <p className="text-sm text-gray-600">Requests Made</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-500">{loadingStats ? "..." : stats.responsesReceived}</p>
                <p className="text-sm text-gray-600">Responses Received</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-500">{loadingStats ? "..." : stats.activeRequests}</p>
                <p className="text-sm text-gray-600">Active Requests</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-[#ffb441]">{loadingStats ? "..." : stats.donationsMade}</p>
                <p className="text-sm text-gray-600">Engagements</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-500">{loadingStats ? "..." : stats.peopleHelped}</p>
                <p className="text-sm text-gray-600">People Helped</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 