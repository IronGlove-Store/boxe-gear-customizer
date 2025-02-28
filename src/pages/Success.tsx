
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";
import Navigation from "@/components/Navigation";
import { CheckCircle, Package, Truck, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useUser } from "@clerk/clerk-react";

// Interface para representar o tipo de dados que recebemos do Supabase
interface OrderData {
  id: string;
  status: string;
  total_amount: number;
  created_at: string;
  payment_method: string;
  shipping_method_id: string;
  shipping_methods: any; // Usando any para lidar com diferentes formatos de resposta
}

// Interface para o estado que armazenamos
interface Order {
  id: string;
  status: string;
  total_amount: number;
  created_at: string;
  payment_method: string;
  shipping_method: {
    name: string;
    estimated_days: string;
  };
}

const Success = () => {
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const { user } = useUser();
  const [latestOrder, setLatestOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Buscar o pedido mais recente do usuário
  useEffect(() => {
    if (user) {
      async function fetchLatestOrder() {
        try {
          const { data, error } = await supabase
            .from('orders')
            .select(`
              id,
              status,
              total_amount,
              created_at,
              payment_method,
              shipping_method_id,
              shipping_methods:shipping_method_id (
                name,
                estimated_days
              )
            `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          if (error) throw error;
          if (data) {
            console.log("Dados recebidos do Supabase:", data);
            
            // Converter o formato recebido do Supabase para o formato esperado pelo estado
            const shippingMethod = {
              name: "Não disponível",
              estimated_days: "Não disponível"
            };
            
            // Verificar os tipos e estrutura dos dados retornados
            console.log("Tipo de shipping_methods:", typeof data.shipping_methods);
            console.log("É array?", Array.isArray(data.shipping_methods));
            
            // Extrair os dados de shipping_method com verificações seguras
            if (data.shipping_methods) {
              if (Array.isArray(data.shipping_methods) && data.shipping_methods.length > 0) {
                const firstMethod = data.shipping_methods[0];
                if (firstMethod && typeof firstMethod === 'object') {
                  shippingMethod.name = firstMethod.name || "Não disponível";
                  shippingMethod.estimated_days = firstMethod.estimated_days || "Não disponível";
                }
              } else if (typeof data.shipping_methods === 'object' && data.shipping_methods !== null) {
                // Caso seja um objeto direto
                shippingMethod.name = data.shipping_methods.name || "Não disponível";
                shippingMethod.estimated_days = data.shipping_methods.estimated_days || "Não disponível";
              }
            }
            
            setLatestOrder({
              id: data.id,
              status: data.status,
              total_amount: data.total_amount,
              created_at: data.created_at,
              payment_method: data.payment_method,
              shipping_method: shippingMethod
            });
          }
        } catch (error) {
          console.error('Erro ao buscar pedido:', error);
        } finally {
          setIsLoading(false);
        }
      }

      fetchLatestOrder();
    }
  }, [user]);

  // Limpar o carrinho quando o componente for montado
  useEffect(() => {
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
                <p className="text-gray-600">{latestOrder.shipping_method.name}</p>
                <p className="text-gray-600">{latestOrder.shipping_method.estimated_days}</p>
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
