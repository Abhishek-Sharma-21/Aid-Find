import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import { User, Mail, ClipboardList } from "lucide-react";

const EngagedRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useContext(AuthContext);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchEngagedRequests = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`${apiUrl}/api/requests/engaged`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setRequests(data);
        } else {
          toast.error("Failed to fetch your engaged requests.");
        }
      } catch (error) {
        toast.error("Network error. Could not fetch requests.");
      } finally {
        setLoading(false);
      }
    };

    fetchEngagedRequests();
  }, [token, apiUrl]);

  if (loading) {
    return <div className="text-center py-10">Loading engaged requests...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <Toaster position="top-center" />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">My Engaged Requests</h1>
        <p className="text-gray-600 mb-8">
          These are the aid requests you have offered to help with. You can now contact the requester to coordinate support.
        </p>

        {requests.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <ClipboardList className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No engaged requests</h3>
            <p className="mt-1 text-sm text-gray-500">You have not offered to help with any requests yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {requests.map((req) => (
              <div key={req._id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      req.status === "In Progress" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"
                    }`}>
                      {req.status}
                    </span>
                    <h2 className="text-xl font-semibold text-gray-800 mt-3">{req.aidType} Aid</h2>
                    <p className="text-sm text-gray-500">Location: {req.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      Requested on: {new Date(req.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <h3 className="text-md font-semibold text-gray-700 mb-2">Requester Contact Information:</h3>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-gray-600">
                      <User className="h-4 w-4 mr-2" />
                      <span>{req.requestedBy?.name || "N/A"}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Mail className="h-4 w-4 mr-2" />
                      <a href={`mailto:${req.requestedBy?.email}`} className="text-blue-500 hover:underline">
                        {req.requestedBy?.email || "N/A"}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EngagedRequests; 