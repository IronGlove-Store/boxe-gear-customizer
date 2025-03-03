import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";
import customizableProducts from "@/data/customizableProducts.json";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: string;
    originalPrice?: string;
    image: string;
    category: string;
    color: string;
    colors?: string[];
    size: string;
    rating?: number;
    reviews?: number;
  };
  className?: string;
}

const ProductCard = ({ product, className }: ProductCardProps) => {
  const navigate = useNavigate();

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, index) => (
      <Star
        key={index}
        className={cn(
          "w-4 h-4",
          index < Math.floor(rating) 
            ? "fill-yellow-400 text-yellow-400" 
            : "text-gray-300"
        )}
      />
    ));
  };
  
  const renderColorDots = () => {
    if (!product.colors || product.colors.length <= 1) {
      // If there's only one color or no colors array, show the main color
      const colorObj = customizableProducts.colors.find(c => c.name === product.color);
      const colorValue = colorObj ? colorObj.value : "#777777";
      
      return (
        <span 
          className="inline-block w-3 h-3 rounded-full border border-gray-300" 
          style={{ backgroundColor: colorValue }}
          title={product.color}
        />
      );
    }
    
    // Otherwise show all available colors (limited to 4 with +X indicator)
    const displayColors = product.colors.slice(0, 4);
    const remainingCount = product.colors.length - 4;
    
    return (
      <div className="flex items-center gap-1">
        {displayColors.map(colorName => {
          const colorObj = customizableProducts.colors.find(c => c.name === colorName);
          const colorValue = colorObj ? colorObj.value : "#777777";
          
          return (
            <span 
              key={colorName}
              className="inline-block w-3 h-3 rounded-full border border-gray-300" 
              style={{ backgroundColor: colorValue }}
              title={colorName}
            />
          );
        })}
        
        {remainingCount > 0 && (
          <span className="text-xs text-gray-500">+{remainingCount}</span>
        )}
      </div>
    );
  };

  return (
    <div 
      className={cn("group hover-lift cursor-pointer", className)}
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <div className="relative aspect-square overflow-hidden rounded-2xl mb-6 bg-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="space-y-2">
        <span className="text-sm text-gray-500 uppercase tracking-wider">
          {product.category}
        </span>
        <h3 className="text-xl font-semibold">{product.name}</h3>
        <div className="flex items-center gap-2">
          <p className="text-gray-900 font-medium">{product.price}</p>
          {product.originalPrice && (
            <p className="text-gray-500 line-through text-sm">{product.originalPrice}</p>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <span>Cores:</span> 
            {renderColorDots()}
          </div>
          <span>•</span>
          <span>Tamanho: {product.size}</span>
        </div>
        {product.rating && (
          <div className="flex items-center gap-2">
            <div className="flex">
              {renderStars(product.rating)}
            </div>
            {product.reviews && (
              <span className="text-sm text-gray-500">
                ({product.reviews})
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
