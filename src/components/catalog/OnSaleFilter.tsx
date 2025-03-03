
import { Checkbox } from "@/components/ui/checkbox";

interface OnSaleFilterProps {
  isOnSale: boolean;
  toggleOnSale: () => void;
}

const OnSaleFilter = ({ isOnSale, toggleOnSale }: OnSaleFilterProps) => {
  return (
    <div>
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="on-sale" 
          checked={isOnSale}
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
  );
};

export default OnSaleFilter;
