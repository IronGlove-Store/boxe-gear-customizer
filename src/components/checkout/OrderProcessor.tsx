
import React from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import { CartItem } from "@/contexts/CartContext";
import { validateCardDetails, CardDetails } from "@/components/checkout/PaymentMethodSelector";
import { ShippingMethod } from "@/components/checkout/ShippingMethodSelector";
import { generateDeliveryCode } from "@/utils/deliveryCodeGenerator";

interface DeliveryPoint {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
}

interface OrderProcessorProps {
  personalInfo: {
    firstName: string;
    lastName: string;
    phone: string;
  };
  address: {
    street: string;
    city: string;
    postal_code: string;
    country: string;
  };
  selectedShippingMethod: string | null;
  paymentMethod: string;
  cardDetails: CardDetails;
  selectedDeliveryPoint: DeliveryPoint | null;
  cartTotal: number;
  shippingCost: number;
  orderTotal: number;
  shippingMethods: ShippingMethod[];
  isFormValid: boolean;
  onSuccess: (orderId: string, deliveryCode: string) => void;
  setIsProcessing: (isProcessing: boolean) => void;
  isProcessing: boolean;
  hasShownTestCardNotice: boolean;
  setHasShownTestCardNotice: (hasShown: boolean) => void;
}

const OrderProcessor = ({
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
  isFormValid,
  onSuccess,
  setIsProcessing,
  isProcessing,
  hasShownTestCardNotice,
  setHasShownTestCardNotice
}: OrderProcessorProps) => {
  const { user, isSignedIn } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { items, clearCart } = useCart();
  
  const selectedShipping = shippingMethods.find(m => m.id === selectedShippingMethod);
  const currentShippingMethod = shippingMethods.find(m => m.id === selectedShippingMethod);
  const requiresAddress = currentShippingMethod?.requires_address || false;
  const isTestShipping = currentShippingMethod?.is_test || false;
  const isPickupShipping = selectedShippingMethod === 'pickup';
  
  const handlePlaceOrder = async () => {
    if (!isFormValid) {
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
      
      onSuccess(orderId, deliveryCode);
      
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
  
  return { handlePlaceOrder };
};

export default OrderProcessor;
