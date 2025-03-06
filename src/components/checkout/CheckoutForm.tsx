
import React from "react";
import PersonalInfoForm from "@/components/checkout/PersonalInfoForm";
import ShippingMethodSelector from "@/components/checkout/ShippingMethodSelector";
import DeliveryPointMap from "@/components/checkout/DeliveryPointMap";
import AddressForm from "@/components/checkout/AddressForm";
import PaymentMethodSelector from "@/components/checkout/PaymentMethodSelector";
import { CardDetails } from "@/components/checkout/PaymentMethodSelector";
import { ShippingMethod } from "@/components/checkout/ShippingMethodSelector";

interface DeliveryPoint {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
}

interface CheckoutFormProps {
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
  shippingMethods: ShippingMethod[];
  selectedShippingMethod: string | null;
  paymentMethod: string;
  cardDetails: CardDetails;
  selectedDeliveryPoint: DeliveryPoint | null;
  cardErrors: Partial<Record<keyof CardDetails, string>>;
  onPersonalInfoChange: (field: string, value: string) => void;
  onAddressChange: (field: string, value: string) => void;
  onSelectShippingMethod: (methodId: string) => void;
  onSelectPaymentMethod: (methodId: string) => void;
  onCardDetailsChange: (field: keyof CardDetails, value: string) => void;
  onSelectDeliveryPoint: (point: DeliveryPoint | null) => void;
}

const CheckoutForm = ({
  personalInfo,
  address,
  shippingMethods,
  selectedShippingMethod,
  paymentMethod,
  cardDetails,
  selectedDeliveryPoint,
  cardErrors,
  onPersonalInfoChange,
  onAddressChange,
  onSelectShippingMethod,
  onSelectPaymentMethod,
  onCardDetailsChange,
  onSelectDeliveryPoint
}: CheckoutFormProps) => {
  const currentShippingMethod = shippingMethods.find(m => m.id === selectedShippingMethod);
  const requiresAddress = currentShippingMethod?.requires_address || false;
  const isTestShipping = currentShippingMethod?.is_test || false;
  const isPickupShipping = selectedShippingMethod === 'pickup';
  
  return (
    <div className="md:col-span-2 space-y-6">
      <PersonalInfoForm
        personalInfo={personalInfo}
        onPersonalInfoChange={onPersonalInfoChange}
      />
      
      <ShippingMethodSelector
        shippingMethods={shippingMethods}
        selectedShippingMethod={selectedShippingMethod}
        onSelectShippingMethod={onSelectShippingMethod}
      />
      
      <DeliveryPointMap
        isRequired={isPickupShipping}
        selectedDeliveryPoint={selectedDeliveryPoint}
        onSelectDeliveryPoint={onSelectDeliveryPoint}
      />
      
      {requiresAddress && !isTestShipping && (
        <AddressForm
          address={address}
          onAddressChange={onAddressChange}
        />
      )}
      
      <PaymentMethodSelector
        paymentMethod={paymentMethod}
        onSelectPaymentMethod={onSelectPaymentMethod}
        cardDetails={cardDetails}
        onCardDetailsChange={onCardDetailsChange}
        errors={cardErrors}
      />
    </div>
  );
};

export default CheckoutForm;
