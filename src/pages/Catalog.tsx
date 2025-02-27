
import { useState, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import Navigation from "@/components/Navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Search, SlidersHorizontal, X } from "lucide-react";

interface Product {
  id: number;
  name: string;
  price: string;
  originalPrice?: string;
  image: string;
  category: string;
  color: string;
  size: string;
  rating?: number;
  reviews?: number;
}

const products: Product[] = [
  {
    id: 1,
    name: "Luvas de Boxe Profissionais",
    price: "€ 199.99",
    category: "Gloves",
    color: "red",
    size: "12oz",
    image: "https://images.pexels.com/photos/6296058/pexels-photo-6296058.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    rating: 4.5,
    reviews: 12
  },
  {
    id: 2,
    name: "Protetor Bucal Premium",
    price: "€ 89.99",
    category: "Protection",
    color: "blue",
    size: "M",
    image: "https://images.pexels.com/photos/6296058/pexels-photo-6296058.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    rating: 4.0,
    reviews: 8
  },
  {
    id: 3,
    name: "Bandagem Elástica",
    price: "€ 24.99",
    originalPrice: "€ 29.99",
    category: "Accessories",
    color: "black",
    size: "One Size",
    image: "https://images.pexels.com/photos/6296058/pexels-photo-6296058.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    rating: 4.8,
    reviews: 25
  },
  {
    id: 4,
    name: "Saco de Pancada Profissional",
    price: "€ 149.99",
    category: "Equipment",
    color: "black",
    size: "70lb",
    image: "https://images.pexels.com/photos/6296058/pexels-photo-6296058.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    rating: 4.2,
    reviews: 15
  },
  {
    id: 5,
    name: "Capacete de Proteção",
    price: "€ 129.99",
    category: "Protection",
    color: "red",
    size: "L",
    image: "https://images.pexels.com/photos/6296058/pexels-photo-6296058.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    rating: 4.6,
    reviews: 19
  },
  {
    id: 6,
    name: "Protetor de Tórax",
    price: "€ 79.99",
    category: "Protection",
    color: "black",
    size: "XL",
    image: "https://images.pexels.com/photos/6296058/pexels-photo-6296058.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    rating: 4.1,
    reviews: 11
  },
  {
    id: 7,
    name: "Corda de Pular Profissional",
    price: "€ 29.99",
    originalPrice: "€ 39.99",
    category: "Accessories",
    color: "black",
    size: "One Size",
    image: "https://images.pexels.com/photos/6296058/pexels-photo-6296058.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    rating: 4.7,
    reviews: 32
  },
  {
    id: 8,
    name: "Shorts de Muay Thai",
    price: "€ 49.99",
    category: "Clothing",
    color: "blue",
    size: "M",
    image: "https://images.pexels.com/photos/6296058/pexels-photo-6296058.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    rating: 4.3,
    reviews: 21
  }
];

const Catalog = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [filters, setFilters] = useState({
    categories: [] as string[],
    colors: [] as string[],
    priceRange: [0, 300] as [number, number],
    onSale: false
  });

  // Extract unique categories and colors for filter options
  const categories = Array.from(new Set(products.map(product => product.category)));
  const colors = Array.from(new Set(products.map(product => product.color)));

  // Apply filters and search
  useEffect(() => {
    let result = [...products];
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(product => 
        product.name.toLowerCase().includes(query) || 
        product.category.toLowerCase().includes(query)
      );
    }
    
    // Category filter
    if (filters.categories.length > 0) {
      result = result.filter(product => filters.categories.includes(product.category));
    }
    
    // Color filter
    if (filters.colors.length > 0) {
      result = result.filter(product => filters.colors.includes(product.color));
    }
    
    // Price range filter
    result = result.filter(product => {
      const price = parseFloat(product.price.replace(/[^0-9,.]/g, '').replace(',', '.'));
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });
    
    // On sale filter
    if (filters.onSale) {
      result = result.filter(product => product.originalPrice !== undefined);
    }
    
    setFilteredProducts(result);
  }, [searchQuery, filters]);

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
          {/* Sidebar with filters (hidden on mobile) */}
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
                {/* Categories filter */}
                <div>
                  <h3 className="font-medium mb-3">Categorias</h3>
                  <div className="space-y-2">
                    {categories.map(category => (
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
                
                {/* Color filter */}
                <div>
                  <h3 className="font-medium mb-3">Cores</h3>
                  <div className="flex flex-wrap gap-2">
                    {colors.map(color => (
                      <button
                        key={color}
                        className={`w-8 h-8 rounded-full transition-all duration-200 ${
                          filters.colors.includes(color) 
                            ? 'ring-2 ring-offset-2 ring-black scale-110' 
                            : 'hover:scale-110'
                        }`}
                        style={{ backgroundColor: color === 'red' ? '#ff0000' : color === 'blue' ? '#0000ff' : '#000000' }}
                        onClick={() => toggleColor(color)}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
                
                {/* Price range filter */}
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
                
                {/* On sale filter */}
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
          
          {/* Main content */}
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
            
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lg text-gray-500">Nenhum produto encontrado.</p>
                <Button onClick={resetFilters} className="mt-4">
                  Limpar Filtros
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
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
