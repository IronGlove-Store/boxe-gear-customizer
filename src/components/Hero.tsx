
const Hero = () => {
  return (
    <section className="min-h-screen relative overflow-hidden flex items-center">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517438322307-e67111335449?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <span className="inline-block px-6 py-2 mb-8 text-sm font-medium bg-white/10 backdrop-blur-lg rounded-full text-white border border-white/20 hover-lift cursor-default">
            Premium Boxing Gear
          </span>
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 leading-tight animate-fade-in">
            Elevate Your <br/>Performance
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-12 animate-slide-up max-w-2xl">
            Discover our collection of premium boxing equipment and personalized gear.
            Designed for champions, crafted for excellence.
          </p>
          <div className="flex flex-col sm:flex-row gap-6">
            <button className="px-8 py-4 bg-white text-black font-medium rounded-lg hover:bg-white/90 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 text-lg animate-fade-in">
              Shop Collection
            </button>
            <button className="px-8 py-4 bg-black/20 backdrop-blur-lg text-white font-medium rounded-lg hover:bg-black/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 text-lg animate-fade-in border border-white/20">
              Customize Gear
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
