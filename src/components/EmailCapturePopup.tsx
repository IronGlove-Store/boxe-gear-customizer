
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@clerk/clerk-react";

export function EmailCapturePopup() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user, isSignedIn } = useUser();

  useEffect(() => {
    // Verificar se o usuário está autenticado e se ainda não fechou o popup
    if (isSignedIn && user) {
      const hasSeenPopup = localStorage.getItem(`email-popup-seen-${user.id}`);
      if (!hasSeenPopup) {
        // Preencher o email do usuário automaticamente, se disponível
        if (user.primaryEmailAddress) {
          setEmail(user.primaryEmailAddress.emailAddress);
        }
        // Preencher o nome do usuário, se disponível
        if (user.fullName) {
          setName(user.fullName);
        }
        // Mostrar o popup após um breve delay
        const timer = setTimeout(() => {
          setOpen(true);
        }, 1500);
        
        return () => clearTimeout(timer);
      }
    }
  }, [isSignedIn, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira um email válido.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch("https://rjtrytcayvbwdnjixwbe.functions.supabase.co/send-welcome-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          email, 
          name: name || (user?.fullName || ""),
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Erro ao enviar email");
      }
      
      // Registrar que o usuário já viu o popup
      if (user) {
        localStorage.setItem(`email-popup-seen-${user.id}`, "true");
      }
      
      toast({
        title: "Sucesso!",
        description: "Email enviado para " + email + ". Verifica a tua caixa de entrada!",
      });
      
      setOpen(false);
    } catch (error) {
      console.error("Erro ao enviar email:", error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar o email. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">Bem-vindo à Nossa Loja!</DialogTitle>
          <DialogDescription className="pt-2">
            Receba ofertas exclusivas e novidades diretamente no seu email.
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4 mb-2">
          <img 
            src="https://images.pexels.com/photos/6296058/pexels-photo-6296058.jpeg" 
            alt="Promoção especial" 
            className="w-full h-48 object-cover rounded-md"
          />
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Seu nome
            </label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite seu nome"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Seu email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Enviando..." : "Receber Ofertas"}
          </Button>
          
          <p className="text-xs text-center text-gray-500 pt-2">
            Ao se inscrever, você concorda em receber emails promocionais e informações sobre nossos produtos.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
