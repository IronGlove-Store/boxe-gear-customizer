
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { CreditCard, Calendar, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

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

interface CardValidation {
  cardNumber: boolean;
  cardHolder: boolean;
  expiryDate: boolean;
  cvv: boolean;
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

  const [validations, setValidations] = useState<CardValidation>({
    cardNumber: true,
    cardHolder: true,
    expiryDate: true,
    cvv: true
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CardDetails, string>>>({});

  const handleCardDetailChange = (field: keyof CardDetails, value: string) => {
    setCardDetails(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing again
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
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

  // Luhn algorithm for credit card validation
  const isValidLuhn = (number: string) => {
    const digits = number.replace(/\D/g, '');
    if (digits.length < 13 || digits.length > 19) return false;

    let sum = 0;
    let shouldDouble = false;

    // Start from the right
    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits.charAt(i));

      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }

      sum += digit;
      shouldDouble = !shouldDouble;
    }

    return sum % 10 === 0;
  };

  // Check if the expiry date is valid and not in the past
  const isValidExpiryDate = (expiryDate: string) => {
    const match = expiryDate.match(/^(\d{2})\/(\d{2})$/);
    if (!match) return false;

    const month = parseInt(match[1], 10);
    const year = parseInt(`20${match[2]}`, 10);

    // Check if month is valid
    if (month < 1 || month > 12) return false;

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // January is 0

    // Check if date is in the past
    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      return false;
    }

    return true;
  };

  // Check if CVV is valid (3-4 digits)
  const isValidCVV = (cvv: string) => {
    return /^\d{3,4}$/.test(cvv);
  };

  // Check if the card type is a test card
  const isTestCard = (cardNumber: string) => {
    // Stripe test card numbers
    const stripeTestCards = [
      '4242424242424242', // Visa
      '4000056655665556', // Visa (debit)
      '5555555555554444', // Mastercard
      '2223003122003222', // Mastercard (2-series)
      '5200828282828210', // Mastercard (debit)
      '5105105105105100', // Mastercard (prepaid)
      '378282246310005',  // American Express
      '371449635398431',  // American Express
      '6011111111111117', // Discover
      '6011000990139424', // Discover
      '3056930009020004', // Diners Club
      '36227206271667',   // Diners Club (14 digit)
      '3566002020360505', // JCB
      '6200000000000005'  // UnionPay
    ];
    
    const cleanNumber = cardNumber.replace(/\D/g, '');
    return stripeTestCards.includes(cleanNumber);
  };

  // Validate all card fields
  const validateCard = () => {
    if (paymentMethod !== 'card') return true;
    
    const cleanCardNumber = cardDetails.cardNumber.replace(/\D/g, '');
    const isTest = isTestCard(cleanCardNumber);
    
    const newErrors: Partial<Record<keyof CardDetails, string>> = {};
    let isValid = true;

    // Skip validation for test cards
    if (!isTest) {
      // Validate card number
      if (!isValidLuhn(cleanCardNumber)) {
        newErrors.cardNumber = 'Número de cartão inválido';
        isValid = false;
      }
      
      // Validate expiry date
      if (!isValidExpiryDate(cardDetails.expiryDate)) {
        newErrors.expiryDate = 'Data de validade inválida';
        isValid = false;
      }
      
      // Validate CVV
      if (!isValidCVV(cardDetails.cvv)) {
        newErrors.cvv = 'CVV inválido';
        isValid = false;
      }
    }
    
    // Always validate card holder
    if (cardDetails.cardHolder.trim().length < 3) {
      newErrors.cardHolder = 'Nome muito curto';
      isValid = false;
    }
    
    setErrors(newErrors);
    
    if (!isValid && !isTest) {
      toast({
        title: "Dados de cartão inválidos",
        description: "Verifique os dados inseridos do cartão",
        variant: "destructive",
      });
    } else if (isTest) {
      toast({
        title: "Cartão de teste detectado",
        description: "Usando cartão de teste válido do Stripe",
      });
    }
    
    return isValid || isTest;
  };

  // Re-validate on payment method change or card detail changes
  useEffect(() => {
    if (paymentMethod === 'card' && 
        (cardDetails.cardNumber || cardDetails.cardHolder || cardDetails.expiryDate || cardDetails.cvv)) {
      setTimeout(() => validateCard(), 500);
    }
  }, [paymentMethod, cardDetails]);

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
                      className={`font-mono ${errors.cardNumber ? 'border-red-500' : ''}`}
                      maxLength={19}
                    />
                    {errors.cardNumber && (
                      <div className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle size={12} />
                        {errors.cardNumber}
                      </div>
                    )}
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
                      className={`uppercase ${errors.cardHolder ? 'border-red-500' : ''}`}
                    />
                    {errors.cardHolder && (
                      <div className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle size={12} />
                        {errors.cardHolder}
                      </div>
                    )}
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
                        className={`font-mono ${errors.expiryDate ? 'border-red-500' : ''}`}
                        maxLength={5}
                      />
                      {errors.expiryDate && (
                        <div className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle size={12} />
                          {errors.expiryDate}
                        </div>
                      )}
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
                        className={`font-mono ${errors.cvv ? 'border-red-500' : ''}`}
                        maxLength={3}
                        type="password"
                      />
                      {errors.cvv && (
                        <div className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle size={12} />
                          {errors.cvv}
                        </div>
                      )}
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
