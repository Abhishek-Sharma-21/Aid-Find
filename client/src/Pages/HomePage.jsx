import { Search, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center bg-[#f0f0f0] text-center space-y-8 p-10 flex-grow px-4">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-gray-800">
        Find Help, Offer Hope
      </h1>
      <p className="max-w-xl text-lg text-gray-500">
        AidFind connects you with nearby medical aid providers and donors in
        your community. Search for clinics, medicine, blood, or register to help
        others.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link to="/search">
          <button className="flex cursor-pointer items-center justify-center gap-2 bg-[#ffb441] text-black px-6 py-3 rounded-lg text-sm hover:bg-[#ff9c2f] transition ease-in-out duration-300 transform hover:scale-105">
            <Search className="h-4 w-4" />
            Find Aid Now
          </button>
        </Link>

        <Link to="/user-register">
          <button className="flex cursor-pointer items-center justify-center gap-2 bg-[#9fe7ff] text-black px-6 py-3 rounded-lg text-sm hover:bg-[#80c9df] transition ease-in-out duration-300 transform hover:scale-105">
            <UserPlus className="h-4 w-4" />
            Register as Donor
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 w-full max-w-4xl">
        <div className="rounded-xl bg-white shadow-lg p-6 text-left space-y-2 transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl">
          <h2 className="text-xl font-semibold text-gray-800">
            Medicine Providers
          </h2>
          <p className="text-gray-500">
            Locate pharmacies and NGOs offering free or subsidized medicines.
          </p>
        </div>
        <div className="rounded-xl bg-white shadow-lg p-6 text-left space-y-2 transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl">
          <h2 className="text-xl font-semibold text-gray-800">Blood Donors</h2>
          <p className="text-gray-500">
            Find registered blood donors near you in times of need.
          </p>
        </div>
        <div className="rounded-xl bg-white shadow-lg p-6 text-left space-y-2 transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl">
          <h2 className="text-xl font-semibold text-gray-800">
            Clinics & NGOs
          </h2>
          <p className="text-gray-500">
            Discover local clinics and non-profits providing medical assistance.
          </p>
        </div>
      </div>
    </div>
  );
}
