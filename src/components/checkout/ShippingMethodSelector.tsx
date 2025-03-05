
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Truck, MapPin } from "lucide-react";

export interface ShippingMethod {
  id: string;
  name: string;
  price: number;
  estimated_days: string;
  is_test: boolean;
  requires_address: boolean;
}

interface ShippingMethodSelectorProps {
  shippingMethods: ShippingMethod[];
  selectedShippingMethod: string | null;
  onSelectShippingMethod: (methodId: string) => void;
}

const ShippingMethodSelector = ({ 
  shippingMethods, 
  selectedShippingMethod, 
  onSelectShippingMethod 
}: ShippingMethodSelectorProps) => {
  return (
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
              onClick={() => onSelectShippingMethod(method.id)}
            >
              <Checkbox 
                checked={selectedShippingMethod === method.id}
                onCheckedChange={() => onSelectShippingMethod(method.id)}
              />
              
              <div className="flex-1">
                <div className="flex justify-between">
                  <h3 className="font-medium flex items-center gap-2">
                    {method.id === 'pickup' ? (
                      <>
                        <MapPin className="w-4 h-4" />
                        {method.name}
                      </>
                    ) : (
                      method.name
                    )}
                  </h3>
                  <span className="font-medium">€ {method.price.toFixed(2)}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{method.estimated_days}</p>
                {method.is_test && (
                  <p className="text-xs text-blue-600 mt-1">Opção para demonstração (não requer endereço)</p>
                )}
                {method.id === 'pickup' && (
                  <p className="text-xs text-green-600 mt-1">Selecione um ponto de entrega no mapa</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ShippingMethodSelector;
