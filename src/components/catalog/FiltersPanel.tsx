
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import CategoryFilter from "./CategoryFilter";
import ColorFilter from "./ColorFilter";
import PriceFilter from "./PriceFilter";
import OnSaleFilter from "./OnSaleFilter";

interface FiltersPanelProps {
  categories: string[];
  colors: string[];
  filters: {
    categories: string[];
    colors: string[];
    priceRange: [number, number];
    onSale: boolean;
  };
  toggleCategory: (category: string) => void;
  toggleColor: (color: string) => void;
  handlePriceChange: (value: number[]) => void;
  toggleOnSale: () => void;
  resetFilters: () => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
}

const FiltersPanel = ({
  categories,
  colors,
  filters,
  toggleCategory,
  toggleColor,
  handlePriceChange,
  toggleOnSale,
  resetFilters,
  showFilters,
  setShowFilters
}: FiltersPanelProps) => {
  return (
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
          <CategoryFilter 
            categories={categories} 
            selectedCategories={filters.categories} 
            toggleCategory={toggleCategory} 
          />
          
          <ColorFilter 
            colors={colors} 
            selectedColors={filters.colors} 
            toggleColor={toggleColor} 
          />
          
          <PriceFilter 
            priceRange={filters.priceRange}
            handlePriceChange={handlePriceChange}
          />
          
          <OnSaleFilter 
            isOnSale={filters.onSale}
            toggleOnSale={toggleOnSale}
          />
          
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
  );
};

export default FiltersPanel;
