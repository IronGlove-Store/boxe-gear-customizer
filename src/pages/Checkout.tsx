import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import Navigation from "@/components/Navigation";
import AddressForm from "@/components/checkout/AddressForm";
import ShippingMethodSelector, { ShippingMethod } from "@/components/checkout/ShippingMethodSelector";
import PaymentMethodSelector, { CardDetails, validateCardDetails } from "@/components/checkout/PaymentMethodSelector";
import OrderSummary from "@/components/checkout/OrderSummary";
import SuccessDialog from "@/components/checkout/SuccessDialog";
import DeliveryPointMap from "@/components/checkout/DeliveryPointMap";
import PersonalInfoForm from "@/components/checkout/PersonalInfoForm";

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
  
  const [personalInfo, setPersonalInfo] = useState({
    firstName: "",
    lastName: "",
    phone: "",
  });
  
  const [shippingMethods] = useState<ShippingMethod[]>(MOCK_SHIPPING_METHODS);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [deliveryCode, setDeliveryCode] = useState<string | null>(null);
  const [selectedDeliveryPoint, setSelectedDeliveryPoint] = useState<DeliveryPoint | null>(null);
  const [cardDetails, setCardDetails] = useState<CardDetails>({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: ""
  });
  const [cardErrors, setCardErrors] = useState<Partial<Record<keyof CardDetails, string>>>({});
  const [hasShownTestCardNotice, setHasShownTestCardNotice] = useState(false);
  
  const cartTotalString = getCartTotal().replace('€', '').trim();
  const cartTotal = parseFloat(cartTotalString);
  
  const selectedShipping = shippingMethods.find(m => m.id === selectedShippingMethod);
  const shippingCost = selectedShipping ? selectedShipping.price : 0;
  const orderTotal = cartTotal + shippingCost;
  
  const currentShippingMethod = shippingMethods.find(m => m.id === selectedShippingMethod);
  const requiresAddress = currentShippingMethod?.requires_address || false;
  const isTestShipping = currentShippingMethod?.is_test || false;
  const isPickupShipping = selectedShippingMethod === 'pickup';
  
  useEffect(() => {
    if (shippingMethods.length > 0 && !selectedShippingMethod) {
      setSelectedShippingMethod(shippingMethods[0].id);
    }
  }, [shippingMethods, selectedShippingMethod]);
  
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
  
  useEffect(() => {
    if (isSignedIn && items.length === 0) {
      toast({
        title: "Carrinho vazio",
        description: "Adicione produtos ao carrinho antes de finalizar a compra.",
      });
      navigate("/catalog");
    }
  }, [items, navigate, toast, isSignedIn]);
  
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
  
  const handlePersonalInfoChange = (field: string, value: string) => {
    setPersonalInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleCardDetailsChange = (field: keyof CardDetails, value: string) => {
    setCardDetails(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (cardErrors[field]) {
      setCardErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };
  
  const generateDeliveryCode = () => {
    const generateLetters = () => {
      let result = '';
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      for (let i = 0; i < 6; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      return result;
    };
    
    let code = generateLetters();
    
    const positions = [];
    while (positions.length < 2) {
      const pos = Math.floor(Math.random() * 6);
      if (!positions.includes(pos)) {
        positions.push(pos);
      }
    }
    
    const codeArray = code.split('');
    
    positions.forEach(pos => {
      codeArray[pos] = Math.floor(Math.random() * 10).toString();
    });
    
    return codeArray.join('');
  };
  
  const isFormValid = () => {
    if (!selectedShippingMethod) return false;
    
    if (
      personalInfo.firstName.trim() === "" ||
      personalInfo.lastName.trim() === "" ||
      personalInfo.phone.trim() === ""
    ) {
      return false;
    }
    
    if (isPickupShipping) {
      return selectedDeliveryPoint !== null;
    }
    
    if (requiresAddress && !isTestShipping) {
      return (
        address.street.trim() !== "" &&
        address.city.trim() !== "" &&
        address.postal_code.trim() !== ""
      );
    }
    
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
    
    if (paymentMethod === 'card') {
      const { isValid, errors, isTest } = validateCardDetails(cardDetails);
      
      if (!isValid) {
        setCardErrors(errors);
        toast({
          title: "Dados de cartão inválidos",
          description: "Verifique os dados inseridos do cartão",
          variant: "destructive",
        });
        return;
      }
      
      if (isTest && !hasShownTestCardNotice) {
        toast({
          title: "Cartão de teste detectado",
          description: "Usando cartão de teste válido do Stripe",
        });
        setHasShownTestCardNotice(true);
      }
    }
    
    setIsProcessing(true);
    
    try {
      const orderId = crypto.randomUUID();
      const deliveryCode = generateDeliveryCode();
      
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
        personalInfo: { ...personalInfo },
        deliveryInfo,
        deliveryCode,
        shippingMethod: selectedShippingMethod,
        paymentMethod: paymentMethod,
        total_amount: orderTotal,
        status: paymentMethod === 'test_card' ? 'completed' : 'processing',
        created_at: new Date().toISOString()
      };
      
      let userOrders = [];
      const savedOrders = localStorage.getItem(`orders-${user.id}`);
      
      if (savedOrders) {
        userOrders = JSON.parse(savedOrders);
      }
      
      userOrders.push(order);
      localStorage.setItem(`orders-${user.id}`, JSON.stringify(userOrders));
      
      localStorage.setItem('latestOrder', JSON.stringify({
        id: orderId,
        status: paymentMethod === 'test_card' ? 'completed' : 'processing',
        total_amount: orderTotal,
        created_at: new Date().toISOString(),
        payment_method: paymentMethod,
        shipping_method: selectedShipping?.name || "Envio de Teste",
        shipping_days: selectedShipping?.estimated_days || "Instantâneo",
        delivery_code: deliveryCode,
        personal_info: { ...personalInfo }
      }));
      
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
        delivery_type: deliveryInfo?.type,
        delivery_code: deliveryCode,
        personal_info: {
          firstName: personalInfo.firstName,
          lastName: personalInfo.lastName,
          phone: personalInfo.phone
        }
      };
      
      adminOrders.push(adminOrder);
      localStorage.setItem('admin_orders', JSON.stringify(adminOrders));
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setOrderId(orderId);
      setDeliveryCode(deliveryCode);
      setShowSuccessDialog(true);
      
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
          <div className="md:col-span-2 space-y-6">
            <PersonalInfoForm
              personalInfo={personalInfo}
              onPersonalInfoChange={handlePersonalInfoChange}
            />
            
            <ShippingMethodSelector
              shippingMethods={shippingMethods}
              selectedShippingMethod={selectedShippingMethod}
              onSelectShippingMethod={setSelectedShippingMethod}
            />
            
            <DeliveryPointMap
              isRequired={isPickupShipping}
              selectedDeliveryPoint={selectedDeliveryPoint}
              onSelectDeliveryPoint={setSelectedDeliveryPoint}
            />
            
            {requiresAddress && !isTestShipping && (
              <AddressForm
                address={address}
                onAddressChange={handleAddressChange}
              />
            )}
            
            <PaymentMethodSelector
              paymentMethod={paymentMethod}
              onSelectPaymentMethod={setPaymentMethod}
              cardDetails={cardDetails}
              onCardDetailsChange={handleCardDetailsChange}
              errors={cardErrors}
            />
          </div>
          
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
      
      <SuccessDialog
        open={showSuccessDialog}
        onOpenChange={setShowSuccessDialog}
        orderId={orderId}
        deliveryCode={deliveryCode}
        paymentMethod={paymentMethod}
        onContinue={handleCloseSuccess}
      />
    </div>
  );
};

export default Checkout;
