
import { Route, Routes } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Catalog from "./pages/Catalog";
import ProductDetail from "./pages/ProductDetail";
import Customize from "./pages/Customize";
import Auth from "./pages/Auth";
import Checkout from "./pages/Checkout";
import Success from "./pages/Success";
import Admin from "./pages/Admin";

import { Toaster } from "@/components/ui/toaster";
import { CartProvider } from "./contexts/CartContext";

function App() {
  return (
    <CartProvider>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/customize" element={<Customize />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/success" element={<Success />} />
        <Route path="/admin/*" element={<Admin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </CartProvider>
  );
}

export default App;
