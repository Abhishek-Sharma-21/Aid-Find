import { MessageCircle, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const AidType = ["Blood", "Medicine", "Oxygen", "Other"];

const FindPage = () => {
  const [donors, setDonors] = useState([]);
  const [filteredDonors, setFilteredDonors] = useState([]);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // To store input text
  const [selectedAid, setSelectedAid] = useState(""); // To store selected aid type

  const apiUrl = import.meta.env.VITE_API_URL;

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
        setFilteredDonors(data); // Initially display all donors
      } else {
        const err = await response.json();
        setError(err.message || "Failed to fetch donors");
      }
    } catch (err) {
      setError("Network error: " + err.message);
    }
  };

  useEffect(() => {
    fetchDonors();
  }, []);

  // Function to filter donors based on search query and selected aid type
  const filterDonors = () => {
    let filtered = donors;

    // Filter by search query (city or area)
    if (searchQuery) {
      filtered = filtered.filter((donor) =>
        donor.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by selected aid type
    if (selectedAid) {
      filtered = filtered.filter((donor) => donor.donorType === selectedAid);
    }

    setFilteredDonors(filtered);
  };

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Handle select change
  const handleSelectChange = (event) => {
    setSelectedAid(event.target.value);
  };

  // Re-filter donors whenever the search query or selected aid type changes
  useEffect(() => {
    filterDonors();
  }, [searchQuery, selectedAid]);

  return (
    <div className="min-h-screen bg-[#F0F0F0] px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-semibold text-gray-800 mb-10 text-center">
          Find Medical Aid Near You
        </h1>

        {/* Search and Filters Section */}
        <div className="flex flex-col md:flex-row gap-6 mb-10 items-center justify-center">
          {/* Input */}
          <input
            type="text"
            placeholder="Enter your city or area..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="flex-1 border-2 border-[#ffb441] focus:ring-2 focus:ring-[#ffb441] rounded-lg px-6 py-3 text-gray-700 focus:outline-none shadow-md"
          />

          {/* Select Options */}
          <select
            name="donorType"
            value={selectedAid}
            onChange={handleSelectChange}
            className="w-full md:w-60 border-2 border-gray-300 focus:ring-2 focus:ring-[#ffb441] rounded-lg px-4 py-3 bg-white text-gray-700 focus:outline-none shadow-md"
          >
            <option value="">Select Aid Type</option>
            {AidType.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          {/* Submit Button */}
          <button
            onClick={filterDonors}
            className="w-full md:w-auto bg-[#ffb441] hover:bg-[#ffa726] text-white font-semibold px-6 py-3 rounded-lg transition duration-200 shadow-md"
          >
            Search
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-red-500 text-center mb-6 bg-white p-3 rounded-lg shadow-md text-lg">
            {error}
          </p>
        )}

        {/* Donor Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDonors.map((donor, index) => (
            <div
              key={index}
              className="flex flex-col bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition transform hover:scale-105"
            >
              <div className="flex flex-col justify-between h-full">
                <div className="text-start mb-4">
                  <p className="text-lg font-semibold text-gray-800">
                    {donor.name}{" "}
                    <span className="text-red-500">({donor.donorType})</span>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">{donor.location}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {donor.contactNumber}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">{donor.details}</p>
                </div>
                <div className="flex gap-4 mt-4 justify-end">
                  <Link
                    to={`tel:${donor.contactNumber}`}
                    className="bg-green-500 hover:bg-green-600 focus:ring-4 focus:ring-green-300 text-white px-6 py-3 rounded-lg text-sm font-medium shadow-md transform transition-transform hover:scale-105 flex items-center"
                  >
                    <Phone className="w-4 h-4 inline-block mr-2" />
                    Call
                  </Link>
                  <Link
                    to={`https://wa.me/${donor.contactNumber}`}
                    className="bg-teal-500 hover:bg-teal-600 focus:ring-4 focus:ring-teal-300 text-white px-6 py-3 rounded-lg text-sm font-medium shadow-md transform transition-transform hover:scale-105 flex items-center"
                  >
                    <MessageCircle className="w-4 h-4 inline-block mr-2" />
                    WhatsApp
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FindPage;
