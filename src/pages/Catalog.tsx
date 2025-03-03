
import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import customizableProducts from "@/data/customizableProducts.json";
import CatalogSearch from "@/components/catalog/CatalogSearch";
import FiltersPanel from "@/components/catalog/FiltersPanel";
import ProductGrid from "@/components/catalog/ProductGrid";

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

const Catalog = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState({
    categories: [] as string[],
    colors: [] as string[],
    priceRange: [0, 300] as [number, number],
    onSale: false
  });

  // Fetch products from localStorage
  useEffect(() => {
    setIsLoadingProducts(true);
    try {
      const storedProducts = localStorage.getItem('products');
      
      // Create sample products if none exist
      if (!storedProducts) {
        // Generate sample products based on customizable products categories
        const sampleProducts = generateSampleProducts();
        localStorage.setItem('products', JSON.stringify(sampleProducts));
        setProducts(sampleProducts);
      } else {
        setProducts(JSON.parse(storedProducts));
      }
    } catch (error) {
      console.error("Error loading products:", error);
      // Generate sample products as fallback
      const sampleProducts = generateSampleProducts();
      setProducts(sampleProducts);
    } finally {
      setIsLoadingProducts(false);
    }
  }, []);

  // Generate sample products from the customizable products data
  const generateSampleProducts = (): Product[] => {
    const sampleProducts: Product[] = [];
    
    customizableProducts.categories.forEach((category, categoryIndex) => {
      // Create multiple products for each category
      const colors = customizableProducts.colors;
      
      for (let i = 0; i < 3; i++) {
        const colorIndex = (i % colors.length);
        const color = colors[colorIndex];
        const size = category.sizes[i % category.sizes.length];
        
        // Create a product
        sampleProducts.push({
          id: `${category.id}-${i}`,
          name: `${category.name} ${i + 1}`,
          price: category.basePrice + (i * 10),
          originalPrice: i === 1 ? category.basePrice + (i * 15) : undefined,
          imageUrl: category.image,
          category: category.name,
          color: color.name,
          size: size,
          rating: 3.5 + (i % 2),
          reviewsCount: 10 + (i * 5)
        });
      }
    });
    
    return sampleProducts;
  };

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
          <FiltersPanel 
            categories={categories}
            colors={colors}
            filters={filters}
            toggleCategory={toggleCategory}
            toggleColor={toggleColor}
            handlePriceChange={handlePriceChange}
            toggleOnSale={toggleOnSale}
            resetFilters={resetFilters}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
          />
          
          <div className="lg:w-3/4 w-full">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <h1 className="text-3xl font-bold">Catálogo</h1>
              
              <div className="flex items-center gap-3">
                <CatalogSearch 
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                />
                
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
            
            <ProductGrid 
              products={filteredProducts}
              isLoading={isLoadingProducts}
              resetFilters={resetFilters}
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Catalog;
