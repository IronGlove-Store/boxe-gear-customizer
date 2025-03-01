
import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Cart } from "./Cart";
import { Button } from "./ui/button";
import { supabase } from "@/lib/supabase";

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Check initial auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsSignedIn(!!session);
    });

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setIsSignedIn(!!session);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

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
              PUGIL
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link
                to="/catalog"
                className={`hover:text-gray-600 transition-colors font-medium ${isLight && !isScrolled ? 'text-white' : 'text-black'}`}
              >
                Catálogo
              </Link>
              <Link
                to="/customize"
                className={`hover:text-gray-600 transition-colors font-medium ${isLight && !isScrolled ? 'text-white' : 'text-black'}`}
              >
                Personalizar
              </Link>
              <Link
                to="/about"
                className={`hover:text-gray-600 transition-colors font-medium ${isLight && !isScrolled ? 'text-white' : 'text-black'}`}
              >
                Sobre
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-6">
            {isSignedIn ? (
              <Button 
                variant="ghost" 
                className={isLight && !isScrolled ? 'text-white hover:bg-white/10' : ''}
                onClick={handleSignOut}
              >
                Sair
              </Button>
            ) : (
              <div className="hidden md:flex items-center gap-4">
                <Link to="/auth">
                  <Button variant="ghost" className={isLight && !isScrolled ? 'text-white hover:bg-white/10' : ''}>
                    Entrar
                  </Button>
                </Link>
                <Link to="/auth?signup=true">
                  <Button variant={isLight && !isScrolled ? 'outline' : 'default'} className={isLight && !isScrolled ? 'text-white border-white hover:bg-white hover:text-black' : ''}>
                    Criar Conta
                  </Button>
                </Link>
              </div>
            )}
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
