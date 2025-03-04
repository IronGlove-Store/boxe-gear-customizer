
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Loader2, CreditCard, Truck, Home, CheckCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useCart } from "@/contexts/CartContext";
import Navigation from "@/components/Navigation";

interface ShippingMethod {
  id: string;
  name: string;
  price: number;
  estimated_days: string;
  is_test: boolean;
}

interface Address {
  street: string;
  city: string;
  postal_code: string;
  country: string;
}

// Mock shipping methods since we're not using Supabase
const MOCK_SHIPPING_METHODS: ShippingMethod[] = [
  {
    id: "standard",
    name: "Envio Standard",
    price: 4.99,
    estimated_days: "3-5 dias úteis",
    is_test: false
  },
  {
    id: "express",
    name: "Envio Expresso",
    price: 9.99,
    estimated_days: "1-2 dias úteis",
    is_test: false
  },
  {
    id: "free",
    name: "Envio Gratuito",
    price: 0,
    estimated_days: "5-7 dias úteis (para compras acima de €50)",
    is_test: true
  }
];

const Checkout = () => {
  const { user, isSignedIn } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { items, getCartTotal, clearCart } = useCart();
  
  const [address, setAddress] = useState<Address>({
    street: "",
    city: "",
    postal_code: "",
    country: "Portugal",
  });
  
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>(MOCK_SHIPPING_METHODS);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  
  // Formatar o total do carrinho como número
  const cartTotalString = getCartTotal().replace('€', '').trim();
  const cartTotal = parseFloat(cartTotalString);
  
  // Calcular o total do pedido incluindo o frete
  const selectedShipping = shippingMethods.find(m => m.id === selectedShippingMethod);
  const shippingCost = selectedShipping ? selectedShipping.price : 0;
  const orderTotal = cartTotal + shippingCost;
  
  // Definir primeiro método de envio como padrão
  useEffect(() => {
    if (shippingMethods.length > 0 && !selectedShippingMethod) {
      setSelectedShippingMethod(shippingMethods[0].id);
    }
  }, [shippingMethods, selectedShippingMethod]);
  
  // Verificar se o usuário está autenticado
  useEffect(() => {
    if (!isSignedIn) {
      toast({
        title: "Autenticação necessária",
        description: "Precisas estar autenticado para finalizar a compra.",
        variant: "destructive",
      });
      navigate("/auth");
    }
  }, [isSignedIn, navigate, toast]);
  
  // Verificar se o carrinho está vazio
  useEffect(() => {
    if (items.length === 0) {
      toast({
        title: "Carrinho vazio",
        description: "Adicione produtos ao carrinho antes de finalizar a compra.",
      });
      navigate("/catalog");
    }
  }, [items, navigate, toast]);
  
  const handleAddressChange = (field: keyof Address, value: string) => {
    setAddress(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const isFormValid = () => {
    return (
      address.street.trim() !== "" &&
      address.city.trim() !== "" &&
      address.postal_code.trim() !== "" &&
      selectedShippingMethod !== null
    );
  };
  
  const handlePlaceOrder = async () => {
    if (!isFormValid()) {
      toast({
        title: "Formulário incompleto",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }
    
    if (!user || !isSignedIn) {
      toast({
        title: "Autenticação necessária",
        description: "Precisas estar autenticado para finalizar a compra.",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Gerar IDs únicos para o pedido
      const orderId = crypto.randomUUID();
      
      // Criar objeto de pedido
      const order = {
        id: orderId,
        userId: user.id,
        items: items.map(item => ({
          productId: item.id,
          name: item.name,
          price: parseFloat(item.price.replace('€', '').trim()),
          quantity: item.quantity,
          size: item.size,
          color: item.color
        })),
        address: {
          ...address
        },
        shippingMethod: selectedShippingMethod,
        paymentMethod: paymentMethod,
        totalAmount: orderTotal,
        status: paymentMethod === 'test_card' ? 'completed' : 'processing',
        createdAt: new Date().toISOString()
      };
      
      // Salvar pedido no localStorage
      let userOrders = [];
      const savedOrders = localStorage.getItem(`orders-${user.id}`);
      
      if (savedOrders) {
        userOrders = JSON.parse(savedOrders);
      }
      
      userOrders.push(order);
      localStorage.setItem(`orders-${user.id}`, JSON.stringify(userOrders));
      
      // Simular processamento de pagamento (2 segundos)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Salvar o ID do pedido e mostrar mensagem de sucesso
      setOrderId(orderId);
      setShowSuccessDialog(true);
      
      // Limpar o carrinho
      clearCart();
      
    } catch (error) {
      console.error('Erro ao processar pedido:', error);
      toast({
        title: "Erro no processamento",
        description: "Ocorreu um erro ao processar o pedido. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleCloseSuccess = () => {
    setShowSuccessDialog(false);
    navigate("/success");
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-12 pt-32">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Formulário de endereço */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="w-5 h-5" />
                  Endereço de Entrega
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label htmlFor="street" className="text-sm font-medium mb-1 block">
                    Rua e Número
                  </label>
                  <Input 
                    id="street" 
                    value={address.street} 
                    onChange={(e) => handleAddressChange('street', e.target.value)}
                    placeholder="Ex: Avenida da Liberdade, 123"
                  />
                </div>
                
                <div>
                  <label htmlFor="city" className="text-sm font-medium mb-1 block">
                    Cidade
                  </label>
                  <Input 
                    id="city" 
                    value={address.city} 
                    onChange={(e) => handleAddressChange('city', e.target.value)}
                    placeholder="Ex: Lisboa"
                  />
                </div>
                
                <div>
                  <label htmlFor="postal_code" className="text-sm font-medium mb-1 block">
                    Código Postal
                  </label>
                  <Input 
                    id="postal_code" 
                    value={address.postal_code} 
                    onChange={(e) => handleAddressChange('postal_code', e.target.value)}
                    placeholder="Ex: 1250-096"
                  />
                </div>
              </CardContent>
            </Card>
            
            {/* Métodos de envio */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  Método de Envio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {shippingMethods.map((method) => (
                    <div 
                      key={method.id}
                      className={`p-4 border rounded-lg flex items-start gap-4 cursor-pointer transition-colors ${
                        selectedShippingMethod === method.id ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedShippingMethod(method.id)}
                    >
                      <Checkbox 
                        checked={selectedShippingMethod === method.id}
                        onCheckedChange={() => setSelectedShippingMethod(method.id)}
                      />
                      
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-medium">{method.name}</h3>
                          <span className="font-medium">€ {method.price.toFixed(2)}</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{method.estimated_days}</p>
                        {method.is_test && (
                          <p className="text-xs text-blue-600 mt-1">Opção para demonstração</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Método de pagamento */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Método de Pagamento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div 
                    className={`p-4 border rounded-lg flex items-start gap-4 cursor-pointer transition-colors ${
                      paymentMethod === 'card' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setPaymentMethod('card')}
                  >
                    <Checkbox 
                      checked={paymentMethod === 'card'}
                      onCheckedChange={() => setPaymentMethod('card')}
                    />
                    
                    <div className="flex-1">
                      <h3 className="font-medium">Cartão de Crédito/Débito</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Pagamento seguro via cartão
                      </p>
                    </div>
                  </div>
                  
                  <div 
                    className={`p-4 border rounded-lg flex items-start gap-4 cursor-pointer transition-colors ${
                      paymentMethod === 'test_card' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setPaymentMethod('test_card')}
                  >
                    <Checkbox 
                      checked={paymentMethod === 'test_card'} 
                      onCheckedChange={() => setPaymentMethod('test_card')}
                    />
                    
                    <div className="flex-1">
                      <h3 className="font-medium">Cartão de Teste</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Opção para demonstração (pagamento simulado)
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        Marcar pedido como concluído automaticamente
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Resumo do pedido */}
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.size}`} className="flex justify-between">
                      <span>
                        {item.name} ({item.size}) x{item.quantity}
                      </span>
                      <span>{item.price}</span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-2 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>€ {cartTotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Envio</span>
                    <span>€ {shippingCost.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between font-bold border-t pt-2">
                    <span>Total</span>
                    <span>€ {orderTotal.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  size="lg" 
                  onClick={handlePlaceOrder}
                  disabled={isProcessing || !isFormValid()}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    'Finalizar Pedido'
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Diálogo de sucesso */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="text-green-500 h-6 w-6" />
              Pedido Confirmado!
            </DialogTitle>
            <DialogDescription>
              O seu pedido #{orderId?.substring(0, 8)} foi registrado com sucesso.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <p>
              {paymentMethod === 'test_card' 
                ? 'O seu pedido foi concluído utilizando o cartão de teste.'
                : 'O seu pedido está sendo processado. Você receberá uma confirmação por email.'}
            </p>
          </div>
          
          <DialogFooter>
            <Button onClick={handleCloseSuccess} className="w-full">
              Continuar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Checkout;
