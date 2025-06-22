import { HandHeart, User, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-300 bg-[#f0f0f0]/95 backdrop-blur bg-background/60 supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4">
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-2">
            <HandHeart className="h-6 w-6 text-[#ffb441]" />
            <span className="font-bold text-xl text-[#333]">AidFind</span>
          </Link>
        </div>

        {/* Auth Navigation */}
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="text-sm font-medium text-gray-700 hover:text-[#ffb441] transition duration-300 ease-in-out"
              >
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="flex items-center space-x-1 text-sm font-medium text-red-600 hover:text-red-700 transition duration-300 ease-in-out"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <div className="flex items-center space-x-6">
              <nav className="flex items-center space-x-6 text-sm font-medium text-gray-700">
                <Link
                  to="/search"
                  className="hover:text-[#ffb441] transition duration-300 ease-in-out"
                >
                  Find Aid
                </Link>
              </nav>
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-700 hover:text-[#ffb441] transition duration-300 ease-in-out"
                >
                  Login
                </Link>
                <Link
                  to="/user-register"
                  className="bg-[#ffb441] text-white px-4 py-2 rounded-lg hover:bg-[#ffa726] transition duration-300 ease-in-out text-sm font-medium"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
