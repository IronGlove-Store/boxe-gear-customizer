
import { useState } from "react";
import Navigation from "@/components/Navigation";
import ProductCard from "@/components/ProductCard";
import { Search } from "lucide-react";

// Tipo para os produtos
interface Product {
  id: number;
  name: string;
  price: string;
  originalPrice?: string;
  category: string;
  color: string;
  size: string;
  image: string;
  rating?: number;
  reviews?: number;
}

// Produtos dinâmicos expandidos
const products: Product[] = [
  {
    id: 1,
    name: "Teste",
    price: "$199.99",
    category: "Gloves",
    color: "red",
    size: "12oz",
    image: "https://i.pinimg.com/736x/dc/80/d2/dc80d2e7e16b190879ba968e9a364705.jpg",
    rating: 4.5,
    reviews: 12
  },
  {
    id: 2,
    name: "Teste2",
    price: "$89.99",
    category: "Protection",
    color: "red",
    size: "M",
    image: "https://i.pinimg.com/736x/dc/80/d2/dc80d2e7e16b190879ba968e9a364705.jpg",
    rating: 4.0,
    reviews: 8
  },
  {
    id: 3,
    name: "Teste3",
    price: "$24.99",
    originalPrice: "$29.99",
    category: "Accessories",
    color: "black",
    size: "One Size",
    image: "https://i.pinimg.com/736x/dc/80/d2/dc80d2e7e16b190879ba968e9a364705.jpg",
    rating: 4.8,
    reviews: 25
  },
  {
    id: 4,
    name: "Teste4",
    price: "$149.99",
    category: "Equipment",
    color: "blue",
    size: "70lb",
    image: "https://i.pinimg.com/736x/dc/80/d2/dc80d2e7e16b190879ba968e9a364705.jpg",
    rating: 4.2,
    reviews: 15
  }
];

const categories = ["All", "Gloves", "Protection", "Accessories", "Equipment"];
const colors = ["All", "red", "blue", "black", "white"];
const sizes = ["All", "12oz", "14oz", "16oz", "M", "L", "One Size", "70lb"];

const Catalog = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedColor, setSelectedColor] = useState("All");
  const [selectedSize, setSelectedSize] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [searchQuery, setSearchQuery] = useState("");

  // Função de filtragem combinada
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesColor = selectedColor === "All" || product.color === selectedColor;
    const matchesSize = selectedSize === "All" || product.size === selectedSize;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesColor && matchesSize && matchesSearch;
  });

  // Função de ordenação
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return parseFloat(a.price.replace("$", "")) - parseFloat(b.price.replace("$", ""));
      case "price-desc":
        return parseFloat(b.price.replace("$", "")) - parseFloat(a.price.replace("$", ""));
      case "rating-desc":
        return (b.rating || 0) - (a.rating || 0);
      default:
        return 0;
    }
  });

  return (
    <main className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="pt-32 pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col gap-8 mb-12">
              <h1 className="text-4xl font-bold">Shop Collection</h1>
              
              {/* Barra de pesquisa */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full md:w-96 px-4 py-3 pl-12 rounded-lg border bg-white focus:ring-2 focus:ring-black focus:outline-none"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>

              {/* Filtros */}
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                <div className="flex flex-wrap gap-4">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                        selectedCategory === category
                          ? "bg-black text-white"
                          : "bg-white hover:bg-gray-100"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                <div className="flex gap-4">
                  <select
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    className="px-4 py-2 rounded-lg border bg-white"
                  >
                    <option value="" disabled>Cor</option>
                    {colors.map(color => (
                      <option key={color} value={color}>{color}</option>
                    ))}
                  </select>

                  <select
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="px-4 py-2 rounded-lg border bg-white"
                  >
                    <option value="" disabled>Tamanho</option>
                    {sizes.map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 rounded-lg border bg-white"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-asc">Preço: Baixo para Alto</option>
                    <option value="price-desc">Preço: Alto to Baixo</option>
                    <option value="rating-desc">Melhor Avaliados</option>
                  </select>
                </div>
              </div>

              {/* Resultados */}
              {sortedProducts.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-xl text-gray-600">No products found matching your criteria</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {sortedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Catalog;
