import { Link } from "react-router-dom";
import { useState } from "react";

const Hero = () => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  const handleVideoLoad = () => {
    setIsVideoLoaded(true);
  };

  return (
    <section className="min-h-screen relative overflow-hidden flex items-center">
      <div className="absolute inset-0">
        {/* Mostra a imagem estática enquanto o vídeo carrega */}
        {!isVideoLoaded && (
          <img
            src="https://via.placeholder.com/1920x1080" // Substitua isso por uma captura de tela do vídeo
            alt="Boxing Hero"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {/* Iframe do YouTube com o vídeo */}
        <iframe
          className={`absolute inset-0 w-full h-full object-cover ${isVideoLoaded ? "opacity-100" : "opacity-0"}`}
          src="https://www.youtube.com/embed/7hd429vNaR4?autoplay=1&mute=1&loop=1&playlist=7hd429vNaR4&controls=0&modestbranding=1&rel=0&iv_load_policy=3&fs=0"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
          onLoad={handleVideoLoad}
        />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <span className="inline-block px-6 py-2 mb-8 text-sm font-medium bg-white/10 backdrop-blur-lg rounded-full text-white border border-white/20 hover-lift cursor-default">
            Nova coleção!
          </span>
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 leading-tight animate-fade-in">
            A tua luta, <br /> o teu estilo.
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-12 animate-slide-up max-w-2xl">
            Descobre as nossas novas coleções de equipamento de boxe, com designs exclusivos e materiais de alta qualidade.
          </p>
          <div className="flex flex-col sm:flex-row gap-6">
            <Link
              to="/catalog"
              className="px-8 py-4 bg-white text-black font-medium rounded-lg hover:bg-white/90 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 text-lg animate-fade-in inline-block text-center"
            >
              Ver Catálogo
            </Link>
            <Link
            to="/customize"
             className="px-8 py-4 bg-black/20 backdrop-blur-lg text-white font-medium rounded-lg hover:bg-black/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 text-lg animate-fade-in border border-white/20">
              Começa a Personalizar
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
