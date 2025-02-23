
import { useState, useEffect } from "react";
import { ShoppingCart, Menu } from "lucide-react";

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/80 backdrop-blur-lg shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-8">
            <a href="/" className="text-2xl font-bold tracking-tighter hover:opacity-80 transition-opacity">
              BOXEGEAR
            </a>
            <div className="hidden md:flex items-center gap-8">
              <a href="#" className="hover:text-gray-600 transition-colors font-medium">
                Shop
              </a>
              <a href="#" className="hover:text-gray-600 transition-colors font-medium">
                Customize
              </a>
              <a href="#" className="hover:text-gray-600 transition-colors font-medium">
                About
              </a>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button className="p-2.5 hover:bg-gray-100 rounded-full transition-all duration-300 hover:scale-105">
              <ShoppingCart className="h-5 w-5" />
            </button>
            <button className="md:hidden p-2.5 hover:bg-gray-100 rounded-full transition-all duration-300 hover:scale-105">
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
