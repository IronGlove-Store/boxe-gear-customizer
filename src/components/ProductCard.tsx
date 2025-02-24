
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    price: string;
    originalPrice?: string;
    image: string;
    category: string;
    color: string;
    size: string;
  };
  className?: string;
}

const ProductCard = ({ product, className }: ProductCardProps) => {
  return (
    <div className={cn("group hover-lift", className)}>
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
          <span>Color: {product.color}</span>
          <span>•</span>
          <span>Size: {product.size}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
