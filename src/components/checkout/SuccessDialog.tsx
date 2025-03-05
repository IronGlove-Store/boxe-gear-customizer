
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
import { CheckCircle } from "lucide-react";

interface SuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string | null;
  paymentMethod: string;
  onContinue: () => void;
}

const SuccessDialog = ({ 
  open, 
  onOpenChange, 
  orderId, 
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
        
        <div className="py-4">
          <p>
            {paymentMethod === 'test_card' 
              ? 'O seu pedido foi concluído utilizando o cartão de teste.'
              : 'O seu pedido está sendo processado. Você receberá uma confirmação por email.'}
          </p>
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
