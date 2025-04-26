import { useEffect, useState } from "react";
import { TrashIcon } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection

const AdminDashboard = () => {
  const [donors, setDonors] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Hook for navigation

  const apiUrl = import.meta.env.VITE_API_URL;

  // for fetching donor details
  const fetchDonors = async () => {
    try {
      const response = await fetch(`${apiUrl}/donor/all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDonors(data);
      } else {
        const err = await response.json();
        setError(err.message || "Failed to fetch donors");
        toast.error(err.message);
      }
    } catch (err) {
      setError("Network error: " + err.message);
      toast.error(err.message);
    }
  };

  useEffect(() => {
    fetchDonors();
  }, []);

  // for deleting donor details
  const handleDelete = async (donorId) => {
    try {
      const response = await fetch(`${apiUrl}/admin/delete/${donorId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setDonors((prev) => prev.filter((d) => d._id !== donorId));
      } else {
        const err = await response.json();
        setError(err.message || "Failed to delete donor");
        toast.error(err.message);
      }
    } catch (err) {
      setError("Network error: " + err.message);
    }
  };

  // Handle logout
  const handleLogout = () => {
    // Remove the token from localStorage
    localStorage.removeItem("token");

    // Redirect to login page
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 font-sans relative">
      {/* Logout Button in the top-right corner */}
      <button
        onClick={handleLogout}
        className="absolute top-4 right-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
      >
        Logout
      </button>

      <h1 className="text-3xl font-bold text-center mb-6 text-[#ffb441]">
        Admin Dashboard
      </h1>

      {error && (
        <p className="text-red-500 text-center mb-4 bg-white p-2 rounded shadow">
          {error}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 max-w-5xl mx-auto">
        {donors.map((donor) => (
          <div
            key={donor._id}
            className="bg-white p-4 rounded-2xl shadow-md hover:shadow-lg transition flex flex-col justify-between"
          >
            <div>
              <p className="text-xl font-semibold text-gray-800 mb-1">
                {donor.name}
              </p>
              <p className="text-sm text-gray-500 mb-2">
                Donor Type:{" "}
                <span className="text-red-500 font-medium">
                  {donor.donorType}
                </span>
              </p>
              <p className="text-sm text-gray-600 mb-1">
                {new Date(donor.createdAt).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600">{donor.details}</p>
            </div>
            <div className="mt-4 self-end">
              <TrashIcon
                onClick={() => handleDelete(donor._id)}
                className="w-6 h-6 text-red-500 hover:text-red-700 cursor-pointer transition"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
