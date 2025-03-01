
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { SignIn, SignUp } from "@clerk/clerk-react";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    // Check if there's a signup parameter in the URL
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get("signup") === "true") {
      setIsSignUp(true);
    }
  }, [location]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isSignUp ? "Criar nova conta" : "Entrar na sua conta"}
          </h2>
        </div>
        {isSignUp ? (
          <SignUp 
            routing="path" 
            path="/auth"
            afterSignUpUrl="/"
            redirectUrl="/"
          />
        ) : (
          <SignIn 
            routing="path" 
            path="/auth"
            afterSignInUrl="/"
            redirectUrl="/"
          />
        )}
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
  );
};

export default Auth;
