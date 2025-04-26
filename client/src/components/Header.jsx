import { HandHeart } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-300 bg-[#f0f0f0]/95 backdrop-blur bg-background/60 supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-start px-4">
        <Link to="/" className="flex items-center space-x-2">
          <HandHeart className="h-6 w-6 text-[#ffb441]" />
          <span className="font-bold text-xl text-[#333]">AidFind</span>
        </Link>
        <nav className="flex items-center ml-6 space-x-6 text-sm font-medium text-gray-700">
          <Link
            to="/search"
            className="hover:text-[#ffb441] transition duration-300 ease-in-out"
          >
            Find Aid
          </Link>
          <Link
            to="/register"
            className="hover:text-[#ffb441] transition duration-300 ease-in-out"
          >
            Register as Donor
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
