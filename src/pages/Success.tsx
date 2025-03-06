import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";
import Navigation from "@/components/Navigation";
import { CheckCircle, Package, Truck, ArrowRight, Printer, User } from "lucide-react";
import { useUser } from "@clerk/clerk-react";

interface Order {
  id: string;
  status: string;
  total_amount: number;
  created_at: string;
  payment_method: string;
  shipping_method: string;
  shipping_days: string;
  delivery_code?: string;
  personal_info?: {
    firstName: string;
    lastName: string;
    phone: string;
  };
}

const Success = () => {
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const { user } = useUser();
  const [latestOrder, setLatestOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchLatestOrder() {
      try {
        const storedOrder = localStorage.getItem('latestOrder');
        
        if (storedOrder) {
          setLatestOrder(JSON.parse(storedOrder));
        } else {
          const mockOrder = {
            id: "temp" + Math.random().toString(36).substring(2, 15),
            status: "processing",
            total_amount: 199.99,
            created_at: new Date().toISOString(),
            payment_method: "card",
            shipping_method: "Entrega Padrão",
            shipping_days: "3-5 dias úteis",
            delivery_code: "ENT" + Math.random().toString(36).substring(2, 8).toUpperCase()
          };
          
          localStorage.setItem('latestOrder', JSON.stringify(mockOrder));
          setLatestOrder(mockOrder);
        }
      } catch (error) {
        console.error('Erro ao buscar pedido:', error);
        const mockOrder = {
          id: "temp" + Math.random().toString(36).substring(2, 15),
          status: "processing",
          total_amount: 199.99,
          created_at: new Date().toISOString(),
          payment_method: "card",
          shipping_method: "Entrega Padrão",
          shipping_days: "3-5 dias úteis",
          delivery_code: "ENT" + Math.random().toString(36).substring(2, 8).toUpperCase()
        };
        
        localStorage.setItem('latestOrder', JSON.stringify(mockOrder));
        setLatestOrder(mockOrder);
      } finally {
        setIsLoading(false);
      }
    }

    fetchLatestOrder();
    
    clearCart();
  }, [clearCart]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handlePrintDeliveryCode = () => {
    if (!latestOrder?.delivery_code) return;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Código de Entrega - Pedido #${latestOrder.id.substring(0, 8)}</title>
            <style>
              body { font-family: Arial, sans-serif; text-align: center; padding: 20px; }
              .code { font-size: 32px; font-weight: bold; margin: 30px 0; padding: 20px; border: 2px dashed #333; }
              .info { margin-bottom: 20px; }
              @media print {
                button { display: none; }
              }
            </style>
          </head>
          <body>
            <h1>Código de Entrega</h1>
            <div class="info">Pedido #${latestOrder.id.substring(0, 8)}</div>
            <div class="info">Data: ${formatDate(latestOrder.created_at)}</div>
            <div class="code">${latestOrder.delivery_code}</div>
            <p>Apresente este código no momento da recolha do seu pedido.</p>
            <button onclick="window.print()">Imprimir</button>
            <button onclick="window.close()">Fechar</button>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
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

              {latestOrder.delivery_code && (
                <div className="bg-gray-50 p-4 rounded-lg border-2 border-dashed border-gray-300">
                  <h3 className="font-medium mb-2">Código de Entrega:</h3>
                  <div className="text-2xl font-mono text-center py-2 font-bold">{latestOrder.delivery_code}</div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-2 flex items-center justify-center gap-2"
                    onClick={handlePrintDeliveryCode}
                  >
                    <Printer className="h-4 w-4" />
                    Imprimir Código
                  </Button>
                  <p className="text-sm text-gray-500 mt-2">
                    Guarde este código para apresentar na recolha do seu pedido.
                  </p>
                </div>
              )}

              <div className="border-t pt-4">
                <h3 className="font-medium flex items-center gap-2 mb-3">
                  <Truck className="h-5 w-5" />
                  Informações de Envio
                </h3>
                <p className="text-gray-600">{latestOrder.shipping_method}</p>
                <p className="text-gray-600">{latestOrder.shipping_days}</p>
              </div>
              
              {latestOrder.personal_info && (
                <div className="border-t pt-4">
                  <h3 className="font-medium flex items-center gap-2 mb-3">
                    <User className="h-5 w-5" />
                    Informações Pessoais
                  </h3>
                  <p className="text-gray-600">
                    {latestOrder.personal_info.firstName} {latestOrder.personal_info.lastName}
                  </p>
                  <p className="text-gray-600">Telefone: {latestOrder.personal_info.phone}</p>
                </div>
              )}
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
