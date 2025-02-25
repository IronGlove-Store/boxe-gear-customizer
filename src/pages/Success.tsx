
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import Navigation from "@/components/Navigation";
import { CheckCircle } from "lucide-react";

const Success = () => {
  const navigate = useNavigate();
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="container mx-auto px-4 py-24 max-w-4xl">
        <div className="text-center space-y-6">
          <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
          <h1 className="text-4xl font-bold">Pedido Confirmado!</h1>
          <p className="text-lg text-gray-600">
            Obrigado por sua compra! Em breve você receberá um e-mail com os detalhes do pedido.
          </p>
          <div className="pt-6">
            <Button onClick={() => navigate("/catalog")}>
              Continuar Comprando
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Success;
