
const Hero = () => {
  return (
    <section className="min-h-screen relative overflow-hidden flex items-center">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517438322307-e67111335449?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <span className="inline-block px-4 py-1 mb-6 text-sm font-medium bg-white/10 backdrop-blur-lg rounded-full text-white">
            Premium Boxing Gear
          </span>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
            Elevate Your Performance
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 animate-slide-up">
            Discover our collection of premium boxing equipment and personalized gear.
            Designed for champions, crafted for excellence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="px-8 py-4 bg-white text-black font-medium rounded-lg hover:bg-white/90 transition-colors animate-fade-in">
              Shop Collection
            </button>
            <button className="px-8 py-4 bg-black/20 backdrop-blur-lg text-white font-medium rounded-lg hover:bg-black/30 transition-colors animate-fade-in">
              Customize Gear
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
