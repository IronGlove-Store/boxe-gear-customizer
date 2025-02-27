
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";
import { EmailCapturePopup } from "@/components/EmailCapturePopup";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Navigation />
      <Hero />
      <FeaturedProducts />
      <EmailCapturePopup />
    </main>
  );
};

export default Index;
