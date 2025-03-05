
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { CreditCard } from "lucide-react";

interface PaymentMethodSelectorProps {
  paymentMethod: string;
  onSelectPaymentMethod: (methodId: string) => void;
}

const PaymentMethodSelector = ({ 
  paymentMethod, 
  onSelectPaymentMethod 
}: PaymentMethodSelectorProps) => {
  return (
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
            onClick={() => onSelectPaymentMethod('card')}
          >
            <Checkbox 
              checked={paymentMethod === 'card'}
              onCheckedChange={() => onSelectPaymentMethod('card')}
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
            onClick={() => onSelectPaymentMethod('test_card')}
          >
            <Checkbox 
              checked={paymentMethod === 'test_card'} 
              onCheckedChange={() => onSelectPaymentMethod('test_card')}
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
  );
};

export default PaymentMethodSelector;
