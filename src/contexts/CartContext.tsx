
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

interface CartItem {
  id: number;
  name: string;
  price: string;
  image: string;
  quantity: number;
  size: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: CartItem) => void;
  removeItem: (id: number, size: string) => void;
  updateQuantity: (id: number, size: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Chave para o localStorage
const CART_STORAGE_KEY = 'boxegear-cart';

export function CartProvider({ children }: { children: ReactNode }) {
  // Inicializar o estado com os itens do localStorage
  const [items, setItems] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  const { toast } = useToast();

  // Persistir o carrinho no localStorage sempre que houver mudanças
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (product: CartItem) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(
        item => item.id === product.id && item.size === product.size
      );

      if (existingItem) {
        toast({
          title: "Item atualizado",
          description: `${product.name} atualizado no carrinho.`,
        });

        return currentItems.map(item =>
          item.id === product.id && item.size === product.size
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

  const removeItem = (id: number, size: string) => {
    setItems(currentItems => 
      currentItems.filter(item => !(item.id === id && item.size === size))
    );
  };

  const updateQuantity = (id: number, size: string, quantity: number) => {
    if (quantity < 1) return;
    
    setItems(currentItems =>
      currentItems.map(item =>
        item.id === id && item.size === size
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem(CART_STORAGE_KEY);
  };

  const getCartTotal = () => {
    const total = items.reduce((sum, item) => {
      // Remove o símbolo € e qualquer espaço, depois converte para número
      const price = parseFloat(item.price.replace(/[€\s]/g, ''));
      return sum + (price * item.quantity);
    }, 0);
    
    return `€ ${total.toFixed(2)}`;
  };

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      getCartTotal,
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
