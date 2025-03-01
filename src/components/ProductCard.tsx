
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";

interface ProductCardProps {
  product: {
    id: string; // Change from number to string
    name: string;
    price: string;
    originalPrice?: string;
    image: string;
    category: string;
    color: string;
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
          <span>Cor: {product.color}</span>
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
