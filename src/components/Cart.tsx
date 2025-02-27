
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { stripe } from "@/lib/stripe";
import { useUser } from "@clerk/clerk-react";

export function Cart() {
  const { items, removeItem, updateQuantity, getCartTotal } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const { toast } = useToast();
  const { isSignedIn } = useUser();

  const handleCheckout = async () => {
    if (!isSignedIn) {
      toast({
        title: "Atenção",
        description: "Precisas de entrar com a tua conta para fazer a compra.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsCheckingOut(true);
      
      // Criar uma sessão de checkout
      const stripeInstance = await stripe;
      if (!stripeInstance) throw new Error("Falha ao carregar Stripe");

      // Formatar os itens para o Stripe
      const lineItems = items.map(item => {
        // Extrair apenas os números do preço
        const priceString = item.price.replace(/[^0-9,.]/g, '').replace(',', '.');
        const price = parseFloat(priceString);
        
        return {
          price_data: {
            currency: 'eur',
            product_data: {
              name: item.name,
              description: `Tamanho: ${item.size}`,
              images: [item.image],
            },
            unit_amount: Math.round(price * 100), // Converter para centavos
          },
          quantity: item.quantity,
        };
      });

      // Redirecionar para o checkout do Stripe
      const { error } = await stripeInstance.redirectToCheckout({
        lineItems,
        mode: 'payment',
        successUrl: `${window.location.origin}/success`,
        cancelUrl: `${window.location.origin}/catalog`,
      });

      if (error) {
        console.error('Erro no checkout do Stripe:', error);
        toast({
          title: "Erro",
          description: error.message || "Houve um erro ao processar o pagamento. Tente novamente.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Erro no checkout:', error);
      toast({
        title: "Erro",
        description: "Houve um erro ao processar o pagamento. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="relative p-2.5 rounded-full transition-all duration-300 hover:scale-105 hover:bg-gray-100">
          <ShoppingCart className="h-5 w-5" />
          {items.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {items.reduce((total, item) => total + item.quantity, 0)}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Carrinho de Compras</SheetTitle>
        </SheetHeader>
        
        <div className="mt-8 flex flex-col h-full">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-500">O teu carrinho está vazio</p>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-auto">
                {items.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="flex gap-4 py-4 border-b">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-500">Tamanho: {item.size}</p>
                      <p className="text-sm font-medium">{item.price}</p>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                          className="p-1 rounded-full hover:bg-gray-100"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                          className="p-1 rounded-full hover:bg-gray-100"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => removeItem(item.id, item.size)}
                          className="p-1 rounded-full hover:bg-gray-100 ml-auto"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4 mt-4 space-y-4">
                <div className="flex justify-between text-lg font-medium">
                  <span>Total</span>
                  <span>{getCartTotal()}</span>
                </div>
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                >
                  {isCheckingOut ? "Processando..." : "Finalizar Compra"}
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
