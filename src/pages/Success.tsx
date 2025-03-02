
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";
import Navigation from "@/components/Navigation";
import { CheckCircle, Package, Truck, ArrowRight } from "lucide-react";
import { useUser } from "@clerk/clerk-react";

// Interface para o estado que armazenamos
interface Order {
  id: string;
  status: string;
  total_amount: number;
  created_at: string;
  payment_method: string;
  shipping_method: string;
  shipping_days: string;
}

const Success = () => {
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const { user } = useUser();
  const [latestOrder, setLatestOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simular busca de pedido usando localStorage
  useEffect(() => {
    async function fetchLatestOrder() {
      try {
        // Tentar buscar o último pedido do localStorage
        const storedOrder = localStorage.getItem('latestOrder');
        
        if (storedOrder) {
          setLatestOrder(JSON.parse(storedOrder));
        } else {
          // Se não encontrar no localStorage, usar dados simulados
          const mockOrder = {
            id: "temp" + Math.random().toString(36).substring(2, 15),
            status: "processing",
            total_amount: 199.99,
            created_at: new Date().toISOString(),
            payment_method: "card",
            shipping_method: "Entrega Padrão",
            shipping_days: "3-5 dias úteis"
          };
          
          // Guardar no localStorage para futuras visitas
          localStorage.setItem('latestOrder', JSON.stringify(mockOrder));
          setLatestOrder(mockOrder);
        }
      } catch (error) {
        console.error('Erro ao buscar pedido:', error);
        // Se houver erro, mostrar dados simulados
        const mockOrder = {
          id: "temp" + Math.random().toString(36).substring(2, 15),
          status: "processing",
          total_amount: 199.99,
          created_at: new Date().toISOString(),
          payment_method: "card",
          shipping_method: "Entrega Padrão",
          shipping_days: "3-5 dias úteis"
        };
        
        localStorage.setItem('latestOrder', JSON.stringify(mockOrder));
        setLatestOrder(mockOrder);
      } finally {
        setIsLoading(false);
      }
    }

    fetchLatestOrder();
    
    // Limpar o carrinho quando o componente for montado
    clearCart();
  }, [clearCart]);

  // Formatação de data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-4 py-16 max-w-4xl pt-32">
        <div className="text-center mb-8">
          <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
          <h1 className="text-4xl font-bold mt-4">Pedido Confirmado!</h1>
          <p className="text-lg text-gray-600 mt-2">
            Obrigado por sua compra! {latestOrder && `O pedido #${latestOrder.id.substring(0, 8)} foi registrado com sucesso.`}
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <p>Carregando detalhes do pedido...</p>
          </div>
        ) : latestOrder ? (
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Detalhes do Pedido
              </CardTitle>
              <CardDescription>
                Pedido realizado em {formatDate(latestOrder.created_at)}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Número do Pedido:</span>
                  <span className="font-medium">#{latestOrder.id.substring(0, 8)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium">
                    {latestOrder.status === 'completed' ? 'Concluído' : 
                    latestOrder.status === 'processing' ? 'Em processamento' :
                    latestOrder.status === 'pending' ? 'Pendente' : 'Cancelado'}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Método de Pagamento:</span>
                  <span className="font-medium">
                    {latestOrder.payment_method === 'card' ? 'Cartão de Crédito/Débito' : 
                    latestOrder.payment_method === 'test_card' ? 'Cartão de Teste' : 
                    latestOrder.payment_method}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Total:</span>
                  <span className="font-medium">€ {latestOrder.total_amount.toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-medium flex items-center gap-2 mb-3">
                  <Truck className="h-5 w-5" />
                  Informações de Envio
                </h3>
                <p className="text-gray-600">{latestOrder.shipping_method}</p>
                <p className="text-gray-600">{latestOrder.shipping_days}</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => navigate("/")}>
                Voltar para a Loja
              </Button>
              <Button onClick={() => navigate("/catalog")}>
                Continuar Comprando
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <div className="text-center py-8">
            <p>Não foi possível encontrar detalhes do pedido.</p>
            <Button onClick={() => navigate("/catalog")} className="mt-4">
              Continuar Comprando
            </Button>
          </div>
        )}
      </div>
    </main>
  );
};

export default Success;
