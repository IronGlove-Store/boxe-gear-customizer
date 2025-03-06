
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import Navigation from "@/components/Navigation";
import OrderSummary from "@/components/checkout/OrderSummary";
import SuccessDialog from "@/components/checkout/SuccessDialog";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import OrderProcessor from "@/components/checkout/OrderProcessor";
import { ShippingMethod } from "@/components/checkout/ShippingMethodSelector";
import { CardDetails } from "@/components/checkout/PaymentMethodSelector";

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
  const { items, getCartTotal } = useCart();
  
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
    
    if (requiresAddress && !currentShippingMethod?.is_test) {
      return (
        address.street.trim() !== "" &&
        address.city.trim() !== "" &&
        address.postal_code.trim() !== ""
      );
    }
    
    return true;
  };
  
  const handleOrderSuccess = (newOrderId: string, newDeliveryCode: string) => {
    setOrderId(newOrderId);
    setDeliveryCode(newDeliveryCode);
    setShowSuccessDialog(true);
  };
  
  const handleCloseSuccess = () => {
    setShowSuccessDialog(false);
    navigate("/success");
  };
  
  const { handlePlaceOrder } = OrderProcessor({
    personalInfo,
    address,
    selectedShippingMethod,
    paymentMethod,
    cardDetails, 
    selectedDeliveryPoint,
    cartTotal,
    shippingCost,
    orderTotal,
    shippingMethods,
    isFormValid: isFormValid(),
    onSuccess: handleOrderSuccess,
    setIsProcessing,
    isProcessing,
    hasShownTestCardNotice,
    setHasShownTestCardNotice
  });
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-12 pt-32">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <CheckoutForm 
            personalInfo={personalInfo}
            address={address}
            shippingMethods={shippingMethods}
            selectedShippingMethod={selectedShippingMethod}
            paymentMethod={paymentMethod}
            cardDetails={cardDetails}
            selectedDeliveryPoint={selectedDeliveryPoint}
            cardErrors={cardErrors}
            onPersonalInfoChange={handlePersonalInfoChange}
            onAddressChange={handleAddressChange}
            onSelectShippingMethod={setSelectedShippingMethod}
            onSelectPaymentMethod={setPaymentMethod}
            onCardDetailsChange={handleCardDetailsChange}
            onSelectDeliveryPoint={setSelectedDeliveryPoint}
          />
          
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
