
import { useState } from "react";
import Navigation from "@/components/Navigation";
import ProductCard from "@/components/ProductCard";

const products = [
  {
    id: 1,
    name: "Pro Boxing Gloves",
    price: "$199.99",
    category: "Gloves",
    image: "https://images.unsplash.com/photo-1583473848882-f9a5cb6c5ae7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    name: "Elite Headgear",
    price: "$89.99",
    category: "Protection",
    image: "https://images.unsplash.com/photo-1584464457692-54f6b2cd5ca3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    name: "Performance Wraps",
    price: "$24.99",
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 4,
    name: "Training Bag",
    price: "$149.99",
    category: "Equipment",
    image: "https://images.unsplash.com/photo-1593787406536-3676a152d9cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  }
];

const categories = ["All", "Gloves", "Protection", "Accessories", "Equipment"];

const Catalog = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");

  const filteredProducts = products.filter(
    product => selectedCategory === "All" || product.category === selectedCategory
  );

  return (
    <main className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="pt-32 pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
              <h1 className="text-4xl font-bold">Shop Collection</h1>
              
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

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 rounded-lg border bg-white"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Newest</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Catalog;
