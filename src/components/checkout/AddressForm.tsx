
import React from "react";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Home } from "lucide-react";

interface AddressFormProps {
  address: {
    street: string;
    city: string;
    postal_code: string;
    country: string;
  };
  onAddressChange: (field: string, value: string) => void;
}

const AddressForm = ({ address, onAddressChange }: AddressFormProps) => {
  return (
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
            onChange={(e) => onAddressChange('street', e.target.value)}
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
            onChange={(e) => onAddressChange('city', e.target.value)}
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
            onChange={(e) => onAddressChange('postal_code', e.target.value)}
            placeholder="Ex: 1250-096"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default AddressForm;
