
import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Cart } from "./Cart";

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isLight = location.pathname === '/';

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled || !isLight ? "bg-white/80 backdrop-blur-lg shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-8">
            <Link to="/" className={`text-2xl font-bold tracking-tighter hover:opacity-80 transition-opacity ${isLight && !isScrolled ? 'text-white' : 'text-black'}`}>
              BOXEGEAR
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link
                to="/catalog"
                className={`hover:text-gray-600 transition-colors font-medium ${isLight && !isScrolled ? 'text-white' : 'text-black'}`}
              >
                Shop
              </Link>
              <Link
                to="/customize"
                className={`hover:text-gray-600 transition-colors font-medium ${isLight && !isScrolled ? 'text-white' : 'text-black'}`}
              >
                Customize
              </Link>
              <Link
                to="#"
                className={`hover:text-gray-600 transition-colors font-medium ${isLight && !isScrolled ? 'text-white' : 'text-black'}`}
              >
                About
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <Cart />
            <button className={`md:hidden p-2.5 rounded-full transition-all duration-300 hover:scale-105 ${isLight && !isScrolled ? 'text-white hover:bg-white/10' : 'text-black hover:bg-gray-100'}`}>
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
