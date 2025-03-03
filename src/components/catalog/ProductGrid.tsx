
import ProductCard from "@/components/ProductCard";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  category: string;
  color: string;
  size: string;
  rating?: number;
  reviewsCount?: number;
}

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  resetFilters: () => void;
}

const ProductGrid = ({ products, isLoading, resetFilters }: ProductGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-gray-100 rounded-lg p-4 h-96 animate-pulse" />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-500">Nenhum produto encontrado.</p>
        <button 
          onClick={resetFilters}
          className="mt-4 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
        >
          Limpar Filtros
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard 
          key={product.id} 
          product={{
            id: product.id,
            name: product.name,
            price: `€ ${product.price.toFixed(2)}`,
            originalPrice: product.originalPrice ? `€ ${product.originalPrice.toFixed(2)}` : undefined,
            image: product.imageUrl,
            category: product.category,
            color: product.color,
            size: product.size,
            rating: product.rating || 0,
            reviews: product.reviewsCount || 0
          }} 
        />
      ))}
    </div>
  );
};

export default ProductGrid;
