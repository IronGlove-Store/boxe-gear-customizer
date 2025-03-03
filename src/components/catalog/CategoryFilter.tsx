
import { Checkbox } from "@/components/ui/checkbox";

interface CategoryFilterProps {
  categories: string[];
  selectedCategories: string[];
  toggleCategory: (category: string) => void;
}

const CategoryFilter = ({ 
  categories, 
  selectedCategories, 
  toggleCategory 
}: CategoryFilterProps) => {
  return (
    <div>
      <h3 className="font-medium mb-3">Categorias</h3>
      <div className="space-y-2">
        {categories.map((category) => (
          <div key={category} className="flex items-center space-x-2">
            <Checkbox 
              id={`category-${category}`} 
              checked={selectedCategories.includes(category)}
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
  );
};

export default CategoryFilter;
