import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShoppingCart, Star } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useCart } from "@/contexts/CartContext";
import customizableProducts from "@/data/customizableProducts.json";

interface Product {
  id: string;
  name: string;
  price: string;
  originalPrice?: string;
  category: string;
  color: string;
  colors?: string[];
  size: string;
  sizes?: string[];
  image: string;
  description?: string;
  rating?: number;
  reviews?: number;
}

interface AdminProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  colors?: string[];
  sizes?: string[];
  original_price?: number;
  created_at: string;
}

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    setLoading(true);
    try {
      const adminProducts = localStorage.getItem('admin_products');
      
      if (adminProducts) {
        const parsedAdminProducts: AdminProduct[] = JSON.parse(adminProducts);
        const foundAdminProduct = parsedAdminProducts.find(p => p.id === id);
        
        if (foundAdminProduct) {
          const firstColor = foundAdminProduct.colors && foundAdminProduct.colors.length > 0 
            ? foundAdminProduct.colors[0] 
            : "Padrão";
          
          setProduct({
            id: foundAdminProduct.id,
            name: foundAdminProduct.name,
            price: `€ ${foundAdminProduct.price.toFixed(2)}`,
            originalPrice: foundAdminProduct.original_price 
              ? `€ ${foundAdminProduct.original_price.toFixed(2)}` 
              : undefined,
            category: foundAdminProduct.category || "Sem categoria",
            color: firstColor,
            colors: foundAdminProduct.colors || [],
            size: "Único",
            sizes: foundAdminProduct.sizes || ["Único"],
            image: foundAdminProduct.image_url || "/placeholder.svg",
            description: foundAdminProduct.description,
            rating: 4.0,
            reviews: 0
          });
          setSelectedColor(firstColor);
        } else {
          const hardcodedProducts: Product[] = [
            {
              id: "1",
              name: "Pro Boxing Gloves",
              price: "€ 199.99",
              category: "Gloves",
              color: "red",
              size: "12oz",
              image: "https://images.pexels.com/photos/6296058/pexels-photo-6296058.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
              description: "Professional-grade boxing gloves designed for superior protection and performance. Made with premium leather and advanced padding technology.",
              rating: 4.5,
              reviews: 12
            },
            {
              id: "2",
              name: "Elite Red Headgear",
              price: "€ 89.99",
              category: "Protection",
              color: "red",
              size: "M",
              image: "https://images.pexels.com/photos/6296058/pexels-photo-6296058.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
              description: "High-quality headgear offering maximum protection during training and sparring sessions. Features adjustable straps for a perfect fit.",
              rating: 4.0,
              reviews: 8
            },
            {
              id: "3",
              name: "Black Performance Wraps",
              price: "€ 24.99",
              originalPrice: "€ 29.99",
              category: "Accessories",
              color: "black",
              size: "One Size",
              image: "https://images.pexels.com/photos/6296058/pexels-photo-6296058.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
              description: "Durable and comfortable hand wraps providing essential support and protection for your wrists and knuckles. Perfect for all combat sports.",
              rating: 4.8,
              reviews: 25
            },
            {
              id: "4",
              name: "Blue Training Bag",
              price: "€ 149.99",
              category: "Equipment",
              color: "blue",
              size: "70lb",
              image: "https://images.pexels.com/photos/6296058/pexels-photo-6296058.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
              description: "Heavy-duty training bag designed to withstand intense workouts. Ideal for developing power, technique, and endurance.",
              rating: 4.2,
              reviews: 15
            }
          ];
          
          const foundProduct = hardcodedProducts.find(p => p.id === id);
          if (foundProduct && foundProduct.colors && foundProduct.colors.length > 0) {
            setSelectedColor(foundProduct.colors[0]);
          }
          setProduct(foundProduct || null);
        }
      } else {
        const hardcodedProducts: Product[] = [
          {
            id: "1",
            name: "Pro Boxing Gloves",
            price: "€ 199.99",
            category: "Gloves",
            color: "red",
            size: "12oz",
            image: "https://images.pexels.com/photos/6296058/pexels-photo-6296058.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            description: "Professional-grade boxing gloves designed for superior protection and performance. Made with premium leather and advanced padding technology.",
            rating: 4.5,
            reviews: 12
          },
          {
            id: "2",
            name: "Elite Red Headgear",
            price: "€ 89.99",
            category: "Protection",
            color: "red",
            size: "M",
            image: "https://images.pexels.com/photos/6296058/pexels-photo-6296058.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            description: "High-quality headgear offering maximum protection during training and sparring sessions. Features adjustable straps for a perfect fit.",
            rating: 4.0,
            reviews: 8
          },
          {
            id: "3",
            name: "Black Performance Wraps",
            price: "€ 24.99",
            originalPrice: "€ 29.99",
            category: "Accessories",
            color: "black",
            size: "One Size",
            image: "https://images.pexels.com/photos/6296058/pexels-photo-6296058.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            description: "Durable and comfortable hand wraps providing essential support and protection for your wrists and knuckles. Perfect for all combat sports.",
            rating: 4.8,
            reviews: 25
          },
          {
            id: "4",
            name: "Blue Training Bag",
            price: "€ 149.99",
            category: "Equipment",
            color: "blue",
            size: "70lb",
            image: "https://images.pexels.com/photos/6296058/pexels-photo-6296058.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            description: "Heavy-duty training bag designed to withstand intense workouts. Ideal for developing power, technique, and endurance.",
            rating: 4.2,
            reviews: 15
          }
        ];
        
        const foundProduct = hardcodedProducts.find(p => p.id === id);
        if (foundProduct && foundProduct.colors && foundProduct.colors.length > 0) {
          setSelectedColor(foundProduct.colors[0]);
        }
        setProduct(foundProduct || null);
      }
    } catch (error) {
      console.error("Error loading product:", error);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 pt-32">
          <div className="text-center">
            <h1 className="text-2xl">Loading product...</h1>
          </div>
        </div>
      </div>
    );
  }
  
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
        ((parseFloat(product.originalPrice!.replace("€", "")) -
          parseFloat(product.price.replace("€", ""))) /
          parseFloat(product.originalPrice!.replace("€", ""))) *
          100
      )
    : 0;

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast({
        title: "Por favor, selecione um tamanho",
        variant: "destructive",
      });
      return;
    }
    
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      size: selectedSize,
      color: selectedColor,
    });
    
    toast({
      title: "Produto adicionado ao carrinho",
      description: product.name,
    });
  };

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${
          index < Math.floor(rating) 
            ? "fill-yellow-400 text-yellow-400" 
            : "text-gray-300"
        }`}
      />
    ));
  };

  const getSizesForProduct = () => {
    if (product.sizes && product.sizes.length > 0) {
      return product.sizes;
    }
    
    const category = customizableProducts.categories.find(
      cat => cat.name.toLowerCase() === product.category.toLowerCase()
    );
    
    if (category && category.sizes.length > 0) {
      return category.sizes;
    }
    
    return ["P", "M", "G"];
  };

  const availableSizes = getSizesForProduct();

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
          <div className="aspect-square rounded-2xl overflow-hidden bg-white">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
              <p className="text-gray-600">{product.category}</p>
            </div>

            {product.rating && (
              <div className="flex items-center gap-2">
                <div className="flex">
                  {renderStars(product.rating)}
                </div>
                {product.reviews && (
                  <span className="text-gray-600">
                    ({product.reviews} avaliações)
                  </span>
                )}
              </div>
            )}

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

            {product.description && (
              <p className="text-gray-600">{product.description}</p>
            )}

            {product.colors && product.colors.length > 0 && (
              <div>
                <h3 className="font-medium mb-3">Cores</h3>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((colorName) => {
                    const colorObj = customizableProducts.colors.find(c => c.name === colorName);
                    const colorValue = colorObj ? colorObj.value : "#777777";
                    
                    return (
                      <button 
                        key={colorName}
                        onClick={() => setSelectedColor(colorName)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
                          selectedColor === colorName
                            ? 'border-black bg-black text-white'
                            : 'border-gray-200 hover:border-black'
                        }`}
                      >
                        <span 
                          className="w-4 h-4 rounded-full border border-gray-300" 
                          style={{ backgroundColor: colorValue }}
                        />
                        <span>{colorName}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div>
              <h3 className="font-medium mb-3">Tamanhos</h3>
              <div className="flex flex-wrap gap-3">
                {availableSizes.map((size) => (
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
              Adicionar ao Carrinho
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
