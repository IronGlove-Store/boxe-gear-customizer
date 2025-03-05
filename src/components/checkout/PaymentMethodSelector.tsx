
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { CreditCard, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";

interface PaymentMethodSelectorProps {
  paymentMethod: string;
  onSelectPaymentMethod: (methodId: string) => void;
}

interface CardDetails {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
}

const PaymentMethodSelector = ({ 
  paymentMethod, 
  onSelectPaymentMethod 
}: PaymentMethodSelectorProps) => {
  const [cardDetails, setCardDetails] = useState<CardDetails>({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: ''
  });

  const handleCardDetailChange = (field: keyof CardDetails, value: string) => {
    setCardDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Format card number with spaces every 4 digits
  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, '');
    const formattedValue = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formattedValue.substring(0, 19); // 16 digits + 3 spaces
  };

  // Format expiry date as MM/YY
  const formatExpiryDate = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length > 2) {
      return `${digits.substring(0, 2)}/${digits.substring(2, 4)}`;
    }
    return digits;
  };

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

              {paymentMethod === 'card' && (
                <div className="mt-4 space-y-3 animate-fade-in">
                  <div>
                    <label htmlFor="cardNumber" className="text-sm font-medium block mb-1">
                      Número do Cartão
                    </label>
                    <Input 
                      id="cardNumber" 
                      placeholder="1234 5678 9012 3456"
                      value={cardDetails.cardNumber}
                      onChange={(e) => handleCardDetailChange('cardNumber', formatCardNumber(e.target.value))}
                      className="font-mono"
                      maxLength={19}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="cardHolder" className="text-sm font-medium block mb-1">
                      Nome no Cartão
                    </label>
                    <Input 
                      id="cardHolder" 
                      placeholder="NOME COMPLETO"
                      value={cardDetails.cardHolder}
                      onChange={(e) => handleCardDetailChange('cardHolder', e.target.value.toUpperCase())}
                      className="uppercase"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="expiryDate" className="text-sm font-medium block mb-1">
                        Validade
                      </label>
                      <Input 
                        id="expiryDate" 
                        placeholder="MM/AA"
                        value={cardDetails.expiryDate}
                        onChange={(e) => handleCardDetailChange('expiryDate', formatExpiryDate(e.target.value))}
                        className="font-mono"
                        maxLength={5}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="cvv" className="text-sm font-medium block mb-1">
                        CVV
                      </label>
                      <Input 
                        id="cvv" 
                        placeholder="123"
                        value={cardDetails.cvv}
                        onChange={(e) => handleCardDetailChange('cvv', e.target.value.replace(/\D/g, '').substring(0, 3))}
                        className="font-mono"
                        maxLength={3}
                        type="password"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-2 text-xs text-blue-600 flex items-center gap-1">
                    <span>Dados armazenados de forma segura</span>
                    <span className="text-xs text-gray-500">(demonstração - nenhum dado real é processado)</span>
                  </div>
                </div>
              )}
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
