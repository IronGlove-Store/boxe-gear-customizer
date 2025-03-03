
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
  colors?: string[];
  size: string;
  rating?: number;
  reviewsCount?: number;
}

interface AdminProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  colors?: string[];
  original_price?: number;
  created_at: string;
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
      // First try to get products from admin panel
      const adminProducts = localStorage.getItem('admin_products');
      
      if (adminProducts) {
        const parsedAdminProducts = JSON.parse(adminProducts);
        // Convert admin products to catalog format
        const formattedProducts = parsedAdminProducts.map((prod: AdminProduct) => {
          // Pick the first color if available, otherwise default
          const firstColor = prod.colors && prod.colors.length > 0 
            ? prod.colors[0] 
            : "Padrão";
            
          return {
            id: prod.id,
            name: prod.name,
            price: prod.price,
            originalPrice: prod.original_price,
            imageUrl: prod.image_url || "/placeholder.svg",
            category: prod.category || "Sem categoria",
            color: firstColor,
            colors: prod.colors || [],
            size: "Único",
            rating: 4.0,
            reviewsCount: 0
          };
        });
        
        setProducts(formattedProducts);
      } else {
        // Create sample products if none exist
        const sampleProducts = generateSampleProducts();
        localStorage.setItem('products', JSON.stringify(sampleProducts));
        setProducts(sampleProducts);
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
          colors: [color.name],
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
  
  // Get all available colors from all products
  const colors = Array.from(
    new Set(
      products.flatMap((product: Product) => 
        product.colors && product.colors.length > 0 
          ? product.colors 
          : [product.color]
      )
    )
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
      result = result.filter((product: Product) => {
        // Check if any of the product's colors match the filter
        if (product.colors && product.colors.length > 0) {
          return product.colors.some(color => filters.colors.includes(color));
        }
        // Fall back to the single color if no colors array
        return product.color && filters.colors.includes(product.color);
      });
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
