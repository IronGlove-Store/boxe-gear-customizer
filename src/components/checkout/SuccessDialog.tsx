
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, Printer } from "lucide-react";

interface SuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string | null;
  deliveryCode: string | null;
  paymentMethod: string;
  onContinue: () => void;
}

const SuccessDialog = ({ 
  open, 
  onOpenChange, 
  orderId, 
  deliveryCode,
  paymentMethod, 
  onContinue 
}: SuccessDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="text-green-500 h-6 w-6" />
            Pedido Confirmado!
          </DialogTitle>
          <DialogDescription>
            O seu pedido #{orderId?.substring(0, 8)} foi registrado com sucesso.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <p>
            {paymentMethod === 'test_card' 
              ? 'O seu pedido foi concluído utilizando o cartão de teste.'
              : 'O seu pedido está sendo processado. Você receberá uma confirmação por email.'}
          </p>
          
          {deliveryCode && (
            <div className="mt-4 border p-4 rounded-md bg-gray-50">
              <h3 className="font-bold mb-2">Código de Entrega:</h3>
              <div className="text-2xl font-mono text-center py-2">{deliveryCode}</div>
              <p className="text-sm text-gray-500 flex items-center gap-1 mt-2">
                <Printer className="h-4 w-4" />
                Por favor, guarde ou imprima este código para apresentar na recolha do seu pedido.
              </p>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button onClick={onContinue} className="w-full">
            Continuar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessDialog;
