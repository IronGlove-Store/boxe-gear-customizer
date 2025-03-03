
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface CatalogSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const CatalogSearch = ({ searchQuery, setSearchQuery }: CatalogSearchProps) => {
  return (
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
  );
};

export default CatalogSearch;
