
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { 
  SignInButton, 
  SignUpButton,
  useUser
} from "@clerk/clerk-react";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { isSignedIn } = useUser();

  useEffect(() => {
    // Check if there's a signup parameter in the URL
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get("signup") === "true") {
      setIsSignUp(true);
    }

    // If user is already signed in, redirect to home
    if (isSignedIn) {
      navigate("/");
    }
  }, [location, isSignedIn, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isSignUp ? "Criar nova conta" : "Entrar na sua conta"}
          </h2>
        </div>
        
        <div className="mt-8 space-y-6">
          <div className="flex justify-center">
            {isSignUp ? (
              <SignUpButton mode="modal" redirectUrl={window.location.origin}>
                <Button size="lg" className="w-full">
                  Criar Conta
                </Button>
              </SignUpButton>
            ) : (
              <SignInButton mode="modal" redirectUrl={window.location.origin}>
                <Button size="lg" className="w-full">
                  Entrar
                </Button>
              </SignInButton>
            )}
          </div>
          
          <div className="text-center">
            <button
              type="button"
              className="text-sm text-blue-600 hover:text-blue-500"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp
                ? "Já tem uma conta? Entre aqui"
                : "Não tem uma conta? Cadastre-se"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
