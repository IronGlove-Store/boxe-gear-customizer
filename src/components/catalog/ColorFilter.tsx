
import customizableProducts from "@/data/customizableProducts.json";

interface ColorFilterProps {
  colors: string[];
  selectedColors: string[];
  toggleColor: (color: string) => void;
}

const ColorFilter = ({ colors, selectedColors, toggleColor }: ColorFilterProps) => {
  return (
    <div>
      <h3 className="font-medium mb-3">Cores</h3>
      <div className="flex flex-wrap gap-2">
        {colors.map((color) => {
          // Find the color value from customizableProducts
          const colorObj = customizableProducts.colors.find(c => c.name === color);
          const colorValue = colorObj ? colorObj.value : "#777777";
          
          return (
            <button
              key={color}
              className={`w-8 h-8 rounded-full transition-all duration-200 ${
                selectedColors.includes(color) 
                  ? 'ring-2 ring-offset-2 ring-black scale-110' 
                  : 'hover:scale-110'
              }`}
              style={{ backgroundColor: colorValue }}
              onClick={() => toggleColor(color)}
              title={color}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ColorFilter;
