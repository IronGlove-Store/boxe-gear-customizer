
const products = [
  {
    id: 1,
    name: "Pro Boxing Gloves",
    price: "$199.99",
    image: "https://images.unsplash.com/photo-1583473848882-f9a5cb6c5ae7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    name: "Elite Headgear",
    price: "$89.99",
    image: "https://images.unsplash.com/photo-1584464457692-54f6b2cd5ca3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    name: "Performance Wraps",
    price: "$24.99",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  }
];

const FeaturedProducts = () => {
  return (
    <section className="py-32 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-bold mb-6">Produtos em Destaque</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Os melhores, para o melhor.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {products.map((product) => (
            <div key={product.id} className="group hover-lift">
              <div className="relative aspect-square overflow-hidden rounded-2xl mb-6 bg-gray-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
              <p className="text-gray-900 font-medium">{product.price}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
