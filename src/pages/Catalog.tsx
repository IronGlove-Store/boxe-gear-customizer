
import ProductCard from "@/components/ProductCard";
import Navigation from "@/components/Navigation";

interface Product {
  id: number;
  name: string;
  price: string;
  originalPrice?: string;
  image: string;
  category: string;
  color: string;
  size: string;
  rating?: number;
  reviews?: number;
}

const products: Product[] = [
  {
    id: 1,
    name: "Teste",
    price: "€ 199.99",
    category: "Gloves",
    color: "red",
    size: "12oz",
    image: "https://images.unsplash.com/photo-1583473848882-f9a5cb6c5ae7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    rating: 4.5,
    reviews: 12
  },
  {
    id: 2,
    name: "Teste2",
    price: "€ 89.99",
    category: "Protection",
    color: "red",
    size: "M",
    image: "https://images.unsplash.com/photo-1584464457692-54f6b2cd5ca3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    rating: 4.0,
    reviews: 8
  },
  {
    id: 3,
    name: "Teste3",
    price: "€ 24.99",
    originalPrice: "€ 29.99",
    category: "Accessories",
    color: "black",
    size: "One Size",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    reviews: 25
  },
  {
    id: 4,
    name: "Teste4",
    price: "€ 149.99",
    category: "Equipment",
    color: "blue",
    size: "70lb",
    image: "https://images.unsplash.com/photo-1593787406536-3676a152d9cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    rating: 4.2,
    reviews: 15
  }
];

const Catalog = () => {
  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="container py-12 pt-24">
        <h1 className="text-3xl font-bold mb-8">Catalog</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </main>
  );
};

export default Catalog;
