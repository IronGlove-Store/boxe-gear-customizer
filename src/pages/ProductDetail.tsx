import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Product {
  id: number;
  name: string;
  price: string;
  originalPrice?: string;
  category: string;
  color: string;
  size: string;
  image: string;
  description?: string;
}

// Dados mockados - em uma aplicação real, viriam de uma API
const products: Product[] = [
  {
    id: 1,
    name: "Pro Boxing Gloves",
    price: "$199.99",
    category: "Gloves",
    color: "red",
    size: "12oz",
    image: "https://images.unsplash.com/photo-1583473848882-f9a5cb6c5ae7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    description: "Professional-grade boxing gloves designed for superior protection and performance. Made with premium leather and advanced padding technology."
  },
  {
    id: 2,
    name: "Elite Red Headgear",
    price: "$89.99",
    category: "Protection",
    color: "red",
    size: "M",
    image: "https://images.unsplash.com/photo-1584464457692-54f6b2cd5ca3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    description: "High-quality headgear offering maximum protection during training and sparring sessions. Features adjustable straps for a perfect fit."
  },
  {
    id: 3,
    name: "Black Performance Wraps",
    price: "$24.99",
    originalPrice: "$29.99",
    category: "Accessories",
    color: "black",
    size: "One Size",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    description: "Durable and comfortable hand wraps providing essential support and protection for your wrists and knuckles. Perfect for all combat sports."
  },
  {
    id: 4,
    name: "Blue Training Bag",
    price: "$149.99",
    category: "Equipment",
    color: "blue",
    size: "70lb",
    image: "https://images.unsplash.com/photo-1593787406536-3676a152d9cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    description: "Heavy-duty training bag designed to withstand intense workouts. Ideal for developing power, technique, and endurance."
  }
];

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedSize, setSelectedSize] = useState<string>("");
  
  const product = products.find(p => p.id === Number(id));
  
  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 pt-32">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <Button onClick={() => navigate("/catalog")}>
              Return to Catalog
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const hasDiscount = product.originalPrice !== undefined;
  const discountPercentage = hasDiscount
    ? Math.round(
        ((parseFloat(product.originalPrice!.replace("$", "")) -
          parseFloat(product.price.replace("$", ""))) /
          parseFloat(product.originalPrice!.replace("$", ""))) *
          100
      )
    : 0;

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast({
        title: "Please select a size",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-32 pb-24">
        <button
          onClick={() => navigate("/catalog")}
          className="flex items-center gap-2 text-gray-600 hover:text-black mb-8"
        >
          <ArrowLeft size={20} />
          Back to Catalog
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Imagem do Produto */}
          <div className="aspect-square rounded-2xl overflow-hidden bg-white">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Detalhes do Produto */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
              <p className="text-gray-600">{product.category}</p>
            </div>

            <div className="flex items-baseline gap-4">
              <span className="text-3xl font-bold">{product.price}</span>
              {hasDiscount && (
                <>
                  <span className="text-xl text-gray-500 line-through">
                    {product.originalPrice}
                  </span>
                  <span className="text-green-600 font-medium">
                    {discountPercentage}% OFF
                  </span>
                </>
              )}
            </div>

            <p className="text-gray-600">{product.description}</p>

            <div>
              <h3 className="font-medium mb-3">Available Sizes</h3>
              <div className="flex flex-wrap gap-3">
                {["12oz", "14oz", "16oz"].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-lg border transition-all ${
                      selectedSize === size
                        ? "border-black bg-black text-white"
                        : "border-gray-200 hover:border-black"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <Button
              size="lg"
              className="w-full"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
