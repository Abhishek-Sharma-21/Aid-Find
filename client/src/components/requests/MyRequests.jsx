import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { List, PlusCircle, User, Mail, CheckCircle } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { token } = useAuth();
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleUpdateRequest = async (requestId, status) => {
    const toastId = toast.loading("Updating status...");
    try {
      const response = await fetch(`${apiUrl}/api/requests/${requestId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (response.ok) {
        const updatedRequest = await response.json();
        setRequests((prev) =>
          prev.map((r) => (r._id === requestId ? updatedRequest.request : r))
        );
        toast.success("Request marked as Fulfilled!", { id: toastId });
      } else {
        const err = await response.json();
        toast.error(err.message || "Failed to update status.", { id: toastId });
      }
    } catch (error) {
      toast.error("Network error. Please try again.", { id: toastId });
    }
  };

  useEffect(() => {
    const fetchMyRequests = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`${apiUrl}/api/requests/my-requests`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setRequests(data);
        } else {
          const err = await response.json();
          setError(err.message || "Failed to fetch requests.");
        }
      } catch (err) {
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyRequests();
  }, [token, apiUrl]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Fulfilled":
        return "bg-green-100 text-green-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="text-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ffb441] mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading Your Requests...</p>
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500 py-10">{error}</p>;
  }

  return (
    <div className="min-h-screen bg-[#F0F0F0] px-4 py-10">
      <Toaster position="top-center" />
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Aid Requests</h1>
          <Link
            to="/request-aid"
            className="inline-flex items-center space-x-2 bg-[#ffb441] text-white px-4 py-2 rounded-lg hover:bg-[#ffa726] transition"
          >
            <PlusCircle className="w-5 h-5" />
            <span>New Request</span>
          </Link>
        </div>

        {requests.length === 0 ? (
          <div className="text-center bg-white p-10 rounded-lg shadow-md">
            <List className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700">No Requests Yet</h3>
            <p className="text-gray-500 mt-2">You have not made any aid requests. When you do, they will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div key={request._id} className="bg-white p-5 rounded-lg shadow-md">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                  <div>
                    <p className="text-lg font-semibold text-gray-900">{request.aidType}</p>
                    <p className="text-sm text-gray-600 mt-1">Location: {request.location}</p>
                    <p className="text-sm text-gray-500 mt-2">"{request.details}"</p>
                  </div>
                  <div className="mt-4 sm:mt-0 flex flex-col items-start sm:items-end">
                    <span
                      className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(request.status)}`}
                    >
                      {request.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-2">
                      Requested on {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {request.status === "In Progress" && request.donatedBy && (
                  <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold text-gray-700">Donor Information:</h4>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center text-gray-600">
                          <User className="h-4 w-4 mr-2" />
                          <span>{request.donatedBy.name}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Mail className="h-4 w-4 mr-2" />
                          <a href={`mailto:${request.donatedBy.email}`} className="text-blue-500 hover:underline">
                            {request.donatedBy.email}
                          </a>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleUpdateRequest(request._id, "Fulfilled")}
                      className="inline-flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                    >
                      <CheckCircle className="w-5 h-5" />
                      <span>Mark as Fulfilled</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRequests; 