import { useEffect, useState } from "react";
import { Trash2, User, Shield, Briefcase, Mail, LogOut, Users, FileText } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  
  const token = localStorage.getItem("adminToken");
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!token) {
      navigate("/admin/login");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const [usersRes, requestsRes] = await Promise.all([
          fetch(`${apiUrl}/api/admin/users`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${apiUrl}/api/admin/requests`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        if (usersRes.ok && requestsRes.ok) {
          const usersData = await usersRes.json();
          const requestsData = await requestsRes.json();
          setUsers(usersData);
          setRequests(requestsData);
        } else {
          toast.error("Failed to fetch admin data.");
          setError("Could not load all data.");
        }
      } catch (err) {
        toast.error("A network error occurred.");
        setError("Network error. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, apiUrl, navigate]);

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user and all their requests? This cannot be undone.")) return;

    const toastId = toast.loading("Deleting user...");
    try {
      const response = await fetch(`${apiUrl}/api/admin/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        toast.success("User deleted successfully.", { id: toastId });
        setUsers(users.filter((user) => user._id !== userId));
        // Also remove their requests from the local state
        setRequests(requests.filter((req) => req.requestedBy?._id !== userId));
      } else {
        const err = await response.json();
        toast.error(err.message || "Failed to delete user.", { id: toastId });
      }
    } catch (err) {
      toast.error("Network error while deleting user.", { id: toastId });
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };
  
  if (loading) return <div className="text-center py-20">Loading Admin Dashboard...</div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Toaster position="top-center" />
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
        
        {/* Manage Users Section */}
        <div className="bg-white p-8 rounded-2xl shadow-lg mb-10">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6 flex items-center"><Users className="mr-3" /> Manage Users</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="p-4 font-semibold">User</th>
                  <th className="p-4 font-semibold">Role</th>
                  <th className="p-4 font-semibold">Joined</th>
                  <th className="p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center">
                        <User className="w-5 h-5 mr-3 text-gray-500" />
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        user.role === 'Donor' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-600">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="p-4">
                      <button onClick={() => handleDeleteUser(user._id)} className="text-red-500 hover:text-red-700">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* All Aid Requests Section */}
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6 flex items-center"><FileText className="mr-3" /> All Aid Requests</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="p-4 font-semibold">Request Details</th>
                  <th className="p-4 font-semibold">Requester</th>
                  <th className="p-4 font-semibold">Donor</th>
                  <th className="p-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr key={req._id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <p className="font-medium">{req.aidType}</p>
                      <p className="text-sm text-gray-600">{req.location}</p>
                    </td>
                    <td className="p-4 text-sm text-gray-600">{req.requestedBy?.name || 'N/A'}</td>
                    <td className="p-4 text-sm text-gray-600">{req.donatedBy?.name || 'Not Assigned'}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        req.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                        req.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 
                        req.status === 'Fulfilled' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
