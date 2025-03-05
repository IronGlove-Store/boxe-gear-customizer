
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { useToast } from "@/components/ui/use-toast";
import { useCart } from "@/contexts/CartContext";
import Navigation from "@/components/Navigation";
import AddressForm from "@/components/checkout/AddressForm";
import ShippingMethodSelector, { ShippingMethod } from "@/components/checkout/ShippingMethodSelector";
import PaymentMethodSelector from "@/components/checkout/PaymentMethodSelector";
import OrderSummary from "@/components/checkout/OrderSummary";
import SuccessDialog from "@/components/checkout/SuccessDialog";
import DeliveryPointMap from "@/components/checkout/DeliveryPointMap";

// Mock shipping methods
const MOCK_SHIPPING_METHODS: ShippingMethod[] = [
  {
    id: "standard",
    name: "Envio Standard",
    price: 4.99,
    estimated_days: "3-5 dias úteis",
    is_test: false,
    requires_address: true
  },
  {
    id: "express",
    name: "Envio Expresso",
    price: 9.99,
    estimated_days: "1-2 dias úteis",
    is_test: false,
    requires_address: true
  },
  {
    id: "pickup",
    name: "Recolha em Ponto de Entrega",
    price: 2.99,
    estimated_days: "2-4 dias úteis",
    is_test: false,
    requires_address: false
  },
  {
    id: "free",
    name: "Envio Gratuito",
    price: 0,
    estimated_days: "5-7 dias úteis (para compras acima de €50)",
    is_test: false,
    requires_address: true
  },
  {
    id: "test",
    name: "Envio de Teste",
    price: 0,
    estimated_days: "Instantâneo (apenas para teste)",
    is_test: true,
    requires_address: false
  }
];

interface DeliveryPoint {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
}

const Checkout = () => {
  const { user, isSignedIn } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { items, getCartTotal, clearCart } = useCart();
  
  const [address, setAddress] = useState({
    street: "",
    city: "",
    postal_code: "",
    country: "Portugal",
  });
  
  const [shippingMethods] = useState<ShippingMethod[]>(MOCK_SHIPPING_METHODS);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [selectedDeliveryPoint, setSelectedDeliveryPoint] = useState<DeliveryPoint | null>(null);
  
  // Format cart total as number
  const cartTotalString = getCartTotal().replace('€', '').trim();
  const cartTotal = parseFloat(cartTotalString);
  
  // Calculate order total including shipping
  const selectedShipping = shippingMethods.find(m => m.id === selectedShippingMethod);
  const shippingCost = selectedShipping ? selectedShipping.price : 0;
  const orderTotal = cartTotal + shippingCost;
  
  // Get the selected shipping method object
  const currentShippingMethod = shippingMethods.find(m => m.id === selectedShippingMethod);
  const requiresAddress = currentShippingMethod?.requires_address || false;
  const isTestShipping = currentShippingMethod?.is_test || false;
  const isPickupShipping = selectedShippingMethod === 'pickup';
  
  // Set first shipping method as default
  useEffect(() => {
    if (shippingMethods.length > 0 && !selectedShippingMethod) {
      setSelectedShippingMethod(shippingMethods[0].id);
    }
  }, [shippingMethods, selectedShippingMethod]);
  
  // Check if user is authenticated
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
  
  // Check if cart is empty
  useEffect(() => {
    if (isSignedIn && items.length === 0) {
      toast({
        title: "Carrinho vazio",
        description: "Adicione produtos ao carrinho antes de finalizar a compra.",
      });
      navigate("/catalog");
    }
  }, [items, navigate, toast, isSignedIn]);
  
  // Reset delivery point when shipping method changes
  useEffect(() => {
    if (!isPickupShipping) {
      setSelectedDeliveryPoint(null);
    }
  }, [isPickupShipping]);
  
  const handleAddressChange = (field: string, value: string) => {
    setAddress(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const isFormValid = () => {
    if (!selectedShippingMethod) return false;
    
    // If pickup shipping, check if delivery point is selected
    if (isPickupShipping) {
      return selectedDeliveryPoint !== null;
    }
    
    // If shipping method requires address, check address fields
    if (requiresAddress && !isTestShipping) {
      return (
        address.street.trim() !== "" &&
        address.city.trim() !== "" &&
        address.postal_code.trim() !== ""
      );
    }
    
    // If shipping method doesn't require address or is test, form is valid
    return true;
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
      // Generate unique ID for order
      const orderId = crypto.randomUUID();
      
      // Create delivery information based on shipping method
      let deliveryInfo = null;
      
      if (isPickupShipping && selectedDeliveryPoint) {
        deliveryInfo = {
          type: "pickup",
          deliveryPoint: selectedDeliveryPoint
        };
      } else if (requiresAddress && !isTestShipping) {
        deliveryInfo = {
          type: "address",
          address: { ...address }
        };
      } else {
        deliveryInfo = {
          type: "test",
          note: "Envio de teste (sem endereço)"
        };
      }
      
      // Create order object
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
        deliveryInfo,
        shippingMethod: selectedShippingMethod,
        paymentMethod: paymentMethod,
        total_amount: orderTotal,
        status: paymentMethod === 'test_card' ? 'completed' : 'processing',
        created_at: new Date().toISOString()
      };
      
      // Save order in localStorage
      let userOrders = [];
      const savedOrders = localStorage.getItem(`orders-${user.id}`);
      
      if (savedOrders) {
        userOrders = JSON.parse(savedOrders);
      }
      
      userOrders.push(order);
      localStorage.setItem(`orders-${user.id}`, JSON.stringify(userOrders));
      
      // Save order in admin orders
      let adminOrders = [];
      const savedAdminOrders = localStorage.getItem('admin_orders');
      
      if (savedAdminOrders) {
        adminOrders = JSON.parse(savedAdminOrders);
      }
      
      const adminOrder = {
        id: orderId,
        status: paymentMethod === 'test_card' ? 'completed' : 'processing',
        total_amount: orderTotal,
        created_at: new Date().toISOString(),
        payment_method: paymentMethod,
        shipping_method: selectedShipping?.name || "Envio de Teste",
        shipping_days: selectedShipping?.estimated_days || "Instantâneo",
        user_id: user.id,
        delivery_type: deliveryInfo?.type
      };
      
      adminOrders.push(adminOrder);
      localStorage.setItem('admin_orders', JSON.stringify(adminOrders));
      
      // Simulate payment processing (2 seconds)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Save order ID and show success message
      setOrderId(orderId);
      setShowSuccessDialog(true);
      
      // Clear cart
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
          {/* Formulário de endereço e métodos */}
          <div className="md:col-span-2 space-y-6">
            {/* Métodos de envio */}
            <ShippingMethodSelector
              shippingMethods={shippingMethods}
              selectedShippingMethod={selectedShippingMethod}
              onSelectShippingMethod={setSelectedShippingMethod}
            />
            
            {/* Mapa de seleção de ponto de entrega (apenas para método de recolha) */}
            <DeliveryPointMap
              isRequired={isPickupShipping}
              selectedDeliveryPoint={selectedDeliveryPoint}
              onSelectDeliveryPoint={setSelectedDeliveryPoint}
            />
            
            {/* Formulário de endereço (apenas mostrado se o método de envio selecionado exigir endereço) */}
            {requiresAddress && !isTestShipping && (
              <AddressForm
                address={address}
                onAddressChange={handleAddressChange}
              />
            )}
            
            {/* Método de pagamento */}
            <PaymentMethodSelector
              paymentMethod={paymentMethod}
              onSelectPaymentMethod={setPaymentMethod}
            />
          </div>
          
          {/* Resumo do pedido */}
          <div>
            <OrderSummary
              items={items}
              cartTotal={cartTotal}
              shippingCost={shippingCost}
              orderTotal={orderTotal}
              isProcessing={isProcessing}
              formValid={isFormValid()}
              onPlaceOrder={handlePlaceOrder}
            />
          </div>
        </div>
      </div>
      
      {/* Diálogo de sucesso */}
      <SuccessDialog
        open={showSuccessDialog}
        onOpenChange={setShowSuccessDialog}
        orderId={orderId}
        paymentMethod={paymentMethod}
        onContinue={handleCloseSuccess}
      />
    </div>
  );
};

export default Checkout;
