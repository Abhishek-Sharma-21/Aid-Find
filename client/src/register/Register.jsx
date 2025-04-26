import React, { useState } from "react";
import toast from "react-hot-toast";

const donorTypes = ["Blood", "Medicine", "Oxygen", "Other"];

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    contactNumber: "",
    location: "",
    donorType: "",
    details: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const apiUrl = import.meta.env.VITE_API_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters.";
    }

    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(formData.contactNumber)) {
      newErrors.contactNumber = "Invalid phone number format.";
    }

    if (formData.location.trim().length < 3) {
      newErrors.location = "Location is required.";
    }

    if (!formData.donorType) {
      newErrors.donorType = "Please select a donor type.";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const response = await fetch(`${apiUrl}/donor/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(
          "Registration Successful! Thank you for offering your help."
        );
        setFormData({
          name: "",
          contactNumber: "",
          location: "",
          donorType: "",
          details: "",
        });
      } else {
        toast.error(data.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      toast.error("Network error. Please try again later.");
      console.log("Network Error" + error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#f0f0f0] ">
      <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-lg ">
        <h2 className="text-2xl font-bold mb-2 text-center text-black">
          Register as a Donor
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Offer your help to the community. Fill in your details below.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block font-medium mb-1">Full Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. John Doe"
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#ffb441]"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block font-medium mb-1">
              Contact Number (with country code)
            </label>
            <input
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              placeholder="e.g. +14155552671"
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#ffb441]"
            />
            {errors.contactNumber && (
              <p className="text-red-500 text-sm mt-1">
                {errors.contactNumber}
              </p>
            )}
          </div>

          <div>
            <label className="block font-medium mb-1">Your City/Area</label>
            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Downtown, Springfield"
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#ffb441]"
            />
            {errors.location && (
              <p className="text-red-500 text-sm mt-1">{errors.location}</p>
            )}
          </div>

          <div>
            <label className="block font-medium mb-1">
              Type of Aid Offered
            </label>
            <select
              name="donorType"
              value={formData.donorType}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded bg-white focus:outline-none focus:ring-2 focus:ring-[#ffb441]"
            >
              <option value="">Select what you can donate</option>
              {donorTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.donorType && (
              <p className="text-red-500 text-sm mt-1">{errors.donorType}</p>
            )}
          </div>

          <div>
            <label className="block font-medium mb-1">Details (Optional)</label>
            <input
              name="details"
              value={formData.details}
              onChange={handleChange}
              placeholder="e.g., Blood Type O+, Specific medicine name"
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#ffb441]"
            />
            <p className="text-xs text-gray-500 mt-1">
              Specify blood type, medicine name, oxygen availability, etc.
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#ffb441] text-white py-2 rounded hover:bg-cyan-800 disabled:bg-gray-400 transition duration-200"
          >
            {isSubmitting ? "Registering..." : "Register Now"}
          </button>
        </form>
      </div>
    </div>
  );
}
