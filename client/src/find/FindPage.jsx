import { useEffect, useState, useContext } from "react";
import { MessageCircle, User, MapPin } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

const AidType = ["Blood", "Medicine", "Oxygen", "Other"];

const FindPage = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAid, setSelectedAid] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [dateRange, setDateRange] = useState("all");
  const { user, token } = useContext(AuthContext);

  const apiUrl = import.meta.env.VITE_API_URL;

  const fetchRequests = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/requests`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const data = await response.json();
        setRequests(data);
        setFilteredRequests(data);
      } else {
        const err = await response.json();
        setError(err.message || "Failed to fetch requests");
      }
    } catch (err) {
      setError("Network error: " + err.message);
    }
  };

  const handleOfferHelp = async (requestId) => {
    if (!token) {
      toast.error("You must be logged in to offer help.");
      return;
    }

    const toastId = toast.loading("Submitting your offer...");

    try {
      const response = await fetch(`${apiUrl}/api/requests/${requestId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "In Progress" }),
      });

      if (response.ok) {
        toast.success("Help offered successfully! The requestor has been notified.", { id: toastId });
        // Remove the request from the list locally
        setFilteredRequests((prevRequests) =>
          prevRequests.filter((req) => req._id !== requestId)
        );
      } else {
        const err = await response.json();
        toast.error(err.message || "Failed to offer help.", { id: toastId });
      }
    } catch (err) {
      toast.error("Network error: " + err.message, { id: toastId });
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const filterRequests = () => {
    let filtered = requests;

    if (searchQuery) {
      filtered = filtered.filter((req) =>
        req.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedAid) {
      filtered = filtered.filter((req) => req.aidType === selectedAid);
    }
    
    // Filter by date range
    if (dateRange !== "all") {
      const now = new Date();
      const days = { "24h": 1, "7d": 7, "30d": 30 }[dateRange];
      const cutoffDate = new Date(now.setDate(now.getDate() - days));
      
      filtered = filtered.filter((req) => new Date(req.createdAt) >= cutoffDate);
    }

    // Sort the results
    filtered.sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
    });

    setFilteredRequests(filtered);
  };
  
  const handleSearchChange = (event) => setSearchQuery(event.target.value);
  const handleSelectChange = (event) => setSelectedAid(event.target.value);
  const handleSortChange = (event) => setSortBy(event.target.value);
  const handleDateRangeChange = (event) => setDateRange(event.target.value);

  useEffect(() => {
    filterRequests();
  }, [searchQuery, selectedAid, requests, sortBy, dateRange]);

  return (
    <div className="min-h-screen bg-[#F0F0F0] px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-semibold text-gray-800 mb-4 text-center">
          Find Aid Requests
        </h1>
        <p className="text-center text-gray-600 mb-10">
          Browse requests from community members in need of medical aid.
        </p>

        <div className="flex flex-col md:flex-row gap-6 mb-10 items-center justify-center">
          <input
            type="text"
            placeholder="Enter a city or area..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="flex-1 border-2 border-gray-300 focus:ring-2 focus:ring-[#ffb441] rounded-lg px-6 py-3 text-gray-700 focus:outline-none shadow-md"
          />
          <select
            value={selectedAid}
            onChange={handleSelectChange}
            className="w-full md:w-60 border-2 border-gray-300 focus:ring-2 focus:ring-[#ffb441] rounded-lg px-4 py-3 bg-white text-gray-700 focus:outline-none shadow-md"
          >
            <option value="">All Aid Types</option>
            {AidType.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={handleSortChange}
            className="w-full md:w-60 border-2 border-gray-300 focus:ring-2 focus:ring-[#ffb441] rounded-lg px-4 py-3 bg-white text-gray-700 focus:outline-none shadow-md"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
          <select
            value={dateRange}
            onChange={handleDateRangeChange}
            className="w-full md:w-60 border-2 border-gray-300 focus:ring-2 focus:ring-[#ffb441] rounded-lg px-4 py-3 bg-white text-gray-700 focus:outline-none shadow-md"
          >
            <option value="all">All Time</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
        </div>

        {error && (
          <p className="text-red-500 text-center mb-6 bg-red-100 p-3 rounded-lg shadow-md text-lg">
            {error}
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRequests.map((request) => (
            <div
              key={request._id}
              className="flex flex-col bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition transform hover:scale-105"
            >
              <div className="flex flex-col justify-between h-full">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
                      {request.aidType}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-lg font-semibold text-gray-800 flex items-center">
                    <User className="w-4 h-4 mr-2 text-gray-600" />
                    {request.requestedBy?.name || "Anonymous"}
                  </p>
                  <p className="text-sm text-gray-600 mt-1 flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-gray-600" />
                    {request.location}
                  </p>
                  <p className="text-sm text-gray-700 mt-3 p-3 bg-gray-50 rounded-lg">
                    {request.details}
                  </p>
                </div>
                <div className="flex gap-4 mt-4 justify-end">
                  {user && user.role === "Donor" && (
                    <button
                      onClick={() => handleOfferHelp(request._id)}
                      className="bg-green-500 hover:bg-green-600 focus:ring-4 focus:ring-green-300 text-white px-6 py-3 rounded-lg text-sm font-medium shadow-md flex items-center"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Offer Help
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        {filteredRequests.length === 0 && !error && (
          <div className="text-center py-10">
            <p className="text-gray-600 text-lg">No pending aid requests found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FindPage;
