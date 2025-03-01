
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "@/components/ProductCard";
import Navigation from "@/components/Navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { fetchProducts, fetchCategories, SanityProduct } from "@/lib/sanity";

interface Product {
  _id: string;
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

interface Category {
  _id: string;
  name: string;
  slug: { current: string };
  description?: string;
  createdAt: string;
}

const Catalog = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState({
    categories: [] as string[],
    colors: [] as string[],
    priceRange: [0, 300] as [number, number],
    onSale: false
  });

  const { data: productsData = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  const { data: categoriesData = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  // Type cast the data to our interfaces
  const products = productsData as Product[];
  
  // Extract unique categories and colors from the products
  const categories = Array.from(
    new Set(products.map((product: Product) => product.category))
  ).filter(Boolean) as string[];
  
  const colors = Array.from(
    new Set(products.map((product: Product) => product.color))
  ).filter(Boolean) as string[];

  useEffect(() => {
    if (!products.length) return;
    
    let result = [...products];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((product: Product) => 
        product.name.toLowerCase().includes(query) || 
        (product.category && product.category.toLowerCase().includes(query))
      );
    }
    
    if (filters.categories.length > 0) {
      result = result.filter((product: Product) => 
        product.category && filters.categories.includes(product.category)
      );
    }
    
    if (filters.colors.length > 0) {
      result = result.filter((product: Product) => 
        product.color && filters.colors.includes(product.color)
      );
    }
    
    result = result.filter((product: Product) => {
      const price = product.price;
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });
    
    if (filters.onSale) {
      result = result.filter((product: Product) => product.originalPrice !== undefined);
    }
    
    setFilteredProducts(result);
  }, [searchQuery, filters, products]);

  const toggleCategory = (category: string) => {
    setFilters(prev => {
      const isSelected = prev.categories.includes(category);
      return {
        ...prev,
        categories: isSelected 
          ? prev.categories.filter(c => c !== category)
          : [...prev.categories, category]
      };
    });
  };

  const toggleColor = (color: string) => {
    setFilters(prev => {
      const isSelected = prev.colors.includes(color);
      return {
        ...prev,
        colors: isSelected 
          ? prev.colors.filter(c => c !== color)
          : [...prev.colors, color]
      };
    });
  };

  const handlePriceChange = (value: number[]) => {
    setFilters(prev => ({
      ...prev,
      priceRange: [value[0], value[1]] as [number, number]
    }));
  };

  const toggleOnSale = () => {
    setFilters(prev => ({
      ...prev,
      onSale: !prev.onSale
    }));
  };

  const resetFilters = () => {
    setFilters({
      categories: [],
      colors: [],
      priceRange: [0, 300],
      onSale: false
    });
    setSearchQuery("");
  };

  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="container py-12 pt-24">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
          <div className={`lg:w-1/4 lg:block ${showFilters ? 'block fixed inset-0 z-50 bg-white p-6 overflow-auto' : 'hidden'}`}>
            <div className="sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Filtros</h2>
                {showFilters && (
                  <Button variant="ghost" size="icon" onClick={() => setShowFilters(false)} className="lg:hidden">
                    <X className="h-5 w-5" />
                  </Button>
                )}
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-3">Categorias</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`category-${category}`} 
                          checked={filters.categories.includes(category)}
                          onCheckedChange={() => toggleCategory(category)}
                        />
                        <label 
                          htmlFor={`category-${category}`}
                          className="text-sm cursor-pointer"
                        >
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-3">Cores</h3>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((color) => (
                      <button
                        key={color}
                        className={`w-8 h-8 rounded-full transition-all duration-200 ${
                          filters.colors.includes(color) 
                            ? 'ring-2 ring-offset-2 ring-black scale-110' 
                            : 'hover:scale-110'
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => toggleColor(color)}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-3">Preço</h3>
                  <div className="px-2">
                    <Slider
                      defaultValue={[0, 300]}
                      max={300}
                      step={10}
                      value={[filters.priceRange[0], filters.priceRange[1]]}
                      onValueChange={handlePriceChange}
                      className="mb-6"
                    />
                    <div className="flex justify-between">
                      <span>€{filters.priceRange[0]}</span>
                      <span>€{filters.priceRange[1]}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="on-sale" 
                      checked={filters.onSale}
                      onCheckedChange={toggleOnSale}
                    />
                    <label 
                      htmlFor="on-sale"
                      className="text-sm cursor-pointer"
                    >
                      Em promoção
                    </label>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  onClick={resetFilters}
                  className="w-full mt-4"
                >
                  Limpar Filtros
                </Button>
              </div>
            </div>
          </div>
          
          <div className="lg:w-3/4 w-full">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <h1 className="text-3xl font-bold">Catálogo</h1>
              
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Pesquisar produtos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-full md:w-[300px]"
                  />
                </div>
                
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setShowFilters(true)}
                  className="lg:hidden"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {isLoadingProducts ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-gray-100 rounded-lg p-4 h-96 animate-pulse" />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lg text-gray-500">Nenhum produto encontrado.</p>
                <Button onClick={resetFilters} className="mt-4">
                  Limpar Filtros
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard 
                    key={product._id} 
                    product={{
                      id: product._id, // Pass _id as string instead of trying to convert to number
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
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Catalog;
