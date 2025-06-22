import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const aidTypes = ["Blood", "Medicine", "Oxygen", "Other"];

const RequestAidForm = () => {
  const [formData, setFormData] = useState({
    aidType: "",
    details: "",
    location: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { token } = useAuth();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${apiUrl}/api/requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Aid request submitted successfully!");
        navigate("/dashboard"); 
      } else {
        toast.error(data.error || "Failed to submit request.");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f0f0] flex items-center justify-center py-12">
      <div className="max-w-xl w-full mx-auto p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">
          Request Medical Aid
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Fill out the form below to request help from our community of donors.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="aidType" className="block text-sm font-medium text-gray-700 mb-1">
              Type of Aid Needed
            </label>
            <select
              id="aidType"
              name="aidType"
              value={formData.aidType}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 p-3 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#ffb441]"
            >
              <option value="" disabled>Select the type of aid...</option>
              {aidTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Your City / Area
            </label>
            <input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              placeholder="e.g., Downtown, Springfield"
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffb441]"
            />
          </div>

          <div>
            <label htmlFor="details" className="block text-sm font-medium text-gray-700 mb-1">
              Details of Your Request
            </label>
            <textarea
              id="details"
              name="details"
              value={formData.details}
              onChange={handleChange}
              required
              rows="4"
              placeholder="Please provide specific details. e.g., 'Need O+ blood urgently for surgery at City Hospital'."
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffb441]"
            ></textarea>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#ffb441] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[#ffa726] disabled:bg-gray-400 transition duration-300"
            >
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestAidForm; 