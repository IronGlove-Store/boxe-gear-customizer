
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@clerk/clerk-react";

export interface CartItem {
  id: string;
  name: string;
  price: string;
  image: string;
  quantity: number;
  size: string;
  color?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: CartItem) => void;
  removeItem: (id: string, size: string, color?: string) => void;
  updateQuantity: (id: string, size: string, quantity: number, color?: string) => void;
  clearCart: () => void;
  getCartTotal: () => string;
  getCartItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const { toast } = useToast();
  const { user } = useUser();
  
  useEffect(() => {
    if (user) {
      const savedCart = localStorage.getItem(`cart-${user.id}`);
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
    } else {
      setItems([]);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`cart-${user.id}`, JSON.stringify(items));
    }
  }, [items, user]);

  const addItem = (product: CartItem) => {
    if (!user) {
      toast({
        title: "Atenção",
        description: "Precisas fazer login para adicionar itens ao carrinho.",
        variant: "destructive",
      });
      return;
    }

    setItems(currentItems => {
      const existingItem = currentItems.find(
        item => 
          item.id === product.id && 
          item.size === product.size && 
          item.color === product.color
      );

      if (existingItem) {
        toast({
          title: "Item atualizado",
          description: `${product.name} atualizado no carrinho.`,
        });

        return currentItems.map(item =>
          item.id === product.id && 
          item.size === product.size && 
          item.color === product.color
            ? { ...item, quantity: item.quantity + product.quantity }
            : item
        );
      }

      toast({
        title: "Item adicionado",
        description: `${product.name} adicionado ao carrinho.`,
      });

      return [...currentItems, product];
    });
  };

  const removeItem = (id: string, size: string, color?: string) => {
    setItems(currentItems => 
      currentItems.filter(item => {
        if (color) {
          return !(item.id === id && item.size === size && item.color === color);
        }
        return !(item.id === id && item.size === size);
      })
    );
  };

  const updateQuantity = (id: string, size: string, quantity: number, color?: string) => {
    if (quantity < 1) return;
    
    setItems(currentItems =>
      currentItems.map(item => {
        if (color) {
          return (item.id === id && item.size === size && item.color === color)
            ? { ...item, quantity }
            : item;
        }
        return (item.id === id && item.size === size)
          ? { ...item, quantity }
          : item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    if (user) {
      localStorage.removeItem(`cart-${user.id}`);
    }
  };

  const getCartTotal = () => {
    const total = items.reduce((sum, item) => {
      const priceString = item.price.replace(/[^0-9,.]/g, '').replace(',', '.');
      const price = parseFloat(priceString);
      
      if (isNaN(price)) {
        console.error('Preço inválido:', item.price, 'para o item:', item.name);
        return sum;
      }
      
      return sum + (price * item.quantity);
    }, 0);
    
    return `€ ${total.toFixed(2)}`;
  };
  
  const getCartItemCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartItemCount,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
