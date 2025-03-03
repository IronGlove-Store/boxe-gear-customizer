
import { Slider } from "@/components/ui/slider";

interface PriceFilterProps {
  priceRange: [number, number];
  handlePriceChange: (value: number[]) => void;
}

const PriceFilter = ({ priceRange, handlePriceChange }: PriceFilterProps) => {
  return (
    <div>
      <h3 className="font-medium mb-3">Preço</h3>
      <div className="px-2">
        <Slider
          defaultValue={[0, 300]}
          max={300}
          step={10}
          value={[priceRange[0], priceRange[1]]}
          onValueChange={handlePriceChange}
          className="mb-6"
        />
        <div className="flex justify-between">
          <span>€{priceRange[0]}</span>
          <span>€{priceRange[1]}</span>
        </div>
      </div>
    </div>
  );
};

export default PriceFilter;
