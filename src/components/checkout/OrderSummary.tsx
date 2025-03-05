
import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { CartItem } from "@/contexts/CartContext";

interface OrderSummaryProps {
  items: CartItem[];
  cartTotal: number;
  shippingCost: number;
  orderTotal: number;
  isProcessing: boolean;
  formValid: boolean;
  onPlaceOrder: () => void;
}

const OrderSummary = ({ 
  items, 
  cartTotal, 
  shippingCost, 
  orderTotal, 
  isProcessing, 
  formValid, 
  onPlaceOrder 
}: OrderSummaryProps) => {
  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle>Resumo do Pedido</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {items.map((item) => (
            <div key={`${item.id}-${item.size}-${item.color || ''}`} className="flex justify-between">
              <span>
                {item.name} ({item.size}) x{item.quantity}
              </span>
              <span>{item.price}</span>
            </div>
          ))}
        </div>
        
        <div className="border-t pt-2 space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>€ {cartTotal.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between">
            <span>Envio</span>
            <span>€ {shippingCost.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between font-bold border-t pt-2">
            <span>Total</span>
            <span>€ {orderTotal.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          size="lg" 
          onClick={onPlaceOrder}
          disabled={isProcessing || !formValid}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processando...
            </>
          ) : (
            'Finalizar Pedido'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OrderSummary;
